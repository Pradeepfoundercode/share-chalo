import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { notificationsList } from '../../data/notificationsData';
import { DetailsHeader } from '../../components/common';
import { getNotificationByIdApi } from '../../services/notification.services';
import { RefreshCw, AlertCircle } from 'lucide-react';

// Asset Icons from src/assets/
import megaphoneIcon from '../../assets/icons/megaphone-icon-transparent.svg';
import calendarBlueIcon from '../../assets/icons/calendar-blue.svg';
import chatMessageIcon from '../../assets/dashboard/chat-message-icon-transparent.svg';
import group1Icon from '../../assets/Group (1).svg';
import driverCarIcon from '../../assets/icons/car-green.svg';
import deliverySummaryIcon from '../../assets/dashboard/ride-analytics.svg';
import sendPlaneIcon from '../../assets/drivers/send-plane-icon.svg';
import deliveredCheckIcon from '../../assets/drivers/active-status-check.svg';
import pendingClockIcon from '../../assets/dashboard/clock-icon.svg';
import failedCloseIcon from '../../assets/icons/close-circle-icon.svg';
import infoIcon from '../../assets/dashboard/info-icon-transparent.svg';
import alertCircleIcon from '../../assets/icons/alert-circle-icon.svg';
import failedRecipientsIcon from '../../assets/dashboard/b526c866-7ce7-4c15-848e-ed8378b03085 4.svg';
import driverRoleIcon from '../../assets/dashboard/50faa1d6-f73a-4c77-b528-d5ff6b3e8fa5 1.svg';
import assignedDriverIcon from '../../assets/drivers/assigned-driver.svg';

