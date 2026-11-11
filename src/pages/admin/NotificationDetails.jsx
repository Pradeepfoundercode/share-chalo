import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  Megaphone,
  Gift,
  Car,
  Info,
  Percent,
  ShieldCheck,
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  User,
  Users,
  Copy,
  CheckCircle2,
  Send,
  Check,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { notificationsList } from '../../data/notificationsData';

export default function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  // Match notification by ID (raw or numeric)
  const cleanId = id?.replace(/^#/, '');
  const notification =
    notificationsList.find(
      (n) =>
        n.id.toLowerCase() === cleanId?.toLowerCase() ||
        String(n.numericId) === cleanId
    ) || notificationsList[0];

  const handleCopyId = () => {
    navigator.clipboard?.writeText(notification.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Sent
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Scheduled
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-3.5 pb-10">
      {/* Breadcrumb Navigation */}
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
        <span className="text-slate-900 font-extrabold">Notification Details</span>
      </div>

      {/* Page Title with Back Arrow Button */}
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
            Notification Details
          </h1>
          <p className="text-xs text-slate-600 font-medium leading-none mt-0.5">
            View complete details, content, recipients and delivery status of this notification.
          </p>
        </div>
      </div>

      {/* Main 2-Column Split: Left 7 cols | Right 5 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* =========================================================
            LEFT COLUMN (col-span-7): Header Card, Content, Recipient Details, Delivery Summary
            ========================================================= */}
        <div className="lg:col-span-7 space-y-3">
          {/* 1. Top Banner Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
              {renderNotificationIcon(notification.iconType)}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                {notification.title}
              </h2>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mt-1">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{notification.sentOn}</span>
                </span>
                <span className="text-slate-300">|</span>
                {renderStatusBadge(notification.status)}
              </div>
            </div>
          </div>

          {/* 2. Notification Content Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">📝</span>
              <h3 className="text-sm font-black text-slate-900">
                Notification Content
              </h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 sm:col-span-2 font-bold text-slate-500">
                  Title
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <span className="col-span-8 sm:col-span-9 font-extrabold text-slate-900">
                  {notification.title}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-3 sm:col-span-2 font-bold text-slate-500">
                  Message
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <span className="col-span-8 sm:col-span-9 font-medium text-slate-800 leading-relaxed">
                  {notification.fullMessage}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Recipient Details Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">👥</span>
              <h3 className="text-sm font-black text-slate-900">
                Recipient Details
              </h3>
            </div>

            <div className="space-y-2.5 text-xs sm:text-sm">
              {/* Recipient Type */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 sm:col-span-3 font-bold text-slate-500">
                  Recipient Type
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <div className="col-span-7 sm:col-span-8">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-amber-950 bg-amber-50 border border-amber-200">
                    <Users className="w-3.5 h-3.5 text-amber-800" />
                    {notification.recipientType}
                  </span>
                </div>
              </div>

              {/* Total Recipients */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 sm:col-span-3 font-bold text-slate-500">
                  Total Recipients
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <span className="col-span-7 sm:col-span-8 font-extrabold text-slate-900">
                  {notification.totalRecipients}
                </span>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 sm:col-span-3 font-bold text-slate-500">
                  Breakdown
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <div className="col-span-7 sm:col-span-8 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-800">
                  <span className="flex items-center gap-1.5 text-sky-800">
                    <User className="w-3.5 h-3.5 text-sky-600" />
                    Passengers: {notification.breakdown.passengers}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <Car className="w-3.5 h-3.5 text-emerald-600" />
                    Drivers: {notification.breakdown.drivers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Delivery Summary (4 colored small cards) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">📊</span>
              <h3 className="text-sm font-black text-slate-900">
                Delivery Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Sent */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.sent}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Sent</div>
                </div>
              </div>

              {/* Delivered */}
              <div className="p-3 rounded-xl bg-sky-50/50 border border-sky-200/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.delivered}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Delivered</div>
                </div>
              </div>

              {/* Pending */}
              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.pending}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Pending</div>
                </div>
              </div>

              {/* Failed */}
              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.failed}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600">Failed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (col-span-5): Notification Info, Audience Donut, Failed Recipients
            ========================================================= */}
        <div className="lg:col-span-5 space-y-3">
          {/* 1. Notification Information Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">ℹ️</span>
              <h3 className="text-sm font-black text-slate-900">
                Notification Information
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Notification ID */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Notification ID</span>
                <div className="flex items-center gap-1.5 font-mono font-black text-slate-900">
                  <span>#{notification.id}</span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-black cursor-pointer"
                    title="Copy ID"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Created By */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Created By</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {notification.createdBy}
                </span>
              </div>

              {/* Created On */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Created On</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {notification.createdOn}
                </span>
              </div>

              {/* Sent On */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Sent On</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Send className="w-3 h-3 text-slate-400" />
                  {notification.sentOn}
                </span>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Status</span>
                {renderStatusBadge(notification.status)}
              </div>
            </div>
          </div>

          {/* 2. Audience & Delivery Report (Donut Chart) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">👥</span>
              <h3 className="text-sm font-black text-slate-900">
                Audience & Delivery Report
              </h3>
            </div>

            <div className="flex items-center gap-4">
              {/* Donut Chart (SVG) */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Total circumference: 2 * PI * 38 ≈ 238.76 */}
                  {/* Delivered: 99.3% -> 237 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#16a34a"
                    strokeWidth="13"
                    strokeDasharray="237 239"
                    strokeDashoffset="0"
                  />
                  {/* Pending: 0.5% -> 1.2 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="13"
                    strokeDasharray="1.2 239"
                    strokeDashoffset="-237"
                  />
                  {/* Failed: 0.2% -> 0.8 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#dc2626"
                    strokeWidth="13"
                    strokeDasharray="0.8 239"
                    strokeDashoffset="-238.2"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-sm font-black text-slate-900 leading-none">
                    2,214
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 mt-0.5">
                    Recipients
                  </span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    <span className="font-bold text-slate-800">Delivered</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.delivered}{' '}
                    <span className="text-slate-400 font-semibold text-[11px]">
                      ({notification.deliverySummary.deliveredPercent})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">Pending</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.pending}{' '}
                    <span className="text-slate-400 font-semibold text-[11px]">
                      ({notification.deliverySummary.pendingPercent})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                    <span className="font-bold text-slate-800">Failed</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.failed}{' '}
                    <span className="text-slate-400 font-semibold text-[11px]">
                      ({notification.deliverySummary.failedPercent})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Failed Recipients (6) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-rose-600">
                <AlertCircle className="w-4 h-4" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900">
                  Failed Recipients ({notification.deliverySummary.failed})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => alert('Viewing all failed recipients...')}
                className="text-xs font-bold text-slate-600 hover:text-black hover:underline cursor-pointer"
              >
                View List
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-slate-500 font-bold border-b border-slate-100 text-[11px]">
                    <th className="pb-1.5 w-6">#</th>
                    <th className="pb-1.5">User</th>
                    <th className="pb-1.5">User Type</th>
                    <th className="pb-1.5 text-right">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {notification.failedRecipients.map((item) => (
                    <tr key={item.id} className="text-slate-800">
                      <td className="py-2 text-slate-500 font-bold">{item.id}</td>
                      <td className="py-2 font-black text-slate-900">{item.user}</td>
                      <td className="py-2">
                        {item.userType === 'Passenger' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-sky-800 bg-sky-50 border border-sky-200">
                            <User className="w-2.5 h-2.5" /> Passenger
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                            ✓ Driver
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-right text-rose-600 font-semibold text-[11px]">
                        {item.reason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

