import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  Car,
  Search,
  Plus,
  Pencil,
  X,
  Save,
  Tag,
  Layers,
  Users,
  Loader2,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';
import { initialModelsList, initialBrandsList } from '../../data/vehicleMasterData';
import Pagination from '../common/Pagination';
import {
  getVehicleModelsApi,
  getVehicleModelByIdApi,
  createVehicleModelApi,
  updateVehicleModelApi,
  updateVehicleModelStatusApi,
  getVehicleBrandsApi,
  getVehicleTypesApi,
} from '../../services/vehicleMaster.services';

export default function ModelTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [models, setModels] = useState(initialModelsList);
  const [modelName, setModelName] = useState('');
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [selectedTypeId, setSelectedTypeId] = useState('');
  const [capacity, setCapacity] = useState('5');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [statusModal, setStatusModal] = useState(null);
  const [fetchingId, setFetchingId] = useState(null);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  const queryClient = useQueryClient();

  // ========================================
  // GET VEHICLE MODELS API
  // ========================================
  const {
    data: modelsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['vehicle-models', currentPage, entriesPerPage],
    queryFn: () =>
      getVehicleModelsApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  // ========================================
  // GET VEHICLE BRANDS API (FOR DROPDOWN)
  // ========================================
  const { data: brandsResponse } = useQuery({
    queryKey: ['vehicle-brands', 1, 100],
    queryFn: () =>
      getVehicleBrandsApi({
        page: 1,
        limit: 100,
      }),
  });

  // ========================================
  // GET VEHICLE TYPES API (FOR DROPDOWN)
  // ========================================
  const { data: typesResponse, isLoading: isTypesLoading } = useQuery({
    queryKey: ['vehicle-types', 1, 100],
    queryFn: () =>
      getVehicleTypesApi({
        page: 1,
        limit: 100,
      }),
  });

  const apiModels = modelsResponse?.data || [];
  const meta = modelsResponse?.meta;
  const brandOptions = brandsResponse?.data?.length
    ? brandsResponse.data
    : initialBrandsList;

  const vehicleTypes = typesResponse?.data?.length
    ? typesResponse.data
    : [
        { id: 1, name: 'Private' },
        { id: 2, name: 'Commercial' },
        { id: 3, name: 'Bus' },
      ];

  // ========================================
  // MUTATIONS (CREATE, UPDATE, STATUS)
  // ========================================
  const createModelMutation = useMutation({
    mutationFn: createVehicleModelApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
      handleCancel();
    },
    onError: (err) => {
      setFormError(
        err?.response?.data?.message || 'Failed to create vehicle model.'
      );
    },
  });

  const updateModelMutation = useMutation({
    mutationFn: updateVehicleModelApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
      handleCancel();
    },
    onError: (err) => {
      setFormError(
        err?.response?.data?.message || 'Failed to update vehicle model.'
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateVehicleModelStatusApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-models'] });
      setStatusModal(null);
    },
    onError: () => {
      // Error handled inside modal
    },
  });

  const getCapacityDisplay = (model) => {
    const val = model.seatCapacity ?? model.capacity;
    if (val === undefined || val === null || val === '') return '-';
    if (typeof val === 'number') return val;
    const str = String(val).trim();
    const plusMatch = str.match(/^(\d+)\s*\+\s*(\d+)/);
    if (plusMatch) {
      return Number(plusMatch[1]) + Number(plusMatch[2]);
    }
    const numMatch = str.match(/\d+/);
    return numMatch ? numMatch[0] : str;
  };

  // Active models source: API data if available, otherwise local state
  const rawList = modelsResponse ? apiModels : models;

  // Filtered models
  const filteredModels = rawList.filter((m) => {
    const nameMatch = (m.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const brandMatch = (m.vehicleBrandName || m.brand || '').toLowerCase().includes(searchTerm.toLowerCase());
    const typeMatch = (m.vehicleTypeName || m.vehicleType || '').toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || brandMatch || typeMatch;
  });

  const totalItems = meta?.total ?? filteredModels.length;
  const totalPages = meta?.totalPages ?? Math.max(1, Math.ceil(totalItems / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedModels = meta
    ? filteredModels
    : filteredModels.slice(
        (safePage - 1) * entriesPerPage,
        safePage * entriesPerPage
      );

  const handleCancel = () => {
    setModelName('');
    setSelectedBrandId('');
    setSelectedTypeId('');
    setCapacity('5');
    setEditingId(null);
    setFormError('');
    setBrandDropdownOpen(false);
    setTypeDropdownOpen(false);
  };

  const handleEdit = async (model) => {
    setFormError('');
    setFetchingId(model.id);

    try {
      const res = await getVehicleModelByIdApi(model.id);
      const data = res?.data || res || model;

      setEditingId(data.id ?? model.id);
      setModelName(data.name || model.name || '');
      setSelectedBrandId(
        data.vehicleBrandId ?? model.vehicleBrandId ?? brandOptions[0]?.id ?? ''
      );
      setSelectedTypeId(
        data.vehicleTypeId ?? model.vehicleTypeId ?? vehicleTypes[0]?.id ?? ''
      );
      setCapacity(String(data.seatCapacity ?? model.seatCapacity ?? 5));
    } catch (err) {
      // Fallback to table model if getById fails
      setEditingId(model.id);
      setModelName(model.name || '');
      setSelectedBrandId(
        model.vehicleBrandId ?? brandOptions[0]?.id ?? ''
      );
      setSelectedTypeId(
        model.vehicleTypeId ?? vehicleTypes[0]?.id ?? ''
      );
      setCapacity(String(model.seatCapacity ?? 5));
    } finally {
      setFetchingId(null);
      document
        .getElementById('model-form')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSaveModel = () => {
    setFormError('');

    if (!modelName.trim()) {
      setFormError('Please enter model name.');
      return;
    }

    const brandId = selectedBrandId || brandOptions[0]?.id;
    if (!brandId) {
      setFormError('Please select a brand.');
      return;
    }

    const typeId = selectedTypeId || vehicleTypes[0]?.id;
    if (!typeId) {
      setFormError('Please select a vehicle type.');
      return;
    }

    const parsedCap = Number(capacity);
    if (!parsedCap || parsedCap <= 0) {
      setFormError('Please enter a valid seating capacity.');
      return;
    }

    const payload = {
      vehicleBrandId: Number(brandId),
      vehicleTypeId: Number(typeId),
      name: modelName.trim(),
      seatCapacity: parsedCap,
    };

    if (editingId) {
      updateModelMutation.mutate({ id: editingId, ...payload });
    } else {
      createModelMutation.mutate(payload);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ----------------- LEFT: Model List (col-span-8) ----------------- */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5">
        {/* Header + Search + Add Model */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
              Model List
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage vehicle models, brand linking, and seating capacities.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search input */}
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search model or brand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-56 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
              />
            </div>

            {/* Add Model Button */}
            <button
              onClick={() => {
                handleCancel();
                document.getElementById('model-name-input')?.focus();
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="hidden sm:inline">Add Model</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[12px] sm:text-[13px] font-bold text-slate-900">
                  <th className="py-2.5 px-2 sm:px-3 pl-3 sm:pl-4 text-center w-8 sm:w-10">#</th>
                  <th className="py-2.5 px-2 sm:px-3">Model Name</th>
                  <th className="py-2.5 px-2 sm:px-3">Brand</th>
                  <th className="py-2.5 px-2 sm:px-3">Vehicle Type</th>
                  <th className="py-2.5 px-2 sm:px-3 text-center">Capacity</th>
                  <th className="py-2.5 px-2 sm:px-3 text-center">Status</th>
                  <th className="py-2.5 px-2 sm:px-3 pr-3 sm:pr-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] font-bold text-slate-700">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      Loading models...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-rose-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-7 h-7 text-rose-500" />
                        <p className="font-bold text-sm">
                          {error?.response?.data?.message || 'Failed to load Vehicle Models.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedModels.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      No models found.
                    </td>
                  </tr>
                ) : (
                  paginatedModels.map((model, index) => {
                    const isActive = (model.status || '').toLowerCase() === 'active';
                    const displayBrand = model.vehicleBrandName || model.brand || '-';
                    const displayType = model.vehicleTypeName || model.vehicleType || '-';

                    return (
                      <tr key={model.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Index */}
                        <td className="py-2 px-2 sm:px-3 pl-3 sm:pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {(safePage - 1) * entriesPerPage + index + 1}
                        </td>

                        {/* Model Name */}
                        <td className="py-2 px-2 sm:px-3">
                          <span className="font-bold text-slate-900 text-[13px] sm:text-[15px] capitalize">
                            {model.name}
                          </span>
                        </td>

                        {/* Brand */}
                        <td className="py-2 px-2 sm:px-3 font-semibold text-slate-800 text-[13px]">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-bold text-xs border border-slate-200/60">
                            {displayBrand}
                          </span>
                        </td>

                        {/* Vehicle Type */}
                        <td className="py-2 px-2 sm:px-3 font-semibold text-slate-600 text-xs sm:text-sm">
                          {displayType}
                        </td>

                        {/* Capacity */}
                        <td className="py-2 px-2 sm:px-3 text-center text-slate-700 font-bold text-xs sm:text-sm">
                          {getCapacityDisplay(model)}
                        </td>

                        {/* Status (Clickable Toggle) */}
                        <td className="py-2 px-2 sm:px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const current = (model.status || 'active').toLowerCase();
                              const next = current === 'active' ? 'inactive' : 'active';
                              setStatusModal({
                                model,
                                currentStatus: current,
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
                            <span className="capitalize">{model.status || 'active'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleEdit(model)}
                              disabled={fetchingId === model.id}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50"
                              title="Edit Model"
                            >
                              {fetchingId === model.id ? (
                                <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin text-amber-500" />
                              ) : (
                                <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                              )}
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

      {/* ----------------- RIGHT: Add/Edit Model Form (col-span-4) ----------------- */}
      <div
        id="model-form"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-bold text-black">
            {editingId ? 'Edit Model' : 'Add Model'}
          </h3>
          <button
            onClick={handleCancel}
            className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Model Name Input */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Model Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Car className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              id="model-name-input"
              type="text"
              placeholder="Enter model name"
              value={modelName}
              onChange={(e) => {
                setModelName(e.target.value);
                setFormError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveModel()}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>
        </div>

        {/* Brand Dropdown */}
        <div className="space-y-1.5 relative">
          <label className="block text-sm font-bold text-slate-800">
            Brand <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Tag className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => {
                setBrandDropdownOpen(!brandDropdownOpen);
                setTypeDropdownOpen(false);
              }}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-left shadow-2xs"
            >
              <span className="truncate">
                {brandOptions.find((b) => b.id === (selectedBrandId || brandOptions[0]?.id))?.name || 'Select Brand'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  brandDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Backdrop for outside click */}
            {brandDropdownOpen && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setBrandDropdownOpen(false)}
              />
            )}

            {/* Custom Dropdown Menu */}
            {brandDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 scrollbar-thin">
                {brandOptions.length === 0 ? (
                  <div className="p-3 text-center text-xs font-semibold text-slate-400">
                    No brands available
                  </div>
                ) : (
                  brandOptions.map((b) => {
                    const isSelected = (selectedBrandId || brandOptions[0]?.id) === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setSelectedBrandId(b.id);
                          setBrandDropdownOpen(false);
                          setFormError('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{b.name}</span>
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Vehicle Type */}
        <div className="space-y-1.5 relative">
          <label className="block text-sm font-bold text-slate-800">
            Vehicle Type <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Layers className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <button
              type="button"
              onClick={() => {
                setTypeDropdownOpen(!typeDropdownOpen);
                setBrandDropdownOpen(false);
              }}
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all text-left shadow-2xs"
            >
              <span className="truncate">
                {isTypesLoading && vehicleTypes.length === 0
                  ? 'Loading types...'
                  : vehicleTypes.find((vt) => vt.id === (selectedTypeId || vehicleTypes[0]?.id))?.name || 'Select Type'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  typeDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Backdrop for outside click */}
            {typeDropdownOpen && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setTypeDropdownOpen(false)}
              />
            )}

            {/* Custom Dropdown Menu */}
            {typeDropdownOpen && (
              <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 max-h-56 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 scrollbar-thin">
                {vehicleTypes.length === 0 ? (
                  <div className="p-3 text-center text-xs font-semibold text-slate-400">
                    No types available
                  </div>
                ) : (
                  vehicleTypes.map((vt) => {
                    const isSelected = (selectedTypeId || vehicleTypes[0]?.id) === vt.id;
                    return (
                      <button
                        key={vt.id}
                        type="button"
                        onClick={() => {
                          setSelectedTypeId(vt.id);
                          setTypeDropdownOpen(false);
                          setFormError('');
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <span className="truncate">{vt.name}</span>
                        {isSelected && <span className="text-xs font-bold">✓</span>}
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Seating Capacity */}
        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Seating Capacity <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="number"
              min="1"
              max="100"
              placeholder="e.g. 5, 7, 4"
              value={capacity}
              onChange={(e) => {
                setCapacity(e.target.value);
                setFormError('');
              }}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            />
          </div>
        </div>

        {/* Form Error */}
        {formError && (
          <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {formError}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1.5">
          <button
            onClick={handleCancel}
            type="button"
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveModel}
            type="button"
            disabled={
              !modelName.trim() ||
              createModelMutation.isPending ||
              updateModelMutation.isPending
            }
            className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            {createModelMutation.isPending || updateModelMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                <span>{editingId ? 'Update' : 'Save Model'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ======================================== */}
      {/* STATUS CONFIRMATION MODAL               */}
      {/* ======================================== */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center bg-amber-50 border border-amber-200/80 text-amber-500 shadow-2xs">
              <AlertCircle className="w-7 h-7 stroke-[2.2] text-amber-500" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                Change Status
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Are you sure you want to change the status of{' '}
                <span className="font-bold text-slate-900 capitalize">
                  "{statusModal.model?.name}"
                </span>{' '}
                to{' '}
                <span className="font-bold text-amber-600 capitalize">
                  {statusModal.nextStatus}
                </span>
                ?
              </p>
            </div>

            {updateStatusMutation.isError && (
              <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                {updateStatusMutation.error?.response?.data?.message ||
                  'Failed to update status. Please try again.'}
              </p>
            )}

            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStatusModal(null)}
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  updateStatusMutation.mutate({
                    id: statusModal.model.id,
                    status: statusModal.nextStatus,
                  })
                }
                disabled={updateStatusMutation.isPending}
                className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Confirm</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
