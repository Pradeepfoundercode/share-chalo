import React, { useState } from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  Tag,
  Search,
  Plus,
  Pencil,
  ImagePlus,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';

import Pagination from '../common/Pagination';

import {
  getVehicleBrandsApi,
  createVehicleBrandApi,
  updateVehicleBrandApi,
  updateVehicleBrandStatusApi,
} from '../../services/vehicleMaster.services';

import { uploadImageToCloudinary } from '../../utils/cloudinary';

export default function BrandTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [statusModal, setStatusModal] = useState(null);

  const queryClient = useQueryClient();

  // ========================================
  // GET VEHICLE BRANDS API
  // ========================================

  const {
    data: brandsResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['vehicle-brands', currentPage, entriesPerPage],
    queryFn: () =>
      getVehicleBrandsApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  const brands = brandsResponse?.data || [];
  const meta = brandsResponse?.meta;

  // ========================================
  // CREATE VEHICLE BRAND API
  // ========================================

  const createBrandMutation = useMutation({
    mutationFn: createVehicleBrandApi,

    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ['vehicle-brands'],
        });

        handleCancel();
      }
    },

    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
        'Failed to create vehicle brand.'
      );
    },
  });

  // ========================================
  // UPDATE VEHICLE BRAND API (EDIT)
  // ========================================

  const updateBrandMutation = useMutation({
    mutationFn: updateVehicleBrandApi,

    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ['vehicle-brands'],
        });

        handleCancel();
      }
    },

    onError: (error) => {
      setFormError(
        error?.response?.data?.message ||
        'Failed to update vehicle brand.'
      );
    },
  });

  // ========================================
  // UPDATE VEHICLE BRAND STATUS API
  // ========================================

  const updateStatusMutation = useMutation({
    mutationFn: updateVehicleBrandStatusApi,

    onSuccess: (response) => {
      if (response?.success) {
        queryClient.invalidateQueries({
          queryKey: ['vehicle-brands'],
        });
        setStatusModal(null);
      }
    },

    onError: (error) => {
      console.log(error);
    },
  });

  // ========================================
  // SEARCH BRANDS
  // ========================================

  const filteredBrands = brands.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = meta?.total || 0;
  const totalPages = meta?.totalPages || 1;

  const safePage = Math.min(currentPage, totalPages);

  // API handles pagination
  const paginatedBrands = filteredBrands;

  // ========================================
  // IMAGE SELECT (SIRF PREVIEW KE LIYE)
  // ========================================

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormError('');
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ========================================
  // CANCEL FORM
  // ========================================

  const handleCancel = () => {
    setNewBrandName('');
    setPreviewImage(null);
    setSelectedFile(null);
    setEditingId(null);
    setFormError('');
  };

  // ========================================
  // SAVE BRAND (CLOUDINARY UPLOAD + API)
  // ========================================

  const handleSaveBrand = async () => {
    if (!newBrandName.trim()) {
      setFormError('Please enter brand name.');
      return;
    }

    setFormError('');

    try {
      let logoUrl = editingId ? previewImage : null;

      // Agar nayi file select hui hai toh Cloudinary pe upload karke URL lo
      if (selectedFile) {
        setIsUploading(true);
        logoUrl = await uploadImageToCloudinary(selectedFile, 'brands');
      }

      const payload = {
        name: newBrandName.trim(),
        ...(logoUrl && { logoUrl }),
      };

      if (editingId) {
        updateBrandMutation.mutate({ id: editingId, ...payload });
      } else {
        createBrandMutation.mutate(payload);
      }
    } catch (err) {
      setFormError(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  // ========================================
  // EDIT BRAND
  // ========================================

  const handleEdit = (brand) => {
    setNewBrandName(brand.name);
    setPreviewImage(brand.logoUrl || null);
    setSelectedFile(null);
    setEditingId(brand.id);
    setFormError('');

    document
      .getElementById('brand-form')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  const isSubmitting =
    isUploading ||
    createBrandMutation.isPending ||
    updateBrandMutation.isPending;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">

      {/* ----------------- LEFT: Brand List ----------------- */}

      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5">

        {/* Header + Search + Add Brand */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
              Brand List
            </h2>

            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage vehicle brands with their logo.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">

            {/* Search input */}

            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

              <input
                type="text"
                placeholder="Search brand..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="w-full sm:w-56 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
              />
            </div>

            {/* Add Brand Button */}

            <button
              onClick={() => {
                handleCancel();
                document.getElementById('brand-name-input')?.focus();
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="hidden sm:inline">Add Brand</span>
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

                  <th className="py-2.5 px-2 sm:px-3">
                    Image
                  </th>

                  <th className="py-2.5 px-2 sm:px-3">
                    Brand Name
                  </th>

                  <th className="py-2.5 px-2 sm:px-3 text-center">
                    Status
                  </th>

                  <th className="py-2.5 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] font-bold text-slate-700">

                {isLoading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      Loading brands...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-rose-500">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <AlertCircle className="w-7 h-7 text-rose-500" />
                        <p className="font-bold text-sm">
                          {error?.response?.data?.message ||
                            'Failed to load Vehicle Brands.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedBrands.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      No brands found.
                    </td>
                  </tr>
                ) : (
                  paginatedBrands.map((brand, index) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >

                      {/* Index */}

                      <td className="py-2 px-2 sm:px-3 pl-3 sm:pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                        {(safePage - 1) * entriesPerPage + index + 1}
                      </td>

                      {/* Image */}

                      <td className="py-2 px-2 sm:px-3">
                        <div className="w-14 h-9 sm:w-16 sm:h-11 rounded-lg border border-slate-200/90 bg-white p-1 flex items-center justify-center shadow-2xs">
                          {brand.logoUrl && (
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="max-w-full max-h-full object-contain select-none"
                            />
                          )}
                        </div>
                      </td>

                      {/* Name */}

                      <td className="py-2 px-2 sm:px-3 font-bold text-slate-900 text-[13px] sm:text-[15px]">
                        {brand.name}
                      </td>

                      {/* Status */}

                      <td className="py-2 px-2 sm:px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const current = (brand.status || 'active').toLowerCase();
                            const next = current === 'active' ? 'inactive' : 'active';
                            setStatusModal({
                              brand,
                              currentStatus: current,
                              nextStatus: next,
                            });
                          }}
                          className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer hover:shadow-2xs active:scale-95 ${(brand.status || '').toLowerCase() === 'active'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70'
                            : 'text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100/70'
                            }`}
                          title={`Click to change status to ${(brand.status || '').toLowerCase() === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${(brand.status || '').toLowerCase() === 'active'
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                              }`}
                          />
                          <span className="capitalize">{brand.status || 'active'}</span>
                        </button>
                      </td>

                      {/* Actions */}

                      <td className="py-2 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleEdit(brand)}
                            className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Brand"
                          >
                            <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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

      {/* ----------------- RIGHT: Add / Edit Brand Form ----------------- */}

      <div
        id="brand-form"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5"
      >

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-bold text-black">
            {editingId ? 'Edit Brand' : 'Add Brand'}
          </h3>

          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
            title="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Upload box */}
        <div className="flex justify-center">
          <label className="relative flex flex-col items-center justify-center w-64 sm:w-72 h-40 border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-2xl cursor-pointer transition-all bg-slate-50/60 hover:bg-amber-50/20 group overflow-hidden p-1.5">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isSubmitting}
              className="hidden"
            />

            {previewImage ? (
              <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-white p-1">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 px-1 text-center">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-amber-500 group-hover:border-amber-300 flex items-center justify-center mb-1.5 shadow-2xs transition-colors">
                  <ImagePlus className="w-5 h-5 stroke-[2]" />
                </div>

                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Upload Brand Image
                </p>

                <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-0.5">
                  PNG, JPG or WEBP
                </p>
              </div>
            )}
          </label>
        </div>

        {/* Brand Name Input */}

        <div className="space-y-1.5">
          <label className="block text-sm font-bold text-slate-800">
            Brand Name <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <Tag className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />

            <input
              id="brand-name-input"
              type="text"
              placeholder="Enter brand name"
              value={newBrandName}
              onChange={(e) => {
                setNewBrandName(e.target.value);
                setFormError('');
              }}
              onKeyDown={(e) =>
                e.key === 'Enter' && !isSubmitting && handleSaveBrand()
              }
              disabled={isSubmitting}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all disabled:opacity-60"
            />
          </div>
        </div>

        {/* Form Error */}

        {formError && (
          <p className="text-xs font-semibold text-rose-500">
            {formError}
          </p>
        )}

        {/* Actions */}

        <div className="flex items-center gap-2.5 pt-1.5">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveBrand}
            disabled={!newBrandName.trim() || isSubmitting}
            className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />

            <span>
              {isUploading
                ? 'Uploading...'
                : createBrandMutation.isPending || updateBrandMutation.isPending
                  ? 'Saving...'
                  : editingId
                    ? 'Update'
                    : 'Save Brand'}
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
                  "{statusModal.brand?.name}"
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
                    id: statusModal.brand.id,
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