import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Palette,
  Search,
  Plus,
  Pencil,
  X,
  Save,
  Hash,
  AlertCircle,
} from 'lucide-react';
import Pagination from '../common/Pagination';
import {
  getVehicleColorsApi,
  createVehicleColorApi,
  updateVehicleColorApi,
  updateVehicleColorStatusApi,
} from '../../services/vehicleMaster.services';

export default function ColorTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [colorName, setColorName] = useState('');
  const [hexCode, setHexCode] = useState('#2563EB');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [statusModal, setStatusModal] = useState(null);

  const queryClient = useQueryClient();

  // ========================================
  // GET VEHICLE COLORS API
  // ========================================
  const {
    data: colorsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['vehicle-colors', currentPage, entriesPerPage],
    queryFn: () =>
      getVehicleColorsApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  const colors = colorsResponse?.data || [];
  const meta = colorsResponse?.meta;

  // ========================================
  // CREATE VEHICLE COLOR API
  // ========================================
  const createColorMutation = useMutation({
    mutationFn: createVehicleColorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehicle-colors'],
      });
      handleCancel();
    },
    onError: (err) => {
      setFormError(
        err?.response?.data?.message || 'Failed to create vehicle color.'
      );
    },
  });

  // ========================================
  // UPDATE VEHICLE COLOR API (EDIT)
  // ========================================
  const updateColorMutation = useMutation({
    mutationFn: updateVehicleColorApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['vehicle-colors'],
      });
      handleCancel();
    },
    onError: (err) => {
      setFormError(
        err?.response?.data?.message || 'Failed to update vehicle color.'
      );
    },
  });

  // ========================================
  // UPDATE VEHICLE COLOR STATUS API
  // ========================================
  const updateStatusMutation = useMutation({
    mutationFn: updateVehicleColorStatusApi,
    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ['vehicle-colors'],
        });
        setStatusModal(null);
      }
    },
    onError: () => {
      // Error is displayed inside modal
    },
  });

  // ========================================
  // SEARCH & PAGINATION
  // ========================================
  const filteredColors = colors.filter((color) => {
    const nameMatch = color.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const hex = color.hexCode || color.hex || '';
    const hexMatch = hex.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || hexMatch;
  });

  const totalItems = meta?.total ?? filteredColors.length;
  const totalPages =
    meta?.totalPages ?? Math.max(1, Math.ceil(filteredColors.length / entriesPerPage));
  const safePage = Math.min(currentPage, Math.max(1, totalPages));

  // If server paginated (meta exists), use data directly; else slice locally
  const paginatedColors = meta
    ? filteredColors
    : filteredColors.slice(
        (safePage - 1) * entriesPerPage,
        safePage * entriesPerPage
      );

  // ========================================
  // CANCEL & RESET FORM
  // ========================================
  const handleCancel = () => {
    setColorName('');
    setHexCode('#2563EB');
    setEditingId(null);
    setFormError('');
  };

  // ========================================
  // SAVE COLOR (CREATE OR UPDATE)
  // ========================================
  const handleSaveColor = () => {
    if (!colorName.trim()) {
      setFormError('Please enter color name.');
      return;
    }

    setFormError('');

    let cleanHex = hexCode.trim();
    if (cleanHex && !cleanHex.startsWith('#')) {
      cleanHex = `#${cleanHex}`;
    }

    const payload = {
      name: colorName.trim(),
      hexCode: cleanHex,
    };

    if (editingId) {
      updateColorMutation.mutate({ id: editingId, ...payload });
    } else {
      createColorMutation.mutate(payload);
    }
  };

  // ========================================
  // EDIT COLOR
  // ========================================
  const handleEdit = (color) => {
    setColorName(color.name || '');
    setHexCode(color.hexCode || color.hex || '#2563EB');
    setEditingId(color.id);
    setFormError('');
    document
      .getElementById('color-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isSaving =
    createColorMutation.isPending || updateColorMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ----------------- LEFT: Color List (col-span-8) ----------------- */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5">
        {/* Header + Search + Add Color */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
              Color List
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage vehicle color master palette and HEX codes.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search color name or hex..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-56 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
              />
            </div>

            {/* Add Color Button */}
            <button
              onClick={() => {
                handleCancel();
                document.getElementById('color-name-input')?.focus();
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="hidden sm:inline">Add Color</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[12px] sm:text-[13px] font-bold text-slate-900">
                  <th className="py-2.5 px-2 sm:px-3 pl-3 sm:pl-4 text-center w-8 sm:w-10">
                    #
                  </th>
                  <th className="py-2.5 px-2 sm:px-3">Preview</th>
                  <th className="py-2.5 px-2 sm:px-3">Color Name</th>
                  <th className="py-2.5 px-2 sm:px-3 font-mono">HEX Code</th>
                  <th className="py-2.5 px-2 sm:px-3 text-center">Status</th>
                  <th className="py-2.5 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] font-bold text-slate-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      Loading colors...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-rose-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-7 h-7 text-rose-500" />
                        <p className="font-bold text-sm">
                          {error?.response?.data?.message ||
                            'Failed to load Vehicle Colors.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedColors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      No colors found.
                    </td>
                  </tr>
                ) : (
                  paginatedColors.map((color, index) => {
                    const currentHex = color.hexCode || color.hex || '#cccccc';
                    const currentStatus = (color.status || 'active').toLowerCase();
                    const isActive = currentStatus === 'active';

                    return (
                      <tr
                        key={color.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Index */}
                        <td className="py-2 px-2 sm:px-3 pl-3 sm:pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {(safePage - 1) * entriesPerPage + index + 1}
                        </td>

                        {/* Swatch Preview */}
                        <td className="py-2 px-2 sm:px-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-7 h-7 rounded-full shadow-2xs border-2 border-slate-200/90 inline-block shrink-0"
                              style={{ backgroundColor: currentHex }}
                            />
                          </div>
                        </td>

                        {/* Color Name */}
                        <td className="py-2 px-2 sm:px-3 font-bold text-slate-900 text-[13px] sm:text-[15px]">
                          {color.name}
                        </td>

                        {/* Hex Code */}
                        <td className="py-2 px-2 sm:px-3 font-mono font-bold text-xs sm:text-sm text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200/70 uppercase">
                            {currentHex}
                          </span>
                        </td>

                        {/* Status (Clickable to change status with confirmation modal) */}
                        <td className="py-2 px-2 sm:px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const next = isActive ? 'inactive' : 'active';
                              setStatusModal({
                                color,
                                currentStatus,
                                nextStatus: next,
                              });
                            }}
                            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${
                              isActive
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70'
                                : 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100/70'
                            }`}
                            title={`Click to change status to ${isActive ? 'Inactive' : 'Active'}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                isActive ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            />
                            <span className="capitalize">{currentStatus}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleEdit(color)}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Color"
                            >
                              <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={safePage}
            totalItems={totalItems}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(n) => {
              setEntriesPerPage(n);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      </div>

      {/* ----------------- RIGHT: Add/Edit Color Form (col-span-4) ----------------- */}
      <div
        id="color-form"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-black">
              {editingId ? 'Edit Color' : 'Add Color'}
            </h3>
            {editingId && (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                Editing #{editingId}
              </span>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Error message */}
        {formError && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {formError}
          </p>
        )}

        {/* Color Name Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Color Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Palette className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="color-name-input"
              type="text"
              placeholder="Enter color name"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveColor()}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>
        </div>

        {/* HEX Color & Live Picker */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            HEX Color Code <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Hash className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="#000000"
                value={hexCode}
                onChange={(e) => setHexCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveColor()}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-mono font-medium text-slate-800 uppercase focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
            <div className="relative shrink-0">
              <input
                type="color"
                value={
                  hexCode.startsWith('#') && hexCode.length === 7
                    ? hexCode
                    : '#2563EB'
                }
                onChange={(e) => setHexCode(e.target.value.toUpperCase())}
                className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer p-0.5 bg-white"
                title="Pick Color"
              />
            </div>
          </div>
        </div>

        {/* Live Swatch Preview */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl border-2 border-white shadow-xs shrink-0"
            style={{
              backgroundColor:
                hexCode.startsWith('#') && hexCode.length === 7
                  ? hexCode
                  : '#2563EB',
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-800 truncate">
              {colorName.trim() || 'Color Preview'}
            </p>
            <p className="text-[11px] font-mono text-slate-500 font-semibold uppercase">
              {hexCode}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1.5">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveColor}
            disabled={!colorName.trim() || isSaving}
            className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            <span>
              {isSaving
                ? 'Saving...'
                : editingId
                  ? 'Update'
                  : 'Save Color'}
            </span>
          </button>
        </div>
      </div>

      {/* ======================================== */}
      {/* STATUS CONFIRMATION MODAL               */}
      {/* ======================================== */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            {/* Modal Icon (Theme Matched) */}
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-amber-50 border border-amber-200/80 text-amber-500 shadow-2xs">
              <AlertCircle className="w-7 h-7 stroke-[2.2] text-amber-500" />
            </div>

            {/* Modal Content */}
            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Change Status
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to change the status of{' '}
                <span className="font-bold text-slate-900">
                  "{statusModal.color?.name}"
                </span>{' '}
                to{' '}
                <span className="font-bold text-amber-600 capitalize">
                  {statusModal.nextStatus}
                </span>
                ?
              </p>
            </div>

            {/* Error Message if API fails */}
            {updateStatusMutation.isError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {updateStatusMutation.error?.response?.data?.message ||
                  'Failed to update status. Please try again.'}
              </p>
            )}

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => setStatusModal(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: statusModal.color.id,
                    status: statusModal.nextStatus,
                  })
                }
                className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
