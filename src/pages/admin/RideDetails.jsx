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
import { rideDetailsData } from '../../data/ridesData';
import busHeroBanner from '../../assets/bus_hero_banner.png';
import { useAuthStore } from '../../store/authStore';
import Pagination from '../../components/common/Pagination';

export default function RideDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const admin = useAuthStore((state) => state.admin);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const ride = rideDetailsData;

  return (
    <div className="space-y-4 select-none pb-12">
      {/* =========================================================
          TOP BREADCRUMB & HEADER BAR
          ========================================================= */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => navigate('/rides')}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-800 transition-colors cursor-pointer"
            title="Back to Rides"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          </button>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              Ride Details
            </h1>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-0.5">
              <span
                onClick={() => navigate('/rides')}
                className="hover:text-amber-600 cursor-pointer"
              >
                Rides
              </span>
              <span>›</span>
              <span className="text-slate-800 font-bold">Ride Details</span>
            </div>
          </div>
        </div>

        {/* Right Header Admin Profile & Notifications */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5 text-slate-700 stroke-[2.2]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-sm font-bold text-slate-900">
                {admin?.name || 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          HERO BANNER CARD (Ride ID, Status, Date/Time, Vehicle Type)
          ========================================================= */}
      <div className="relative rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden p-4 sm:p-5">
        {/* Subtle background wave banner */}
        <div className="absolute inset-y-0 right-0 w-2/5 pointer-events-none opacity-20">
          <img
            src={busHeroBanner}
            alt="Hero Background"
            className="w-full h-full object-cover object-right"
          />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Bus Cutout + Ride ID & Status */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-36 h-20 sm:w-44 sm:h-22 bg-slate-50/70 border border-slate-100 rounded-xl p-1 flex items-center justify-center shrink-0">
              <img
                src={ride.vehicleImage}
                alt="Bus Preview"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ride ID
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {ride.rideId}
              </h2>
              <div className="mt-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-emerald-700 shadow-2xs">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                  {ride.status}
                </span>
              </div>
            </div>
          </div>

          {/* Middle: Ride Date & Time */}
          <div className="flex items-center gap-3 px-4 py-2 border-y lg:border-y-0 lg:border-x border-slate-200/80">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">
                Ride Date & Time
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-900">
                {ride.date}, {ride.time}
              </p>
            </div>
          </div>

          {/* Right: Vehicle & Usage Badges */}
          <div className="flex flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-xs font-bold">
              <Car className="w-4 h-4 stroke-[2.2]" />
              <span>{ride.vehicleType}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800 text-xs font-bold">
              <Briefcase className="w-4 h-4 stroke-[2.2]" />
              <span>{ride.usageType}</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 2: DRIVER DETAILS & VEHICLE DETAILS (2 Columns)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Driver Details (col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2.3]" />
            </div>
            <h3 className="text-base font-bold text-black">Driver Details</h3>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base sm:text-lg font-bold text-black">
                  {ride.driver.name}
                </h4>
                {ride.driver.isKycVerified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                    <CheckCircle2 className="w-3 h-3 fill-emerald-600 text-white" />
                    KYC Verified
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{ride.driver.phone}</span>
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Driver ID: <span className="font-bold text-slate-700">{ride.driver.driverId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Vehicle Details (col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Car className="w-4 h-4 stroke-[2.3]" />
            </div>
            <h3 className="text-base font-bold text-black">Vehicle Details</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4 text-xs sm:text-[13px] pt-1">
            <div>
              <span className="text-slate-500 font-semibold">Vehicle Number :</span>
              <p className="font-bold text-slate-900 mt-0.5">{ride.vehicle.number}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Brand :</span>
              <p className="font-bold text-slate-900 mt-0.5">{ride.vehicle.brand}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Vehicle Type :</span>
              <p className="font-bold text-slate-900 mt-0.5">{ride.vehicle.type}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Model :</span>
              <p className="font-bold text-slate-900 mt-0.5">{ride.vehicle.model}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Usage Type :</span>
              <div className="mt-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                  {ride.vehicle.usage}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Seating Capacity :</span>
              <p className="font-bold text-slate-900 mt-0.5">{ride.vehicle.seatingCapacity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 3: ROUTE DETAILS CARD
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <MapPin className="w-4 h-4 stroke-[2.3]" />
          </div>
          <h3 className="text-base font-bold text-black">Route Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Pickup & Destination with dotted route line */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full border-3 border-emerald-500 bg-white mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Pickup Location</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.pickup}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-slate-300 h-4 ml-1.5 -my-1" />

            <div className="flex items-start gap-3">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Destination</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.destination}</p>
              </div>
            </div>
          </div>

          {/* Selected Route & Added Stops */}
          <div className="space-y-3 md:pl-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Selected Route</p>
                <p className="text-xs sm:text-[13px] font-bold text-slate-900 mt-0.5">
                  {ride.route.selectedRoute}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Added Stops ({ride.route.addedStops.length})
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  {ride.route.addedStops.map((stop) => (
                    <span
                      key={stop}
                      className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700"
                    >
                      {stop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Distance & Duration */}
          <div className="space-y-3 md:pl-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <RouteIcon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Distance</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.totalDistance}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Estimated Duration</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.estimatedDuration}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 4: RIDE INFORMATION (5 STATS PILLS)
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Armchair className="w-4 h-4 stroke-[2.3]" />
          </div>
          <h3 className="text-base font-bold text-black">Ride Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-1">
          {/* Total Seats */}
          <div className="bg-[#fffdf2] rounded-xl p-3 border border-amber-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Armchair className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600">Total Seats</p>
              <h4 className="text-lg font-bold text-black mt-0.5">{ride.info.totalSeats}</h4>
            </div>
          </div>

          {/* Booked Seats */}
          <div className="bg-[#f0fdf4] rounded-xl p-3 border border-emerald-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600">Booked Seats</p>
              <h4 className="text-lg font-bold text-black mt-0.5">{ride.info.bookedSeats}</h4>
            </div>
          </div>

          {/* Available Seats */}
          <div className="bg-[#eff6ff] rounded-xl p-3 border border-blue-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Armchair className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600">Available Seats</p>
              <h4 className="text-lg font-bold text-black mt-0.5">{ride.info.availableSeats}</h4>
            </div>
          </div>

          {/* Fare Per Seat */}
          <div className="bg-[#faf5ff] rounded-xl p-3 border border-purple-200/70 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold text-base">
              ₹
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600">Fare Per Seat</p>
              <h4 className="text-lg font-bold text-black mt-0.5">₹ {ride.info.farePerSeat}</h4>
            </div>
          </div>

          {/* Total Ride Fare */}
          <div className="bg-[#fffdf2] rounded-xl p-3 border border-amber-300/80 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
            <div className="w-10 h-10 rounded-lg bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-600">Total Ride Fare</p>
              <h4 className="text-lg font-bold text-black mt-0.5">₹ {ride.info.totalRideFare.toLocaleString()}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 5: PASSENGER LIST (28) TABLE
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-slate-900">
          <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
            <Users className="w-4 h-4 stroke-[2.3]" />
          </div>
          <h3 className="text-base font-bold text-black">
            Passenger List ({ride.passengers.length})
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-10">#</th>
                  <th className="py-2.5 px-3">Booking ID</th>
                  <th className="py-2.5 px-3">Passenger Name</th>
                  <th className="py-2.5 px-3">Mobile Number</th>
                  <th className="py-2.5 px-3 text-center">Seat No.</th>
                  <th className="py-2.5 px-3 text-center">Booking Status</th>
                  <th className="py-2.5 px-3 pr-4 text-center">OTP Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] font-bold text-slate-700">
                {ride.passengers.map((p, index) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* 1. Index */}
                    <td className="py-2.5 px-3 pl-4 text-center text-slate-900 font-bold">
                      {index + 1}
                    </td>

                    {/* 2. Booking ID */}
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {p.bookingId}
                    </td>

                    {/* 3. Passenger Avatar & Name */}
                    <td className="py-2.5 px-3">
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
                    <td className="py-2.5 px-3 text-slate-800 font-medium">
                      {p.phone}
                    </td>

                    {/* 5. Seat No. */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                      {p.seatNo}
                    </td>

                    {/* 6. Booking Status */}
                    <td className="py-2.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {p.bookingStatus}
                      </span>
                    </td>

                    {/* 7. OTP Verification */}
                    <td className="py-2.5 px-3 pr-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
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
      <div className="bg-[#fff8f8] rounded-2xl border border-rose-200/80 shadow-2xs p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2 text-rose-600">
          <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
            <XCircle className="w-4 h-4 stroke-[2.3]" />
          </div>
          <h3 className="text-base font-bold text-black">Cancellation Details</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 divide-y sm:divide-y-0 sm:divide-x divide-rose-100">
          {/* Cancelled By */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              <User className="w-4.5 h-4.5" />
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
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="w-4.5 h-4.5" />
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
            <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 text-slate-700 flex items-center justify-center shrink-0 shadow-2xs">
              <Calendar className="w-4.5 h-4.5" />
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

