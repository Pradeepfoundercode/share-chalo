import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  Play,
  Calendar,
  Briefcase,
  Car,
  User,
  Phone,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  AlertTriangle,
  Route as RouteIcon,
  Clock,
  Armchair,
  Users,
  Coins,
  ChevronLeft,
  ChevronRight,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { rideDetailsData, ridesList } from '../../data/ridesData';
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';
import coachBusCutout from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
import paleYellowWavesBg from '../../assets/drivers/Pale Yellow Layered Waves.png';
import vehicleCarIcon from '../../assets/drivers/bus-vehicle.svg';
import briefcaseIcon from '../../assets/drivers/briefcase-icon.svg';

// Custom icons requested by user
import routeDetailsIcon from '../../assets/dashboard/akar-icons_location.svg';
import destinationIcon from '../../assets/dashboard/b526c866-7ce7-4c15-848e-ed8378b03085 36.svg';
import pickupIcon from '../../assets/dashboard/b526c866-7ce7-4c15-848e-ed8378b03085 38.svg';
import driverDetailsIcon from '../../assets/drivers/assigned-driver.svg';
import vehicleDetailsIcon from '../../assets/drivers/bus-vehicle.svg';
import addedStopIcon from '../../assets/dashboard/akar-icons_location.svg';
import selectedRouteIcon from '../../assets/dashboard/road-icon.svg';
import totalDistanceIcon from '../../assets/dashboard/opposite-arrows-icon.svg';
import estimatedDurationIcon from '../../assets/dashboard/clock-icon.svg';
import rideInfoIcon from '../../assets/dashboard/info-icon-transparent.svg';

// Newly requested icons by user
import totalSeatsIcon from '../../assets/drivers/seat-arrangement.svg';
import bookedSeatsIcon from '../../assets/dashboard/group-users-icon.svg';
import availableSeatsIcon from '../../assets/drivers/seat-icon.svg';
import farePerSeatIcon from '../../assets/drivers/b526c866-7ce7-4c15-848e-ed8378b03085 23.svg';
import totalRideFareIcon from '../../assets/dashboard/database-icon-transparent.svg';
import passengerListIcon from '../../assets/dashboard/Group (9).svg';
import cancelledByDriverIcon from '../../assets/dashboard/Group (10).svg';
import cancellationReasonIcon from '../../assets/dashboard/chat-message-icon-transparent.svg';
import cancellationDateTimeIcon from '../../assets/dashboard/72658f49-1c99-42c0-b972-a95bf219ed1e 9.svg';

import { useAuthStore } from '../../store/authStore';
import { Pagination, DetailsHeader } from '../../components/common';

