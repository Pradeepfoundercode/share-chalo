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
import defaultAvatar from '../../assets/Smiling Man in Yellow Circular Frame.png';
import amitPhoto from '../../assets/amit_kumar_photo.png';

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          TOP NAV BAR: Header (Driver Verification / Drivers > Verify Driver)
          ========================================================= */}
      <div className="flex items-center justify-between pb-4 pt-1">
        {/* Left: Back Arrow + Page Title + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/drivers')}
            className="p-1 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer text-slate-900"
            title="Back to Drivers"
          >
            <ArrowLeft className="w-5 h-5 text-black stroke-[2.4]" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black leading-tight tracking-tight">
              Driver Verification
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Drivers &nbsp;&gt;&nbsp; <span className="text-slate-700">Verify Driver</span>
            </p>
          </div>
        </div>

        {/* Right: Notification Bell + Admin Profile Pill */}
        <div className="flex items-center gap-3">
          <button
            className="relative p-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
          </button>

          <div className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs">
              {admin?.name ? admin.name[0].toUpperCase() : 'A'}
            </div>
            <span className="text-xs font-bold text-slate-900 hidden sm:inline">
              {admin?.name || 'Admin'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* =========================================================
          HORIZONTAL STEPPER TABS (1 to 5)
          ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 mb-5">
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#fed011] text-black font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
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
          MAIN BODY: Left Sidebar (Profile + Progress + Step List) | Right Content (Personal Details Review Card)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* =========================================================
            LEFT COLUMN (col-span-4): Driver Card + Verification Progress + Stepper Tracker
            ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Driver Profile Header Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <img
              src={driver.avatar || defaultAvatar}
              alt={driver.name}
              className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-slate-100 shadow-2xs"
            />
            <div className="space-y-1 min-w-0">
              <h3 className="text-base font-black text-black leading-tight truncate">
                {driver.name}
              </h3>
              <p className="text-xs font-bold text-slate-600">
                Driver ID: {driver.id}
              </p>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 truncate">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{driver.mobile || driver.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{driver.email}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Verification Progress & Vertical Steps Tracker */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            {/* Progress Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-black">
                  Verification Progress
                </h4>
                <span className="text-xs font-bold text-slate-600">
                  Step 1 of 5
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-[#fed011] rounded-full w-1/5" />
              </div>

              <p className="text-[11px] font-semibold text-slate-600">
                Personal Details (In Review)
              </p>
            </div>

            {/* Vertical Steps List */}
            <div className="space-y-2.5 pt-1">
              {steps.map((step) => {
                const isActive = step.num === activeStep;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveStep(step.num)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100/60 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                          isActive
                            ? 'bg-[#fed011] text-black shadow-2xs'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {step.num}
                      </span>
                      <span className="text-xs font-bold text-black">
                        {step.name}
                      </span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        step.status === 'In Review'
                          ? 'bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
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
            RIGHT COLUMN (col-span-8): Personal Details Review Card + Photo + Details + Reject / Approve Buttons
            ========================================================= */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-6">
            {/* Header: Title + Subtitle */}
            <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 bg-amber-100/70 rounded-2xl text-amber-700 shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black leading-tight">
                  Personal Details
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  Verify the driver's personal information submitted during registration.
                </p>
              </div>
            </div>

            {/* Content: Driver Profile Picture + Specifications */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              {/* Profile Image (Portrait rounded rectangle matching screenshot) */}
              <div className="md:col-span-4 flex justify-center">
                <div className="w-36 h-40 sm:w-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50">
                  <img
                    src={driver.avatar || amitPhoto}
                    alt={driver.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Personal Details Table */}
              <div className="md:col-span-8 space-y-3.5 text-xs sm:text-[13px]">
                <div className="grid grid-cols-12 gap-1 items-center pb-1 border-b border-slate-50">
                  <span className="col-span-4 text-slate-700 font-bold">Full Name</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-black font-bold text-sm">
                    {driver.name}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-center pb-1 border-b border-slate-50">
                  <span className="col-span-4 text-slate-700 font-bold">Mobile Number</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-black font-bold">
                    {driver.mobile || driver.phone}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-center pb-1 border-b border-slate-50">
                  <span className="col-span-4 text-slate-700 font-bold">Email</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-black font-bold break-all">
                    {driver.email}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-center pb-1 border-b border-slate-50">
                  <span className="col-span-4 text-slate-700 font-bold">Date of Birth</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-black font-bold">
                    {driver.dob || '10 Jan 1994'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-center pb-1 border-b border-slate-50">
                  <span className="col-span-4 text-slate-700 font-bold">Gender</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-black font-bold">
                    {driver.gender || 'Male'}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-1 items-start">
                  <span className="col-span-4 text-slate-700 font-bold">Address</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-7 text-slate-900 font-medium leading-relaxed">
                    {driver.address || 'House No. 45, Boring Road, Patna, Bihar - 800001'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons: Reject & Approve */}
          <div className="grid grid-cols-2 gap-4 pt-8 mt-6 border-t border-slate-100">
            {/* Reject Button (Light red bg, red border, red text + X icon) */}
            <button
              onClick={handleReject}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-600 font-bold text-sm transition-all cursor-pointer shadow-2xs"
            >
              <XCircle className="w-4 h-4 stroke-[2.4]" />
              <span>Reject</span>
            </button>

            {/* Approve Button (Solid Green bg, green text, Check icon) */}
            <button
              onClick={handleApprove}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.4]" />
              <span>Approve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

