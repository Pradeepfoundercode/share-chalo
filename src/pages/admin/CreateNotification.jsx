import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Calendar,
  Send,
  Save,
  Users,
  User,
  Car,
  Plus,
  X,
  Search,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import DetailsHeader from '../../components/common/DetailsHeader';
import { createNotificationApi } from '../../services/notification.services';

// Custom SVGs requested by user
import financeSettlementsIcon from '../../assets/dashboard/finance-settlements.svg';
import selectUsersIcon from '../../assets/dashboard/72658f49-1c99-42c0-b972-a95bf219ed1e 9.svg';
import chatMessageIcon from '../../assets/dashboard/chat-message-icon-transparent.svg';
import totalSeatsIcon from '../../assets/drivers/total-seats.svg';
import privateCarIcon from '../../assets/drivers/private-car.svg';
import group10Icon from '../../assets/dashboard/Group (10).svg';

export default function CreateNotification() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Form states
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  // Recipient Target
  const [recipientOption, setRecipientOption] = useState('All Users');

  // Schedule option: 'now' or 'schedule'
  const [scheduleOption, setScheduleOption] = useState('now');
  const [scheduleDate, setScheduleDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [scheduleTime, setScheduleTime] = useState('12:00');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const [y, m, d] = dateStr.split('-').map(Number);
    if (!y || !m || !d) return dateStr;
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // User picker state
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All Users');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Mutation for creating/broadcasting notification
  const createMutation = useMutation({
    mutationFn: createNotificationApi,
    onSuccess: (data) => {
      const msg = data?.message || 'Notification broadcasted successfully';
      toast.success(msg);
      triggerToast(msg);
      queryClient.invalidateQueries({ queryKey: ['admin-notifications'] });
      setTimeout(() => navigate('/notifications'), 1000);
    },
    onError: (err) => {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to broadcast notification';
      toast.error(errorMsg);
      triggerToast(errorMsg);
    },
  });

  // Mock users list for selected users table
  const usersList = [
    {
      id: 1,
      name: 'Rohit Kumar',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      type: 'Passenger',
      phone: '+91 98765 43210'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      type: 'Driver',
      phone: '+91 91234 56780'
    },
    {
      id: 3,
      name: 'Amit Verma',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
      type: 'Passenger',
      phone: '+91 87654 32109'
    },
    {
      id: 4,
      name: 'Neha Singh',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
      type: 'Driver',
      phone: '+91 99887 66554'
    }
  ];

  const filteredUsers = usersList.filter((user) => {
    if (userFilter === 'Passenger' && user.type !== 'Passenger') return false;
    if (userFilter === 'Driver' && user.type !== 'Driver') return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      const matchName = user.name.toLowerCase().includes(q);
      const matchPhone = user.phone.toLowerCase().includes(q);
      const matchId = String(user.id).includes(q);
      if (!matchName && !matchPhone && !matchId) return false;
    }
    return true;
  });

  const handleToggleUser = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setSelectedUserIds([]);
  };

  const selectedCount = selectedUserIds.length;
  const passengerCount = usersList.filter(
    (u) => selectedUserIds.includes(u.id) && u.type === 'Passenger'
  ).length;
  const driverCount = usersList.filter(
    (u) => selectedUserIds.includes(u.id) && u.type === 'Driver'
  ).length;

  const handleSend = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please enter a notification title');
      return;
    }
    if (!message.trim()) {
      toast.error('Please enter a notification message');
      return;
    }

    let target = 'all';
    if (recipientOption === 'All Passengers') target = 'passenger';
    else if (recipientOption === 'All Drivers') target = 'driver';
    else if (recipientOption === 'Selected Users') target = 'all';

    let scheduledAt = null;
    if (scheduleOption === 'schedule' && scheduleDate) {
      const timeStr = scheduleTime || '00:00';
      try {
        scheduledAt = new Date(`${scheduleDate}T${timeStr}:00`).toISOString();
      } catch {
        scheduledAt = null;
      }
    }

    const payload = {
      title: title.trim(),
      message: message.trim(),
      target,
      scheduledAt,
    };

    createMutation.mutate(payload);
  };

  const handleSaveDraft = () => {
    triggerToast('Saved as draft!');
  };

  return (
    <div className="space-y-3 pb-8">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMsg}
        </div>
      )}

      {/* =========================================================
          REUSABLE DETAILS HEADER BAR (Driver Details Style)
          ========================================================= */}
      <DetailsHeader
        title="Create Notification"
        breadcrumbs={[
          { label: 'Notifications', path: '/notifications' },
          { label: 'Create Notification' },
        ]}
      />

      {/* Main 2-Column Layout */}
      <form onSubmit={handleSend}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* =========================================================
              LEFT COLUMN (col-span-7): Title, Message, Media, Schedule
              ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            {/* 1. Notification Title Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-base sm:text-[17px] font-bold text-slate-900">
                  <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={financeSettlementsIcon} alt="Notification Title" className="w-5 h-5 object-contain" />
                  </div>
                  <span>Notification Title</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-xs sm:text-sm font-bold text-slate-400">
                  {title.length} / 80
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter notification title..."
                className="w-full h-10.5 px-3.5 bg-white border border-slate-200 rounded-xl text-sm sm:text-[15px] font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
              />
            </div>

            {/* 2. Message Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 text-base sm:text-[17px] font-bold text-slate-900">
                  <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={chatMessageIcon} alt="Message" className="w-5 h-5 object-contain" />
                  </div>
                  <span>Message</span>
                  <span className="text-rose-500 font-bold">*</span>
                </label>
                <span className="text-xs sm:text-sm font-bold text-slate-400">
                  {message.length} / 300
                </span>
              </div>
              <textarea
                rows="3"
                required
                maxLength={300}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your notification message here..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm sm:text-[15px] font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* 3. Schedule & Send Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2">
              <label className="flex items-center gap-2.5 text-base sm:text-[17px] font-bold text-slate-900">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                  <img src={selectUsersIcon} alt="Schedule & Send" className="w-5 h-5 object-contain" />
                </div>
                <span>Schedule & Send</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Send Now Option */}
                <div
                  onClick={() => setScheduleOption('now')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scheduleOption === 'now'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      scheduleOption === 'now'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {scheduleOption === 'now' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                       Send Now
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      Send the notification immediately
                    </span>
                  </div>
                </div>

                {/* Schedule for Later Option */}
                <div
                  onClick={() => setScheduleOption('schedule')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scheduleOption === 'schedule'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      scheduleOption === 'schedule'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {scheduleOption === 'schedule' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                      Schedule for Later
                    </span>
                    <span className="text-xs text-slate-600 font-semibold">
                      Choose date and time to send
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Time Picker if Schedule is selected */}
              {scheduleOption === 'schedule' && (
                <div className="grid grid-cols-2 gap-2.5 pt-1 animate-in fade-in">
                  {/* Custom Calendar Date Picker */}
                  <div className="relative">
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                      Date
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (!datePickerOpen && scheduleDate) {
                          const [y, m, d] = scheduleDate.split('-').map(Number);
                          if (y && m) setCalendarViewDate(new Date(y, m - 1, d || 1));
                        }
                        setDatePickerOpen(!datePickerOpen);
                      }}
                      className="w-full h-10 px-3 bg-white border border-slate-200 hover:border-amber-400 rounded-xl text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between cursor-pointer shadow-2xs transition-colors"
                    >
                      <span className="flex items-center gap-2 text-slate-800">
                        <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>{formatDisplayDate(scheduleDate)}</span>
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          datePickerOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Backdrop for outside click */}
                    {datePickerOpen && (
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setDatePickerOpen(false)}
                      />
                    )}

                    {/* Custom Calendar Popover - Opens Upwards */}
                    {datePickerOpen && (
                      <div className="absolute left-0 bottom-full mb-2 w-68 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 space-y-2.5 animate-in fade-in zoom-in-95">
                        {/* Month / Year Navigator */}
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs sm:text-[13px] font-bold text-slate-900">
                            {calendarViewDate.toLocaleString('default', {
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <div className="flex items-center gap-1">
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
                              className="w-6.5 h-6.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
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
                              className="w-6.5 h-6.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Day of week headers */}
                        <div className="grid grid-cols-7 gap-1 text-center">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                            <span key={d} className="text-[11px] font-bold text-slate-400">
                              {d}
                            </span>
                          ))}
                        </div>

                        {/* Days grid */}
                        <div className="grid grid-cols-7 gap-1">
                          {(() => {
                            const year = calendarViewDate.getFullYear();
                            const month = calendarViewDate.getMonth();
                            const firstDayIndex = new Date(year, month, 1).getDay();
                            const totalDays = new Date(year, month + 1, 0).getDate();
                            const days = [];

                            // Empty slots for start padding
                            for (let i = 0; i < firstDayIndex; i++) {
                              days.push(
                                <div key={`empty-${i}`} className="w-7 h-7" />
                              );
                            }

                            // Month days
                            for (let day = 1; day <= totalDays; day++) {
                              const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                              const isSelected = scheduleDate === dateString;

                              days.push(
                                <button
                                  key={dateString}
                                  type="button"
                                  onClick={() => {
                                    setScheduleDate(dateString);
                                    setDatePickerOpen(false);
                                  }}
                                  className={`w-7 h-7 text-xs font-bold rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#fed011] text-black shadow-xs font-bold'
                                      : 'text-slate-800 hover:bg-slate-100'
                                  }`}
                                >
                                  {day}
                                </button>
                              );
                            }
                            return days;
                          })()}
                        </div>

                        {/* Footer: Today & Done */}
                        <div className="flex items-center justify-between border-t border-slate-100 pt-2 px-0.5 text-xs font-bold">
                          <button
                            type="button"
                            onClick={() => {
                              const today = new Date();
                              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                              setScheduleDate(todayStr);
                              setCalendarViewDate(today);
                              setDatePickerOpen(false);
                            }}
                            className="text-amber-600 hover:text-amber-700 cursor-pointer"
                          >
                            Today
                          </button>
                          <button
                            type="button"
                            onClick={() => setDatePickerOpen(false)}
                            className="text-slate-500 hover:text-slate-700 cursor-pointer"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form Actions: Send Notification + Save as Draft */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="h-10.5 px-6 rounded-xl bg-[#fed011] hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-black text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4.5 h-4.5" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-10.5 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Save className="w-4.5 h-4.5" />
                <span>Save as Draft</span>
              </button>
            </div>
          </div>

          {/* =========================================================
              RIGHT COLUMN (col-span-5): Select Recipients + Select Users
              ========================================================= */}
          <div className="lg:col-span-5 space-y-3">
            {/* 1. Select Recipients Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2">
              <label className="flex items-center gap-2.5 text-base sm:text-[17px] font-bold text-slate-900 pb-0.5">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                  <img src={totalSeatsIcon} alt="Select Recipients" className="w-5 h-5 object-contain" />
                </div>
                <span>Select Recipients</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>

              <div className="space-y-1.5">
                {/* Option 1: All Users */}
                <div
                  onClick={() => setRecipientOption('All Users')}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Users'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      recipientOption === 'All Users'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {recipientOption === 'All Users' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={totalSeatsIcon} alt="All Users" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                      All Users
                    </span>
                    <span className="text-xs text-slate-600 font-semibold leading-none">
                      Send to all passengers and drivers
                    </span>
                  </div>
                </div>

                {/* Option 2: All Passengers */}
                <div
                  onClick={() => setRecipientOption('All Passengers')}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Passengers'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      recipientOption === 'All Passengers'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {recipientOption === 'All Passengers' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={group10Icon} alt="All Passengers" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                      All Passengers
                    </span>
                    <span className="text-xs text-slate-600 font-semibold leading-none">
                      Send only to registered passengers
                    </span>
                  </div>
                </div>

                {/* Option 3: All Drivers */}
                <div
                  onClick={() => setRecipientOption('All Drivers')}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Drivers'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      recipientOption === 'All Drivers'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {recipientOption === 'All Drivers' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={privateCarIcon} alt="All Drivers" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                      All Drivers
                    </span>
                    <span className="text-xs text-slate-600 font-semibold leading-none">
                      Send only to registered drivers
                    </span>
                  </div>
                </div>

                {/* Option 4: Selected Users (Highlighted Active in screenshot) */}
                <div
                  onClick={() => setRecipientOption('Selected Users')}
                  className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'Selected Users'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      recipientOption === 'Selected Users'
                        ? 'border-[#fed011] bg-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {recipientOption === 'Selected Users' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                    <img src={totalSeatsIcon} alt="Selected Users" className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <span className="text-sm sm:text-[15px] font-bold text-slate-900 block leading-tight">
                      Selected Users
                    </span>
                    <span className="text-xs text-slate-600 font-semibold leading-none">
                      Choose specific passengers or drivers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Select Users Card (When Selected Users is active) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
              <label className="flex items-center gap-2.5 text-base sm:text-[17px] font-bold text-slate-900">
                <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                  <img src={selectUsersIcon} alt="Select Users" className="w-5 h-5 object-contain" />
                </div>
                <span>Select Users</span>
                <span className="text-rose-500 font-bold">*</span>
              </label>

              {/* Search + All Users Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4.5 h-4.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, mobile number or user ID..."
                    className="w-full h-10 pl-9.5 pr-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-4 relative">
                  <button
                    type="button"
                    onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    className="w-full h-10 flex items-center justify-between px-3 text-xs sm:text-sm font-bold rounded-xl border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
                  >
                    <span className="truncate">
                      {userFilter === 'Passenger' ? 'Passengers' : userFilter === 'Driver' ? 'Drivers' : 'All Users'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform ${
                        filterDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Backdrop for outside click */}
                  {filterDropdownOpen && (
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setFilterDropdownOpen(false)}
                    />
                  )}

                  {/* Custom Dropdown Menu matching Drivers page */}
                  {filterDropdownOpen && (
                    <div className="absolute right-0 left-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                      {[
                        { value: 'All Users', label: 'All Users' },
                        { value: 'Passenger', label: 'Passengers' },
                        { value: 'Driver', label: 'Drivers' }
                      ].map((item) => {
                        const isSelected = userFilter === item.value;
                        return (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() => {
                              setUserFilter(item.value);
                              setFilterDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                            }`}
                          >
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Users Checkbox List - Compact & Bigger Text */}
              <div className="divide-y divide-slate-100 rounded-xl overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 font-semibold text-xs sm:text-sm">
                    No users found matching your search or filter.
                  </div>
                ) : (
                  filteredUsers.map((user) => {
                  const isChecked = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleToggleUser(user.id)}
                      className="p-2 sm:p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Custom Square Checkbox */}
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#fed011] text-black font-bold'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <span className="text-xs font-bold">✓</span>}
                        </div>

                        {/* Avatar */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8.5 h-8.5 rounded-full object-cover border border-amber-300 shrink-0"
                        />

                        {/* Name */}
                        <span className="text-sm sm:text-[14.5px] font-bold text-slate-900 truncate">
                          {user.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* User Type Badge */}
                        {user.type === 'Passenger' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200">
                            <User className="w-3.5 h-3.5 text-sky-600" />
                            Passenger
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                            <span className="w-3.5 h-3.5 rounded-full border border-emerald-600 flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </span>
                            Driver
                          </span>
                        )}

                        {/* Phone */}
                        <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap">
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  );
                }))}
              </div>

              {/* Bottom Summary Pill: 3 Users Selected (2 Passengers, 1 Driver) | Clear All */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs sm:text-sm font-bold">
                <span className="text-slate-900">
                  {selectedCount} Users Selected{' '}
                  <span className="text-slate-700 font-semibold text-xs">
                    ({passengerCount} Passengers, {driverCount} Driver{driverCount !== 1 ? 's' : ''})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-600 hover:text-rose-800 hover:underline cursor-pointer font-bold text-xs sm:text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