export default function RideDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const admin = useAuthStore((state) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Resolve ride from list if id matches, otherwise default to rideDetailsData
  const matchedRide = ridesList.find((r) => r.rideId === id);
  const ride = matchedRide
    ? {
        ...rideDetailsData,
        rideId: matchedRide.rideId,
        status: matchedRide.status,
        date: matchedRide.date,
        time: matchedRide.time,
        vehicleType: matchedRide.vehicleType,
        usageType: matchedRide.usageType,
        vehicleImage:
          matchedRide.vehicleType === 'Car'
            ? carCutout
            : coachBusCutout,
        driver: {
          ...rideDetailsData.driver,
          name: matchedRide.driverName,
          avatar: matchedRide.driverAvatar,
        },
        vehicle: {
          ...rideDetailsData.vehicle,
          number: matchedRide.vehicleNumber,
          type: matchedRide.vehicleType,
          usage: matchedRide.usageType,
        },
      }
    : {
        ...rideDetailsData,
        vehicleImage:
          rideDetailsData.vehicleType === 'Car'
            ? carCutout
            : coachBusCutout,
      };

  return (
    <div className="space-y-4 select-none pb-12">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Ride Details"
        breadcrumbs={[
          { label: 'Rides', path: '/rides' },
          { label: 'Ride Details' },
        ]}
      />

      {/* =========================================================
          HERO BANNER CARD (Ride ID, Status, Date/Time, Vehicle Type)
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

        {/* Desktop & Tablet View (sm and above: nicely balanced spacing between sections) */}
        <div className="hidden sm:flex w-full px-5 py-4 lg:px-8 lg:py-5 items-center justify-start gap-8 md:gap-12 lg:gap-16 relative z-10">
          {/* Left Section: Vehicle Image + Ride ID + Status */}
          <div className="flex items-center gap-4 lg:gap-5 shrink-0">
            {/* Vehicle Image */}
            <div className="w-32 h-18 md:w-40 md:h-22 lg:w-48 lg:h-24 flex items-center justify-center shrink-0">
              <img
                src={ride.vehicleImage}
                alt="Vehicle Preview"
                className="max-w-full max-h-full object-contain select-none transition-transform hover:scale-105 drop-shadow-sm"
              />
            </div>

            {/* Ride ID and Status */}
            <div className="space-y-1">
              <p className="text-xs lg:text-[13px] font-bold text-slate-500 uppercase tracking-wider">
                Ride ID
              </p>
              <h2 className="text-2xl md:text-3xl lg:text-[32px] font-black text-black tracking-tight leading-none">
                {ride.rideId}
              </h2>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[13px] font-bold text-white bg-emerald-600 shadow-2xs">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                  <span>{ride.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Center Vertical Divider */}
          <div className="w-px h-12 lg:h-14 bg-slate-300/80 block shrink-0" />

          {/* Middle: Ride Date & Time */}
          <div className="flex items-center gap-3.5 shrink-0">
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-white/95 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
              <Calendar className="w-5.5 h-5.5 stroke-[2.2]" />
            </div>
            <div className="leading-snug">
              <p className="text-xs lg:text-[13px] font-bold text-slate-500">Ride Date & Time</p>
              <p className="text-base lg:text-lg font-black text-black whitespace-nowrap">{ride.date}, {ride.time}</p>
            </div>
          </div>

          {/* Center Vertical Divider */}
          <div className="w-px h-12 lg:h-14 bg-slate-300/80 block shrink-0" />

          {/* Right Section: Vehicle Type & Usage Pills (Stacked: Uper Neeche) */}
          <div className="flex flex-col items-start gap-2 lg:gap-2.5 shrink-0">
            {/* Vehicle Type Pill */}
            <span className="inline-flex items-center gap-2 text-[13px] lg:text-sm font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-2xs">
              <img src={vehicleCarIcon} alt={ride.vehicleType} className="w-4 h-4 object-contain shrink-0" />
              <span>{ride.vehicleType}</span>
            </span>

            {/* Usage Type Pill */}
            <span className="inline-flex items-center gap-2 text-[13px] lg:text-sm font-bold text-emerald-800 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-2xs">
              <img src={briefcaseIcon} alt={ride.usageType} className="w-4 h-4 object-contain shrink-0" />
              <span>{ride.usageType}</span>
            </span>
          </div>
        </div>

        {/* Mobile View (sm:hidden - clean stacked card matching VehicleDetails, zero overlap) */}
        <div className="sm:hidden w-full p-3 flex flex-col gap-2.5 relative z-10">
          {/* Top Row: Vehicle Image + Ride ID & Status */}
          <div className="flex items-center gap-3">
            <div className="w-20 h-14 flex items-center justify-center shrink-0">
              <img
                src={ride.vehicleImage}
                alt="Bus Preview"
                className="max-w-full max-h-full object-contain select-none drop-shadow-sm"
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Ride ID
              </p>
              <h2 className="text-lg font-black text-black tracking-tight leading-tight truncate">
                {ride.rideId}
              </h2>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-emerald-600 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <Play className="w-2.5 h-2.5 fill-white text-white" />
                  <span>{ride.status}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs">
                  <img src={vehicleCarIcon} alt={ride.vehicleType} className="w-3 h-3 object-contain shrink-0" />
                  <span>{ride.vehicleType}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shadow-2xs">
                  <img src={briefcaseIcon} alt={ride.usageType} className="w-3 h-3 object-contain shrink-0" />
                  <span>{ride.usageType}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="w-full h-px bg-slate-200/90" />

          {/* Bottom Row: Date & Time Info */}
          <div className="flex items-center gap-2 px-1">
            <div className="w-8 h-8 rounded-lg bg-white/95 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
              <Calendar className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="leading-tight">
              <p className="text-[10px] font-bold text-slate-500">Ride Date & Time</p>
              <p className="text-xs font-black text-black">{ride.date}, {ride.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 2: DRIVER DETAILS & VEHICLE DETAILS (2 Columns)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Left: Driver Details (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <img src={driverDetailsIcon} alt="Driver Details" className="w-6 h-6 object-contain" />
            </div>
            <h3 className="text-base sm:text-[17px] font-bold text-black">Driver Details</h3>
          </div>

          <div className="flex items-center gap-4 pt-0.5">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-15 h-15 rounded-full object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-black">
                  {ride.driver.name}
                </h4>
                {ride.driver.isKycVerified && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                    KYC Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-semibold text-slate-600">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{ride.driver.phone}</span>
              </div>
              <div className="text-xs sm:text-[13px] font-semibold text-slate-500">
                Driver ID: <span className="font-bold text-slate-800">{ride.driver.driverId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vehicle Details (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <img src={vehicleDetailsIcon} alt="Vehicle Details" className="w-6 h-6 object-contain" />
            </div>
            <h3 className="text-base sm:text-[17px] font-bold text-black">Vehicle Details</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs sm:text-sm pt-0.5">
            <div>
              <span className="text-slate-500 font-semibold text-xs">Vehicle Number :</span>
              <p className="font-bold text-slate-900 text-sm sm:text-[15px] mt-0.5">{ride.vehicle.number}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold text-xs">Brand :</span>
              <p className="font-bold text-slate-900 text-sm sm:text-[15px] mt-0.5">{ride.vehicle.brand}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold text-xs">Vehicle Type :</span>
              <p className="font-bold text-slate-900 text-sm sm:text-[15px] mt-0.5">{ride.vehicle.type}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold text-xs">Model :</span>
              <p className="font-bold text-slate-900 text-sm sm:text-[15px] mt-0.5">{ride.vehicle.model}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold text-xs">Usage Type :</span>
              <div className="mt-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                  {ride.vehicle.usage}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold text-xs">Seating Capacity :</span>
              <p className="font-bold text-slate-900 text-sm sm:text-[15px] mt-0.5">{ride.vehicle.seatingCapacity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 3: ROUTE DETAILS CARD
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <img src={routeDetailsIcon} alt="Route Details" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">Route Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Pickup & Destination with dotted route line */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <img src={pickupIcon} alt="Pickup Location" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Pickup Location</p>
                <p className="text-sm sm:text-[15px] font-bold text-slate-900 mt-0.5">{ride.route.pickup}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-slate-300 h-3.5 ml-2.5 -my-1" />

            <div className="flex items-start gap-3">
              <img src={destinationIcon} alt="Destination" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Destination</p>
                <p className="text-sm sm:text-[15px] font-bold text-slate-900 mt-0.5">{ride.route.destination}</p>
              </div>
            </div>
          </div>

          {/* Selected Route & Added Stops */}
          <div className="space-y-2.5 md:pl-4">
            <div className="flex items-start gap-2.5">
              <img src={selectedRouteIcon} alt="Selected Route" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Selected Route</p>
                <p className="text-xs sm:text-[13.5px] font-bold text-slate-900 mt-0.5">
                  {ride.route.selectedRoute}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <img src={addedStopIcon} alt="Added Stops" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Added Stops ({ride.route.addedStops.length})
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {ride.route.addedStops.map((stop) => (
                    <span
                      key={stop}
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-800"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Distance & Duration */}
          <div className="space-y-2.5 md:pl-4">
            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <img src={totalDistanceIcon} alt="Total Distance" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Distance</p>
                <p className="text-sm sm:text-[15px] font-bold text-slate-900 mt-0.5">{ride.route.totalDistance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <img src={estimatedDurationIcon} alt="Estimated Duration" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Estimated Duration</p>
                <p className="text-sm sm:text-[15px] font-bold text-slate-900 mt-0.5">{ride.route.estimatedDuration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 4: RIDE INFORMATION (5 STATS PILLS)
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <img src={rideInfoIcon} alt="Ride Information" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">Ride Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-0.5">
          {/* Total Seats */}
          <div className="bg-[#fffdf2] rounded-xl p-2.5 sm:p-3 border border-amber-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <img src={totalSeatsIcon} alt="Total Seats" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Total Seats</p>
              <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">{ride.info.totalSeats}</h4>
            </div>
          </div>

          {/* Booked Seats */}
          <div className="bg-[#f0fdf4] rounded-xl p-2.5 sm:p-3 border border-emerald-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
              <img src={bookedSeatsIcon} alt="Booked Seats" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Booked Seats</p>
              <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">{ride.info.bookedSeats}</h4>
            </div>
          </div>

          {/* Available Seats */}
          <div className="bg-[#eff6ff] rounded-xl p-2.5 sm:p-3 border border-blue-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <img src={availableSeatsIcon} alt="Available Seats" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Available Seats</p>
              <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">{ride.info.availableSeats}</h4>
            </div>
          </div>

          {/* Fare Per Seat */}
          <div className="bg-[#faf5ff] rounded-xl p-2.5 sm:p-3 border border-purple-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
              <img src={farePerSeatIcon} alt="Fare Per Seat" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Fare Per Seat</p>
              <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">₹ {ride.info.farePerSeat}</h4>
            </div>
          </div>

          {/* Total Ride Fare */}
          <div className="bg-[#fffdf2] rounded-xl p-2.5 sm:p-3 border border-amber-300/80 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-amber-200 flex items-center justify-center shrink-0">
              <img src={totalRideFareIcon} alt="Total Ride Fare" className="w-6 h-6 object-contain" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-600">Total Ride Fare</p>
              <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">₹ {ride.info.totalRideFare.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 5: PASSENGER LIST (28) TABLE
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <img src={passengerListIcon} alt="Passenger List" className="w-5 h-5 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">
            Passenger List ({ride.passengers.length})
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-10 whitespace-nowrap">#</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Booking ID</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Passenger Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Mobile Number</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Seat No.</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Booking Status</th>
                  <th className="py-2.5 px-3 pr-4 text-center whitespace-nowrap">OTP Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] font-bold text-slate-700">
                {ride.passengers.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. Index */}
                    <td className="py-2.5 px-3 pl-4 text-center text-slate-900 font-bold whitespace-nowrap">
                      {index + 1}
                    </td>

                    {/* 2. Booking ID */}
                    <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                      {p.bookingId}
                    </td>

                    {/* 3. Passenger Avatar & Name */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <img
                          src={p.avatar}
                          alt={p.name}
                          className="w-7 h-7 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                        />
                        <span className="font-bold text-slate-900">{p.name}</span>
                      </div>
                    </td>

                    {/* 4. Mobile Number */}
                    <td className="py-2.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                      {p.phone}
                    </td>

                    {/* 5. Seat No. */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                      {p.seatNo}
                    </td>

                    {/* 6. Booking Status */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {p.bookingStatus}
                      </span>
                    </td>

                    {/* 7. OTP Verification */}
                    <td className="py-2.5 px-3 pr-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                        <CheckCircle2 className="w-3 h-3 fill-emerald-600 text-white" />
                        {p.otpVerification}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer (Reusable Component) */}
          <Pagination
            currentPage={currentPage}
            totalItems={28}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setEntriesPerPage}
            pageSizeOptions={[5, 10, 20]}
            itemLabel="passengers"
          />
        </div>
      </div>

      {/* =========================================================
          ROW 6: CANCELLATION DETAILS (Red Tinted Box)
          ========================================================= */}
      <div className="bg-[#fff8f8] rounded-2xl border border-rose-200/80 shadow-2xs p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <XCircle className="w-4 h-4 stroke-[2.3]" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">Cancellation Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 divide-y sm:divide-y-0 sm:divide-x divide-rose-100">
          {/* Cancelled By */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
              <img src={cancelledByDriverIcon} alt="Cancelled By" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Cancelled By</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {ride.cancellation.cancelledBy}
              </p>
            </div>
          </div>

          {/* Cancellation Reason */}
          <div className="flex items-center gap-3 sm:pl-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
              <img src={cancellationReasonIcon} alt="Cancellation Reason" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Cancellation Reason</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {ride.cancellation.reason}
              </p>
            </div>
          </div>

          {/* Cancellation Date & Time */}
          <div className="flex items-center gap-3 sm:pl-4">
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
              <img src={cancellationDateTimeIcon} alt="Cancellation Date & Time" className="w-5 h-5 object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Cancellation Date & Time</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {ride.cancellation.dateTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

