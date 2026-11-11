import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  ChevronRight,
  User,
  Phone,
  Mail,
  Car,
  Calendar,
  Clock,
  Flag,
  CreditCard,
  Shield,
  FileText,
  Star,
  Headphones,
  Paperclip,
  Download,
  AlertCircle,
  CheckCircle2,
  Send,
  PenTool,
  Info
} from 'lucide-react';
import { complaintsList } from '../../data/supportData';

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find complaint by raw ID or without prefix
  const cleanId = id?.replace(/^#/, '');
  const complaint =
    complaintsList.find(
      (c) =>
        c.id.toLowerCase() === cleanId?.toLowerCase() ||
        c.ticketId.toLowerCase() === `#${cleanId}`.toLowerCase() ||
        String(c.numericId) === cleanId
    ) || complaintsList[0];

  // Action status and remarks state
  const [ticketStatus, setTicketStatus] = useState(complaint.ticketStatus || 'Open');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  // Status badge styling
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Resolved
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100">
            {status}
          </span>
        );
    }
  };

  const handleUpdateTicket = (e) => {
    e.preventDefault();
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          Complaint status updated successfully!
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link
          to="/"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <Link
          to="/support"
          className="text-slate-600 hover:text-slate-900 transition-colors font-medium"
        >
          Support & Complaints
        </Link>
        <ChevronRight className="w-3 h-3 text-slate-400" />
        <span className="text-slate-900 font-bold">Complaint Details</span>
      </div>

      {/* Page Title with Back Button */}
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate('/support')}
          type="button"
          className="w-9 h-9 mt-0.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
          title="Back to Complaints"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
            Complaint Details
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            View complaint information, related ride details, attachments and take action.
          </p>
        </div>
      </div>

      {/* Main 2-Column Layout (Left 8 cols, Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =========================================================
            LEFT COLUMN (8 cols): User Card, Complaint Info, Ride Details, Attachments
            ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. User Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center gap-4 shadow-2xs">
            <div className="w-14 h-14 rounded-full border-2 border-amber-300 p-0.5 shrink-0 overflow-hidden bg-amber-50">
              <img
                src={complaint.user.avatar}
                alt={complaint.user.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
                }}
              />
            </div>

            <div className="flex-1 min-w-[200px]">
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  {complaint.user.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-sky-800 bg-sky-50 border border-sky-200">
                  <User className="w-3 h-3 text-sky-600" />
                  {complaint.userType}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">
                    {complaint.user.phone}
                  </span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold text-slate-800">
                    {complaint.user.email}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Complaint Information Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <span className="text-base">📋</span>
              <h3 className="text-sm font-black tracking-tight text-slate-900">
                Complaint Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-3 sm:gap-x-4 text-xs sm:text-sm">
              {/* Ticket ID */}
              <div className="sm:col-span-3 font-semibold text-slate-500">Ticket ID</div>
              <div className="sm:col-span-9 font-extrabold text-slate-900 font-mono">
                {complaint.ticketId}
              </div>

              {/* Category */}
              <div className="sm:col-span-3 font-semibold text-slate-500">Category</div>
              <div className="sm:col-span-9 font-bold text-slate-800 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-600" />
                <span>{complaint.category}</span>
              </div>

              {/* Subject */}
              <div className="sm:col-span-3 font-semibold text-slate-500">Subject</div>
              <div className="sm:col-span-9 font-bold text-slate-900">
                {complaint.subject}
              </div>

              {/* Description */}
              <div className="sm:col-span-3 font-semibold text-slate-500">Description</div>
              <div className="sm:col-span-9 font-medium text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                {complaint.description}
              </div>
            </div>
          </div>

          {/* 3. Related Ride Details Card */}
          {complaint.relatedRide && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
                <Car className="w-4 h-4 text-slate-900" />
                <h3 className="text-sm font-black tracking-tight text-slate-900">
                  Related Ride Details
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Ride ID */}
                <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/60">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Ride ID</div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#fed011]/30 border border-amber-300 font-mono font-black text-xs text-slate-900">
                    {complaint.relatedRide.rideId}
                  </span>
                </div>

                {/* Ride Date & Time */}
                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">
                    Ride Date & Time
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                    <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                    <span>
                      {complaint.relatedRide.date}, {complaint.relatedRide.time}
                    </span>
                  </div>
                </div>

                {/* Route */}
                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Route</div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                    <span className="text-[11px] text-amber-600 font-black">📍</span>
                    <span>{complaint.relatedRide.route}</span>
                  </div>
                </div>

                {/* Fare */}
                <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Fare</div>
                  <div className="text-xs font-black text-slate-900">
                    {complaint.relatedRide.fare}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Attachments (2) Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <Paperclip className="w-4 h-4 text-slate-900" />
              <h3 className="text-sm font-black tracking-tight text-slate-900">
                Attachments ({complaint.attachments?.length || 0})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {complaint.attachments?.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail preview */}
                    <div className="w-16 h-12 rounded-lg border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={att.preview}
                        alt={att.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {att.name}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500">
                        ({att.size})
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${att.name}...`)}
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 flex items-center justify-center text-slate-700 hover:text-black transition-colors cursor-pointer shrink-0 ml-2"
                    title="Download attachment"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (4 cols): Ticket Status, Timeline, Admin Remarks
            ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* 1. Ticket Status Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🏷️</span>
                <h3 className="text-sm font-black text-slate-900">Ticket Status</h3>
              </div>
              {renderStatusBadge(ticketStatus)}
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Created On</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {complaint.createdOn}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Last Updated</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {complaint.lastUpdated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">User Type</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400" />
                  {complaint.userType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Priority</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-[11px]">
                  <Flag className="w-3 h-3 text-amber-700" />
                  {complaint.priority}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Conversation / Activity Timeline Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="text-base">💬</span>
              <h3 className="text-sm font-black text-slate-900">
                Conversation / Activity Timeline
              </h3>
            </div>

            <div className="relative pl-5 space-y-5 border-l-2 border-slate-100 ml-2">
              {complaint.timeline?.map((step) => {
                let dotBg = 'bg-slate-300';
                if (step.color === 'yellow') dotBg = 'bg-amber-400';
                if (step.color === 'blue') dotBg = 'bg-sky-500';
                if (step.color === 'green') dotBg = 'bg-emerald-500';

                return (
                  <div key={step.id} className="relative">
                    {/* Dot on timeline */}
                    <span
                      className={`absolute -left-[27px] top-1 w-3 h-3 rounded-full border-2 border-white shadow-xs ${dotBg}`}
                    ></span>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          {step.title}
                        </h4>
                        <p className="text-[11px] font-medium text-slate-500 mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>
                      <div className="text-right text-[10px] text-slate-400 whitespace-nowrap font-medium">
                        <div>{step.date}</div>
                        <div>{step.time}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Admin Remarks Card Notice */}
          <div className="bg-[#fffdf0] border border-amber-200/80 rounded-2xl p-3.5 shadow-2xs flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              !
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-900">Admin Remarks</h4>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium leading-relaxed">
                Add your response, update the status and resolve this complaint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FULL WIDTH BOTTOM CARD: Update Status & Add Resolution
          ========================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-4">
          <span className="text-base">✏️</span>
          <h3 className="text-sm font-black text-slate-900">
            Update Status & Add Resolution
          </h3>
        </div>

        <form onSubmit={handleUpdateTicket} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Update Status Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Update Status <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full h-11 pl-3 pr-8 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:border-amber-400 shadow-2xs cursor-pointer"
                >
                  <option value="Open">● Open</option>
                  <option value="In Progress">● In Progress</option>
                  <option value="Resolved">● Resolved</option>
                  <option value="Closed">● Closed</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Admin Remarks / Resolution Textarea */}
            <div className="lg:col-span-9">
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Admin Remarks / Resolution <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Enter your response or resolution here..."
                    className="w-full h-11 px-3.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                </div>

                {/* Yellow Update Ticket Button */}
                <button
                  type="submit"
                  className="h-11 px-5 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Update Ticket</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

