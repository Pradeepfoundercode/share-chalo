import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Ban,
  Search,
  RotateCcw,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  Filter,
  Car,
  FileText,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import driversIcon from '../../assets/Group (1).svg';
import Pagination from '../../components/common/Pagination';
import StatsCards from '../../components/common/StatsCards';

import { driversList } from '../../data/driversData';

const driverStats = [
  {
    id: "total-drivers",
    label: "Total Drivers",
    value: "1,250",
    image: driversIcon,
    cardColor: "bg-[#fffbeb] border-amber-200/80",
    iconBg: "bg-amber-200/80",
  },
  {
    id: "approved",
    label: "Approved",
    value: "1,080",
    icon: CheckCircle2,
    cardColor: "bg-[#f0fdf4] border-emerald-200/80",
    iconBg: "bg-emerald-100",
    iconColor: "text-[#16a34a]",
  },
  {
    id: "pending",
    label: "Pending",
    value: "68",
    icon: Clock,
    cardColor: "bg-[#fefce8] border-yellow-200/80",
    iconBg: "bg-yellow-100",
    iconColor: "text-[#ca8a04]",
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "32",
    icon: X,
    cardColor: "bg-[#fef2f2] border-rose-200/80",
    iconBg: "bg-rose-100",
    iconColor: "text-[#dc2626]",
  },
  {
    id: "action-required",
    label: "Action Required",
    value: "70",
    icon: AlertCircle,
    cardColor: "bg-[#fff7ed] border-orange-200/80",
    iconBg: "bg-orange-100",
    iconColor: "text-[#ea580c]",
  },
  {
    id: "blocked",
    label: "Blocked",
    value: "20",
    icon: Ban,
    cardColor: "bg-[#faf5ff] border-purple-200/80",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

export default function Drivers() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState(driversList);
  const [selectedTab, setSelectedTab] = useState('All Drivers');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [vehicleFilter, setVehicleFilter] = useState('All Vehicles');
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [selectedDriverDetail, setSelectedDriverDetail] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [vehicleDropdownOpen, setVehicleDropdownOpen] = useState(false);

  // Calendar UI state for custom interactive picker
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1)); // Default Nov 2026
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  // Tab Definitions
  const tabs = [
    { name: 'All Drivers', count: '1,250' },
    { name: 'Pending', count: '68' },
    { name: 'Approved', count: '1,080' },
    { name: 'Rejected', count: '32' },
    { name: 'Action Required', count: '70' },
    { name: 'Blocked', count: '20' },
  ];

  // Select all handler
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDrivers(drivers.map((d) => d.id));
    } else {
      setSelectedDrivers([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedDrivers((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Reset Filters
  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setVehicleFilter('All Vehicles');
    setSelectedTab('All Drivers');
    setStartDate('');
    setEndDate('');
    setDatePickerOpen(false);
  };

  // Helper to parse dates like "02 Nov 2026" or "30 Oct 2026"
  const parseRegistrationDate = (dateStr) => {
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

  // Filtered List
  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      // Tab filter
      if (selectedTab === 'Pending' && driver.kycStatus !== 'Pending') return false;
      if (selectedTab === 'Approved' && driver.kycStatus !== 'Approved') return false;
      if (selectedTab === 'Rejected' && driver.kycStatus !== 'Rejected') return false;
      if (selectedTab === 'Action Required' && driver.kycStatus !== 'Action Required') return false;
      if (selectedTab === 'Blocked' && driver.accountStatus !== 'Blocked') return false;

      // Status dropdown filter
      if (statusFilter !== 'All Statuses' && driver.kycStatus !== statusFilter) return false;

      // Vehicle dropdown filter
      if (vehicleFilter !== 'All Vehicles' && driver.vehicleType !== vehicleFilter) return false;

      // Registration Date Filter
      if (startDate || endDate) {
        const driverDate = parseRegistrationDate(driver.registeredOn);
        if (driverDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (driverDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (driverDate > end) return false;
          }
        }
      }

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = driver.name.toLowerCase().includes(query);
        const matchesMobile = driver.mobile.toLowerCase().includes(query);
        const matchesId = driver.id.toLowerCase().includes(query);
        const matchesPlate = driver.plate.toLowerCase().includes(query);
        if (!matchesName && !matchesMobile && !matchesId && !matchesPlate) return false;
      }

      return true;
    });
  }, [drivers, selectedTab, statusFilter, vehicleFilter, searchTerm, startDate, endDate]);

  // Status Badge Component
  const renderKycBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-bold bg-[#eafaf1] text-[#16a34a]">
            <Check className="w-4 h-4 stroke-[2.6]" />
            Approved
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-bold bg-[#fef9eb] text-[#d97706]">
            <Clock className="w-4 h-4 stroke-[2.2]" />
            Pending
          </span>
        );
      case 'Action Required':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-bold bg-[#fff7ed] text-[#ea580c]">
            <AlertCircle className="w-4 h-4 stroke-[2.2]" />
            Action Required
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-bold bg-[#fdf2f2] text-[#dc2626]">
            <X className="w-4 h-4 stroke-[2.6]" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  const renderAccountBadge = (status) => {
    if (status === 'Active') {
      return (
        <span className="inline-block px-3.5 py-1 rounded-md text-[13px] font-bold bg-[#eefaf4] text-[#16a34a]">
          Active
        </span>
      );
    }
    return (
      <span className="inline-block px-3.5 py-1 rounded-md text-[13px] font-bold bg-[#fee2e2]/80 text-[#dc2626]">
        Blocked
      </span>
    );
  };

  return (
    <div className="space-y-5 pb-10">
      {/* 1. REUSABLE STATS CARDS */}
      <StatsCards items={driverStats} />

      {/* =========================================================
          2. FILTER STATUS TABS ROW
          ========================================================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab.name;
          return (
            <button
              key={tab.name}
              onClick={() => setSelectedTab(tab.name)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-xs'
                  : 'bg-gray-100/90 text-slate-700 hover:bg-gray-200/90'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          );
        })}
      </div>

      {/* =========================================================
          3. SEARCH & CONTROLS FILTER BAR
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5">
        {/* Search by Name, Mobile, Driver ID */}
        <div className="relative flex-1 min-w-[240px] max-w-md max-sm:max-w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, Mobile or Driver ID..."
            className="w-full pl-10.5 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap max-sm:flex-col items-end max-sm:items-stretch gap-2">
          {/* Verification Status */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-2">
              Verification Status
            </label>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setVehicleDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-42 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{statusFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  statusDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {statusDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {[
                  'All Statuses',
                  'Approved',
                  'Pending',
                  'Action Required',
                  'Rejected'
                ].map((status) => {
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setStatusDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
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

          {/* Vehicle Type */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Vehicle Type
            </label>
            <button
              type="button"
              onClick={() => {
                setVehicleDropdownOpen(!vehicleDropdownOpen);
                setStatusDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-44 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{vehicleFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  vehicleDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {vehicleDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {[
                  'All Vehicles',
                  'Private Car',
                  'Commercial Car',
                  'Commercial Bus'
                ].map((type) => {
                  const isSelected = vehicleFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setVehicleFilter(type);
                        setVehicleDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Registration Date Dropdown & Picker */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
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
                setVehicleDropdownOpen(false);
              }}
              className="w-full sm:w-54 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-1.5 text-slate-700 truncate text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                {startDate || endDate
                  ? `${startDate ? startDate.split('-').reverse().join('-') : 'Start'} → ${endDate ? endDate.split('-').reverse().join('-') : 'End'}`
                  : 'Select Date Range'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Date Range Picker Popover with Custom Calendar View */}
            {datePickerOpen && (
              <div className="absolute right-0 max-sm:left-0 mt-1.5 sm:w-68 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 space-y-2.5 animate-in fade-in zoom-in-95">
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
                          <div key={`empty-${i}`} className="w-7 h-6.5 max-sm:mx-auto" />
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
                              // If no start date or both already selected, start a fresh range
                              if (!tempStart || (tempStart && tempEnd)) {
                                setTempStart(dateString);
                                setTempEnd('');
                              } else {
                                // Already have start, picking end
                                if (dateString < tempStart) {
                                  setTempStart(dateString);
                                  setTempEnd('');
                                } else {
                                  setTempEnd(dateString);
                                }
                              }
                            }}
                            className={`w-7 h-6.5 max-sm:mx-auto text-[11px] font-medium rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                                : inRange
                                ? 'bg-amber-100 text-amber-900 rounded-none max-sm:w-full'
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

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl transition-all cursor-pointer max-sm:w-full max-sm:mt-1"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Apply Button */}
          <button className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer max-sm:w-full">
            <Filter className="w-4 h-4 fill-black" />
            Apply
          </button>
        </div>
      </div>

      {/* =========================================================
          4. DRIVERS DATA TABLE
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70 text-slate-800 font-bold text-[13px] select-none">
                <th className="py-2.5 px-4">Driver</th>
                <th className="py-2.5 px-4">Driver ID</th>
                <th className="py-2.5 px-4">Mobile</th>
                <th className="py-2.5 px-4">Vehicle</th>
                <th className="py-2.5 px-4">KYC Status</th>
                <th className="py-2.5 px-4">Account Status</th>
                <th className="py-2.5 px-4">Registered On</th>
                <th className="py-2.5 px-4 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No drivers found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => {
                  return (
                    <tr
                      key={driver.id}
                      onClick={() => navigate(`/drivers/${driver.id}`)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                    >
                      {/* Driver Avatar & Name */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl border border-amber-400 bg-amber-50/60 p-0.5 flex items-center justify-center shrink-0">
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          </div>
                          <span className="font-bold text-slate-900 whitespace-nowrap text-sm">
                            {driver.name}
                          </span>
                        </div>
                      </td>

                      {/* Driver ID */}
                      <td className="py-2.5 px-4 font-bold text-slate-700 whitespace-nowrap text-sm">
                        {driver.id}
                      </td>

                      {/* Mobile */}
                      <td className="py-2.5 px-4 text-slate-800 font-semibold whitespace-nowrap text-sm">
                        {driver.mobile}
                      </td>

                      {/* Vehicle Cutout & Plate */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-11 h-8 flex items-center justify-center shrink-0">
                            <img
                              src={driver.vehicleImg}
                              alt={driver.vehicleType}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-tight whitespace-nowrap text-sm">
                              {driver.vehicleType}
                            </p>
                            <p className="text-xs text-slate-500 font-semibold mt-0.5 whitespace-nowrap">
                              {driver.plate}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* KYC Status */}
                      <td className="py-2.5 px-4 whitespace-nowrap text-xs">
                        {renderKycBadge(driver.kycStatus)}
                      </td>

                      {/* Account Status */}
                      <td className="py-2.5 px-4 whitespace-nowrap text-xs">
                        {renderAccountBadge(driver.accountStatus)}
                      </td>

                      {/* Registered On */}
                      <td className="py-2.5 px-4 text-slate-800 font-medium whitespace-nowrap text-sm">
                        {driver.registeredOn}
                      </td>

                      {/* View Button */}
                      <td className="py-2.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/drivers/${driver.id}`)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 bg-white border border-amber-300 hover:bg-amber-100/60 transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-4 h-4 text-slate-700" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            5. TABLE PAGINATION FOOTER (Reusable Component)
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={1250}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="drivers"
        />
      </div>

      {/* =========================================================
          6. DRIVER DETAIL MODAL
          ========================================================= */}
      {selectedDriverDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-sm:w-[95%] p-6 max-sm:p-4 shadow-2xl border border-gray-100 relative max-sm:max-h-[90vh] max-sm:overflow-y-auto">
            <button
              onClick={() => setSelectedDriverDetail(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-4 max-sm:flex-col max-sm:text-center border-b border-gray-100 pb-5">
              <img
                src={selectedDriverDetail.avatar}
                alt={selectedDriverDetail.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-amber-400"
              />
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedDriverDetail.name}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  ID: <span className="text-slate-800">{selectedDriverDetail.id}</span> • Registered: {selectedDriverDetail.registeredOn}
                </p>
                <div className="mt-2 flex items-center max-sm:justify-center gap-2">
                  {renderKycBadge(selectedDriverDetail.kycStatus)}
                  {renderAccountBadge(selectedDriverDetail.accountStatus)}
                </div>
              </div>
            </div>

            {/* Details List */}
            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone className="w-4 h-4 text-slate-400" /> Mobile
                </span>
                <span className="font-bold text-slate-900">
                  {selectedDriverDetail.mobile}
                </span>
              </div>

              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Mail className="w-4 h-4 text-slate-400" /> Email
                </span>
                <span className="font-bold text-slate-900">
                  {selectedDriverDetail.email}
                </span>
              </div>

              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <Car className="w-4 h-4 text-slate-400" /> Vehicle
                </span>
                <div className="flex items-center gap-2">
                  <img
                    src={selectedDriverDetail.vehicleImg}
                    alt={selectedDriverDetail.vehicleType}
                    className="w-7 h-5 object-contain"
                  />
                  <span className="font-bold text-slate-900">
                    {selectedDriverDetail.vehicleType} ({selectedDriverDetail.plate})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start max-sm:gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <FileText className="w-4 h-4 text-slate-400" /> Documents
                </span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Aadhaar, DL, RC Verified
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end max-sm:justify-center gap-2.5">
              <button
                onClick={() => setSelectedDriverDetail(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setDrivers((prev) =>
                    prev.map((d) =>
                      d.id === selectedDriverDetail.id
                        ? { ...d, kycStatus: 'Approved' }
                        : d
                    )
                  );
                  setSelectedDriverDetail(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#fed011] hover:bg-amber-200 transition-all cursor-pointer shadow-xs"
              >
                Approve Driver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}