import React, { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  XCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { DetailsHeader } from '../common';
import defaultAvatar from '../../assets/Smiling Man in Yellow Circular Frame.png';
import amitPhoto from '../../assets/amit_kumar_photo.png';
import personalInfoIcon from '../../assets/drivers/Group-9-f29c03.svg';

export default function PendingVerificationView({ driver }) {
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  // Stepper active step (1: Personal Details, 2: KYC & Documents, 3: Vehicle Details, 4: Seat Layout, 5: Review & Approve)
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    { num: 1, name: 'Personal Details', status: 'In Review' },
    { num: 2, name: 'KYC & Documents', status: 'Pending' },
    { num: 3, name: 'Vehicle Details', status: 'Pending' },
    { num: 4, name: 'Seat Layout', status: 'Pending' },
    { num: 5, name: 'Review & Approve', status: 'Pending' },
  ];

  const handleReject = () => {
    alert(`Driver ${driver.name} (${driver.id}) application has been rejected.`);
  };

  const handleApprove = () => {
    alert(`Step 1 (Personal Details) for ${driver.name} (${driver.id}) approved!`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-10 sm:pb-12 select-none">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Driver Verification"
        breadcrumbs={[
          { label: 'Drivers', path: '/drivers' },
          { label: 'Verify Driver' },
        ]}
      />

      {/* =========================================================
          HORIZONTAL STEPPER TABS (1 to 5) - Full Width Coverage
          ========================================================= */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-3 border-b border-slate-200 pb-3 mb-4 sm:mb-5 w-full">
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              // flex-1 aur min-w-max ensure karte hain ki ye poori width evenly cover karein
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#fed011] text-black font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50  font-bold'
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {step.num}
              </span>
              <span>{step.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          MAIN BODY: Left Sidebar + Right Content
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* =========================================================
            LEFT COLUMN (col-span-4): Driver Card + Verification Progress
            ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Driver Profile Header Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
            <img
              src={driver.avatar || defaultAvatar}
              alt={driver.name}
              className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-200 shadow-2xs"
            />
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-black leading-tight truncate">
                {driver.name}
              </h3>
              <p className="text-[11px] sm:text-sm font-bold text-black leading-tight">
                Driver ID: {driver.id}
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-black truncate leading-tight pt-1">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black shrink-0" />
                <span>{driver.mobile || driver.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-black truncate leading-tight">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black shrink-0" />
                <span className="truncate">{driver.email}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Verification Progress & Vertical Steps Tracker */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* Progress Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-black">
                  Verification Progress
                </h4>
                <span className="text-[11px] sm:text-sm font-bold text-black">
                  Step 1 of 5
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#fed011] rounded-full w-1/5" />
              </div>

              <p className="text-[11px] sm:text-xs font-bold text-black">
                Personal Details (In Review)
              </p>
            </div>

            {/* Vertical Steps List */}
            <div className="space-y-1.5 pt-1">
              {steps.map((step) => {
                const isActive = step.num === activeStep;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveStep(step.num)}
                    className={`flex items-center justify-between px-2.5 sm:px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100/60 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                          isActive
                            ? 'bg-[#fed011] text-black shadow-2xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {step.num}
                      </span>
                      <span className="text-[13px] sm:text-sm font-bold text-black">
                        {step.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        step.status === 'In Review'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (col-span-8): Personal Details Review Card
            ========================================================= */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-3 sm:space-y-6">
            {/* Header: Title + Subtitle */}
            <div className="flex items-start gap-2.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-100">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2 sm:mt-0.5">
                <img src={personalInfoIcon} alt="Personal Details" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                  Personal Details
                </h3>
                <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                  Verify the driver's personal information submitted during registration.
                </p>
              </div>
            </div>

            {/* Content: Driver Profile Picture + Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-start pt-1 sm:pt-2">
              {/* Profile Image (Smaller height on mobile) */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-24 h-28 sm:w-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                  <img
                    src={driver.avatar || amitPhoto}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Personal Details List (Compact gaps and padding on mobile) */}
              <div className="md:col-span-8 space-y-1.5 sm:space-y-2 pt-2 sm:pt-0">
                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Full Name</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-black sm:font-bold text-[13px] sm:text-base">
                    {driver.name}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Mobile Number</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                    {driver.mobile || driver.phone}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Email</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm break-all">
                    {driver.email}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Date of Birth</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                    {driver.dob || '10 Jan 1994'}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Gender</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                    {driver.gender || 'Male'}
                  </span>
                </div>

                <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start">
                  <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Address</span>
                  <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                  <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm leading-snug">
                    {driver.address || 'House No. 45, Boring Road, Patna, Bihar - 800001'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons: Reject & Approve (Always Side-by-Side) */}
          <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-6 pt-4 sm:pt-8 mt-4 sm:mt-6 border-t border-slate-100 w-full">
            {/* Reject Button */}
            <button
              onClick={handleReject}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-600 font-bold text-[13px] sm:text-base transition-all cursor-pointer shadow-2xs"
            >
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
              <span>Reject</span>
            </button>

            {/* Approve Button */}
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] sm:text-base transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}