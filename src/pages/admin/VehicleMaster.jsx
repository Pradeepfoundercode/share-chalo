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
  ChevronLeft,
  ChevronRight,
  Save
} from 'lucide-react';
import { initialBrandsList } from '../../data/vehicleMasterData';
import Pagination from '../../components/common/Pagination';

export default function VehicleMaster() {
  const [activeTab, setActiveTab] = useState('Brand');
  const [searchTerm, setSearchTerm] = useState('');
  const [brands, setBrands] = useState(initialBrandsList);
  const [newBrandName, setNewBrandName] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Tab definitions matching top pills
  const tabs = [
    { name: 'Brand', icon: Tag },
    { name: 'Model', icon: Car },
    { name: 'Color', icon: Palette },
    { name: 'Seat Type', icon: Armchair },
  ];

  // Filtered brands
  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    const newBrand = {
      id: brands.length + 1,
      name: newBrandName.trim(),
      image: previewImage || brands[0].image,
      models: 0,
      status: 'Active',
    };

    setBrands([...brands, newBrand]);
    setNewBrandName('');
    setPreviewImage(null);
  };

  const handleCancel = () => {
    setNewBrandName('');
    setPreviewImage(null);
  };

  const handleDelete = (id) => {
    setBrands(brands.filter((b) => b.id !== id));
  };

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* =========================================================
          TOP CATEGORY PILLS (Brand, Model, Color, Seat Type)
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-base font-bold transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-amber-300/40'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Icon className="w-5.5 h-5.5 stroke-[2.3]" />
              <span className="text-[15px]">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          MAIN CONTENT AREA (Left: Brand List | Right: Add Brand Form)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* ----------------- LEFT: Brand List Table (col-span-8) ----------------- */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3.5">
          {/* Header & Search / Add Brand Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight">
                Brand List
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                Manage vehicle brands with their logo.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search brand name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40 sm:w-56 pl-9.5 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13.5px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              {/* Add Brand Action Button */}
              <button
                onClick={() => {
                  const input = document.getElementById('brand-name-input');
                  if (input) input.focus();
                }}
                className="flex items-center gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <Plus className="w-4.5 h-4.5 stroke-[2.4]" />
                <span>Add Brand</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[13px] font-bold text-slate-900">
                    <th className="py-2.5 px-3 pl-4 text-center w-10">#</th>
                    <th className="py-2.5 px-3">Brand Image</th>
                    <th className="py-2.5 px-3">Brand Name</th>
                    <th className="py-2.5 px-3 text-center">Models</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 pr-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[14px] font-bold text-slate-700">
                  {filteredBrands.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold">
                        No brands found.
                      </td>
                    </tr>
                  ) : (
                    filteredBrands.map((brand, index) => (
                      <tr
                        key={brand.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* 1. Index */}
                        <td className="py-2 px-3 pl-4 text-center text-slate-900 font-bold text-sm">
                          {index + 1}
                        </td>

                        {/* 2. Brand Image (Bordered Box) */}
                        <td className="py-2 px-3">
                          <div className="w-18 h-11 rounded-lg border border-slate-200/90 bg-white p-1 flex items-center justify-center shadow-2xs">
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="max-w-full max-h-full object-contain select-none"
                            />
                          </div>
                        </td>

                        {/* 3. Brand Name */}
                        <td className="py-2 px-3 font-bold text-slate-900 text-[15px]">
                          {brand.name}
                        </td>

                        {/* 4. Models count */}
                        <td className="py-2 px-3 text-center font-bold text-slate-900 text-sm">
                          {brand.models}
                        </td>

                        {/* 5. Status Badge */}
                        <td className="py-2 px-3 text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            {brand.status}
                          </span>
                        </td>

                        {/* 6. Action Icons (Edit / Delete) */}
                        <td className="py-2 px-3 pr-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                setNewBrandName(brand.name);
                                setPreviewImage(brand.image);
                              }}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Brand"
                            >
                              <Pencil className="w-4.5 h-4.5 stroke-[2.2]" />
                            </button>
                            <button
                              onClick={() => handleDelete(brand.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Brand"
                            >
                              <Trash2 className="w-4.5 h-4.5 stroke-[2.2]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Reusable Component) */}
            <Pagination
              currentPage={currentPage}
              totalItems={brands.length}
              itemsPerPage={entriesPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setEntriesPerPage}
              pageSizeOptions={[5, 10, 20]}
              itemLabel="brands"
            />
          </div>
        </div>

        {/* ----------------- RIGHT: Add Brand Form (col-span-4) ----------------- */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-3.5">
          {/* Header with Title + Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base sm:text-lg font-bold text-black">
              Add Brand
            </h3>
            <button
              onClick={handleCancel}
              className="p-1.5 text-slate-400 hover:text-black hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Dotted Upload Brand Image Box */}
          <label className="block border-2 border-dashed border-slate-300 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-amber-50/20 group">
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
                  <ImagePlus className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Upload Brand Image
                </p>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  PNG, JPG or WEBP (Max 2 MB)
                </p>
              </div>
            )}
          </label>

          {/* Brand Name Input Field */}
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-800">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="w-4.5 h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                id="brand-name-input"
                type="text"
                placeholder="Enter brand name"
                value={newBrandName}
                onChange={(e) => setNewBrandName(e.target.value)}
                className="w-full pl-9.5 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons: Cancel + Save Brand */}
          <div className="flex items-center gap-2.5 pt-1.5">
            <button
              onClick={handleCancel}
              className="flex-1 py-2.5 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveBrand}
              className="flex-1 py-2.5 px-3.5 bg-[#fed011] hover:bg-amber-400 text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
            >
              <Save className="w-4.5 h-4.5 stroke-[2.2]" />
              <span>Save Brand</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
