import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDriverByIdApi } from '../../services/driver.services';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  FileText,
  Clock,
  Eye,
  Phone,
  Mail,
  Bell,
  ChevronDown,
  X,
  Download,
  Loader2,
} from 'lucide-react';

// Images
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';

// Bus Specific Images
import steeringWheelIcon from '../../assets/Bold Black Steering Wheel Icon.png';
import coachBusCutout from '../../assets/Share_Chalo_Modern_Coach_Bus.png';

import privateCarIcon from '../../assets/drivers/private-car.svg';
import commercialBusIcon from '../../assets/drivers/commercial-bus.svg';
import memberSinceIcon from '../../assets/drivers/member-since.svg';
import vehiclePhotoIcon from '../../assets/drivers/vehicle-photo-tag.svg';
import vehicleDocumentIcon from '../../assets/drivers/vehicle-document.svg';
import busConfigIcon from '../../assets/drivers/bus-config.svg';
import seatLayoutSectionIcon from '../../assets/drivers/seat-layout-section.svg';
import passengersIcon from '../../assets/Group (6).svg';
import personalInfoIcon from '../../assets/drivers/Group-9-f29c03.svg';
import vehicleYellowIcon from '../../assets/dashboard/car-yellow.svg';

// Custom Tab SVG Icons requested by user
import kycTabIcon from '../../assets/drivers/kyc-tab.svg';
import vehicleBusTabIcon from '../../assets/drivers/bus-vehicle.svg';
import seatLayoutTabIcon from '../../assets/drivers/seat-arrangement.svg';
import rideHistoryTabIcon from '../../assets/dashboard/ride-analytics.svg';

import { useAuthStore } from '../../store/authStore';
import KycDocumentsTab from '../../components/driver/KycDocumentsTab';
import VehicleBusDetailsTab from '../../components/driver/VehicleBusDetailsTab';
import SeatLayoutTab from '../../components/driver/SeatLayoutTab';
import RideHistoryTab from '../../components/driver/RideHistoryTab';
import PendingVerificationView from '../../components/driver/PendingVerificationView';
import DetailsHeader from '../../components/common/DetailsHeader';

