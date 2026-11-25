import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Calendar,
  XCircle,
  Plus,
  Search,
  Users,
  Eye,
  Megaphone,
  Gift,
  Car,
  Info,
  Percent,
  ShieldCheck,
  AlertTriangle,
  X,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Filter
} from 'lucide-react';
import { notificationsSummary, notificationsList } from '../../data/notificationsData';
import Pagination from '../../components/common/Pagination';
import StatsCards from '../../components/common/StatsCards';

// SVG Icons requested by user
import totalNotificationsIcon from '../../assets/icons/notification-transparent.svg';
import sentNotificationsIcon from '../../assets/icons/b526c866-7ce7-4c15-848e-ed8378b03085 32 (1).svg';
import scheduledNotificationsIcon from '../../assets/icons/calendar-blue.svg';
import failedNotificationsIcon from '../../assets/drivers/blocked-cancelled.svg';
import notificationListIcon from '../../assets/dashboard/finance-list.svg';
import sendPlaneIcon from '../../assets/drivers/send-plane-icon.svg';

export default function Notifications() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Notifications List');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('All Recipients');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [recipientDropdownOpen, setRecipientDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1));
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Helper to parse dates like "02 Nov 2026", "02 Nov 2026, 10:00 AM"
  const parseNotificationDate = (dateStr) => {
    if (!dateStr) return null;
    const cleaned = dateStr.split(',')[0].trim();
    const parts = cleaned.split(' ');
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
    setSelectedRecipient('All Recipients');
    setSelectedStatus('All Statuses');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setDatePickerOpen(false);
    setStatusDropdownOpen(false);
    setRecipientDropdownOpen(false);
    setCurrentPage(1);
  };

  // Stats cards configuration for reusable StatsCards
  const notificationStatsItems = [
    {
      id: 'total-notifications',
      label: 'Total Notifications',
      value: notificationsSummary.totalNotifications,
      image: totalNotificationsIcon,
      cardColor: 'bg-[#fffdf0] border-amber-300',
      iconBg: 'bg-[#fef3c7]',
      iconBoxSize: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8 object-contain',
      valueClassName: 'text-2xl sm:text-3xl font-black text-slate-900',
      labelClassName: 'text-xs sm:text-sm font-bold text-slate-700',
      height: 'p-3.5 sm:p-4',
    },
    {
      id: 'sent-notifications',
      label: 'Sent',
      value: notificationsSummary.sent,
      image: sentNotificationsIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200',
      iconBg: 'bg-[#dcfce7]',
      iconBoxSize: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8 object-contain',
      valueClassName: 'text-2xl sm:text-3xl font-black text-slate-900',
      labelClassName: 'text-xs sm:text-sm font-bold text-slate-700',
      height: 'p-3.5 sm:p-4',
    },
    {
      id: 'scheduled-notifications',
      label: 'Scheduled',
      value: notificationsSummary.scheduled,
      image: scheduledNotificationsIcon,
      cardColor: 'bg-[#f0f9ff] border-sky-200',
      iconBg: 'bg-[#e0f2fe]',
      iconBoxSize: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8 object-contain',
      valueClassName: 'text-2xl sm:text-3xl font-black text-slate-900',
      labelClassName: 'text-xs sm:text-sm font-bold text-slate-700',
      height: 'p-3.5 sm:p-4',
    },
    {
      id: 'failed-notifications',
      label: 'Failed',
      value: notificationsSummary.failed,
      image: failedNotificationsIcon,
      cardColor: 'bg-[#fff1f2] border-rose-200',
      iconBg: 'bg-[#ffe4e6]',
      iconBoxSize: 'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8 object-contain',
      valueClassName: 'text-2xl sm:text-3xl font-black text-slate-900',
      labelClassName: 'text-xs sm:text-sm font-bold text-slate-700',
      height: 'p-3.5 sm:p-4',
    },
  ];

  // Modal Detail State
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Create Notification Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newRecipient, setNewRecipient] = useState('All Users');
  const [scheduleType, setScheduleType] = useState('now');
  const [successToast, setSuccessToast] = useState('');

  const triggerToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  // Helper for notification icons
  const renderNotificationIcon = (iconType) => {
    switch (iconType) {
      case 'megaphone':
        return <Megaphone className="w-5 h-5 text-emerald-600" />;
      case 'gift':
        return <Gift className="w-5 h-5 text-rose-500" />;
      case 'car':
        return <Car className="w-5 h-5 text-amber-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-sky-500" />;
      case 'percent':
        return <Percent className="w-5 h-5 text-rose-500" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-rose-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-600" />;
    }
  };

  // Helper for status badge (matching vehicle list style)
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return (
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
            Sent
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-600 border border-sky-100/80">
            Scheduled
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100/80">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  // Helper for recipient pill (matching vehicle list style)
  const renderRecipientBadge = (recipient) => {
    if (recipient === 'Passengers') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-sky-700 bg-sky-50 border border-sky-100">
          <Users className="w-3.5 h-3.5 text-sky-600 stroke-[2.2]" />
          Passengers
        </span>
      );
    }
    if (recipient === 'Drivers') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
          <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center text-[9px] font-black">
            ✓
          </span>
          Drivers
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200/80">
        <Users className="w-3.5 h-3.5 text-amber-700 stroke-[2.2]" />
        All Users
      </span>
    );
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notificationsList.filter((item) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        item.title.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        (item.fullMessage && item.fullMessage.toLowerCase().includes(query)) ||
        (item.id && item.id.toLowerCase().includes(query));

      const matchesRecipient =
        selectedRecipient === 'All Recipients' ||
        selectedRecipient === 'All' ||
        item.recipient.toLowerCase() === selectedRecipient.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All Statuses' ||
        selectedStatus === 'All Status' ||
        selectedStatus === 'All' ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      let matchesDate = true;
      if (startDate || endDate) {
        const itemDate = parseNotificationDate(item.date || item.sentOn);
        if (itemDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (itemDate < start) matchesDate = false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (itemDate > end) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesRecipient && matchesStatus && matchesDate;
    });
  }, [searchTerm, selectedRecipient, selectedStatus, startDate, endDate]);

  const paginatedNotifications = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage;
    return filteredNotifications.slice(startIndex, startIndex + entriesPerPage);
  }, [filteredNotifications, currentPage, entriesPerPage]);

  const handleSendNotification = (e) => {
    e.preventDefault();
    setCreateModalOpen(false);
    triggerToast('Notification created and queued successfully!');
    setNewTitle('');
    setNewMessage('');
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {successToast}
        </div>
      )}

      {/* =========================================================
          1. TOP ROW: TAB BUTTONS (LEFT) + CREATE NOTIFICATION BUTTON (RIGHT)
          ========================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left 2 Tabs */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('Notifications List')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'Notifications List'
                ? 'bg-[#fed011] text-black shadow-xs font-black'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <img src={notificationListIcon} alt="Notifications List" className="w-5 h-5 object-contain shrink-0" />
            <span>Notifications List</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/notifications/create')}
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer shadow-2xs ${
              activeTab === 'Create Notification'
                ? 'bg-[#fed011] text-black shadow-xs font-black'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <img src={sendPlaneIcon} alt="Create Notification" className="w-5 h-5 object-contain shrink-0" />
            <span>Create Notification</span>
          </button>
        </div>

        {/* Right Yellow Action Button: + Create Notification */}
        <button
          type="button"
          onClick={() => navigate('/notifications/create')}
          className="h-11 px-6 bg-[#fed011] hover:bg-amber-400 text-black rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2.5 cursor-pointer shadow-xs transition-colors self-end sm:self-auto"
        >
          <img src={sendPlaneIcon} alt="Create Notification" className="w-5 h-5 object-contain shrink-0" />
          <span>Create Notification</span>
        </button>
      </div>

      {/* =========================================================
          2. FOUR SUMMARY METRIC CARDS (Reusable StatsCards)
          ========================================================= */}
      <StatsCards
        items={notificationStatsItems}
        columns="grid-cols-2 lg:grid-cols-4 gap-3.5"
        valueFirst={true}
      />

      {/* =========================================================
          3. SEARCH & CONTROLS FILTER BAR (Style matching Drivers page)
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5">
        {/* Search by Title, Message, ID */}
        <div className="relative flex-1 min-w-[240px] max-w-md max-sm:max-w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Title, Message or ID..."
            className="w-full pl-10.5 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap max-sm:flex-col items-end max-sm:items-stretch gap-2">
          {/* Recipient Type */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-2">
              Recipient Type
            </label>
            <button
              type="button"
              onClick={() => {
                setRecipientDropdownOpen(!recipientDropdownOpen);
                setStatusDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-44 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{selectedRecipient}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  recipientDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {recipientDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {[
                  'All Recipients',
                  'All Users',
                  'Passengers',
                  'Drivers'
                ].map((recipient) => {
                  const isSelected = selectedRecipient === recipient;
                  return (
                    <button
                      key={recipient}
                      type="button"
                      onClick={() => {
                        setSelectedRecipient(recipient);
                        setRecipientDropdownOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {recipient}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Delivery Status */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Status
            </label>
            <button
              type="button"
              onClick={() => {
                setStatusDropdownOpen(!statusDropdownOpen);
                setRecipientDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-40 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{selectedStatus}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  statusDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {statusDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {[
                  'All Statuses',
                  'Sent',
                  'Scheduled',
                  'Failed'
                ].map((status) => {
                  const isSelected = selectedStatus === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setSelectedStatus(status);
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

          {/* Sent Date Dropdown & Picker */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Sent Date
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
                setRecipientDropdownOpen(false);
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
                      Sent Date
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

          {/* Reset Button */}
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl transition-all cursor-pointer max-sm:w-full max-sm:mt-1 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Apply Button */}
          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
            }}
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer max-sm:w-full"
          >
            <Filter className="w-4 h-4 fill-black" />
            Apply
          </button>
        </div>
      </div>

      {/* =========================================================
          4. NOTIFICATIONS DATA TABLE (Ratings & Reviews Style)
          ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Content */}
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[850px]">
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5 text-center w-12 whitespace-nowrap">#</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Title</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Message (Preview)</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Recipient</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Sent / Scheduled On</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredNotifications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold text-sm sm:text-base">
                    No notifications found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginatedNotifications.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => navigate(`/notifications/${item.id || item.numericId}`)}
                    className="hover:bg-amber-50/20 transition-colors cursor-pointer"
                  >
                    {/* # */}
                    <td className="py-2 px-3.5 text-center font-bold text-slate-500 text-sm sm:text-base">
                      {(currentPage - 1) * entriesPerPage + index + 1}
                    </td>

                    {/* Title */}
                    <td className="py-2 px-3.5">
                      <div className="flex items-center gap-2.5 whitespace-nowrap">
                        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                          {renderNotificationIcon(item.iconType)}
                        </div>
                        <span className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </span>
                      </div>
                    </td>

                    {/* Message (Preview) */}
                    <td className="py-2 px-3.5">
                      <span className="font-medium text-xs sm:text-sm text-slate-700 truncate max-w-[320px] block">
                        {item.message}
                      </span>
                    </td>

                    {/* Recipient */}
                    <td className="py-2 px-3.5 whitespace-nowrap">
                      {renderRecipientBadge(item.recipient)}
                    </td>

                    {/* Sent / Scheduled On */}
                    <td className="py-2 px-3.5 whitespace-nowrap font-medium text-slate-700 text-xs sm:text-sm">
                      {item.sentOn}
                    </td>

                    {/* Status */}
                    <td className="py-2 px-3.5 text-center whitespace-nowrap">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Action */}
                    <td className="py-2 px-3.5 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/notifications/${item.id || item.numericId}`);
                        }}
                        className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                        title="View Notification Details"
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

        {/* Reusable Standardized Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredNotifications.length}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setEntriesPerPage(newSize);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="notifications"
        />
      </div>

      {/* =========================================================
          4. VIEW NOTIFICATION DETAIL MODAL
          ========================================================= */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-amber-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold">
                  {renderNotificationIcon(selectedNotification.iconType)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Sent on {selectedNotification.sentOn}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Recipient</span>
                  {renderRecipientBadge(selectedNotification.recipient)}
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block mb-0.5">Delivery Status</span>
                  {renderStatusBadge(selectedNotification.status)}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                  Full Message Content
                </label>
                <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {selectedNotification.fullMessage}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-black cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          5. CREATE NOTIFICATION POPUP MODAL
          ========================================================= */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-[#fffdf0]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold">
                  <img src={sendPlaneIcon} alt="Send" className="w-5 h-5 object-contain shrink-0" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    Create New Notification
                  </h3>
                  <p className="text-xs text-slate-600">
                    Broadcast announcement or send targeted push alert.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Notification Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Special Holiday Cashback"
                  className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Target Recipient <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
                >
                  <option value="All Users">All Users (Passengers & Drivers)</option>
                  <option value="Passengers">Passengers Only</option>
                  <option value="Drivers">Drivers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                  Message Body <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="4"
                  required
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write full announcement or alert message here..."
                  className="w-full p-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold text-slate-700 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleType === 'now'}
                    onChange={() => setScheduleType('now')}
                    className="accent-amber-500"
                  />
                  <span>Send Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="schedule"
                    checked={scheduleType === 'schedule'}
                    onChange={() => setScheduleType('schedule')}
                    className="accent-amber-500"
                  />
                  <span>Schedule for later</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
                >
                  <img src={sendPlaneIcon} alt="Send Notification" className="w-4 h-4 object-contain shrink-0" />
                  <span>Send Notification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

