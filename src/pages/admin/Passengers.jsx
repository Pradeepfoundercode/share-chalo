import React, { useState, useMemo } from 'react';
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
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { passengersStats, passengersList } from '../../data/passengersData';
import { getUsersApi } from '../../services/user.services';
import { Pagination, StatsCards } from '../../components/common';

// Assets
import totalPassengersIcon from '../../assets/drivers/passengers-orange.svg';
import activePassengersIcon from '../../assets/drivers/Group-9-1e8a06.svg';
import blockedPassengersIcon from '../../assets/drivers/blocked-cancelled.svg';
import newThisMonthIcon from '../../assets/dashboard/calender-yellow.svg';
import defaultAvatar from '../../assets/amit_kumar_photo.png';

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
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  // Applied filters state (only applies when "Apply" button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'All Statuses',
    startDate: '',
    endDate: '',
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      status: accountStatusFilter,
      startDate: startDate,
      endDate: endDate,
    });
    setCurrentPage(1);
  };

  // Fetch users/passengers from API
  const { data: usersResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-users', currentPage, entriesPerPage],
    queryFn: () => getUsersApi({ page: currentPage, limit: entriesPerPage }),
  });

  const apiData = usersResponse?.data;
  const apiStats = apiData?.stats || usersResponse?.stats;
  const meta = usersResponse?.meta;

  // Extract users list safely
  const rawUsers = useMemo(() => {
    if (!usersResponse) return null;
    if (Array.isArray(apiData?.users)) return apiData.users;
    if (Array.isArray(apiData)) return apiData;
    if (Array.isArray(usersResponse?.users)) return usersResponse.users;
    return [];
  }, [usersResponse, apiData]);

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

  // Helper to format ISO date string to readable format
  const formatRegisteredDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Map API users to passenger rows (fallback to mock if offline/not fetched)
  const passengers = useMemo(() => {
    if (rawUsers) {
      return rawUsers.map((u, idx) => ({
        id: u.userId ?? idx + 1,
        userId: u.userId,
        passengerId: u.userId != null ? u.userId : idx + 1,
        name: u.name || 'User',
        mobile: u.mobile || '-',
        email: u.email || '-',
        avatar: u.imageUrl || defaultAvatar,
        totalBookings: u.totalBookings ?? 0,
        completedRides: u.completedRides ?? 0,
        cancelledRides: u.cancelledRides ?? 0,
        accountStatus: u.status
          ? u.status.charAt(0).toUpperCase() + u.status.slice(1).toLowerCase()
          : 'Active',
        registeredOn: u.registeredOn,
        registeredOnFormatted: formatRegisteredDate(u.registeredOn),
        memberSince: formatRegisteredDate(u.registeredOn),
      }));
    }
    return passengersList.map((p) => ({
      ...p,
      registeredOnFormatted: p.memberSince || '-',
    }));
  }, [rawUsers]);

  const handleReset = () => {
    setSearchTerm('');
    setAccountStatusFilter('All Statuses');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setAppliedFilters({
      search: '',
      status: 'All Statuses',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  // Filter passengers (using appliedFilters)
  const filteredPassengers = useMemo(() => {
    return passengers.filter((p) => {
      const pIdStr = String(p.passengerId || p.id || '');
      const matchesSearch =
        !appliedFilters.search ||
        p.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        pIdStr.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        p.mobile.includes(appliedFilters.search) ||
        p.email.toLowerCase().includes(appliedFilters.search.toLowerCase());

      const matchesStatus =
        appliedFilters.status === 'All Statuses' ||
        appliedFilters.status === 'All Status' ||
        p.accountStatus.toLowerCase() === appliedFilters.status.toLowerCase();

      // Date range filter
      let matchesDate = true;
      if (appliedFilters.startDate || appliedFilters.endDate) {
        const pDate = p.registeredOn ? new Date(p.registeredOn) : parseMemberDate(p.memberSince);
        if (pDate && !isNaN(pDate.getTime())) {
          if (appliedFilters.startDate) {
            const start = new Date(appliedFilters.startDate);
            start.setHours(0, 0, 0, 0);
            if (pDate < start) matchesDate = false;
          }
          if (appliedFilters.endDate) {
            const end = new Date(appliedFilters.endDate);
            end.setHours(23, 59, 59, 999);
            if (pDate > end) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [passengers, appliedFilters]);

  // Stats cards configuration for reusable StatsCards
  const passengerStats = useMemo(() => [
    {
      id: 1,
      label: 'Total Passengers',
      value: apiStats
        ? (apiStats.totalUsers ?? 0).toLocaleString()
        : passengersStats.totalPassengers,
      image: totalPassengersIcon,
      cardColor: 'bg-[#fffdf0] border-amber-200/80',
      iconBg: 'bg-[#fef3c7]',
      iconBoxSize: 'w-10 h-10 sm:w-13 sm:h-13 rounded-xl sm:rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-11 sm:h-11',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 2,
      label: 'Active Passengers',
      value: apiStats
        ? (apiStats.activeUsers ?? 0).toLocaleString()
        : passengersStats.activePassengers,
      image: activePassengersIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-[#dcfce7]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 3,
      label: 'Inactive Passengers',
      value: apiStats
        ? (apiStats.inactiveUsers ?? 0).toLocaleString()
        : '0',
      image: newThisMonthIcon,
      cardColor: 'bg-[#fffdf0] border-amber-200/80',
      iconBg: 'bg-[#fef3c7]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 4,
      label: 'Blocked Passengers',
      value: apiStats
        ? (apiStats.blockedUsers ?? 0).toLocaleString()
        : passengersStats.blockedPassengers,
      image: blockedPassengersIcon,
      cardColor: 'bg-[#fff1f2] border-rose-200/80',
      iconBg: 'bg-[#ffe4e6]',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-5 h-5 sm:w-7 sm:h-7',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
  ], [apiStats]);

  const hasActiveFilters = Boolean(
    appliedFilters.search ||
    (appliedFilters.status && appliedFilters.status !== 'All Statuses') ||
    appliedFilters.startDate ||
    appliedFilters.endDate
  );

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
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
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
                {['All Statuses', 'Active', 'Inactive', 'Blocked'].map((status) => {
                  const isSelected = accountStatusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setAccountStatusFilter(status);
                        setStatusDropdownOpen(false);
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

          {/* Reset Filters Button (if filters active) */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Filter className="w-4 h-4 fill-black" />
            <span>Apply</span>
          </button>

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
          PASSENGERS DATA TABLE (Ratings & Reviews Style)
          ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[1000px]">
            {/* Table Header: Ratings & Reviews Amber/Yellow Tint */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5 text-center w-12 whitespace-nowrap">#</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Passenger</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Passenger ID</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Mobile Number</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Email</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Registered On</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Total Bookings</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Completed Rides</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Cancelled Rides</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Account Status</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-bold">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-7 h-7 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs font-semibold text-slate-500">Loading passengers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPassengers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400 font-bold text-sm sm:text-base">
                    No passengers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredPassengers.map((p, index) => (
                  <tr
                    key={p.id}
                    onClick={() => navigate(`/passengers/${p.id}`)}
                    className="hover:bg-amber-50/20 transition-colors cursor-pointer"
                  >
                    {/* # */}
                    <td className="py-2 px-3.5 text-center font-bold text-slate-500 text-sm sm:text-base whitespace-nowrap">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>

                    {/* Passenger: Avatar + Name */}
                    <td className="py-2 px-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-8.5 h-8.5 rounded-full object-cover shrink-0 border border-amber-300 ring-1 ring-amber-100"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultAvatar;
                          }}
                        />
                        <span className="font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">
                          {p.name}
                        </span>
                      </div>
                    </td>

                    {/* Passenger ID */}
                    <td className="py-2 px-3.5 font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">
                      <span className="inline-block bg-[#fffdf0] border border-amber-200/80 px-2.5 py-0.5 rounded-lg text-xs sm:text-sm font-bold text-slate-900 shadow-2xs">
                        {p.passengerId}
                      </span>
                    </td>

                    {/* Mobile Number */}
                    <td className="py-2 px-3.5 font-medium text-slate-700 text-xs sm:text-sm whitespace-nowrap">
                      {p.mobile}
                    </td>

                    {/* Email */}
                    <td className="py-2 px-3.5 font-medium text-slate-700 text-xs sm:text-sm whitespace-nowrap">
                      {p.email}
                    </td>

                    {/* Registered On */}
                    <td className="py-2 px-3.5 text-center font-medium text-slate-700 text-xs sm:text-sm whitespace-nowrap">
                      {p.registeredOnFormatted}
                    </td>

                    {/* Total Bookings */}
                    <td className="py-2 px-3.5 text-center font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">
                      {p.totalBookings}
                    </td>

                    {/* Completed Rides */}
                    <td className="py-2 px-3.5 text-center font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">
                      {p.completedRides}
                    </td>

                    {/* Cancelled Rides */}
                    <td className="py-2 px-3.5 text-center font-bold text-slate-900 text-sm sm:text-base whitespace-nowrap">
                      {p.cancelledRides}
                    </td>

                    {/* Account Status Badge */}
                    <td className="py-2 px-3.5 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
                          p.accountStatus.toLowerCase() === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100/80'
                            : p.accountStatus.toLowerCase() === 'blocked'
                            ? 'bg-rose-50 text-rose-600 border-rose-100/80'
                            : 'bg-amber-50 text-amber-700 border-amber-200/80'
                        }`}
                      >
                        {p.accountStatus}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3.5 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/passengers/${p.id}`);
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="View Passenger Details"
                      >
                        <Eye className="w-4.5 h-4.5 text-slate-800" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            BOTTOM PAGINATION BAR
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={meta?.total ?? filteredPassengers.length}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(limit) => {
            setEntriesPerPage(limit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          itemLabel="passengers"
        />
      </div>
    </div>
  );
}