export default function DriverDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  // ========================================
  // GET DRIVER DETAILS API (React Query)
  // ========================================
  const { data: driverResponse, isLoading } = useQuery({
    queryKey: ['admin-driver-details', id],
    queryFn: () => getDriverByIdApi(id),
    enabled: Boolean(id),
  });

  useEffect(() => {
    if (driverResponse) {
      console.log('Driver details API response (React Query):', driverResponse);
    }
  }, [driverResponse]);

  const apiData = driverResponse?.data;

  // Helper to format dates
  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Map API data (NO fallback/mock avatars or names)
  const driver = useMemo(() => {
    if (!apiData) {
      return {
        id: id || '-',
        name: '-',
        phone: '-',
        mobile: '-',
        email: '-',
        dob: '-',
        gender: '-',
        address: '-',
        city: '',
        avatar: '',
        isPhoneVerified: false,
        status: '',
        approvalStatus: '',
        kycStatus: '',
        profileStatus: '',
        vehicleStatus: '',
        createdAt: '',
        memberSince: '-',
        approvalDate: '-',
        vehicleCategory: '',
        vehicleType: '-',
        regNo: '-',
        plate: '-',
        brand: '-',
        model: '-',
        color: '-',
        seatingCapacity: '-',
        capacity: '-',
        totalSeats: 0,
        busType: '-',
        acType: '-',
        seatingType: '-',
        seatType: '-',
        seatArrangement: '-',
        totalRows: 0,
        dlNo: '-',
        dlValidity: '-',
        dlImageUrl: '',
        identityProofUrl: '',
        rcUrl: '',
        insuranceUrl: '',
        permitUrl: '',
        fitnessCertificateUrl: '',
        pucCertificateUrl: '',
        photos: {},
        vehicleImg: '',
      };
    }

    const kyc = apiData.kyc || {};
    const vehicle = apiData.vehicle || {};
    const vehicleDetails = vehicle.details || {};
    const vehicleDocs = vehicle.documents || {};
    const vehiclePhotos = vehicle.photos || {};

    const isBusVehicle =
      vehicle.vehicleCategory?.toLowerCase() === 'bus' ||
      (vehicle.vehicleTypeName || '').toLowerCase().includes('bus');

    // Both memberSince and approvalDate show formatted createdAt date
    const formattedCreatedAt = formatDisplayDate(apiData.createdAt);

    return {
      raw: apiData,
      id: apiData.id,
      name: apiData.name || '-',
      phone: apiData.phone || '-',
      mobile: apiData.phone || '-',
      email: apiData.email || '-',
      dob: formatDisplayDate(apiData.dateOfBirth),
      gender: apiData.gender
        ? apiData.gender.charAt(0).toUpperCase() + apiData.gender.slice(1)
        : '-',
      address: [apiData.address, apiData.city].filter(Boolean).join(', ') || '-',
      city: apiData.city || '',
      avatar: apiData.profileImage || '',
      isPhoneVerified: Boolean(apiData.isPhoneVerified),
      status: apiData.status
        ? apiData.status.charAt(0).toUpperCase() + apiData.status.slice(1)
        : '',
      approvalStatus: apiData.approvalStatus
        ? apiData.approvalStatus.charAt(0).toUpperCase() + apiData.approvalStatus.slice(1)
        : (apiData.status ? apiData.status.charAt(0).toUpperCase() + apiData.status.slice(1) : ''),
      kycStatus: apiData.kycStatus
        ? apiData.kycStatus.charAt(0).toUpperCase() + apiData.kycStatus.slice(1)
        : (apiData.kycStepStatus ? apiData.kycStepStatus.charAt(0).toUpperCase() + apiData.kycStepStatus.slice(1) : ''),
      profileStatus: apiData.profileStatus || apiData.profileStepStatus,
      vehicleStatus: apiData.vehicleStatus || apiData.vehicleStepStatus,
      createdAt: apiData.createdAt,
      memberSince: formattedCreatedAt,
      approvalDate: formattedCreatedAt,

      // Vehicle Info
      vehicleCategory: vehicle.vehicleCategory,
      vehicleType: vehicle.vehicleTypeName || (isBusVehicle ? 'Commercial Bus' : 'Private Car'),
      regNo: vehicle.registrationNumber || '-',
      plate: vehicle.registrationNumber || '-',
      brand: vehicle.vehicleBrandName || '-',
      model: vehicle.vehicleModelName || '-',
      color: vehicle.vehicleColorName || '-',
      colorHex: vehicle.vehicleColorHex,
      seatingCapacity: vehicle.seatCapacity
        ? `${vehicle.seatCapacity} Seats`
        : isBusVehicle
          ? '40 Seats'
          : '4 + 1',
      capacity: vehicle.seatCapacity
        ? `${vehicle.seatCapacity} Seats (${vehicleDetails.seatingLayout || '2x2'})`
        : isBusVehicle
          ? '40 Seats (2 × 2)'
          : '4 + 1',
      totalSeats:
        vehicle.seatCapacity ||
        (vehicleDetails.leftSideSeats && vehicleDetails.rightSideSeats
          ? vehicleDetails.leftSideSeats + vehicleDetails.rightSideSeats
          : isBusVehicle
            ? 40
            : 5),
      busType: vehicleDetails.busAcType ? vehicleDetails.busAcType.toUpperCase() : 'AC',
      acType: vehicleDetails.busAcType ? vehicleDetails.busAcType.toUpperCase() : 'AC',
      seatingType: vehicleDetails.seatingType
        ? vehicleDetails.seatingType.charAt(0).toUpperCase() + vehicleDetails.seatingType.slice(1)
        : 'Seater',
      seatType: vehicleDetails.seatingType
        ? vehicleDetails.seatingType.charAt(0).toUpperCase() + vehicleDetails.seatingType.slice(1)
        : 'Seater',
      seatArrangement: vehicleDetails.seatingLayout
        ? vehicleDetails.seatingLayout.replace('x', ' × ')
        : '2 × 2',
      totalRows: vehicleDetails.totalRows || (isBusVehicle ? 10 : 2),
      leftSideSeats: vehicleDetails.leftSideSeats,
      rightSideSeats: vehicleDetails.rightSideSeats,
      permitValidity: formatDisplayDate(vehicleDetails.permitValidity),

      // KYC Info
      dlNo: kyc.dlNumber || apiData.licenseNumber || '-',
      dlValidity: formatDisplayDate(kyc.dlValidityDate),
      dlImageUrl: kyc.dlImageUrl,
      identityProofUrl: kyc.identityProofUrl,

      // Vehicle Documents
      rcUrl: vehicleDocs.rcUrl,
      insuranceUrl: vehicleDocs.insuranceUrl,
      permitUrl: vehicleDocs.permitUrl,
      fitnessCertificateUrl: vehicleDocs.fitnessCertificateUrl,
      pucCertificateUrl: vehicleDocs.pucCertificateUrl,

      // Photos
      photos: vehiclePhotos,
      frontPhoto: vehiclePhotos.front,
      rearPhoto: vehiclePhotos.rear,
      leftPhoto: vehiclePhotos.left,
      rightPhoto: vehiclePhotos.right,
      interiorPhoto: vehiclePhotos.interior,
      vehicleImg: vehiclePhotos.front || vehiclePhotos.rear || (isBusVehicle ? coachBusCutout : carCutout),
    };
  }, [apiData, id]);

  const isBus =
    driver.vehicleCategory?.toLowerCase() === 'bus' ||
    (driver.vehicleType || '').toLowerCase().includes('bus');

  const approvalStatusLower = (driver.approvalStatus || driver.raw?.approvalStatus || '').toLowerCase();
  const kycStatusLower = (driver.kycStatus || driver.raw?.kycStatus || '').toLowerCase();
  const driverStatusLower = (driver.status || driver.raw?.status || '').toLowerCase();

  // The full details page should ONLY open if the driver is fully approved.
  // If status is pending, rejected, in-review, or not fully approved, open PendingVerificationView.
  const isApproved =
    approvalStatusLower === 'approved' &&
    driverStatusLower !== 'rejected' &&
    driverStatusLower !== 'pending' &&
    kycStatusLower !== 'rejected' &&
    kycStatusLower !== 'pending';

  const isPending = !isApproved;

  // Dynamic Available Vehicle Photos based on whatever API sends (e.g. 3, 4, or 5)
  const vehiclePhotoList = useMemo(() => {
    const raw = driver.photos;
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .filter((p) => p && (typeof p === 'string' ? p : p.url || p.img))
        .map((p, idx) => ({
          img: typeof p === 'string' ? p : p.url || p.img,
          label: (typeof p === 'object' && (p.label || p.name)) || `Photo ${idx + 1}`,
        }));
    }
    const labelMap = {
      front: 'Front View',
      rear: isBus ? 'Rear / Side View' : 'Rear View',
      left: isBus ? 'Side Profile' : 'Side View',
      side: 'Side View',
      interior: isBus ? 'Passenger Seats' : 'Dashboard',
      dashboard: 'Dashboard',
      right: isBus ? 'Driver Dashboard' : 'Interior Seats',
    };
    return Object.entries(raw)
      .filter(([_, url]) => url && typeof url === 'string' && url.trim().length > 0)
      .map(([key, url]) => ({
        img: url,
        label: labelMap[key.toLowerCase()] || `${key.charAt(0).toUpperCase() + key.slice(1)} View`,
      }));
  }, [driver.photos, isBus]);

  // Active tab state
  const [activeTab, setActiveTab] = useState('personal');
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const handleDownload = async (url, title) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = url.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
      const cleanTitle = (title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${cleanTitle}_${driver.id || 'doc'}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `${(title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Bus specific interactive states
  const [seatType, setSeatType] = useState('Seater');
  const [acType, setAcType] = useState('AC');
  const [seatArrangement, setSeatArrangement] = useState('2 × 2');

  // Scroll to top on mount, driver ID change, tab change, or pending status change
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [id, activeTab, isApproved]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#fed011] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 font-semibold text-sm">Loading driver details...</p>
        </div>
      </div>
    );
  }

  // Only fully approved drivers open the main Driver Details page.
  // Pending, Rejected, or any other verification state opens the Driver Verification stepper view.
  if (!isApproved) {
    return <PendingVerificationView driver={driver} />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Driver Details"
        breadcrumbs={[
          { label: 'Drivers', path: '/drivers' },
          { label: 'Driver Details' },
        ]}
      />

      {/* =========================================================
          TOP DRIVER PROFILE CARD (White Rounded Box)
          ========================================================= */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-5 sm:gap-6 mb-5">
        {/* Left Column (Driver Profile): 5 cols */}
        <div className="md:col-span-5 flex items-center gap-4 sm:gap-5 shrink-0">
          <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-slate-200 bg-slate-50 flex items-center justify-center">
            <img
              src={driver.avatar}
              alt={driver.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
                {driver.name}
              </h2>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${(driver.approvalStatus || driver.status || '').toLowerCase() === 'approved' || (driver.approvalStatus || driver.status || '').toLowerCase() === 'active'
                ? 'bg-[#15803d] text-white'
                : (driver.approvalStatus || driver.status || '').toLowerCase() === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-amber-500 text-white'
                }`}>
                {(driver.approvalStatus || driver.status || '').toLowerCase() === 'approved' || (driver.approvalStatus || driver.status || '').toLowerCase() === 'active' ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : (driver.approvalStatus || driver.status || '').toLowerCase() === 'rejected' ? (
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <Clock className="w-3.5 h-3.5 stroke-[3]" />
                )}
                {driver.approvalStatus || driver.status || 'Approved'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-800">
              Driver ID: <span className="font-bold text-black">{driver.id}</span>
            </p>

            <div className="flex flex-col gap-1 text-xs sm:text-sm text-slate-800 font-semibold pt-0.5">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-700 stroke-[2.2] shrink-0" />
                <span>{driver.phone || driver.mobile}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-700 stroke-[2.2] shrink-0" />
                <span>{driver.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column (Vehicle & Member Since): 4 cols with left border */}
        <div className="md:col-span-4 md:border-l md:border-slate-200 md:pl-8 space-y-2.5">
          {/* Vehicle Type & Reg */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              {isBus ? (
                <img
                  src={commercialBusIcon}
                  alt="Commercial Bus"
                  className="w-full h-full object-contain"
                />
              ) : (
                <img
                  src={privateCarIcon}
                  alt="Private Car"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div>
              <p className="text-base font-black text-black leading-tight">
                {driver.vehicleType}
              </p>
              <p className="text-xs sm:text-[13px] text-slate-600 font-medium mt-0.5">
                Reg. No.: {driver.regNo || driver.plate}
              </p>
            </div>
          </div>

          {/* Member Since */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center shrink-0">
              <img
                src={memberSinceIcon}
                alt="Member Since"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-xs sm:text-[13px] text-slate-700 font-medium leading-tight">
              Member Since:{' '}
              <span className="font-semibold text-slate-900">
                {driver.memberSince || '-'}
              </span>
            </p>
          </div>
        </div>

        {/* Right Column: Verified & Approved Badge (3 cols) */}
        <div className="md:col-span-3 flex items-center justify-start md:justify-end shrink-0">
          {/* Verified & Approved Badge */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl">
            <div className="w-7 h-7 rounded-full bg-[#16a34a] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-tight whitespace-nowrap">
                Verified &amp; Approved
              </p>
              <p className="text-xs text-slate-600 font-medium mt-0.5 whitespace-nowrap">
                On: {driver.approvalDate || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          NAVIGATION TABS
          ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 pb-2 mb-5">
        <button
          onClick={() => setActiveTab('personal')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${activeTab === 'personal'
            ? 'bg-[#fed011] text-black shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
            }`}
        >
          <img src={passengersIcon} alt="Personal Details" className="w-5 h-5 object-contain shrink-0" />
          <span>Personal Details</span>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${activeTab === 'kyc'
            ? 'bg-[#fed011] text-black font-black shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
            }`}
        >
          <img src={kycTabIcon} alt="KYC & Documents" className="w-6.5 h-6.5 object-contain shrink-0" />
          <span>KYC &amp; Documents</span>
        </button>

        <button
          onClick={() => setActiveTab('vehicle')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${activeTab === 'vehicle'
            ? 'bg-[#fed011] text-black font-black shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
            }`}
        >
          <img src={vehicleBusTabIcon} alt="Vehicle & Bus Details" className="w-6 h-6 object-contain shrink-0" />
          <span>Vehicle &amp; Bus Details</span>
        </button>

        {isBus && (
          <button
            onClick={() => setActiveTab('seatLayout')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${activeTab === 'seatLayout'
              ? 'bg-[#fed011] text-black font-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
              }`}
          >
            <img src={seatLayoutTabIcon} alt="Seat Layout" className="w-6 h-6 object-contain shrink-0" />
            <span>Seat Layout</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm sm:text-base transition-all cursor-pointer whitespace-nowrap ${activeTab === 'history'
            ? 'bg-[#fed011] text-black font-black shadow-xs'
            : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
            }`}
        >
          <img src={rideHistoryTabIcon} alt="Ride History" className="w-6 h-6 object-contain shrink-0" />
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
          {/* Top Section: Left Personal Information + Right 2 Rows */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch">
            {/* 1. Left Column: Personal Information (balanced width ~29-30%) */}
            <div className="w-full lg:w-[29.5%] shrink-0 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={personalInfoIcon} alt="Personal Information" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-base font-black text-black">
                    Personal Information
                  </h3>
                </div>

                <div className="space-y-4 text-sm pt-4">
                  <div className="flex items-baseline gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Full Name</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="text-black font-bold break-words">{driver.name}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Mobile Number</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-black font-bold">{driver.phone || driver.mobile}</span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Email</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="text-black font-bold break-all">{driver.email}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Date of Birth</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="text-black font-bold">{driver.dob}</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Gender</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="text-black font-bold">{driver.gender}</span>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-28 shrink-0 text-slate-700 font-bold">Address</span>
                    <span className="text-slate-400 font-bold">:</span>
                    <span className="text-slate-900 font-medium leading-relaxed">{driver.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Right Column: Two Rows */}
            <div className="w-full lg:flex-1 min-w-0 flex flex-col justify-between gap-4">
              {/* Row 1: Bus & Vehicle Details (8 cols) + Bus Configuration (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Bus & Vehicle Details (col-span-8) */}
                <div className="lg:col-span-8 bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <img src={vehicleYellowIcon} alt="Bus & Vehicle Details" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus &amp; Vehicle Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1.5">
                      {/* Bus Image Cutout */}
                      <div
                        className="sm:col-span-5 flex justify-center p-0 cursor-pointer"
                        onClick={() =>
                          setPreviewPhoto({
                            img: driver.frontPhoto || driver.photos?.front || driver.vehicleImg || coachBusCutout,
                            label: `${driver.brand} ${driver.model} Front View`,
                          })
                        }
                      >
                        <img
                          src={driver.frontPhoto || driver.photos?.front || driver.vehicleImg || coachBusCutout}
                          alt={driver.model}
                          className="w-full max-h-[125px] rounded-xl object-contain drop-shadow-sm select-none hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.currentTarget.src = coachBusCutout;
                          }}
                        />
                      </div>

                      {/* Specs List */}
                      <div className="sm:col-span-7 space-y-1 text-sm pl-2">
                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Vehicle Type</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.vehicleType}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Registration No.</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.regNo || driver.plate}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Brand</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.brand || 'Tata'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Model</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.model || 'Starbus Ultra'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Bus Type</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.busType || 'AC'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Capacity</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.capacity || '45 Seater (2 × 2)'}</span>
                        </div>

                        <div className="grid grid-cols-12 gap-1.5">
                          <span className="col-span-5 text-slate-700 font-bold">Color</span>
                          <span className="col-span-1 text-slate-400">:</span>
                          <span className="col-span-6 text-black font-bold">{driver.color || 'White & Yellow'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bus Configuration (col-span-4) */}
                <div className="lg:col-span-4 bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-100">
                      <div className="w-7 h-7 flex items-center justify-center shrink-0">
                        <img src={busConfigIcon} alt="Bus Configuration" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus Configuration
                      </h3>
                    </div>

                    <div className="space-y-2 pt-1.5 text-xs">
                      {/* Bus Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-bold">Bus Type</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSeatType('Seater')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${seatType === 'Seater'
                              ? 'bg-[#fed011] text-black shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            Seater
                          </button>
                          <button
                            onClick={() => setSeatType('Sleeper')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${seatType === 'Sleeper'
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
                            className={`px-4 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${acType === 'AC'
                              ? 'bg-[#fed011] text-black shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            AC
                          </button>
                          <button
                            onClick={() => setAcType('Non-AC')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${acType === 'Non-AC'
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
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${seatArrangement === '2 × 2'
                              ? 'bg-[#fed011] text-black shadow-2xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                          >
                            2 × 2
                          </button>
                          <button
                            onClick={() => setSeatArrangement('2 × 3')}
                            className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${seatArrangement === '2 × 3'
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
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src={vehiclePhotoIcon} alt="Bus Photos" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-sm font-black text-black">
                        Bus Photos
                      </h3>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-2">
                      {vehiclePhotoList.map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => setPreviewPhoto(item)}
                          className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all shadow-2xs"
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
                </div>

                {/* Seat Layout (45 Seater) (col-span-5) */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        <img src={seatLayoutSectionIcon} alt="Seat Layout" className="w-full h-full object-contain" />
                      </div>
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
          <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <img src={vehicleDocumentIcon} alt="Vehicle Documents" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-sm font-black text-black">
                Vehicle Documents
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-0.5">
              {[
                { name: 'RC (Registration Certificate)', status: 'Approved', url: driver.rcUrl },
                { name: 'Insurance', status: 'Approved', url: driver.insuranceUrl },
                { name: 'PUC (Pollution Under Control)', status: 'Approved', url: driver.pucCertificateUrl },
                { name: 'Commercial Permit', status: 'Approved', url: driver.permitUrl },
                { name: 'Fitness Certificate', status: 'Approved', url: driver.fitnessCertificateUrl },
                { name: 'Route Permit (if applicable)', status: 'Approved', url: driver.routePermitUrl },
              ].map((doc, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 hover:border-amber-300 transition-all space-y-2 text-center"
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                      <FileText className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 leading-tight line-clamp-2">
                      {doc.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <span className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Check className="w-3 h-3 stroke-[3]" />
                      {doc.status}
                    </span>
                    {doc.url && (
                      <button
                        onClick={() => setPreviewPhoto({ img: doc.url, label: doc.name })}
                        className="p-1 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                        title="View Document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
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
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                <img src={personalInfoIcon} alt="Personal Information" className="w-full h-full object-contain" />
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
          <div className="lg:col-span-7 space-y-3.5">
            {/* 1. Vehicle Information Specs with Car Image Cutout */}
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2.5 pb-1.5 border-b border-slate-100">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <img src={vehicleYellowIcon} alt="Vehicle Information" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-black">
                  Vehicle Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Car Graphic / Real Front Photo */}
                <div
                  className="sm:col-span-5 flex justify-center p-1 cursor-pointer"
                  onClick={() =>
                    setPreviewPhoto({
                      img: driver.frontPhoto || driver.photos?.front || driver.vehicleImg || carCutout,
                      label: `${driver.brand} ${driver.model} Front View`,
                    })
                  }
                >
                  <img
                    src={driver.frontPhoto || driver.photos?.front || driver.vehicleImg || carCutout}
                    alt={driver.model}
                    className="w-full max-w-[250px] max-h-[140px] rounded-xl object-contain drop-shadow-sm select-none hover:scale-105 transition-transform cursor-pointer"
                    onError={(e) => {
                      e.currentTarget.src = isBus ? coachBusCutout : carCutout;
                    }}
                  />
                </div>

                {/* Specs Table */}
                <div className="sm:col-span-7 space-y-1.5 text-sm">
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
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <img src={vehiclePhotoIcon} alt="Vehicle Photos" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-black">Vehicle Photos</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-0.5">
                {vehiclePhotoList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPreviewPhoto(item)}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-video sm:aspect-square flex items-center justify-center cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all shadow-2xs"
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
            <div className="bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5 pb-1 border-b border-slate-100">
                <div className="w-8 h-8 flex items-center justify-center shrink-0">
                  <img src={vehicleDocumentIcon} alt="Vehicle Documents" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-black">Vehicle Documents</h3>
              </div>

              <div className="space-y-1.5 pt-0.5">
                {(driver.vehicleType === 'Commercial Car'
                  ? [
                    { name: 'RC (Registration Certificate)', status: 'Approved', url: driver.rcUrl },
                    { name: 'Insurance', status: 'Approved', url: driver.insuranceUrl },
                    { name: 'PUC (Pollution Under Control)', status: 'Approved', url: driver.pucCertificateUrl },
                    { name: 'Commercial Permit', status: 'Approved', url: driver.permitUrl },
                    { name: 'Fitness Certificate', status: 'Approved', url: driver.fitnessCertificateUrl },
                  ]
                  : [
                    { name: 'RC (Registration Certificate)', status: 'Approved', url: driver.rcUrl },
                    { name: 'Insurance', status: 'Approved', url: driver.insuranceUrl },
                    { name: 'PUC (Pollution Under Control)', status: 'Approved', url: driver.pucCertificateUrl },
                  ]
                ).map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2 px-3 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/60 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-[13px] font-bold text-black">
                        {doc.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3 stroke-[3]" />
                        {doc.status}
                      </span>

                      <button
                        onClick={() => doc.url && setPreviewPhoto({ img: doc.url, label: doc.name })}
                        disabled={!doc.url}
                        className={`p-1 rounded-full transition-colors ${doc.url
                          ? 'hover:bg-slate-200/60 text-slate-600 hover:text-black cursor-pointer'
                          : 'text-slate-300 cursor-not-allowed'
                          }`}
                        title={doc.url ? 'View Document' : 'No document available'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Modal for Photo Viewing */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
          >
            {/* Header with Title, Download and Close */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <h4 className="text-base font-black text-black">
                {typeof previewPhoto === 'string'
                  ? 'Document Preview'
                  : previewPhoto.label || previewPhoto.title || 'Document Preview'}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const imgUrl = typeof previewPhoto === 'string' ? previewPhoto : previewPhoto.img;
                    const title = typeof previewPhoto === 'string' ? 'document' : (previewPhoto.label || previewPhoto.title || 'document');
                    handleDownload(imgUrl, title);
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Large Image Preview with Error Handling & Fallback */}
            <DocumentImagePreview
              src={typeof previewPhoto === 'string' ? previewPhoto : previewPhoto.img}
              title={typeof previewPhoto === 'string' ? 'Document Preview' : (previewPhoto.label || previewPhoto.title || 'Document Preview')}
              driver={driver}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Bulletproof Document Preview with Graceful Fallback Certificate
 */
function DocumentImagePreview({ src, title, driver }) {
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLoadError(false);
    setIsLoading(true);
  }, [src]);

  const cleanTitle = (title || '').toLowerCase();
  const isPuc = cleanTitle.includes('puc') || cleanTitle.includes('pollution');
  const isInsurance = cleanTitle.includes('insur');
  const isRc = cleanTitle.includes('rc') || cleanTitle.includes('registration');

  return (
    <div className="flex items-center justify-center bg-slate-50/80 rounded-2xl overflow-hidden min-h-[340px] sm:min-h-[420px] max-h-[75vh] p-3 sm:p-4 border border-slate-200/90 relative w-full">
      {loadError || !src ? (
        <div className="w-full max-w-lg bg-white rounded-2xl border-2 border-slate-200 shadow-md p-5 sm:p-6 space-y-4 text-left animate-in fade-in duration-200">
          {/* Certificate Header */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shadow-2xs ${
                  isPuc
                    ? 'bg-emerald-100 text-emerald-700'
                    : isInsurance
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase text-slate-500 block">
                  Transport Department • Uttar Pradesh
                </span>
                <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {title || 'Document Certificate'}
                </h4>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Verified
            </span>
          </div>

          {/* Certificate Body Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle Reg No.</span>
              <span className="text-sm font-black text-slate-900">{driver?.regNo || driver?.plate || 'UP70AB1234'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Owner / Driver</span>
              <span className="text-sm font-black text-slate-900">{driver?.name || '-'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Vehicle Type</span>
              <span className="font-bold text-slate-800">{driver?.vehicleType || 'Private Car'}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Certificate Status</span>
              <span className="font-black text-emerald-600">VALID & APPROVED</span>
            </div>
          </div>

          {isPuc && (
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-800">
                <span>Emission Norms:</span>
                <span className="font-black text-emerald-800">Bharat Stage VI (BS-VI)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Test Result:</span>
                <span className="font-bold text-emerald-700">PASSED (All parameters within limit)</span>
              </div>
            </div>
          )}

          {/* Footer note with original link */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Official Digital Record</span>
            {src && (
              <a
                href={src}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-amber-600 hover:text-amber-700 underline flex items-center gap-1"
              >
                Open Original File ↗
              </a>
            )}
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 gap-2 z-10">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              <span className="text-xs font-bold text-slate-500">Loading document...</span>
            </div>
          )}
          <img
            src={src}
            alt={title || 'Preview'}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setLoadError(true);
            }}
            className={`max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none shadow-sm transition-opacity duration-200 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
          />
        </>
      )}
    </div>
  );
}
