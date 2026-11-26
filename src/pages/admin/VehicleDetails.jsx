import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Car,
  Briefcase,
  Check,
  Phone,
  FileText,
  FileSpreadsheet,
  Bus,
  Armchair,
  Loader2,
  Eye,
  Download,
  X,
} from 'lucide-react';
import {
  vehiclesList,
  defaultCarPhotos,
  defaultBusPhotos,
  defaultVehicleDocuments,
} from '../../data/vehiclesData';
import { getVehicleByIdApi } from '../../services/vehicle.services';
import carThumb from '../../assets/White Compact Hatchback Car Cutout.png';
import busThumb from '../../assets/commercial_bus.png';
import { useAuthStore } from '../../store/authStore';
import { DetailsHeader } from '../../components/common';
import paleYellowWavesBg from '../../assets/drivers/Pale Yellow Layered Waves.png';

// Assets for specs & badges
import vehicleCarIcon from '../../assets/drivers/bus-vehicle.svg';
import brandPriceTagIcon from '../../assets/drivers/price-tag-icon.svg';
import seatIcon from '../../assets/drivers/seat-arrangement.svg';
import briefcaseIcon from '../../assets/drivers/briefcase-icon.svg';
import vehiclePhotosIcon from '../../assets/drivers/vehicle-photos.svg';
import vehicleDocsIcon from '../../assets/drivers/vehicle-docs.svg';
import assignedDriverIcon from '../../assets/drivers/assigned-driver.svg';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const admin = useAuthStore((state) => state.admin);

  // Fetch live vehicle details by ID via API
  const { data: apiResponse, isLoading, isError, error } = useQuery({
    queryKey: ['admin-vehicle-details', id],
    queryFn: () => getVehicleByIdApi(id),
    enabled: Boolean(id),
    staleTime: 30000,
  });

  // Extract raw vehicle from API response
  const apiVehicle = apiResponse?.data || apiResponse?.vehicle || location.state?.vehicle;

  // Map API vehicle object directly to UI fields without dummy fallback
  const vehicle = React.useMemo(() => {
    if (!apiVehicle) return null;

    const vId = apiVehicle.id ?? apiVehicle.vehicleId ?? id;
    const vehicleNumber =
      apiVehicle.registrationNumber ||
      apiVehicle.vehicleNumber ||
      apiVehicle.number ||
      '-';

    // Type & Category
    const categoryName = apiVehicle.vehicleCategory
      ? apiVehicle.vehicleCategory.charAt(0).toUpperCase() + apiVehicle.vehicleCategory.slice(1)
      : 'Private';

    const typeName =
      apiVehicle.vehicleTypeName ||
      apiVehicle.type?.name ||
      categoryName ||
      'Private';

    const usageType = categoryName;

    // Brand, Model, Color
    const brandName =
      apiVehicle.vehicleBrandName ||
      apiVehicle.brand?.name ||
      '-';

    const modelName =
      apiVehicle.vehicleModelName ||
      apiVehicle.model?.name ||
      '-';

    const colorName =
      apiVehicle.vehicleColorName ||
      apiVehicle.color?.name ||
      '-';

    const colorHex = apiVehicle.color?.hexCode;

    // Capacity & Seats
    const seats =
      apiVehicle.seatCapacity ??
      apiVehicle.model?.seatCapacity ??
      apiVehicle.seats ??
      '-';

    // Driver details
    const driver = apiVehicle.driver || {};
    const driverName = driver.name || apiVehicle.driverName || 'Unassigned';
    const driverAvatar =
      driver.profileImage ||
      driver.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
    const driverPhone = driver.phone || driver.mobile || apiVehicle.driverPhone || '-';
    const driverEmail = driver.email || '-';
    const driverCity = driver.city || '-';
    const driverId = driver.id ? `#${driver.id}` : (apiVehicle.driverId ? `#${apiVehicle.driverId}` : '-');
    const isDriverApproved = (driver.approvalStatus || '').toLowerCase() === 'approved';

    // Status
    const status =
      driver.vehicleStepStatus
        ? (driver.vehicleStepStatus.charAt(0).toUpperCase() + driver.vehicleStepStatus.slice(1))
        : (apiVehicle.status || 'Active');

    // Photos from API
    // "photos": { "front": "...", "rear": "...", "interior": "..." }
    const rawPhotos = apiVehicle.photos || {};
    const photoList = [];
    if (typeof rawPhotos === 'object' && !Array.isArray(rawPhotos)) {
      if (rawPhotos.front) photoList.push({ img: rawPhotos.front, label: 'Front View' });
      if (rawPhotos.rear) photoList.push({ img: rawPhotos.rear, label: 'Rear View' });
      if (rawPhotos.side) photoList.push({ img: rawPhotos.side, label: 'Side View' });
      if (rawPhotos.interior) photoList.push({ img: rawPhotos.interior, label: 'Interior View' });
    } else if (Array.isArray(rawPhotos)) {
      rawPhotos.forEach((p, idx) => {
        if (typeof p === 'string') photoList.push({ img: p, label: `Photo ${idx + 1}` });
        else if (p?.img) photoList.push(p);
      });
    }

    // Hero image
    const heroImage =
      rawPhotos.front ||
      rawPhotos.rear ||
      rawPhotos.interior ||
      photoList[0]?.img ||
      carThumb;

    // Documents from API
    // "documents": { "rcUrl": "...", "insuranceUrl": "...", "pucCertificateUrl": "..." }
    const rawDocs = apiVehicle.documents || {};
    const documentList = [];
    if (rawDocs.rcUrl) {
      documentList.push({
        id: documentList.length + 1,
        name: 'Registration Certificate (RC)',
        url: rawDocs.rcUrl,
        linkText: 'View RC',
        validity: 'Verified',
      });
    }
    if (rawDocs.insuranceUrl) {
      documentList.push({
        id: documentList.length + 1,
        name: 'Insurance Policy',
        url: rawDocs.insuranceUrl,
        linkText: 'View Insurance',
        validity: 'Verified',
      });
    }
    if (rawDocs.pucCertificateUrl) {
      documentList.push({
        id: documentList.length + 1,
        name: 'Pollution Under Control (PUC)',
        url: rawDocs.pucCertificateUrl,
        linkText: 'View PUC',
        validity: 'Verified',
      });
    }
    if (rawDocs.permitUrl) {
      documentList.push({
        id: documentList.length + 1,
        name: 'Commercial Permit',
        url: rawDocs.permitUrl,
        linkText: 'View Permit',
        validity: 'Verified',
      });
    }
    if (rawDocs.fitnessCertificateUrl) {
      documentList.push({
        id: documentList.length + 1,
        name: 'Fitness Certificate',
        url: rawDocs.fitnessCertificateUrl,
        linkText: 'View Fitness',
        validity: 'Verified',
      });
    }

    const isBus = (categoryName || '').toLowerCase().includes('bus') || (typeName || '').toLowerCase().includes('bus');

    return {
      id: vId,
      vehicleNumber,
      vehicleType: typeName,
      usageType,
      brand: brandName,
      model: modelName,
      color: colorName,
      colorHex,
      seats,
      status,
      heroImage,
      photos: photoList,
      documents: documentList,
      isBus,
      totalTrips: apiVehicle.totalTrips ?? 0,
      createdAt: apiVehicle.createdAt ? new Date(apiVehicle.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-',
      driverName,
      driverAvatar,
      driverPhone,
      driverId,
      driver: {
        id: driverId,
        name: driverName,
        avatar: driverAvatar,
        phone: driverPhone,
        email: driverEmail,
        city: driverCity,
        isApproved: isDriverApproved,
      },
    };
  }, [apiVehicle, id]);

  const [previewDoc, setPreviewDoc] = React.useState(null);

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
      link.download = `${cleanTitle}_${vehicle?.id || 'vehicle'}.${extension}`;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
        <DetailsHeader
          title="Vehicle Details"
          breadcrumbs={[
            { label: 'Vehicles', path: '/vehicles' },
            { label: 'Vehicle Details' },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          <p className="text-sm font-semibold text-slate-500">Loading vehicle details from server...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12">
        <DetailsHeader
          title="Vehicle Details"
          breadcrumbs={[
            { label: 'Vehicles', path: '/vehicles' },
            { label: 'Vehicle Details' },
          ]}
        />
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-3">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-black">Vehicle Not Found</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            {isError ? (error?.response?.data?.message || 'Unable to fetch vehicle details from the server.') : 'No vehicle information found for this ID.'}
          </p>
          <button
            onClick={() => navigate('/vehicles')}
            className="mt-5 px-5 py-2.5 bg-[#fed011] text-black font-bold rounded-xl text-sm shadow-2xs hover:bg-amber-400 cursor-pointer"
          >
            Back to Vehicles List
          </button>
        </div>
      </div>
    );
  }

  const isBus = vehicle.isBus;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Vehicle Details"
        breadcrumbs={[
          { label: 'Vehicles', path: '/vehicles' },
          { label: 'Vehicle Details' },
        ]}
      />

      <div className="space-y-2.5 px-3 sm:px-4 lg:px-6 mt-4">
        {/* =========================================================
            TOP VEHICLE HERO CARD (Fully fluid single-row on all screen sizes - NO SCROLL)
            ========================================================= */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          {/* Background Pale Yellow Layered Waves banner */}
          <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-90">
            <img
              src={paleYellowWavesBg}
              alt="Pale Yellow Waves"
              className="w-full h-full object-cover sm:object-fill object-center"
            />
          </div>

          {/* Desktop & Tablet View (sm and above: clean single row) */}
          <div className="hidden sm:flex w-full px-4 py-3.5 lg:px-6 lg:py-5 items-center justify-between gap-4 lg:gap-6 relative z-10">
            {/* Left Section: Vehicle Image + Reg Number + Pills */}
            <div className="flex items-center gap-3.5 lg:gap-5 min-w-0">
              {/* Vehicle Image */}
              <div className="w-36 h-20 md:w-44 md:h-24 lg:w-56 lg:h-28 flex items-center justify-center shrink-0">
                <img
                  src={vehicle.heroImage || vehicle.image}
                  alt={vehicle.vehicleNumber}
                  className="max-w-full max-h-full object-contain select-none transition-transform hover:scale-105 drop-shadow-sm"
                />
              </div>

              {/* Number and Pills */}
              <div className="min-w-0 space-y-1">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-black tracking-tight leading-none truncate">
                  {vehicle.vehicleNumber}
                </h2>

                <div className="flex items-center gap-1.5 pt-0.5">
                  {/* Vehicle Type Pill */}
                  <span className="inline-flex items-center gap-1 text-xs lg:text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-2xs shrink-0">
                    <img src={vehicleCarIcon} alt={vehicle.vehicleType} className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span>{vehicle.vehicleType}</span>
                  </span>

                  {/* Usage Type Pill */}
                  <span className="inline-flex items-center gap-1 text-xs lg:text-[13px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-2xs shrink-0">
                    <img src={briefcaseIcon} alt={vehicle.usageType} className="w-3.5 h-3.5 object-contain shrink-0" />
                    <span>{vehicle.usageType}</span>
                  </span>

                  {/* Status Pill */}
                  <span className="inline-flex items-center gap-1 text-xs lg:text-[13px] font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-2xs shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span>{vehicle.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Center Vertical Divider */}
            <div className="w-px h-12 lg:h-14 bg-slate-300 block shrink-0" />

            {/* Right Section: Specs (Brand, Model, Seats) */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6 shrink-0">
              {/* Brand */}
              <div className="flex items-center gap-2 lg:gap-2.5">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/95 border border-slate-200/90 flex items-center justify-center p-2 lg:p-2.5 shadow-2xs shrink-0">
                  <img src={brandPriceTagIcon} alt="Brand" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] lg:text-xs font-bold text-slate-500">Brand</p>
                  <p className="text-sm lg:text-[16px] font-black text-black">{vehicle.brand || 'Tata'}</p>
                </div>
              </div>

              {/* Divider between Brand & Model */}
              <div className="w-px h-10 lg:h-12 bg-slate-300 block shrink-0" />

              {/* Model */}
              <div className="flex items-center gap-2 lg:gap-2.5">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/95 border border-slate-200/90 flex items-center justify-center p-2 lg:p-2.5 shadow-2xs shrink-0">
                  <img src={vehicleCarIcon} alt="Model" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] lg:text-xs font-bold text-slate-500">Model</p>
                  <p className="text-sm lg:text-[16px] font-black text-black">{vehicle.model || 'Starbus'}</p>
                </div>
              </div>

              {/* Divider between Model & Seats */}
              <div className="w-px h-10 lg:h-12 bg-slate-300 block shrink-0" />

              {/* Seats */}
              <div className="flex items-center gap-2 lg:gap-2.5">
                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-white/95 border border-slate-200/90 flex items-center justify-center p-2 lg:p-2.5 shadow-2xs shrink-0">
                  <img src={seatIcon} alt="Seats" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[11px] lg:text-xs font-bold text-slate-500">Seats</p>
                  <p className="text-sm lg:text-[16px] font-black text-black">{vehicle.seats}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View (sm:hidden - clean 2-tier stacked card, slightly increased height, no horizontal scrolling, zero overlap) */}
          <div className="sm:hidden w-full p-3 flex flex-col gap-2.5 relative z-10">
            {/* Top Row: Vehicle Image + Vehicle Number & Pills */}
            <div className="flex items-center gap-3">
              <div className="w-20 h-14 flex items-center justify-center shrink-0">
                <img
                  src={vehicle.heroImage || vehicle.image}
                  alt={vehicle.vehicleNumber}
                  className="max-w-full max-h-full object-contain select-none drop-shadow-sm"
                />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <h2 className="text-lg font-black text-black tracking-tight leading-tight truncate">
                  {vehicle.vehicleNumber}
                </h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs">
                    <img src={vehicleCarIcon} alt={vehicle.vehicleType} className="w-3 h-3 object-contain shrink-0" />
                    <span>{vehicle.vehicleType}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs">
                    <img src={briefcaseIcon} alt={vehicle.usageType} className="w-3 h-3 object-contain shrink-0" />
                    <span>{vehicle.usageType}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-full shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                    <span>{vehicle.status}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Separator Line */}
            <div className="w-full h-px bg-slate-200/90" />

            {/* Bottom Row: 3 Specs Spaced Evenly with Dividers */}
            <div className="flex items-center justify-between px-1">
              {/* Brand */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200/90 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                  <img src={brandPriceTagIcon} alt="Brand" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-slate-500">Brand</p>
                  <p className="text-xs font-black text-black">{vehicle.brand || 'Tata'}</p>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-300 block shrink-0" />

              {/* Model */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200/90 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                  <img src={vehicleCarIcon} alt="Model" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-slate-500">Model</p>
                  <p className="text-xs font-black text-black">{vehicle.model || 'Starbus'}</p>
                </div>
              </div>

              <div className="w-px h-6 bg-slate-300 block shrink-0" />

              {/* Seats */}
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200/90 flex items-center justify-center p-1.5 shadow-2xs shrink-0">
                  <img src={seatIcon} alt="Seats" className="w-full h-full object-contain" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] font-bold text-slate-500">Seats</p>
                  <p className="text-xs font-black text-black">{vehicle.seats}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            ROW 2: Vehicle Information (Left) + Vehicle Photos & Bus Configuration (Right)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
          {/* ----------------- LEFT COLUMN (col-span-5) ----------------- */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            {/* 1. Vehicle Information Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 p-2 sm:p-2.5 shadow-2xs">
                  <img src={vehicleCarIcon} alt="Vehicle Information" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] sm:text-base font-bold text-black">
                  Vehicle Information
                </h3>
              </div>

              <div className="space-y-2 pt-3 text-[13px] sm:text-sm">
                {/* Applied custom grid layout for mobile readability */}
                {[
                  { label: 'Vehicle Number', value: vehicle.vehicleNumber },
                  { label: 'Vehicle Type', value: vehicle.vehicleType },
                  { label: 'Usage Type', value: vehicle.usageType },
                  { label: 'Brand', value: vehicle.brand },
                  { label: 'Model', value: vehicle.model },
                  { label: 'Color', value: vehicle.color },
                  { label: 'Seating Capacity', value: vehicle.seats },
                  { label: 'Total Trips Completed', value: vehicle.totalTrips },
                  { label: 'Registered On', value: vehicle.createdAt },
                ].map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[minmax(120px,40%)_auto_1fr] sm:grid-cols-12 gap-2 items-start sm:items-center">
                    <span className="sm:col-span-5 text-slate-700 font-bold">{item.label}</span>
                    <span className="sm:col-span-1 text-slate-400">:</span>
                    <span className="sm:col-span-6 font-bold text-black break-words">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Assigned Driver Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 p-2 sm:p-2.5 shadow-2xs">
                  <img src={assignedDriverIcon} alt="Assigned Driver" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] sm:text-base font-bold text-black">
                  Assigned Driver
                </h3>
              </div>

              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 pt-3">
                <img
                  src={vehicle.driver?.avatar || vehicle.driverAvatar}
                  alt={vehicle.driver?.name || vehicle.driverName}
                  className="w-[52px] h-[52px] sm:w-14 sm:h-14 rounded-full object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
                />
                <div className="space-y-0.5">
                  <h4 className="text-base sm:text-lg font-bold text-black leading-tight">
                    {vehicle.driver?.name || vehicle.driverName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[13px] sm:text-sm font-bold text-slate-800">
                      {vehicle.driver?.phone || vehicle.driverPhone}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      {vehicle.driver?.isApproved ? 'Verified' : 'Approved'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 text-xs font-semibold text-slate-500">
                    <p>Driver ID: {vehicle.driver?.id || vehicle.driverId}</p>
                    {vehicle.driver?.city && vehicle.driver.city !== '-' && (
                      <p>City: {vehicle.driver.city}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN (col-span-7) ----------------- */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            {/* 1. Vehicle Photos Card */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 p-2 sm:p-2.5 shadow-2xs">
                  <img src={vehiclePhotosIcon} alt="Vehicle Photos" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] sm:text-base font-bold text-black">
                  Vehicle Photos
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {(vehicle.photos || []).map((photo, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full h-24 sm:h-24 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-2xs">
                      <img
                        src={photo.img}
                        alt={photo.label}
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-1.5 text-center">
                      {photo.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Bus Configuration & Layout Card (Only for Bus vehicles) */}
            {isBus && (
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 p-2 sm:p-2.5 shadow-2xs">
                    <img src={seatIcon} alt="Bus Configuration" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-[15px] sm:text-base font-bold text-black">
                    Bus Configuration
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 sm:gap-4 items-center pt-3">
                  {/* Left: Spec Table */}
                  <div className="sm:col-span-7 space-y-2 text-[13px] sm:text-sm">
                    {[
                      { label: 'Seat Configuration', value: vehicle.configuration?.seatConfiguration || '2 × 2' },
                      { label: 'Total Rows', value: vehicle.configuration?.totalRows || 9 },
                      { label: 'Left Side Seats (per row)', value: vehicle.configuration?.leftSideSeats || 2 },
                      { label: 'Right Side Seats (per row)', value: vehicle.configuration?.rightSideSeats || 2 },
                      { label: 'Aisle Position', value: vehicle.configuration?.aislePosition || 'Center' },
                      { label: 'Total Seating Capacity', value: vehicle.configuration?.totalSeatingCapacity || 36 },
                    ].map((item, idx) => (
                      <div key={idx} className="grid grid-cols-[minmax(140px,50%)_auto_1fr] sm:grid-cols-12 gap-2 items-start sm:items-center">
                        <span className="sm:col-span-7 text-slate-700 font-bold">{item.label}</span>
                        <span className="sm:col-span-1 text-slate-400">:</span>
                        <span className="sm:col-span-4 font-bold text-black break-words">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Right: Coach Seat Mini Layout Capsule */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center">
                    <div className="w-[120px] bg-slate-50 border border-slate-300 rounded-xl p-2.5 shadow-2xs flex flex-col items-center">
                      {/* Driver Top indicator */}
                      <div className="w-full flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-200 text-xs font-bold text-slate-700 px-1">
                        <span className="text-xs">🛞</span>
                        <span>Driver</span>
                      </div>

                      {/* 2x2 Mini Seat Matrix (5 rows shown symbolically) */}
                      <div className="space-y-1.5 w-full">
                        {[1, 2, 3, 4, 5].map((row) => (
                          <div key={row} className="flex items-center justify-between px-1">
                            {/* Left 2 seats */}
                            <div className="flex gap-1">
                              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                            </div>
                            {/* Aisle */}
                            <div className="w-2" />
                            {/* Right 2 seats */}
                            <div className="flex gap-1">
                              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                              <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-2">
                      2 × 2 (36 Seats)
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Vehicle Documents Table */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0 p-2 sm:p-2.5 shadow-2xs">
                  <img src={vehicleDocsIcon} alt="Vehicle Documents" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-[15px] sm:text-base font-bold text-black">
                  Vehicle Documents
                </h3>
              </div>

              {/* Added w-full & horizontal scroll safety */}
              <div className="overflow-x-auto w-full pt-2 scrollbar-hide sm:scrollbar-default">
                <table className="w-full text-left text-[13px] sm:text-sm font-bold min-w-[450px]">
                  <thead>
                    <tr className="text-xs text-slate-700 border-b border-slate-100">
                      <th className="py-2 px-3 text-center w-10 whitespace-nowrap">#</th>
                      <th className="py-2 px-3 whitespace-nowrap">Document Name</th>
                      <th className="py-2 px-3 whitespace-nowrap">Document</th>
                      <th className="py-2 px-3 text-right whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(vehicle.documents || []).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-xs text-slate-400 font-semibold">
                          No documents uploaded for this vehicle.
                        </td>
                      </tr>
                    ) : (
                      (vehicle.documents || []).map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-900">{doc.id}</td>
                          <td className="py-2.5 px-3 text-slate-900 font-bold whitespace-nowrap">{doc.name}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => doc.url && setPreviewDoc({ img: doc.url, title: doc.name })}
                              className="inline-flex items-center gap-1.5 text-blue-600 select-none cursor-pointer hover:underline"
                            >
                              <span className="w-5 h-5 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 border border-blue-100">
                                <Eye className="w-3 h-3" />
                              </span>
                              {doc.linkText}
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                              {doc.validity}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Lightbox Modal */}
      {previewDoc && (
        <div
          onClick={() => setPreviewDoc(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100">
              <h4 className="text-base font-black text-black">
                {previewDoc.title || 'Document Preview'}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewDoc.img, previewDoc.title)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Image */}
            <div className="flex items-center justify-center bg-slate-50/70 rounded-2xl overflow-hidden max-h-[75vh] p-2 border border-slate-100">
              <img
                src={previewDoc.img}
                alt={previewDoc.title || 'Document'}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}