import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  MoreVertical,
  User,
  ShieldCheck,
  FileText,
  Clock,
  Eye,
  Phone,
  Mail,
  Bell,
  ChevronDown
} from 'lucide-react';

// Images
import driverAvatar from '../../assets/harsh_singh_avatar_square.png';
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';
import carFrontImg from '../../assets/White Baleno Hatchback on a Tree-Lined Road.png';
import carRearImg from '../../assets/White Maruti Suzuki Baleno Rear View.png';
import carSideImg from '../../assets/White Compact Sedan on a Tree-Lined Road.png';
import carDashImg from '../../assets/Modern Suzuki Cabin Dashboard View.png';
import carInteriorImg from '../../assets/Beige Leather Car Interior.png';

// Bus Specific Images
import steeringWheelIcon from '../../assets/Bold Black Steering Wheel Icon.png';
import coachBusCutout from '../../assets/Share Chalo Coach Bus.png';
import busHighRes1 from '../../assets/White_Share_Chalo_Bus_on_Tree_Lined_Road.png';
import busHighRes2 from '../../assets/White_Coach_Bus_on_a_Tree_Lined_Road.png';
import busHighRes3 from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
import busPhoto4 from '../../assets/bus_photo_4.png';
import busPhoto5 from '../../assets/bus_photo_5.png';

