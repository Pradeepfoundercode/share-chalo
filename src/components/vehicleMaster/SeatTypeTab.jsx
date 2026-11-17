import React, { useState } from 'react';
import {
  Armchair,
  Search,
  Plus,
  Pencil,
  X,
  Save,
  AlertCircle,
  Check,
} from 'lucide-react';
import { initialSeatTypesList } from '../../data/vehicleMasterData';
import Pagination from '../common/Pagination';

export default function SeatTypeTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [seatTypes, setSeatTypes] = useState(initialSeatTypesList);
  const [box1, setBox1] = useState('1');
  const [box2, setBox2] = useState('A');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState('');
  const [statusModal, setStatusModal] = useState(null);

  const busColumns = Array.from({ length: 12 }, (_, i) => i + 1);
  const validLetters = ['A', 'B', 'C', 'D'];

  const colNum = parseInt(box1, 10);
  const letter = box2.trim().toUpperCase();

  // Validate if seat exists in 1-12 and A-D
  const isValidSeat =
    !isNaN(colNum) &&
    colNum >= 1 &&
    colNum <= 12 &&
    validLetters.includes(letter);

  // Filtered seat types
  const filteredSeatTypes = seatTypes.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredSeatTypes.length / entriesPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedSeatTypes = filteredSeatTypes.slice(
    (safePage - 1) * entriesPerPage,
    safePage * entriesPerPage
  );

  // ========================================
  // SAVE SEAT TYPE (ADD OR UPDATE)
  // ========================================
  const handleSaveSeatType = () => {
    if (!isValidSeat) {
      setFormError('Please enter a valid seat (Number 1-12 and Letter A-D).');
      return;
    }

    setFormError('');
    const finalName = `${colNum}${letter}`;

    if (editingId) {
      setSeatTypes((prev) =>
        prev.map((s) =>
          s.id === editingId
            ? {
                ...s,
                name: finalName,
              }
            : s
        )
      );
    } else {
      const newSeatType = {
        id: seatTypes.length > 0 ? Math.max(...seatTypes.map((s) => s.id)) + 1 : 1,
        name: finalName,
        status: 'Active',
      };
      setSeatTypes([...seatTypes, newSeatType]);
    }

    handleCancel();
    setCurrentPage(1);
  };

  // ========================================
  // CANCEL & RESET FORM
  // ========================================
  const handleCancel = () => {
    setBox1('1');
    setBox2('A');
    setEditingId(null);
    setFormError('');
  };

  // ========================================
  // EDIT SEAT TYPE
  // ========================================
  const handleEdit = (seat) => {
    const match = (seat.name || '').match(/^(\d+)[xX\s]*([a-zA-Z])$/);
    if (match) {
      setBox1(match[1]);
      setBox2(match[2].toUpperCase());
    } else {
      setBox1('1');
      setBox2('A');
    }
    setEditingId(seat.id);
    setFormError('');
    document
      .getElementById('seat-type-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ========================================
  // TOGGLE STATUS HANDLER
  // ========================================
  const handleConfirmStatusChange = () => {
    if (!statusModal?.seat) return;
    setSeatTypes((prev) =>
      prev.map((s) =>
        s.id === statusModal.seat.id
          ? {
              ...s,
              status: statusModal.nextStatus === 'active' ? 'Active' : 'Inactive',
            }
          : s
      )
    );
    setStatusModal(null);
  };

  // ========================================
  // SEAT LAYOUT HELPER: Highlight ONLY exact seat
  // ========================================
  const isSeatSelected = (col, seatLetter) => {
    if (!isValidSeat) return false;
    return colNum === col && letter === seatLetter;
  };

  // Quick click on seat in layout
  const handleSeatClick = (col, seatLetter) => {
    setBox1(String(col));
    setBox2(seatLetter);
    setFormError('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
      {/* ----------------- LEFT: Seat Type List (col-span-8) ----------------- */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-3.5">
        {/* Header + Search + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-black leading-tight">
              Seat Type List
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Manage vehicle seat configuration formats and layout arrangements.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            {/* Search input */}
            <div className="relative flex-1 sm:w-44 md:w-52">
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search seat type..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={() => {
                handleCancel();
                document.getElementById('box1-input')?.focus();
              }}
              className="flex items-center justify-center gap-1.5 sm:gap-2 bg-[#fed011] hover:bg-amber-400 text-black px-3.5 sm:px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-2xs cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="whitespace-nowrap">Add Seat Type</span>
            </button>
          </div>
        </div>

        {/* Table - ONLY #, Seat Type, Status, Action */}
        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-[12px] sm:text-[13px] font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-12 sm:w-16">#</th>
                  <th className="py-2.5 px-3">Seat Type</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 pr-4 text-center w-24">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px] sm:text-[14px] font-bold text-slate-700">
                {paginatedSeatTypes.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-slate-400 font-semibold"
                    >
                      No seat types found.
                    </td>
                  </tr>
                ) : (
                  paginatedSeatTypes.map((seat, index) => {
                    const currentStatus = (seat.status || 'Active').toLowerCase();
                    const isActive = currentStatus === 'active';

                    return (
                      <tr
                        key={seat.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Index */}
                        <td className="py-2.5 px-3 pl-4 text-center text-slate-900 font-bold text-xs sm:text-sm">
                          {(safePage - 1) * entriesPerPage + index + 1}
                        </td>

                        {/* Seat Type Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
                              <Armchair className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-900 text-sm sm:text-base">
                              {seat.name}
                            </span>
                          </div>
                        </td>

                        {/* Status (Clickable button with Confirmation Modal) */}
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const next = isActive ? 'inactive' : 'active';
                              setStatusModal({
                                seat,
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
                        <td className="py-2.5 px-3 pr-4 text-center">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => handleEdit(seat)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Edit Seat Type"
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
            totalItems={filteredSeatTypes.length}
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

      {/* ----------------- RIGHT: Add/Edit Seat Type Card (col-span-4) ----------------- */}
      <div
        id="seat-type-form"
        className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 sm:p-5 space-y-4"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-black">
              {editingId ? 'Edit Seat Type' : 'Add Seat Type'}
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

        {/* Error Message */}
        {formError && (
          <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-100">
            {formError}
          </p>
        )}

        {/* Dual Input Box with "x" */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-800 text-center">
            Seat Type <span className="text-red-500">*</span>
          </label>

          <div className="flex items-center justify-center gap-3">
            {/* Box 1 (Number 1-12) */}
            <div className="w-20 sm:w-24">
              <input
                id="box1-input"
                type="text"
                inputMode="numeric"
                maxLength={2}
                placeholder="1"
                value={box1}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, '');
                  setBox1(val);
                  setFormError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && isValidSeat && handleSaveSeatType()}
                className="w-full text-center py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all uppercase"
              />
            </div>

            {/* Into "x" Sign */}
            <div className="text-slate-400 font-extrabold text-2xl select-none shrink-0">
              ×
            </div>

            {/* Box 2 (Alphabet A-D Only) */}
            <div className="w-20 sm:w-24">
              <input
                id="box2-input"
                type="text"
                maxLength={1}
                placeholder="A"
                value={box2}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
                  setBox2(val);
                  setFormError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && isValidSeat && handleSaveSeatType()}
                className="w-full text-center py-2 px-2 bg-slate-50 border border-slate-200 rounded-xl text-lg font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all uppercase"
              />
            </div>
          </div>
        </div>

        {/* Bus Seat Layout */}
        <div className="bg-slate-50/80 border-2 border-slate-200/90 rounded-2xl p-2 sm:p-2.5 relative shadow-inner">
            <div className="flex items-stretch gap-1.5 sm:gap-2">
              {/* Driver & Entry Section (Left Side of Bus - Compact Width) */}
              <div className="w-7 sm:w-8 rounded-xl bg-slate-200/70 border border-slate-300/80 flex flex-col justify-between items-center py-1 px-0.5 text-center shrink-0 select-none">
                {/* Windshield curved top */}
                <div className="w-4 h-0.5 bg-slate-400 rounded-full mt-0.5" />

                {/* Driver Steering wheel icon */}
                <div className="flex flex-col items-center gap-0.5">
                  <div className="w-5 h-5 rounded-full border border-slate-600 bg-white flex items-center justify-center shadow-2xs">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 fill-slate-700"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
                      <path d="M12 3v6.5M12 14.5V21M3 12h6.5M14.5 12H21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-[7px] font-extrabold text-slate-700 tracking-tight">
                    Driver
                  </span>
                </div>

                {/* Yellow Entry Door Steps */}
                <div className="w-full bg-amber-300 border border-amber-400 rounded py-0.5 px-0.5 text-[6px] font-bold text-amber-950">
                  <div className="h-0.5 bg-amber-400/80 rounded-xs mb-0.5" />
                  <div className="h-0.5 bg-amber-400/80 rounded-xs" />
                </div>
              </div>

              {/* Passenger Seat Grid (All 12 Columns Fit Without Scroll) */}
              <div className="flex-1 min-w-0">
                <div className="w-full flex flex-col justify-between h-full space-y-1">
                  {/* Upper Row (A) */}
                  <div className="flex items-center gap-0.5 sm:gap-1 w-full">
                    {busColumns.map((col) => {
                      const selected = isSeatSelected(col, 'A');
                      return (
                        <button
                          type="button"
                          key={`A-${col}`}
                          onClick={() => handleSeatClick(col, 'A')}
                          title={`Select ${col}A`}
                          className={`flex-1 aspect-square rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold tracking-tighter transition-all border cursor-pointer ${
                            selected
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs scale-105'
                              : 'bg-white text-slate-300 border-slate-200 hover:border-amber-300 hover:text-slate-600'
                          }`}
                        >
                          {col}A
                        </button>
                      );
                    })}
                  </div>

                  {/* Upper Row (B) */}
                  <div className="flex items-center gap-0.5 sm:gap-1 w-full">
                    {busColumns.map((col) => {
                      const selected = isSeatSelected(col, 'B');
                      return (
                        <button
                          type="button"
                          key={`B-${col}`}
                          onClick={() => handleSeatClick(col, 'B')}
                          title={`Select ${col}B`}
                          className={`flex-1 aspect-square rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold tracking-tighter transition-all border cursor-pointer ${
                            selected
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs scale-105'
                              : 'bg-white text-slate-300 border-slate-200 hover:border-amber-300 hover:text-slate-600'
                          }`}
                        >
                          {col}B
                        </button>
                      );
                    })}
                  </div>

                  {/* Central Walkway / Aisle */}
                  <div className="h-2.5 border-y border-dashed border-slate-200 bg-white/60 flex items-center justify-center rounded-xs my-0.5">
                    <span className="text-[6.5px] font-extrabold text-slate-400 tracking-widest uppercase">
                      AISLE
                    </span>
                  </div>

                  {/* Lower Row (C) */}
                  <div className="flex items-center gap-0.5 sm:gap-1 w-full">
                    {busColumns.map((col) => {
                      const selected = isSeatSelected(col, 'C');
                      return (
                        <button
                          type="button"
                          key={`C-${col}`}
                          onClick={() => handleSeatClick(col, 'C')}
                          title={`Select ${col}C`}
                          className={`flex-1 aspect-square rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold tracking-tighter transition-all border cursor-pointer ${
                            selected
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs scale-105'
                              : 'bg-white text-slate-300 border-slate-200 hover:border-amber-300 hover:text-slate-600'
                          }`}
                        >
                          {col}C
                        </button>
                      );
                    })}
                  </div>

                  {/* Lower Row (D) */}
                  <div className="flex items-center gap-0.5 sm:gap-1 w-full">
                    {busColumns.map((col) => {
                      const selected = isSeatSelected(col, 'D');
                      return (
                        <button
                          type="button"
                          key={`D-${col}`}
                          onClick={() => handleSeatClick(col, 'D')}
                          title={`Select ${col}D`}
                          className={`flex-1 aspect-square rounded-md flex items-center justify-center text-[7px] sm:text-[8px] font-extrabold tracking-tighter transition-all border cursor-pointer ${
                            selected
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-2xs scale-105'
                              : 'bg-white text-slate-300 border-slate-200 hover:border-amber-300 hover:text-slate-600'
                          }`}
                        >
                          {col}D
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 pt-1">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveSeatType}
            disabled={!isValidSeat}
            className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer"
          >
            <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
            <span>{editingId ? 'Update' : 'Save Seat Type'}</span>
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
                  "{statusModal.seat?.name}"
                </span>{' '}
                to{' '}
                <span className="font-bold text-amber-600 capitalize">
                  {statusModal.nextStatus}
                </span>
                ?
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setStatusModal(null)}
                className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusChange}
                className="flex-1 py-2.5 px-3 bg-[#fed011] hover:bg-amber-400 text-black text-sm font-bold rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
