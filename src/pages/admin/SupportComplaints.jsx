import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Headphones,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  User,
  Users,
  Car,
  CreditCard,
  Shield,
  Star,
  Calendar,
  Eye,
  X,
  Send,
  MessageSquare,
  Clock,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { supportSummary, complaintsList } from '../../data/supportData';
import Pagination from '../../components/common/Pagination';
import financeSettlementsIcon from '../../assets/dashboard/finance-settlements.svg';
import totalTicketsMicIcon from '../../assets/icons/mic.svg';
import openAlertCircleIcon from '../../assets/icons/alert-circle-icon.svg';
import inProgressRefreshIcon from '../../assets/icons/refresh-icon.svg';
import resolvedCheckIcon from '../../assets/icons/b526c866-7ce7-4c15-848e-ed8378b03085 32 (1).svg';
import closedCircleIcon from '../../assets/icons/close-circle-icon.svg';

export default function SupportComplaints() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [userTypeDropdownOpen, setUserTypeDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Calendar UI state for custom interactive picker
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1)); // Default Nov 2026
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Modal detail state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');

  // Category Icon mapper
  const renderCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'ride issue':
      case 'vehicle':
        return <Car className="w-4 h-4 text-slate-700" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-slate-700" />;
      case 'safety':
        return <Shield className="w-4 h-4 text-slate-700" />;
      case 'account':
        return <FileText className="w-4 h-4 text-slate-700" />;
      case 'service':
        return <Star className="w-4 h-4 text-slate-700" />;
      default:
        return <Headphones className="w-4 h-4 text-slate-700" />;
    }
  };

  // Helper to parse date
  const parseComplaintDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split(',')[0].trim().split(' ');
    if (parts.length >= 3) {
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

  // Status Badge styling & dot
  const renderStatusBadge = (status) => {
    const s = status || 'Open';
    switch (s) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200">
            <img src={openAlertCircleIcon} alt="Open" className="w-3.5 h-3.5 object-contain" />
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200">
            <img src={inProgressRefreshIcon} alt="In Progress" className="w-3.5 h-3.5 object-contain" />
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <img src={resolvedCheckIcon} alt="Resolved" className="w-3.5 h-3.5 object-contain" />
            Resolved
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200">
            <img src={closedCircleIcon} alt="Closed" className="w-3.5 h-3.5 object-contain" />
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-600 bg-slate-100">
            {s}
          </span>
        );
    }
  };

  // Filter complaints
  const filteredComplaints = useMemo(() => {
    return complaintsList.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.relatedRide?.rideId && item.relatedRide.rideId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesUserType =
        selectedUserType === 'All' ||
        (item.userType || '').toLowerCase() === selectedUserType.toLowerCase();

      const itemStatus = item.ticketStatus || item.status || '';
      const matchesStatus =
        selectedStatus === 'All' ||
        itemStatus.toLowerCase() === selectedStatus.toLowerCase();

      // Date Range Filter
      if (startDate || endDate) {
        const cDate = parseComplaintDate(item.createdOn || item.createdDate);
        if (cDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (cDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (cDate > end) return false;
          }
        }
      }

      return matchesSearch && matchesUserType && matchesStatus;
    });
  }, [searchQuery, selectedUserType, selectedStatus, startDate, endDate]);

  const totalItems = searchQuery || selectedUserType !== 'All' || selectedStatus !== 'All' || startDate || endDate
    ? filteredComplaints.length
    : 1248;
  const displayedItems = filteredComplaints;

  return (
    <div className="space-y-5 pb-8">
      {/* 5 Top Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Tickets */}
        <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 text-slate-900 border border-amber-200/50">
            <img src={totalTicketsMicIcon} alt="Total Tickets" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {supportSummary.totalTickets}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {supportSummary.totalLabel}
            </div>
          </div>
        </div>

        {/* Open */}
        <div className="bg-rose-50/40 border border-rose-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-100/70 flex items-center justify-center shrink-0 text-rose-600 border border-rose-200/50">
            <img src={openAlertCircleIcon} alt="Open" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {supportSummary.open}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {supportSummary.openLabel}
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-sky-50/40 border border-sky-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="w-12 h-12 rounded-full bg-sky-100/70 flex items-center justify-center shrink-0 text-sky-600 border border-sky-200/50">
            <img src={inProgressRefreshIcon} alt="In Progress" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {supportSummary.inProgress}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {supportSummary.inProgressLabel}
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-100/70 flex items-center justify-center shrink-0 text-emerald-600 border border-emerald-200/50">
            <img src={resolvedCheckIcon} alt="Resolved" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {supportSummary.resolved}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {supportSummary.resolvedLabel}
            </div>
          </div>
        </div>

        {/* Closed */}
        <div className="bg-purple-50/40 border border-purple-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs transition-all hover:shadow-sm col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-full bg-purple-100/70 flex items-center justify-center shrink-0 text-purple-600 border border-purple-200/50">
            <img src={closedCircleIcon} alt="Closed" className="w-6 h-6 object-contain" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {supportSummary.closed}
            </div>
            <div className="text-xs font-semibold text-slate-700">
              {supportSummary.closedLabel}
            </div>
          </div>
        </div>
      </div>

      {/* Main Section: Complaints List */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Title Header */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center text-amber-900 shrink-0">
            <img src={financeSettlementsIcon} alt="Complaints List" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Complaints List
            </h2>
            <p className="text-xs text-slate-600 font-medium">
              All support requests and complaints from passengers and drivers.
            </p>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/30">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name, ticket ID or subject..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-semibold text-slate-900 shadow-2xs"
              />
            </div>
          </div>

          {/* Dropdowns Group */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-2">
            {/* User Type Dropdown */}
            <div className="flex-1 sm:flex-initial relative max-sm:w-full">
              <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-2">
                User Type
              </label>
              <button
                type="button"
                onClick={() => {
                  setUserTypeDropdownOpen(!userTypeDropdownOpen);
                  setStatusDropdownOpen(false);
                  setDatePickerOpen(false);
                }}
                className="w-full sm:w-36 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
              >
                <span className="truncate">{selectedUserType === 'All' ? 'All Users' : selectedUserType}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    userTypeDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {userTypeDropdownOpen && (
                <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                  {['All', 'Passenger', 'Driver'].map((u) => {
                    const isSelected = selectedUserType === u;
                    return (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          setSelectedUserType(u);
                          setUserTypeDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        {u === 'All' ? 'All Users' : u}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Dropdown */}
            <div className="flex-1 sm:flex-initial relative max-sm:w-full">
              <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
                Status
              </label>
              <button
                type="button"
                onClick={() => {
                  setStatusDropdownOpen(!statusDropdownOpen);
                  setUserTypeDropdownOpen(false);
                  setDatePickerOpen(false);
                }}
                className="w-full sm:w-38 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
              >
                <span className="truncate">{selectedStatus === 'All' ? 'All Statuses' : selectedStatus}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    statusDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {statusDropdownOpen && (
                <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                  {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((s) => {
                    const isSelected = selectedStatus === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setSelectedStatus(s);
                          setStatusDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                        }`}
                      >
                        {s === 'All' ? 'All Statuses' : s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date Range Dropdown & Picker */}
            <div className="flex-1 sm:flex-initial relative max-sm:w-full">
              <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
                Date Range
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
                  setUserTypeDropdownOpen(false);
                  setStatusDropdownOpen(false);
                }}
                className="w-full sm:w-54 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
              >
                <span className="flex items-center gap-1.5 text-slate-700 truncate">
                  <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="truncate">
                    {startDate || endDate
                      ? `${startDate ? startDate.split('-').reverse().join('-') : 'Start'} → ${endDate ? endDate.split('-').reverse().join('-') : 'End'}`
                      : 'Select Date Range'}
                  </span>
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </button>

              {/* Date Range Picker Popover with Custom Calendar View */}
              {datePickerOpen && (
                <div className="absolute right-0 max-sm:left-0 max-sm:right-auto mt-1.5 w-72 sm:w-68 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 space-y-2.5 animate-in fade-in zoom-in-95">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-900">
                        Complaint Date
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

                        for (let i = 0; i < firstDayIndex; i++) {
                          days.push(
                            <div key={`empty-${i}`} className="w-7 h-6.5 max-sm:mx-auto" />
                          );
                        }

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

            {/* Export Button */}
            <button
              type="button"
              className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer w-full sm:w-auto shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#feea98]/50 border-b border-amber-200/70 text-slate-900 text-xs sm:text-[13px] font-black uppercase tracking-wider">
                <th className="py-3 px-3 text-center w-12">#</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3">User Type</th>
                <th className="py-3 px-3">Ticket ID</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Subject</th>
                <th className="py-3 px-3 text-center">Ride ID</th>
                <th className="py-3 px-3">Created On</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
              {displayedItems.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/support/${item.id || item.ticketId.replace('#', '')}`)}
                  className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                >
                  {/* # */}
                  <td className="py-3.5 px-3 text-center font-bold text-slate-700">
                    {index + 1}
                  </td>

                  {/* User */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full border border-amber-300 p-0.5 shrink-0 overflow-hidden bg-amber-50">
                        <img
                          src={item.user.avatar}
                          alt={item.user.name}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <span className="font-extrabold text-slate-900 whitespace-nowrap">
                        {item.user.name}
                      </span>
                    </div>
                  </td>

                  {/* User Type Badge */}
                  <td className="py-3.5 px-3">
                    {item.userType === 'Passenger' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200">
                        <User className="w-3.5 h-3.5 text-sky-600" />
                        Passenger
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                        <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center text-[9px] font-black">
                          ✓
                        </span>
                        Driver
                      </span>
                    )}
                  </td>

                  {/* Ticket ID */}
                  <td className="py-3.5 px-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 font-mono font-extrabold text-xs text-slate-900 shadow-2xs">
                      {item.ticketId}
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2 text-slate-800 font-bold whitespace-nowrap">
                      <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center">
                        {renderCategoryIcon(item.category)}
                      </div>
                      <span>{item.category}</span>
                    </div>
                  </td>

                  {/* Subject */}
                  <td className="py-3.5 px-3">
                    <span
                      className="font-medium text-slate-800 truncate max-w-[200px] block"
                      title={item.fullSubject}
                    >
                      {item.subject}
                    </span>
                  </td>

                  {/* Ride ID */}
                  <td className="py-3.5 px-3 text-center">
                    {item.rideId ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 font-bold text-xs text-slate-900">
                        {item.rideId}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold text-sm">—</span>
                    )}
                  </td>

                  {/* Created On */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <div className="text-xs font-bold text-slate-900">
                      {item.createdOn}
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500">
                      {item.createdTime}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    {renderStatusBadge(item.ticketStatus || item.status)}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-center whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/support/${item.id || item.ticketId.replace('#', '')}`)}
                      type="button"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {displayedItems.length === 0 && (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-600 font-bold">
                    No support tickets or complaints match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Centralized Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>

      {/* Ticket Details & Action Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/40 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Ticket {selectedTicket.ticketId}
                    </h3>
                    {renderStatusBadge(selectedTicket.ticketStatus || selectedTicket.status)}
                  </div>
                  <p className="text-xs text-slate-600">
                    Created on {selectedTicket.createdOn} at {selectedTicket.createdTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* User Info Card */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedTicket.user.avatar}
                    alt={selectedTicket.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-300"
                  />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">
                      {selectedTicket.user.name}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {selectedTicket.user.phone} • {selectedTicket.user.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 block">User Type</span>
                  <span className="text-xs font-extrabold text-slate-900">
                    {selectedTicket.userType}
                  </span>
                </div>
              </div>

              {/* Ride Information (if applicable) */}
              {selectedTicket.rideId && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-900" />
                    <span className="text-xs font-bold text-amber-950">
                      Associated Ride ID:
                    </span>
                    <span className="font-mono font-black text-xs text-slate-900">
                      {selectedTicket.rideId}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // Navigate or show ride preview
                      window.open(`/rides/${selectedTicket.rideId}`, '_self');
                    }}
                    className="text-xs font-bold text-amber-900 hover:underline flex items-center gap-1"
                  >
                    View Ride <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Complaint Description */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Subject & Full Description
                </label>
                <div className="p-3.5 bg-white border border-slate-200 rounded-xl">
                  <h5 className="text-sm font-extrabold text-slate-900 mb-1">
                    {selectedTicket.category}: {selectedTicket.subject}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedTicket.fullSubject}
                  </p>
                </div>
              </div>

              {/* Update Status & Reply Box */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Quick Reply & Status Update
                </label>
                <textarea
                  rows="3"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official admin response or internal note..."
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs resize-none"
                ></textarea>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 rounded-b-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Change Status:</span>
                <select
                  defaultValue={selectedTicket.ticketStatus || selectedTicket.status}
                  className="h-8 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedTicket(null)}
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    alert(`Response sent for Ticket ${selectedTicket.ticketId}`);
                    setSelectedTicket(null);
                  }}
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#fed011] hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  Send & Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

