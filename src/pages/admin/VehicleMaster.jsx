import React, { useState } from 'react';
import {
  Tag,
  Car,
  Palette,
  Armchair,
  Search,
  Plus,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  Save,
} from 'lucide-react';
import { initialBrandsList } from '../../data/vehicleMasterData';
import Pagination from '../../components/common/Pagination';
import brandTagIcon from '../../assets/drivers/price-tag-icon.svg';
import colorIcon from '../../assets/drivers/color-palette.svg';
import seatTypeIcon from '../../assets/drivers/seat-type.svg';

export default function VehicleMaster() {
  const [activeTab, setActiveTab] = useState('Brand');
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState(initialBrandsList);
  const [newBrandName, setNewBrandName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);

  // Tab definitions
  const tabs = [
    { name: 'Brand', image: brandTagIcon, icon: Tag },
    { name: 'Model', icon: Car },
    { name: 'Color', image: colorIcon, icon: Palette },
    { name: 'Seat Type', image: seatTypeIcon, icon: Armchair },
  ];

  // Filtered brands
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ FIX: Actual pagination slicing
  const totalPages = Math.max(1, Math.ceil(filteredBrands.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedBrands = filteredBrands.slice(
    (safePage - 1) * entriesPerPage,
    safePage * entriesPerPage
  );

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleSaveBrand = () => {
    if (!newBrandName.trim()) return;

    if (editingId) {
      // Update existing
      setBrands((prev) =>
        prev.map((b) =>
          b.id === editingId
            ? { ...b, name: newBrandName.trim(), image: previewImage || b.image }
            : b
        )
      );
    } else {
      // Add new
      const newBrand = {
        id: brands.length + 1,
        name: newBrandName.trim(),
        image: previewImage || brands[0]?.image,
        models: 0,
        status: 'Active',
      };
      setBrands([...brands, newBrand]);
    }

    setNewBrandName('');
    setPreviewImage(null);
    setEditingId(null);
    setCurrentPage(1);
  };

  const handleCancel = () => {
    setNewBrandName('');
    setPreviewImage(null);
    setEditingId(null);
  };

  const handleEdit = (brand) => {
    setNewBrandName(brand.name);
    setPreviewImage(brand.image);
    setEditingId(brand.id);
    // scroll form into view on mobile
    document
      .getElementById('brand-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b.id !== id));
    if (editingId === id) handleCancel();
  };

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* =========================================================
          TOP CATEGORY PILLS
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 px-2 sm:px-4 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer shadow-2xs ${isActive
                ? 'bg-[#fed011] text-black shadow-amber-300/40'
                : 'bg-white text-slate-700 hover:bg-slate-50 '
                }`}
            >
              {tab.image ? (
                <img
                  src={tab.image}
                  alt={tab.name}
                  className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                />
              ) : (
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] shrink-0" />
              )}
              <span className="text-[13px] sm:text-[15px] truncate">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          MAIN CONTENT AREA
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* ----------------- LEFT: Brand List (col-span-8) ----------------- */}
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
                    setCurrentPage(1);
                  }}
                  className="w-full sm:w-56 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              {/* Add Brand Button */}
              <button
                onClick={() => {
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
                    <th className="py-2.5 px-2 sm:px-3 pl-3 sm:pl-4 text-center w-8 sm:w-10">#</th>
                    <th className="py-2.5 px-2 sm:px-3">Image</th>
                    <th className="py-2.5 px-2 sm:px-3">Brand Name</th>
                    <th className="py-2.5 px-2 sm:px-3 text-center">Models</th>
                    <th className="py-2.5 px-2 sm:px-3 text-center">Status</th>
                    <th className="py-2.5 px-2 sm:px-3 pr-3 sm:pr-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] font-bold text-slate-700">
                  {paginatedBrands.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-slate-400 font-semibold"
                      >
                        No brands found.
                      </td>
                    </tr>
                  ) : (
                    paginatedBrands.map((brand, index) => (
                      <tr key={brand.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Index */}
                        <td className="py-2 px-2 sm:px-3 pl-3 sm:pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {(safePage - 1) * entriesPerPage + index + 1}
                        </td>

                        {/* Image */}
                        <td className="py-2 px-2 sm:px-3">
                          <div className="w-14 h-9 sm:w-16 sm:h-11 rounded-lg border border-slate-200/90 bg-white p-1 flex items-center justify-center shadow-2xs">
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="max-w-full max-h-full object-contain select-none"
                            />
                          </div>
                        </td>

                        {/* Name */}
                        <td className="py-2 px-2 sm:px-3 font-bold text-slate-900 text-[13px] sm:text-[15px]">
                          {brand.name}
                        </td>

                        {/* Models */}
                        <td className="py-2 px-2 sm:px-3 text-center font-bold text-slate-900 text-xs sm:text-sm">
                          {brand.models}
                        </td>

                        {/* Status */}
                        <td className="py-2 px-2 sm:px-3 text-center">
                          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
                            {brand.status}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-2 px-2 sm:px-3 pr-3 sm:pr-4 text-center">
                          <div className="flex items-center justify-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(brand)}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Brand"
                            >
                              <Pencil className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="p-1 sm:p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Brand"
                            >
                              <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
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
              totalItems={filteredBrands.length}
              itemsPerPage={entriesPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(n) => {
                setEntriesPerPage(n);
                setCurrentPage(1);
              }}
              pageSizeOptions={[5, 10, 20]}
              itemLabel="brands"
            />
          </div>
        </div>

        {/* ----------------- RIGHT: Add / Edit Brand Form (col-span-4) ----------------- */}
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
              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Upload box */}
          <label className="block border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-3 sm:p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-amber-50/20 group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {previewImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-12 object-contain rounded-lg mb-1.5"
                />
                <span className="text-xs font-bold text-amber-600">
                  Change Brand Image
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 text-slate-400 group-hover:text-amber-500 group-hover:border-amber-300 flex items-center justify-center mb-2 shadow-2xs transition-colors">
                  <ImagePlus className="w-5 h-5 stroke-[2]" />
                </div>
                <p className="text-sm font-bold text-slate-800">Upload Brand Image</p>
                <p className="text-[11px] sm:text-xs font-semibold text-slate-400 mt-0.5">
                  PNG, JPG or WEBP (Max 2 MB)
                </p>
              </div>
            )}
          </label>

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
                onChange={(e) => setNewBrandName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveBrand()}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 pt-1.5">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBrand}
              disabled={!newBrandName.trim()}
              className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
              <span>{editingId ? 'Update' : 'Save Brand'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}