import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Calendar,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter
} from 'lucide-react';
import { passengersStats, passengersList } from '../../data/passengersData';
import { useNavigate } from 'react-router-dom';
import { Pagination, StatsCards } from '../../components/common';

// Assets
import totalPassengersIcon from '../../assets/drivers/df691cdf-f29c03.svg';
import activePassengersIcon from '../../assets/drivers/Group-9-1e8a06.svg';
import blockedPassengersIcon from '../../assets/drivers/f5a5f448-ccdf-4eed-ac86-f5f78f3ddfd3 5.svg';
import newThisMonthIcon from '../../assets/dashboard/9d339631-e072-42f8-b0ed-5ff639d869a8 2.svg';

export default function Passengers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState('All Statuses');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1));
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Helper to parse dates like "15 Oct 2026", "01 Nov 2026"
  const parseMemberDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.trim().split(' ');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const monthNames = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      const month = monthNames[parts[1]];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  const handleReset = () => {
    setSearchTerm('');
    setAccountStatusFilter('All Statuses');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setCurrentPage(1);
  };

  // Filter passengers
  const filteredPassengers = passengersList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passengerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      accountStatusFilter === 'All Statuses' ||
      accountStatusFilter === 'All Status' ||
      p.accountStatus === accountStatusFilter;

    // Date range filter
    let matchesDate = true;
    if (startDate || endDate) {
      const pDate = parseMemberDate(p.memberSince);
      if (pDate) {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (pDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (pDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats cards configuration for reusable StatsCards
  const passengerStats = [
    {
      id: 1,
      label: 'Total Passengers',
      value: passengersStats.totalPassengers,
      image: totalPassengersIcon,
      cardColor: 'bg-[#fffdf0] border-amber-200/80',
      iconBg: 'bg-[#fef3c7]',
      iconBoxSize: 'w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-11 sm:h-11',
      labelClassName: 'text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black',
      valueClassName: 'text-lg sm:text-2xl font-black text-black',
    },
    {
      id: 2,
      label: 'Active Passengers',
      value: passengersStats.activePassengers,
      image: activePassengersIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-[#dcfce7]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black',
      valueClassName: 'text-lg sm:text-2xl font-black text-black',
    },
    {
      id: 3,
      label: 'Blocked Passengers',
      value: passengersStats.blockedPassengers,
      image: blockedPassengersIcon,
      cardColor: 'bg-[#fff1f2] border-rose-200/80',
      iconBg: 'bg-[#ffe4e6]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-5 h-5 sm:w-7 sm:h-7',
      labelClassName: 'text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black',
      valueClassName: 'text-lg sm:text-2xl font-black text-black',
    },
    {
      id: 4,
      label: 'New This Month',
      value: passengersStats.newThisMonth,
      image: newThisMonthIcon,
      cardColor: 'bg-[#fffdf0] border-amber-200/80',
      iconBg: 'bg-[#fef3c7]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black',
      valueClassName: 'text-lg sm:text-2xl font-black text-black',
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 select-none pb-10 sm:pb-12">
      {/* =========================================================
          STATS CARDS (Reusable StatsCards - 4 Columns)
          ========================================================= */}
      <StatsCards
        items={passengerStats}
        columns="grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        className="max-w-6xl"
        cardHeight="p-3.5 sm:p-3.5"
      />

      {/* =========================================================
          SEARCH & CONTROLS FILTER BAR
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 sm:gap-2.5">
        {/* Search by Name, Mobile, Passenger ID */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Mobile or ID..."
            className="w-full pl-10 pr-4 py-2 sm:py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-2 w-full lg:w-auto">
          {/* Account Status */}
          <div className="relative w-full sm:w-42">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Account Status
            </label>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setDatePickerOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{accountStatusFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  statusDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {statusDropdownOpen && (
              <div className="absolute left-0 right-0 sm:right-auto mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['All Statuses', 'Active', 'Blocked'].map((status) => {
                  const isSelected = accountStatusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setAccountStatusFilter(status);
                        setStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Registration Date Dropdown & Picker */}
          <div className="relative w-full sm:w-54">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Registration Date
            </label>
            <button
              type="button"
              onClick={() => {
                if (!datePickerOpen) {
                  setTempStart(startDate);
                  setTempEnd(endDate);
                  if (startDate) {
                    const [y, m] = startDate.split('-').map(Number);
                    if (y && m) setCalendarViewDate(new Date(y, m - 1, 1));
                  }
                }
                setDatePickerOpen(!datePickerOpen);
                setStatusDropdownOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-1.5 text-slate-700 truncate text-xs sm:text-sm">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
                {startDate || endDate
                  ? `${startDate ? startDate.split('-').reverse().join('-') : 'Start'} → ${endDate ? endDate.split('-').reverse().join('-') : 'End'}`
                  : 'Select Date Range'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Date Range Picker Popover */}
            {datePickerOpen && (
              <div className="absolute left-0 right-0 sm:left-auto sm:right-0 mt-1.5 w-full sm:w-68 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 space-y-2.5 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">
                      Registration Date
                    </span>
                  </div>
                  {(tempStart || tempEnd || startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempStart('');
                        setTempEnd('');
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Interactive Calendar Month View */}
                <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                  {/* Month / Year Navigator */}
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <span className="text-[11px] font-bold text-slate-900">
                      {calendarViewDate.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-0.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-0.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day of week headers */}
                  <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-[9px] font-bold text-slate-400">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {(() => {
                      const year = calendarViewDate.getFullYear();
                      const month = calendarViewDate.getMonth();
                      const firstDayIndex = new Date(year, month, 1).getDay();
                      const totalDays = new Date(year, month + 1, 0).getDate();
                      const days = [];

                      // Empty slots for start padding
                      for (let i = 0; i < firstDayIndex; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="w-full h-6.5" />
                        );
                      }

                      // Month days
                      for (let day = 1; day <= totalDays; day++) {
                        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isStart = tempStart === dateString;
                        const isEnd = tempEnd === dateString;
                        const inRange =
                          tempStart &&
                          tempEnd &&
                          dateString >= tempStart &&
                          dateString <= tempEnd;

                        days.push(
                          <button
                            key={dateString}
                            type="button"
                            onClick={() => {
                              if (!tempStart || (tempStart && tempEnd)) {
                                setTempStart(dateString);
                                setTempEnd('');
                              } else {
                                if (dateString < tempStart) {
                                  setTempStart(dateString);
                                  setTempEnd('');
                                } else {
                                  setTempEnd(dateString);
                                }
                              }
                            }}
                            className={`w-full h-6.5 text-[11px] font-medium rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                                : inRange
                                ? 'bg-amber-100 text-amber-900 rounded-none'
                                : 'text-slate-700 hover:bg-white hover:text-slate-900'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-0.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempStart(startDate);
                      setTempEnd(endDate);
                      setDatePickerOpen(false);
                    }}
                    className="flex-1 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate(tempStart);
                      setEndDate(tempEnd);
                      setDatePickerOpen(false);
                      setCurrentPage(1);
                    }}
                    className="flex-1 h-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            onClick={() => alert('Exporting Passengers data...')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.4]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          PASSENGERS DATA TABLE (Card Container)
          ========================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto no-scrollbar pb-2">
          {/* Added min-w-[1050px] so the table doesn't squish on mobile */}
          <table className="w-full min-w-[1050px] text-left text-[13px] sm:text-[15px]">
            {/* Table Header: Yellow Banner */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-bold rounded-2xl border-y border-amber-200/60 text-[13px] sm:text-base">
                <th className="py-2.5 sm:py-3 px-3 rounded-l-xl whitespace-nowrap">#</th>
                <th className="py-2.5 sm:py-3 px-3 whitespace-nowrap">Passenger</th>
                <th className="py-2.5 sm:py-3 px-3 whitespace-nowrap">Passenger ID</th>
                <th className="py-2.5 sm:py-3 px-3 whitespace-nowrap">Mobile Number</th>
                <th className="py-2.5 sm:py-3 px-3 whitespace-nowrap">Email</th>
                <th className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">Total Bookings</th>
                <th className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">Completed Rides</th>
                <th className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">Cancelled Rides</th>
                <th className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">Account Status</th>
                <th className="py-2.5 sm:py-3 px-3 rounded-r-xl text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredPassengers.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/passengers/${p.id}`)}
                  className="hover:bg-amber-50/40 transition-colors text-slate-800 cursor-pointer"
                >
                  {/* # */}
                  <td className="py-2.5 sm:py-3 px-3 font-bold text-slate-500 whitespace-nowrap">
                    {p.id}
                  </td>

                  {/* Passenger: Avatar + Name */}
                  <td className="py-2.5 sm:py-3 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <span className="font-bold text-black whitespace-nowrap">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  {/* Passenger ID */}
                  <td className="py-2.5 sm:py-3 px-3 font-bold text-black whitespace-nowrap">
                    {p.passengerId}
                  </td>

                  {/* Mobile Number */}
                  <td className="py-2.5 sm:py-3 px-3 font-semibold text-black whitespace-nowrap">
                    {p.mobile}
                  </td>

                  {/* Email */}
                  <td className="py-2.5 sm:py-3 px-3 font-semibold text-black whitespace-nowrap">
                    {p.email}
                  </td>

                  {/* Total Bookings */}
                  <td className="py-2.5 sm:py-3 px-3 text-center font-bold text-black whitespace-nowrap">
                    {p.totalBookings}
                  </td>

                  {/* Completed Rides */}
                  <td className="py-2.5 sm:py-3 px-3 text-center font-bold text-black whitespace-nowrap">
                    {p.completedRides}
                  </td>

                  {/* Cancelled Rides */}
                  <td className="py-2.5 sm:py-3 px-3 text-center font-bold text-black whitespace-nowrap">
                    {p.cancelledRides}
                  </td>

                  {/* Account Status Badge */}
                  <td className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-[13px] font-bold border ${
                        p.accountStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                    >
                      {p.accountStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 sm:py-3 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/passengers/${p.id}`);
                      }}
                      className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-full text-slate-700 hover:text-black transition-colors cursor-pointer"
                      title="View Passenger Details"
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            BOTTOM PAGINATION BAR
            ========================================================= */}
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalItems={12486}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setEntriesPerPage}
            pageSizeOptions={[5, 10, 25, 50]}
            itemLabel="passengers"
          />
        </div>
      </div>
    </div>
  );
}