import { driversList } from '../../data/driversData';
import { useAuthStore } from '../../store/authStore';
import KycDocumentsTab from '../../components/driver/KycDocumentsTab';
import VehicleBusDetailsTab from '../../components/driver/VehicleBusDetailsTab';
import SeatLayoutTab from '../../components/driver/SeatLayoutTab';
import RideHistoryTab from '../../components/driver/RideHistoryTab';
import PendingVerificationView from '../../components/driver/PendingVerificationView';

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  const matchedDriver = driversList.find((d) => d.id === id);

  // Default driver state fallback
  const driver = matchedDriver || {
    id: id || 'SC5678',
    name: 'Harsh Singh',
    phone: '+91 98765 43210',
    email: 'harshsingh@gmail.com',
    dob: '15 Aug 1996',
    gender: 'Male',
    address: 'House No. 12, Boring Road, Patna, Bihar - 800001',
    isPhoneVerified: true,
    status: 'Approved',
    approvalDate: '02 Nov 2026',
    memberSince: '02 Nov 2026',
    vehicleType: 'Private Car',
    regNo: 'BR01PB4567',
    brand: 'Maruti Suzuki',
    model: 'Swift Dzire',
    color: 'White',
    seatingCapacity: '4 + 1',
    avatar: driverAvatar,
    vehicleImg: carCutout,
  };

  const isBus = driver.vehicleType === 'Commercial Bus';
  const isPending = driver.kycStatus === 'Pending';

  // If driver status is pending, show Driver Verification workflow view matching the screenshot
  if (isPending) {
    return <PendingVerificationView driver={driver} />;
  }

  // Active tab state
  const [activeTab, setActiveTab] = useState('personal');

  // Bus specific interactive states
  const [seatType, setSeatType] = useState('Seater');
  const [acType, setAcType] = useState('AC');
  const [seatArrangement, setSeatArrangement] = useState('2 × 2');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          TOP NAV BAR (Header inside details page matching screenshot)
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
              Driver Details
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              <span
                onClick={() => navigate('/drivers')}
                className="hover:underline cursor-pointer"
              >
                Drivers
              </span>{' '}
              › Driver Details
            </p>
          </div>
        </div>

        {/* Right: Notifications Bell + Admin Profile Pill */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#fed011] flex items-center justify-center text-black font-black text-xs shadow-2xs">
              <User className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-bold text-slate-900 hidden sm:inline-block">
              {admin?.username ? admin.username.split('@')[0] : 'Admin'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>
        </div>
      </div>

      {/* =========================================================
          TOP DRIVER PROFILE CARD (White Rounded Box)
          ========================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-5">
        {/* Left: Avatar + Basic Info */}
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#fffdf0] border border-amber-200/80 p-2 flex items-center justify-center shrink-0 shadow-2xs">
            <img
              src={driver.avatar || driverAvatar}
              alt={driver.name}
              className="w-full h-full rounded-full object-cover border-2 border-[#fed011] shadow-2xs"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                {driver.name}
              </h2>
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-[#15803d] text-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Approved
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800">
              Driver ID: <span className="font-bold text-black">{driver.id}</span>
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-slate-700 font-semibold pt-0.5">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                <span>{driver.phone || driver.mobile}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                <span>{driver.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Info: Vehicle info, Member Since, Verified & Approved Pill, Menu */}
        <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 sm:gap-8 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
          {/* Vehicle Type & Reg */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-800">
              {isBus ? (
                <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="15" rx="2" />
                  <circle cx="7.5" cy="18" r="2" />
                  <circle cx="16.5" cy="18" r="2" />
                  <path d="M3 10h18M8 3v4M16 3v4" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-base font-black text-black leading-tight">
                {driver.vehicleType}
              </p>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                Reg. No.: {driver.regNo || driver.plate}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-slate-800">
              <Calendar className="w-5 h-5 text-slate-800 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Member Since:</p>
              <p className="text-xs sm:text-sm font-bold text-black leading-tight">
                {driver.memberSince || driver.registeredOn}
              </p>
            </div>
          </div>

          {/* Verified & Approved Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl">
            <div className="w-7 h-7 rounded-full bg-[#16a34a] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 leading-tight">
                Verified &amp; Approved
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                On: {driver.approvalDate || '02 Nov 2026'}
              </p>
            </div>
          </div>

          {/* More Action */}
          <button className="p-2 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-700 transition-colors cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION TABS
          ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 mb-5">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'personal'
              ? 'bg-[#fed011] text-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
          }`}
        >
          <User className="w-4 h-4 text-black stroke-[2.4]" />
          <span>Personal Details</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kyc'
              ? 'bg-[#fed011] text-black font-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-slate-800 stroke-[2.2]" />
          <span>KYC &amp; Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'vehicle'
              ? 'bg-[#fed011] text-black font-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
          }`}
        >
          {isBus ? (
            <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <rect x="3" y="3" width="18" height="15" rx="2" />
              <circle cx="7.5" cy="18" r="2" />
              <circle cx="16.5" cy="18" r="2" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
              <circle cx="7" cy="17" r="2" />
              <circle cx="17" cy="17" r="2" />
            </svg>
          )}
          <span>{isBus ? 'Vehicle & Bus Details' : 'Vehicle Details'}</span>
        </button>

        {isBus && (
          <button
            onClick={() => setActiveTab('seatLayout')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'seatLayout'
                ? 'bg-[#fed011] text-black font-black shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
            }`}
          >
            <svg className="w-4 h-4 text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
              <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
              <path d="M5 18v2M19 18v2" />
            </svg>
            <span>Seat Layout</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-[#fed011] text-black font-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
          }`}
        >
          <Clock className="w-4 h-4 text-slate-800 stroke-[2.2]" />
          <span>Ride History</span>
        </button>
      </div>

      {/* =========================================================
          BODY CONTENT (Tab-based: Personal Details vs KYC & Documents vs Vehicle & Bus Details vs Seat Layout vs Ride History)
          ========================================================= */}
      {activeTab === 'kyc' ? (
        <KycDocumentsTab driver={driver} />
      ) : activeTab === 'vehicle' ? (
        <VehicleBusDetailsTab driver={driver} />
      ) : activeTab === 'seatLayout' ? (
        <SeatLayoutTab driver={driver} />
      ) : activeTab === 'history' ? (
        <RideHistoryTab driver={driver} />
      ) : isBus ? (
        /* =========================================================
            COMMERCIAL BUS LAYOUT (Exact Match to Screenshot 1)
           ========================================================= */
        <div className="space-y-5">
          {/* Top Section: Left Tall Personal Information + Right 2 Rows */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* 1. Left Column: Personal Information (col-span-3, stretches to match right 2 rows) */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-black">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-4 text-xs sm:text-[13px] pt-4">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Full Name</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.name}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1 items-start">
                    <span className="col-span-5 text-slate-700 font-bold">Mobile Number</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <div className="col-span-6 flex flex-wrap items-center gap-1.5">
                      <span className="text-black font-bold">{driver.phone || driver.mobile}</span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Email</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold break-all">{driver.email}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Date of Birth</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.dob}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Gender</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.gender}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Address</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-slate-900 font-medium leading-relaxed">{driver.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Right Column (col-span-9): Two Rows */}
            <div className="lg:col-span-9 flex flex-col justify-between gap-4">
              {/* Row 1: Bus & Vehicle Details (7 cols) + Bus Configuration (5 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Bus & Vehicle Details (col-span-7) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="3" width="18" height="15" rx="2" />
                          <circle cx="7.5" cy="18" r="2" />
                          <circle cx="16.5" cy="18" r="2" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus &amp; Vehicle Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
                      {/* Bus Image Cutout */}
                      <div className="sm:col-span-5 flex justify-center p-1">
                        <img
                          src={coachBusCutout}
                          alt={driver.model}
                          className="w-full max-w-[210px] h-auto object-contain drop-shadow-sm select-none"
                        />
                      </div>

                      {/* Specs List */}
                      <div className="sm:col-span-7 space-y-1.5 text-xs sm:text-[13px]">
                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Vehicle Type</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.vehicleType}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Registration No.</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.regNo || driver.plate}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Brand</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.brand || 'Tata'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Model</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.model || 'Starbus Ultra'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Bus Type</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.busType || 'AC'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Capacity</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.capacity || '45 Seater (2 × 2)'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1">
                          <span className="col-span-5 text-slate-700 font-bold">Color</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.color || 'White & Yellow'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Configuration (col-span-5) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1 bg-amber-100/70 rounded-xl text-amber-700">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus Configuration
                      </h3>
                    </div>

                    <div className="space-y-3 pt-2 text-xs">
                      {/* Bus Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-bold">Bus Type</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSeatType('Seater')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              seatType === 'Seater'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Seater
                          </button>
                          <button
                            onClick={() => setSeatType('Sleeper')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              seatType === 'Sleeper'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Sleeper
                          </button>
                        </div>
                      </div>

                      {/* AC Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-bold">AC Type</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setAcType('AC')}
                            className={`px-4 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              acType === 'AC'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            AC
                          </button>
                          <button
                            onClick={() => setAcType('Non-AC')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              acType === 'Non-AC'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            Non-AC
                          </button>
                        </div>
                      </div>

                      {/* Seat Arrangement */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-bold">Seat Arrangement</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSeatArrangement('2 × 2')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              seatArrangement === '2 × 2'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            2 × 2
                          </button>
                          <button
                            onClick={() => setSeatArrangement('2 × 3')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                              seatArrangement === '2 × 3'
                                ? 'bg-[#fed011] text-black shadow-2xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            2 × 3
                          </button>
                        </div>
                      </div>

                      {/* Total Seats */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-700 font-bold">Total Seats</span>
                        <span className="px-3.5 py-0.5 bg-amber-100/70 text-black font-black rounded-lg text-xs">
                          {driver.totalSeats || 45}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Bus Photos (col-span-7) + Seat Layout (col-span-5) in the SAME ROW! */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Bus Photos (col-span-7) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="3" width="18" height="15" rx="2" />
                          <circle cx="7.5" cy="18" r="2" />
                          <circle cx="16.5" cy="18" r="2" />
                        </svg>
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus Photos
                      </h3>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {[
                        { img: busHighRes1, label: 'Front View' },
                        { img: busHighRes2, label: 'Rear / Side View' },
                        { img: busHighRes3, label: 'Side Profile' },
                        { img: busPhoto4, label: 'Passenger Seats' },
                        { img: busPhoto5, label: 'Driver Dashboard' },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center transition-all shadow-2xs"
                        >
                          <img
                            src={item.img}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Seat Layout (45 Seater) (col-span-5) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                        <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                        <path d="M5 18v2M19 18v2" />
                      </svg>
                      <h3 className="text-sm font-black text-black">
                        Seat Layout (45 Seater)
                      </h3>
                    </div>

                    {/* Floor map with steering and seats */}
                    <div className="bg-[#fafbfc] border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 flex items-center gap-3 mt-2">
                      <div className="shrink-0 flex items-center justify-center pr-2 border-r border-slate-200">
                        <img
                          src={steeringWheelIcon}
                          alt="Steering Wheel"
                          className="w-7 h-7 object-contain opacity-90"
                        />
                      </div>

                      <div className="flex-1 flex flex-col gap-1 overflow-x-auto no-scrollbar py-0.5">
                        <div className="flex gap-1.5">
                          {[...Array(11)].map((_, i) => (
                            <div key={`t1-${i}`} className="w-3.5 h-3.5 rounded-[3px] bg-slate-300 border border-slate-400/60" />
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(11)].map((_, i) => (
                            <div key={`t2-${i}`} className="w-3.5 h-3.5 rounded-[3px] bg-slate-300 border border-slate-400/60" />
                          ))}
                        </div>
                        <div className="h-1.5" />
                        <div className="flex gap-1.5">
                          {[...Array(11)].map((_, i) => (
                            <div key={`b1-${i}`} className="w-3.5 h-3.5 rounded-[3px] bg-slate-300 border border-slate-400/60" />
                          ))}
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(11)].map((_, i) => (
                            <div key={`b2-${i}`} className="w-3.5 h-3.5 rounded-[3px] bg-slate-300 border border-slate-400/60" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Vehicle Documents (6 Cards Grid Matching Screenshot 1) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
              <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-black text-black">
                Vehicle Documents
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 pt-1">
              {[
                { name: 'RC (Registration Certificate)', status: 'Approved' },
                { name: 'Insurance', status: 'Approved' },
                { name: 'PUC (Pollution Under Control)', status: 'Approved' },
                { name: 'Commercial Permit', status: 'Approved' },
                { name: 'Fitness Certificate', status: 'Approved' },
                { name: 'Route Permit (if applicable)', status: 'Approved' },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:border-amber-300 transition-all space-y-3 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">
                      {doc.name}
                    </span>
                  </div>

                  <span className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100 w-fit mx-auto">
                    <Check className="w-3 h-3 stroke-[3]" />
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================
            PRIVATE / COMMERCIAL CAR LAYOUT (Exact Match to Screenshot 2)
           ========================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Personal Information (col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                <User className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-black">
                Personal Information
              </h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-700 font-bold">Full Name</span>
                <span className="col-span-8 text-black font-bold">{driver.name}</span>
              </div>

              <div className="grid grid-cols-12 gap-2 items-center">
                <span className="col-span-4 text-slate-700 font-bold">Mobile Number</span>
                <div className="col-span-8 flex items-center gap-2">
                  <span className="text-black font-bold">{driver.phone || driver.mobile}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Verified
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-700 font-bold">Email</span>
                <span className="col-span-8 text-black font-bold break-all">{driver.email}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-700 font-bold">Date of Birth</span>
                <span className="col-span-8 text-black font-bold">{driver.dob}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-700 font-bold">Gender</span>
                <span className="col-span-8 text-black font-bold">{driver.gender}</span>
              </div>

              <div className="grid grid-cols-12 gap-2">
                <span className="col-span-4 text-slate-700 font-bold">Address</span>
                <span className="col-span-8 text-slate-900 font-medium leading-relaxed">{driver.address}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Information, Vehicle Photos & Vehicle Documents (col-span-7) */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Vehicle Information Specs with Car Image Cutout */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-black">
                  Vehicle Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Car Graphic */}
                <div className="sm:col-span-5 flex justify-center p-2">
                  <img
                    src={driver.vehicleImg || carCutout}
                    alt={driver.model}
                    className="w-full max-w-[220px] h-auto object-contain drop-shadow-sm select-none"
                  />
                </div>

                {/* Specs Table */}
                <div className="sm:col-span-7 space-y-2 text-sm">
                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Vehicle Type</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.vehicleType}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Registration No.</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.regNo || driver.plate}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Brand</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.brand}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Model</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.model}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Color</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.color}</span>
                  </div>

                  <div className="grid grid-cols-12 gap-1">
                    <span className="col-span-5 text-slate-700 font-bold">Seating Capacity</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-6 text-black font-bold">{driver.seatingCapacity}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Vehicle Photos (5 Thumbnails) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-black">Vehicle Photos</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                {[
                  { img: carFrontImg, label: 'Front View' },
                  { img: carRearImg, label: 'Rear View' },
                  { img: carSideImg, label: 'Side View' },
                  { img: carDashImg, label: 'Dashboard' },
                  { img: carInteriorImg, label: 'Interior Seats' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video sm:aspect-square flex items-center justify-center cursor-pointer hover:border-amber-400 transition-all shadow-2xs"
                  >
                    <img
                      src={item.img}
                      alt={item.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Vehicle Documents (3 Horizontal Rows with Eye button - Matching Screenshot 2) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-black">Vehicle Documents</h3>
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { name: 'RC (Registration Certificate)', status: 'Approved' },
                  { name: 'Insurance', status: 'Approved' },
                  { name: 'PUC (Pollution Under Control)', status: 'Approved' },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/60 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-black">
                        {doc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        {doc.status}
                      </span>

                      <button
                        className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
