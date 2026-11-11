import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Send,
  Save,
  Users,
  User,
  Car,
  Plus,
  X,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function CreateNotification() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('Diwali Special Offer');
  const [message, setMessage] = useState(
    'Get 20% off on your next 3 rides.\nUse code: DIWALI20 and enjoy a safer, more affordable ride with Share Chalo. 🎉'
  );

  // Recipient Target
  const [recipientOption, setRecipientOption] = useState('Selected Users');

  // Schedule option: 'now' or 'schedule'
  const [scheduleOption, setScheduleOption] = useState('now');
  const [scheduleDate, setScheduleDate] = useState('2026-11-03');
  const [scheduleTime, setScheduleTime] = useState('12:00');

  // Media preview state
  const [mediaUploaded, setMediaUploaded] = useState(true);

  // User picker state
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All Users');
  const [selectedUserIds, setSelectedUserIds] = useState([1, 2, 3]);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

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
    triggerToast(
      scheduleOption === 'now'
        ? 'Notification broadcasted successfully!'
        : 'Notification scheduled successfully!'
    );
    setTimeout(() => navigate('/notifications'), 1200);
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

      {/* Breadcrumb Navigation - Compact */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link
          to="/notifications"
          className="text-slate-600 hover:text-slate-900 transition-colors font-semibold"
        >
          Notifications
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-extrabold">Create Notification</span>
      </div>

      {/* Page Title with Back Arrow */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => navigate('/notifications')}
          type="button"
          className="w-8.5 h-8.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs shrink-0"
          title="Back to Notifications"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-tight">
            Create Notification
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-none mt-0.5">
            Compose a new notification and send it to all users, a specific group, or selected users.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout - Reduced Gap (gap-3.5) */}
      <form onSubmit={handleSend}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
          {/* =========================================================
              LEFT COLUMN (col-span-7): Title, Message, Media, Schedule
              ========================================================= */}
          <div className="lg:col-span-7 space-y-3">
            {/* 1. Notification Title Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
                  <span className="text-base">📋</span>
                  <span>Notification Title</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <span className="text-xs font-bold text-slate-400">
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
                className="w-full h-10 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
              />
            </div>

            {/* 2. Message Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
                  <span className="text-base">💬</span>
                  <span>Message</span>
                  <span className="text-rose-500 font-black">*</span>
                </label>
                <span className="text-xs font-bold text-slate-400">
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
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* 3. Add Media (Optional) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
                <span className="text-base">🖼️</span>
                <span>Add Media (Optional)</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Uploaded Banner Graphic Preview */}
                {mediaUploaded ? (
                  <div className="relative rounded-xl border border-amber-300 bg-amber-50/60 p-2 flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-3">
                      {/* Festive banner visual */}
                      <div className="w-32 h-16 rounded-lg bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 border border-amber-300 flex flex-col items-center justify-center p-1.5 text-center overflow-hidden">
                        <span className="text-[11px] font-black text-amber-950 uppercase tracking-tight leading-tight">
                          Diwali Special Offer
                        </span>
                        <span className="text-xs font-black text-rose-600 bg-white px-2 py-0.5 rounded-full mt-0.5 shadow-2xs leading-none">
                          20% OFF
                        </span>
                        <span className="text-[9px] font-bold text-slate-700 mt-0.5 leading-none">
                          Use Code: DIWALI20
                        </span>
                      </div>
                    </div>

                    {/* Delete Cross Badge */}
                    <button
                      type="button"
                      onClick={() => setMediaUploaded(false)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-black flex items-center justify-center cursor-pointer shadow-xs"
                      title="Remove media"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : null}

                {/* Upload Image Box */}
                <label className="rounded-xl border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/30 p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors min-h-[76px]">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mb-0.5">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    Upload Image
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    (JPG, PNG - Max 2 MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={() => setMediaUploaded(true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 4. Schedule & Send Card */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
                <span className="text-base">📅</span>
                <span>Schedule & Send</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Send Now Option */}
                <div
                  onClick={() => setScheduleOption('now')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scheduleOption === 'now'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="scheduleRadio"
                    checked={scheduleOption === 'now'}
                    onChange={() => setScheduleOption('now')}
                    className="mt-0.5 accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      Send Now
                    </span>
                    <span className="text-[11px] text-slate-600 font-semibold">
                      Send the notification immediately
                    </span>
                  </div>
                </div>

                {/* Schedule for Later Option */}
                <div
                  onClick={() => setScheduleOption('schedule')}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-2.5 ${
                    scheduleOption === 'schedule'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="scheduleRadio"
                    checked={scheduleOption === 'schedule'}
                    onChange={() => setScheduleOption('schedule')}
                    className="mt-0.5 accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      Schedule for Later
                    </span>
                    <span className="text-[11px] text-slate-600 font-semibold">
                      Choose date and time to send
                    </span>
                  </div>
                </div>
              </div>

              {/* Date & Time Picker if Schedule is selected */}
              {scheduleOption === 'schedule' && (
                <div className="grid grid-cols-2 gap-2.5 pt-1 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Time
                    </label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Form Actions: Send Notification + Save as Draft */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="submit"
                className="h-10 px-6 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Notification</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="h-10 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors"
              >
                <Save className="w-4 h-4" />
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
              <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900 pb-0.5">
                <span className="text-base">👥</span>
                <span>Select Recipients</span>
                <span className="text-rose-500 font-black">*</span>
              </label>

              <div className="space-y-1.5">
                {/* Option 1: All Users */}
                <div
                  onClick={() => setRecipientOption('All Users')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Users'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="recipientGroup"
                    checked={recipientOption === 'All Users'}
                    onChange={() => setRecipientOption('All Users')}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      All Users
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold leading-none">
                      Send to all passengers and drivers
                    </span>
                  </div>
                </div>

                {/* Option 2: All Passengers */}
                <div
                  onClick={() => setRecipientOption('All Passengers')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Passengers'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="recipientGroup"
                    checked={recipientOption === 'All Passengers'}
                    onChange={() => setRecipientOption('All Passengers')}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-700 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      All Passengers
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold leading-none">
                      Send only to registered passengers
                    </span>
                  </div>
                </div>

                {/* Option 3: All Drivers */}
                <div
                  onClick={() => setRecipientOption('All Drivers')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2.5 ${
                    recipientOption === 'All Drivers'
                      ? 'border-[#fed011] bg-[#fffdf0]'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="recipientGroup"
                    checked={recipientOption === 'All Drivers'}
                    onChange={() => setRecipientOption('All Drivers')}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      All Drivers
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold leading-none">
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
                  <input
                    type="radio"
                    name="recipientGroup"
                    checked={recipientOption === 'Selected Users'}
                    onChange={() => setRecipientOption('Selected Users')}
                    className="accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <div className="w-7 h-7 rounded-lg bg-amber-100/80 flex items-center justify-center text-slate-950 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                      Selected Users
                    </span>
                    <span className="text-[11px] text-slate-600 font-semibold leading-none">
                      Choose specific passengers or drivers
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Select Users Card (When Selected Users is active) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-black text-slate-900">
                <span className="text-base">📋</span>
                <span>Select Users</span>
                <span className="text-rose-500 font-black">*</span>
              </label>

              {/* Search + All Users Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-8 relative">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by name, mobile number or user ID..."
                    className="w-full h-9 pl-9 pr-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="sm:col-span-4 relative">
                  <select
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                    className="w-full h-9 pl-2.5 pr-6 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-800 appearance-none focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="All Users">All Users</option>
                    <option value="Passenger">Passengers</option>
                    <option value="Driver">Drivers</option>
                  </select>
                  <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-xs font-bold">
                    ▼
                  </div>
                </div>
              </div>

              {/* Users Checkbox List - Compact & Bigger Text */}
              <div className="divide-y divide-slate-100 border border-slate-150 rounded-xl overflow-hidden bg-slate-50/20">
                {usersList.map((user) => {
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
                          className={`w-4.5 h-4.5 rounded-sm flex items-center justify-center shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-[#fed011] text-black font-black'
                              : 'border-2 border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <span className="text-[11px] font-black">✓</span>}
                        </div>

                        {/* Avatar */}
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7.5 h-7.5 rounded-full object-cover border border-amber-300 shrink-0"
                        />

                        {/* Name */}
                        <span className="text-xs sm:text-[13px] font-black text-slate-900 truncate">
                          {user.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* User Type Badge */}
                        {user.type === 'Passenger' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-black text-sky-800 bg-sky-50 border border-sky-200">
                            <User className="w-3 h-3 text-sky-600" />
                            Passenger
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-black text-emerald-800 bg-emerald-50 border border-emerald-200">
                            <span className="w-3 h-3 rounded-full border border-emerald-600 flex items-center justify-center text-[8px] font-black">
                              ✓
                            </span>
                            Driver
                          </span>
                        )}

                        {/* Phone */}
                        <span className="text-xs font-extrabold text-slate-800 whitespace-nowrap">
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Summary Pill: 3 Users Selected (2 Passengers, 1 Driver) | Clear All */}
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs font-black">
                <span className="text-slate-900">
                  {selectedCount} Users Selected{' '}
                  <span className="text-slate-700 font-bold text-[11px]">
                    ({passengerCount} Passengers, {driverCount} Driver{driverCount !== 1 ? 's' : ''})
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-rose-600 hover:text-rose-800 hover:underline cursor-pointer font-black text-xs"
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
