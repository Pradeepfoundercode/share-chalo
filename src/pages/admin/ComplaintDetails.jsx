import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
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
  Info,
  ClipboardList,
  Tag,
  MessageSquare,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { complaintsList } from '../../data/supportData';
import { DetailsHeader } from '../../components/common';

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold text-rose-600 bg-rose-50 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold text-blue-600 bg-blue-50 border border-blue-200">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            In Progress
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            Resolved
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold text-purple-700 bg-purple-50 border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-600"></span>
            Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-[13px] font-bold text-slate-700 bg-slate-100">
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

      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Complaint Details"
        breadcrumbs={[
          { label: 'Support & Complaints', path: '/support' },
          { label: 'Complaint Details' },
        ]}
      />

      {/* Main 2-Column Layout (Left 8 cols, Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* =========================================================
            LEFT COLUMN (8 cols): User Card, Complaint Info, Ride Details, Attachments
            ========================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. User Header Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center gap-4 shadow-2xs">
            <div className="w-14 h-14 sm:w-15 sm:h-15 rounded-full border-2 border-amber-300 p-0.5 shrink-0 overflow-hidden bg-amber-50">
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
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  {complaint.user.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs sm:text-[13px] font-bold text-sky-800 bg-sky-50 border border-sky-200">
                  <User className="w-3.5 h-3.5 text-sky-600" />
                  {complaint.userType}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sm:text-[15px] text-slate-600 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-800">
                    {complaint.user.phone}
                  </span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="font-bold text-slate-800">
                    {complaint.user.email}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 2. Complaint Information Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <ClipboardList className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="text-base sm:text-[17px] font-black tracking-tight text-slate-900">
                Complaint Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-y-2.5 sm:gap-x-4 text-sm sm:text-[15px]">
              {/* Ticket ID */}
              <div className="sm:col-span-3 font-bold text-slate-500 flex items-center">Ticket ID</div>
              <div className="sm:col-span-9 font-black text-slate-900 font-mono text-base">
                {complaint.ticketId}
              </div>

              {/* Category */}
              <div className="sm:col-span-3 font-bold text-slate-500 flex items-center">Category</div>
              <div className="sm:col-span-9 font-bold text-slate-800 flex items-center gap-2">
                <Car className="w-4.5 h-4.5 text-slate-600 shrink-0" />
                <span className="text-sm sm:text-base font-bold text-slate-900">{complaint.category}</span>
              </div>

              {/* Subject */}
              <div className="sm:col-span-3 font-bold text-slate-500 flex items-center">Subject</div>
              <div className="sm:col-span-9 font-black text-slate-900 text-sm sm:text-base">
                {complaint.subject}
              </div>

              {/* Description */}
              <div className="sm:col-span-3 font-bold text-slate-500">Description</div>
              <div className="sm:col-span-9 font-medium text-slate-700 leading-snug bg-slate-50/80 p-2.5 sm:p-3 rounded-xl border border-slate-100 text-sm sm:text-[14.5px]">
                {complaint.description}
              </div>
            </div>
          </div>

          {/* 3. Related Ride Details Card */}
          {complaint.relatedRide && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
                <Car className="w-5 h-5 text-amber-500 shrink-0" />
                <h3 className="text-base sm:text-[17px] font-black tracking-tight text-slate-900">
                  Related Ride Details
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {/* Ride ID */}
                <div className="bg-amber-50/40 p-2 sm:p-2.5 rounded-xl border border-amber-200/60">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-500 mb-1">Ride ID</div>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-[#fed011]/30 border border-amber-300 font-mono font-black text-sm text-slate-900">
                    {complaint.relatedRide.rideId}
                  </span>
                </div>

                {/* Ride Date & Time */}
                <div className="bg-slate-50/70 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-500 mb-1">
                    Ride Date & Time
                  </div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="truncate">
                      {complaint.relatedRide.date}, {complaint.relatedRide.time}
                    </span>
                  </div>
                </div>

                {/* Route */}
                <div className="bg-slate-50/70 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-500 mb-1">Route</div>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{complaint.relatedRide.route}</span>
                  </div>
                </div>

                {/* Fare */}
                <div className="bg-slate-50/70 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <div className="text-xs sm:text-[13px] font-bold text-slate-500 mb-1">Fare</div>
                  <div className="text-sm sm:text-base font-black text-slate-900">
                    {complaint.relatedRide.fare}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Attachments (2) Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <Paperclip className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="text-base sm:text-[17px] font-black tracking-tight text-slate-900">
                Attachments ({complaint.attachments?.length || 0})
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {complaint.attachments?.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors"
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
                      <div className="text-sm sm:text-[15px] font-black text-slate-900 truncate">
                        {att.name}
                      </div>
                      <div className="text-xs sm:text-[13px] font-bold text-slate-500">
                        ({att.size})
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${att.name}...`)}
                    className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 flex items-center justify-center text-slate-700 hover:text-black transition-colors cursor-pointer shrink-0 ml-2"
                    title="Download attachment"
                  >
                    <Download className="w-4 h-4 text-slate-700" />
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
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-500 shrink-0" />
                <h3 className="text-base sm:text-[17px] font-black text-slate-900">Ticket Status</h3>
              </div>
              {renderStatusBadge(ticketStatus)}
            </div>

            <div className="space-y-2 text-sm sm:text-[14.5px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Created On</span>
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {complaint.createdOn}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Last Updated</span>
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {complaint.lastUpdated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">User Type</span>
                <span className="font-black text-slate-900 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  {complaint.userType}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-bold">Priority</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-black text-xs sm:text-sm">
                  <Flag className="w-3.5 h-3.5 text-amber-700" />
                  {complaint.priority}
                </span>
              </div>
            </div>
          </div>

          {/* 2. Conversation / Activity Timeline Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <MessageSquare className="w-5 h-5 text-amber-500 shrink-0" />
              <h3 className="text-base sm:text-[17px] font-black text-slate-900">
                Activity Timeline
              </h3>
            </div>

            <div className="relative pl-5 space-y-3.5 border-l-2 border-slate-100 ml-2">
              {complaint.timeline?.map((step) => {
                let dotBg = 'bg-slate-300';
                if (step.color === 'yellow') dotBg = 'bg-amber-400';
                if (step.color === 'blue') dotBg = 'bg-sky-500';
                if (step.color === 'green') dotBg = 'bg-emerald-500';

                return (
                  <div key={step.id} className="relative">
                    {/* Dot on timeline */}
                    <span
                      className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${dotBg}`}
                    ></span>

                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">
                          {step.title}
                        </h4>
                        <p className="text-xs sm:text-[13px] font-semibold text-slate-500 mt-0.5 leading-snug">
                          {step.description}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400 whitespace-nowrap font-bold">
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
          <div className="bg-[#fffdf0] border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 shadow-2xs flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-sm font-black shrink-0 mt-0.5">
              !
            </div>
            <div>
              <h4 className="text-sm sm:text-[15px] font-black text-slate-900">Admin Remarks</h4>
              <p className="text-xs sm:text-[13px] text-slate-600 mt-0.5 font-medium leading-relaxed">
                Add your response, update the status and resolve this complaint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FULL WIDTH BOTTOM CARD: Update Status & Add Resolution
          ========================================================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 mb-3.5">
          <PenTool className="w-5 h-5 text-amber-500 shrink-0" />
          <h3 className="text-base sm:text-[17px] font-black text-slate-900">
            Update Status & Add Resolution
          </h3>
        </div>

        <form onSubmit={handleUpdateTicket} className="space-y-3.5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* Update Status Dropdown */}
            <div className="lg:col-span-3">
              <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">
                Update Status <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full h-11 pl-3.5 pr-8 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900 appearance-none focus:outline-none focus:border-amber-400 shadow-2xs cursor-pointer"
                >
                  <option value="Open">● Open</option>
                  <option value="In Progress">● In Progress</option>
                  <option value="Resolved">● Resolved</option>
                  <option value="Closed">● Closed</option>
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Admin Remarks / Resolution Textarea */}
            <div className="lg:col-span-9">
              <label className="block text-xs sm:text-sm font-black text-slate-800 mb-1">
                Admin Remarks / Resolution <span className="text-rose-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={adminRemarks}
                    onChange={(e) => setAdminRemarks(e.target.value)}
                    placeholder="Enter your response or resolution here..."
                    className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                </div>

                {/* Yellow Update Ticket Button */}
                <button
                  type="submit"
                  className="h-11 px-6 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors shrink-0"
                >
                  <Send className="w-4.5 h-4.5" />
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