export default function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);

  // Match notification by ID (raw or numeric)
  const cleanId = id?.replace(/^#/, '');

  // Fetch notification details from API: GET /admins/notifications/{{notifId}}
  const { data: notifResponse, isLoading } = useQuery({
    queryKey: ['admin-notification-detail', cleanId],
    queryFn: () => getNotificationByIdApi(cleanId),
    enabled: Boolean(cleanId),
    retry: 1,
  });

  const apiData = notifResponse?.data || notifResponse?.notification || notifResponse;

  // Helper to format ISO date
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      return (
        d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ', ' +
        d.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    } catch {
      return String(dateStr);
    }
  };

  const notification = useMemo(() => {
    if (apiData && (apiData.id !== undefined || apiData.title)) {
      const rawStatus = apiData.status || 'sent';
      const normalizedStatus =
        rawStatus.toLowerCase() === 'sent'
          ? 'Sent'
          : rawStatus.toLowerCase() === 'scheduled'
          ? 'Scheduled'
          : rawStatus.toLowerCase() === 'failed'
          ? 'Failed'
          : rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);

      const createdOnFormatted = formatDateTime(apiData.createdAt);
      const sentOnFormatted = apiData.scheduledAt
        ? formatDateTime(apiData.scheduledAt)
        : createdOnFormatted;

      const recipientCount = apiData.recipientCount ?? 0;
      const deliverySummary = apiData.deliverySummary || {};
      const breakdown = apiData.breakdown || {};
      const failedRecipients = Array.isArray(apiData.failedRecipients)
        ? apiData.failedRecipients
        : [];

      return {
        id: String(apiData.id),
        title: apiData.title || 'Untitled Notification',
        fullMessage: apiData.message || '-',
        recipientType: apiData.targetLabel || apiData.target || 'All Users & Drivers',
        totalRecipients: recipientCount,
        status: normalizedStatus,
        createdOn: createdOnFormatted,
        sentOn: sentOnFormatted,
        createdBy: apiData.createdBy || 'Admin',
        iconType: apiData.iconType || 'megaphone',
        breakdown: {
          passengers: breakdown.passengers ?? 0,
          drivers: breakdown.drivers ?? 0,
        },
        deliverySummary: {
          sent: deliverySummary.sent ?? (rawStatus.toLowerCase() === 'sent' ? recipientCount : 0),
          delivered: deliverySummary.delivered ?? 0,
          pending: deliverySummary.pending ?? 0,
          failed: deliverySummary.failed ?? 0,
          deliveredPercent: deliverySummary.deliveredPercent ?? '0%',
          pendingPercent: deliverySummary.pendingPercent ?? '0%',
          failedPercent: deliverySummary.failedPercent ?? '0%',
        },
        failedRecipients,
      };
    }

    const localMatch = notificationsList.find(
      (n) =>
        n.id.toLowerCase() === cleanId?.toLowerCase() ||
        String(n.numericId) === cleanId
    );
    if (localMatch) return localMatch;

    return {
      id: cleanId || '-',
      title: '-',
      fullMessage: '-',
      recipientType: 'All Users & Drivers',
      totalRecipients: 0,
      status: 'Sent',
      createdOn: '-',
      sentOn: '-',
      createdBy: 'Admin',
      iconType: 'megaphone',
      breakdown: {
        passengers: 0,
        drivers: 0,
      },
      deliverySummary: {
        sent: 0,
        delivered: 0,
        pending: 0,
        failed: 0,
        deliveredPercent: '0%',
        pendingPercent: '0%',
        failedPercent: '0%',
      },
      failedRecipients: [],
    };
  }, [apiData, cleanId]);

  const handleCopyId = () => {
    if (notification?.id) {
      navigator.clipboard?.writeText(notification.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderNotificationIcon = (iconType) => {
    switch (iconType) {
      case 'megaphone':
        return <img src={megaphoneIcon} alt="Offer" className="w-9 h-9 object-contain" />;
      case 'car':
        return <img src={driverCarIcon} alt="Car" className="w-9 h-9 object-contain" />;
      case 'info':
        return <img src={infoIcon} alt="Info" className="w-9 h-9 object-contain" />;
      case 'alert':
        return <img src={alertCircleIcon} alt="Alert" className="w-9 h-9 object-contain" />;
      default:
        return <img src={megaphoneIcon} alt="Notification" className="w-9 h-9 object-contain" />;
    }
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Sent
          </span>
        );
      case 'Scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            Scheduled
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold text-rose-700 bg-rose-50 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold text-slate-700 bg-slate-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 pb-8">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR (Driver Details Style)
          ========================================================= */}
      <DetailsHeader
        title="Notification Details"
        breadcrumbs={[
          { label: 'Notifications', path: '/notifications' },
          { label: 'Notification Details' },
        ]}
      />

      {/* Main 2-Column Split: Left 7 cols | Right 5 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* =========================================================
            LEFT COLUMN (col-span-7): Header Card, Content, Recipient Details, Delivery Summary
            ========================================================= */}
        <div className="lg:col-span-7 space-y-3.5">
          {/* 1. Top Banner Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 flex items-center gap-4 shadow-2xs">
            <div className="w-15 h-15 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center shrink-0">
              {renderNotificationIcon(notification.iconType)}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {notification.title}
              </h2>
              <div className="flex items-center gap-3 text-sm sm:text-[15px] font-bold text-slate-600 mt-1">
                <span className="flex items-center gap-1.5">
                  <img src={calendarBlueIcon} alt="Date" className="w-5 h-5 object-contain" />
                  <span>{notification.sentOn}</span>
                </span>
                <span className="text-slate-300">|</span>
                {renderStatusBadge(notification.status)}
              </div>
            </div>
          </div>

          {/* 2. Notification Content Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                <img src={chatMessageIcon} alt="Content" className="w-5.5 h-5.5 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Notification Content
              </h3>
            </div>

            <div className="space-y-2.5 text-sm sm:text-[15px]">
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-3 sm:col-span-2 font-bold text-slate-500 text-sm sm:text-[15px]">
                  Title
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <span className="col-span-8 sm:col-span-9 font-black text-slate-900 text-sm sm:text-[16px]">
                  {notification.title}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 items-start">
                <span className="col-span-3 sm:col-span-2 font-bold text-slate-500 pt-0.5 text-sm sm:text-[15px]">
                  Message
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold pt-0.5">:</span>
                <span className="col-span-8 sm:col-span-9 font-medium text-slate-800 leading-relaxed whitespace-pre-line text-sm sm:text-[14.5px] py-0.5">
                  {notification.fullMessage}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Recipient Details Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                <img src={group1Icon} alt="Recipients" className="w-5.5 h-5.5 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Recipient Details
              </h3>
            </div>

            <div className="space-y-2.5 text-sm sm:text-[15px]">
              {/* Recipient Type */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 sm:col-span-3 font-bold text-slate-500">
                  Recipient Type
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <div className="col-span-7 sm:col-span-8">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs sm:text-sm font-bold text-amber-950 bg-amber-50 border border-amber-200">
                    <img src={group1Icon} alt="All Users" className="w-5 h-5 object-contain" />
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
                <span className="col-span-7 sm:col-span-8 font-black text-slate-900 text-sm sm:text-[16px]">
                  {notification.totalRecipients}
                </span>
              </div>

              {/* Breakdown */}
              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 sm:col-span-3 font-bold text-slate-500">
                  Breakdown
                </span>
                <span className="col-span-1 text-slate-400 text-center font-bold">:</span>
                <div className="col-span-7 sm:col-span-8 flex flex-wrap items-center gap-3.5 text-xs sm:text-[14px] font-bold text-slate-800 py-0.5">
                  <span className="flex items-center gap-1.5 text-sky-800">
                    <img src={assignedDriverIcon} alt="Passenger" className="w-5 h-5 object-contain" />
                    Passengers: {notification.breakdown.passengers}
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="flex items-center gap-1.5 text-emerald-800">
                    <img src={driverRoleIcon} alt="Driver" className="w-5.5 h-5.5 object-contain" />
                    Drivers: {notification.breakdown.drivers}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Delivery Summary (4 colored small cards) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                <img src={deliverySummaryIcon} alt="Delivery Summary" className="w-5.5 h-5.5 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Delivery Summary
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* Sent */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <img src={sendPlaneIcon} alt="Sent" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.sent}
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-slate-600 mt-0.5">Sent</div>
                </div>
              </div>

              {/* Delivered */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-sky-50/50 border border-sky-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
                  <img src={deliveredCheckIcon} alt="Delivered" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.delivered}
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-slate-600 mt-0.5">Delivered</div>
                </div>
              </div>

              {/* Pending */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <img src={pendingClockIcon} alt="Pending" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.pending}
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-slate-600 mt-0.5">Pending</div>
                </div>
              </div>

              {/* Failed */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-rose-50/50 border border-rose-200/60 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                  <img src={failedCloseIcon} alt="Failed" className="w-6 h-6 object-contain" />
                </div>
                <div>
                  <div className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {notification.deliverySummary.failed}
                  </div>
                  <div className="text-xs sm:text-[13px] font-bold text-slate-600 mt-0.5">Failed</div>
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
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs space-y-1">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8.5 h-8.5 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                <img src={infoIcon} alt="Info" className="w-5 h-5 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Notification Information
              </h3>
            </div>

            <div className="divide-y divide-slate-100 text-sm sm:text-[14.5px]">
              {/* Notification ID */}
              <div className="flex items-center py-1.5">
                <span className="w-36 sm:w-40 shrink-0 font-bold text-slate-900">
                  Notification ID
                </span>
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="font-bold text-slate-900 font-mono text-sm sm:text-[15px]">
                    #{notification.id}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-1 hover:bg-slate-100 rounded text-slate-700 hover:text-black cursor-pointer transition-colors"
                    title="Copy ID"
                  >
                    {copied ? (
                      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    ) : (
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Created By */}
              <div className="flex items-center py-1.5">
                <span className="w-36 sm:w-40 shrink-0 font-bold text-slate-900">
                  Created By
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-[15px]">
                  <img src={assignedDriverIcon} alt="Admin" className="w-4.5 h-4.5 object-contain" />
                  <span>{notification.createdBy}</span>
                </div>
              </div>

              {/* Created On */}
              <div className="flex items-center py-1.5">
                <span className="w-36 sm:w-40 shrink-0 font-bold text-slate-900">
                  Created On
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-[15px]">
                  <img src={calendarBlueIcon} alt="Calendar" className="w-4.5 h-4.5 object-contain" />
                  <span>{notification.createdOn}</span>
                </div>
              </div>

              {/* Sent On */}
              <div className="flex items-center py-1.5">
                <span className="w-36 sm:w-40 shrink-0 font-bold text-slate-900">
                  Sent On
                </span>
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm sm:text-[15px]">
                  <img src={sendPlaneIcon} alt="Send" className="w-4.5 h-4.5 object-contain" />
                  <span>{notification.sentOn}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center py-1.5">
                <span className="w-36 sm:w-40 shrink-0 font-bold text-slate-900">
                  Status
                </span>
                <div className="flex items-center">
                  {renderStatusBadge(notification.status)}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Audience & Delivery Report (Donut Chart) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
                <img src={group1Icon} alt="Audience" className="w-5.5 h-5.5 object-contain" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900">
                Audience & Delivery Report
              </h3>
            </div>

            <div className="flex items-center gap-4">
              {/* Donut Chart (SVG) */}
              <div className="relative w-28 h-28 sm:w-30 sm:h-30 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background track circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#e2e8f0"
                    strokeWidth="13"
                  />
                  {/* Delivered segment if any */}
                  {notification.deliverySummary.delivered > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#16a34a"
                      strokeWidth="13"
                      strokeDasharray={`${(notification.deliverySummary.delivered / (notification.totalRecipients || 1)) * 238.76} 239`}
                      strokeDashoffset="0"
                    />
                  )}
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-base sm:text-lg font-black text-slate-900 leading-none">
                    {notification.totalRecipients}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 mt-0.5">
                    Recipients
                  </span>
                </div>
              </div>

              {/* Legends list */}
              <div className="flex-1 space-y-1.5 text-sm sm:text-[14.5px]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600"></span>
                    <span className="font-bold text-slate-800">Delivered</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.delivered}{' '}
                    <span className="text-slate-400 font-semibold text-xs sm:text-[13px]">
                      ({notification.deliverySummary.deliveredPercent})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                    <span className="font-bold text-slate-800">Pending</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.pending}{' '}
                    <span className="text-slate-400 font-semibold text-xs sm:text-[13px]">
                      ({notification.deliverySummary.pendingPercent})
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600"></span>
                    <span className="font-bold text-slate-800">Failed</span>
                  </div>
                  <span className="font-black text-slate-900">
                    {notification.deliverySummary.failed}{' '}
                    <span className="text-slate-400 font-semibold text-xs sm:text-[13px]">
                      ({notification.deliverySummary.failedPercent})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Failed Recipients */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-4.5 shadow-2xs space-y-2">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-rose-600">
                <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                  <img src={failedRecipientsIcon} alt="Failed Recipients" className="w-5.5 h-5.5 object-contain" />
                </div>
                <h3 className="text-[15px] sm:text-base font-black text-slate-900">
                  Failed Recipients ({notification.deliverySummary.failed})
                </h3>
              </div>
              {notification.failedRecipients.length > 0 && (
                <button
                  type="button"
                  onClick={() => alert('Viewing all failed recipients...')}
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-black hover:underline cursor-pointer"
                >
                  View List
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="text-slate-500 font-bold border-b border-slate-100 text-xs sm:text-[13px]">
                    <th className="pb-1 w-6">#</th>
                    <th className="pb-1">User</th>
                    <th className="pb-1">User Type</th>
                    <th className="pb-1 text-right">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {notification.failedRecipients.length > 0 ? (
                    notification.failedRecipients.map((item) => (
                      <tr key={item.id} className="text-slate-800">
                        <td className="py-1.5 text-slate-500 font-bold">{item.id}</td>
                        <td className="py-1.5 font-black text-slate-900 text-sm sm:text-[14px]">{item.user}</td>
                        <td className="py-1.5">
                          {item.userType === 'Passenger' ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200">
                              <img src={assignedDriverIcon} alt="Passenger" className="w-4 h-4 object-contain" /> Passenger
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200">
                              <img src={driverRoleIcon} alt="Driver" className="w-4.5 h-4.5 object-contain" /> Driver
                            </span>
                          )}
                        </td>
                        <td className="py-1.5 text-right text-rose-600 font-semibold text-xs sm:text-[13px]">
                          {item.reason}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-4 text-center text-slate-400 font-bold text-xs sm:text-sm">
                        No failed recipients
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
