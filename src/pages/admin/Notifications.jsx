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
  Sparkles
} from 'lucide-react';
import { notificationsSummary, notificationsList } from '../../data/notificationsData';
import Pagination from '../../components/common/Pagination';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

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

  // Helper for status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Sent
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Scheduled
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 bg-slate-100">
            {status}
          </span>
        );
    }
  };

  // Helper for recipient pill
  const renderRecipientBadge = (recipient) => {
    if (recipient === 'Passengers') {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-sky-800 bg-sky-50 border border-sky-200">
          <Users className="w-4 h-4 text-sky-600" />
          Passengers
        </span>
      );
    }
    if (recipient === 'Drivers') {
      return (
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
          <span className="w-4 h-4 rounded-full border border-emerald-600 flex items-center justify-center text-[10px] font-black">
            ✓
          </span>
          Drivers
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200">
        <Users className="w-4 h-4 text-amber-700" />
        All Users
      </span>
    );
  };

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notificationsList.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRecipient =
        selectedRecipient === 'All' ||
        (selectedRecipient === 'All Users' && item.recipient === 'All Users') ||
        item.recipient.toLowerCase() === selectedRecipient.toLowerCase();

      const matchesStatus =
        selectedStatus === 'All' ||
        item.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesRecipient && matchesStatus;
    });
  }, [searchQuery, selectedRecipient, selectedStatus]);

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
          2. FOUR SUMMARY METRIC CARDS
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Total Notifications */}
        <div className="bg-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-amber-100/70 border border-amber-200/50 flex items-center justify-center shrink-0">
            <img src={totalNotificationsIcon} alt="Total Notifications" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {notificationsSummary.totalNotifications}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">
              Total Notifications
            </div>
          </div>
        </div>

        {/* Sent */}
        <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/70 border border-emerald-200/50 flex items-center justify-center shrink-0">
            <img src={sentNotificationsIcon} alt="Sent" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {notificationsSummary.sent}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Sent</div>
          </div>
        </div>

        {/* Scheduled */}
        <div className="bg-sky-50/40 border border-sky-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-sky-100/70 border border-sky-200/50 flex items-center justify-center shrink-0">
            <img src={scheduledNotificationsIcon} alt="Scheduled" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {notificationsSummary.scheduled}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Scheduled</div>
          </div>
        </div>

        {/* Failed */}
        <div className="bg-rose-50/40 border border-rose-200/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-100/70 border border-rose-200/50 flex items-center justify-center shrink-0">
            <img src={failedNotificationsIcon} alt="Failed" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {notificationsSummary.failed}
            </div>
            <div className="text-xs sm:text-sm font-bold text-slate-800">Failed</div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. MAIN TABLE CONTAINER: FILTERS + DATA TABLE + PAGINATION
          ========================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Filter Controls Row */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or message..."
                className="w-full h-11 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-300/20 shadow-2xs transition-all"
              />
            </div>

            {/* All Users Dropdown */}
            <div className="lg:col-span-2.5 relative">
              <div className="relative">
                <Users className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={selectedRecipient}
                  onChange={(e) => setSelectedRecipient(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
                >
                  <option value="All">All Users</option>
                  <option value="Passengers">Passengers</option>
                  <option value="Drivers">Drivers</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* All Status Dropdown */}
            <div className="lg:col-span-2.5 relative">
              <div className="relative">
                <div className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
                  <span className="w-3 h-3 border-2 border-slate-700 rounded-xs rotate-45"></span>
                </div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
                >
                  <option value="All">All Status</option>
                  <option value="Sent">Sent</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Failed">Failed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Select Date Range */}
            <div className="lg:col-span-2 relative">
              <div className="relative">
                <Calendar className="w-5 h-5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Select Date Range"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full h-11 pl-10 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-800 placeholder:text-slate-600 focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600 text-[10px]">
                  ▼
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-[#feea98]/50 border-b border-amber-200/70 text-slate-900 text-xs sm:text-sm font-black uppercase tracking-wider">
                <th className="py-3.5 px-3.5 text-center w-12">#</th>
                <th className="py-3.5 px-3.5">Title</th>
                <th className="py-3.5 px-3.5">Message (Preview)</th>
                <th className="py-3.5 px-3.5">Recipient</th>
                <th className="py-3.5 px-3.5">Sent / Scheduled On</th>
                <th className="py-3.5 px-3.5 text-center">Status</th>
                <th className="py-3.5 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-800">
              {filteredNotifications.map((item, index) => (
                <tr
                  key={item.id}
                  onClick={() => navigate(`/notifications/${item.id || item.numericId}`)}
                  className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                >
                  {/* # */}
                  <td className="py-4 px-3.5 text-center font-extrabold text-slate-700 text-sm">
                    {index + 1}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-3.5">
                    <div className="flex items-center gap-2.5 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center shrink-0">
                        {renderNotificationIcon(item.iconType)}
                      </div>
                      <span className="font-extrabold text-sm sm:text-base text-slate-900">
                        {item.title}
                      </span>
                    </div>
                  </td>

                  {/* Message (Preview) */}
                  <td className="py-4 px-3.5">
                    <span
                      className="font-medium text-xs sm:text-sm text-slate-700 truncate max-w-[320px] block"
                      title={item.fullMessage}
                    >
                      {item.message}
                    </span>
                  </td>

                  {/* Recipient */}
                  <td className="py-4 px-3.5 whitespace-nowrap">
                    {renderRecipientBadge(item.recipient)}
                  </td>

                  {/* Sent / Scheduled On */}
                  <td className="py-4 px-3.5 whitespace-nowrap font-bold text-slate-900 text-xs sm:text-sm">
                    {item.sentOn}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-3.5 text-center whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>

                  {/* Action */}
                  <td className="py-4 px-3.5 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => navigate(`/notifications/${item.id || item.numericId}`)}
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 text-slate-800 hover:text-amber-900 text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-2xs"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}

              {filteredNotifications.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-500 font-bold">
                    No notifications match your selected filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Standardized Pagination */}
        <Pagination
          currentPage={currentPage}
          totalItems={2460}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
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

