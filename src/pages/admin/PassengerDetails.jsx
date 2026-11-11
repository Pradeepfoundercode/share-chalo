import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  MoreVertical,
  Check,
  Calendar,
  User,
  Phone,
  Ban,
  UserCheck,
  Clock,
  XCircle,
  Wallet,
  MapPin,
  Car,
  Eye,
  CreditCard
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { passengersList, passengerBookingHistory } from '../../data/passengersData';
import Pagination from '../../components/common/Pagination';

export default function PassengerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  const matchedPassenger =
    passengersList.find((p) => String(p.id) === id || p.passengerId === id);

  const passenger = matchedPassenger || passengersList[1]; // fallback Priya Sharma

  const [activeTab, setActiveTab] = useState('booking');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [isBlocked, setIsBlocked] = useState(passenger.accountStatus === 'Blocked');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggleBlock = (blockStatus) => {
    setIsBlocked(blockStatus);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          TOP NAV BAR: Header (Passenger Details / Passengers > Passenger Details)
          ========================================================= */}
      <div className="flex items-center justify-between pb-4 pt-1">
        {/* Left: Back Arrow + Page Title + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/passengers')}
            className="p-1 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer text-slate-900"
            title="Back to Passengers"
          >
            <ArrowLeft className="w-5 h-5 text-black stroke-[2.4]" />
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-black leading-tight tracking-tight">
              Passenger Details
            </h1>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              Passengers &nbsp;&gt;&nbsp;{' '}
              <span className="text-slate-700">Passenger Details</span>
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

      <div className="space-y-4">
        {/* =========================================================
            TOP PROFILE CARD (3 Sub-Sections)
            ========================================================= */}
        <div className="bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs relative">
          {/* Three-dot Action Menu with Dropdown */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-black cursor-pointer transition-colors"
              title="More Actions"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-30 space-y-1">
                <button
                  onClick={() => handleToggleBlock(true)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isBlocked
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-rose-600 hover:bg-rose-50'
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  <span>Block Passenger</span>
                </button>

                <button
                  onClick={() => handleToggleBlock(false)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    !isBlocked
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'text-emerald-600 hover:bg-emerald-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Unblock Passenger</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* 1. Passenger Profile Info (col-span-6) */}
            <div className="lg:col-span-6 flex items-center gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-100">
                <img
                  src={passenger.avatar}
                  alt={passenger.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight truncate">
                  {passenger.name}
                </h2>
                <p className="text-xs sm:text-[13px] font-bold text-slate-600">
                  Passenger ID: {passenger.passengerId}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs sm:text-[13px] font-bold text-slate-800">
                    {passenger.mobile}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    <Check className="w-3 h-3 stroke-[3]" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Member Since & Account Status (col-span-6) */}
            <div className="lg:col-span-6 flex items-center gap-8 lg:border-l border-slate-100 lg:pl-8">
              {/* Member Since */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Member Since</p>
                  <p className="text-xs sm:text-sm font-black text-black">
                    {passenger.memberSince || '01 Nov 2026'}
                  </p>
                </div>
              </div>

              {/* Account Status */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Account Status</p>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border mt-0.5 ${
                      isBlocked
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}
                  >
                    {isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            EMERGENCY CONTACT DETAILS BANNER (Yellow accent)
            ========================================================= */}
        <div className="bg-[#feea98]/50 border border-amber-200/80 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left Title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-400/80 rounded-xl text-black">
              <Phone className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h3 className="text-sm font-black text-black">
              Emergency Contact Details
            </h3>
          </div>

          {/* Right Details: Contact Name & Contact Number */}
          <div className="flex flex-wrap items-center gap-6 md:gap-12 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/70 rounded-lg text-slate-700">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-600">Contact Name</p>
                <p className="font-black text-black">
                  {passenger.emergencyContact?.name || 'Rahul Sharma'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/70 rounded-lg text-slate-700">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-600">Contact Number</p>
                <p className="font-black text-black">
                  {passenger.emergencyContact?.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            STATS ROW: 4 Summary Cards
            ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Total Bookings */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Bookings</p>
              <h3 className="text-xl font-black text-black leading-tight mt-0.5">
                {passenger.totalBookings || 24}
              </h3>
            </div>
          </div>

          {/* 2. Completed Rides */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Completed Rides</p>
              <h3 className="text-xl font-black text-black leading-tight mt-0.5">
                {passenger.completedRides || 22}
              </h3>
            </div>
          </div>

          {/* 3. Cancelled Rides */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Cancelled Rides</p>
              <h3 className="text-xl font-black text-black leading-tight mt-0.5">
                {passenger.cancelledRides || 2}
              </h3>
            </div>
          </div>

          {/* 4. Total Amount Spent */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-indigo-100/70 text-indigo-600 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Amount Spent</p>
              <h3 className="text-xl font-black text-black leading-tight mt-0.5">
                {passenger.totalSpent || '₹ 5,860'}
              </h3>
            </div>
          </div>
        </div>

        {/* =========================================================
            TABS: Booking History vs Payment History
            ========================================================= */}
        <div className="flex items-center gap-2 pt-1 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('booking')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'booking'
                ? 'bg-[#fed011] text-black shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
            }`}
          >
            <Calendar className="w-4 h-4 text-black stroke-[2.4]" />
            <span>Booking History</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-[#fed011] text-black font-black shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/70 font-bold'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-800 stroke-[2.2]" />
            <span>Payment History</span>
          </button>
        </div>

        {/* =========================================================
            BOOKING HISTORY DATA TABLE (Matching Exact Columns)
            ========================================================= */}
        {activeTab === 'booking' ? (
          <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#feea98]/60 text-slate-900 font-black rounded-2xl border-y border-amber-200/60">
                    <th className="py-3 px-3 rounded-l-xl">#</th>
                    <th className="py-3 px-3">Booking ID</th>
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Travel Date &amp; Time</th>
                    <th className="py-3 px-3">Driver</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3 text-center">Seats</th>
                    <th className="py-3 px-3">Fare</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3 rounded-r-xl text-center">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {passengerBookingHistory.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors text-slate-800"
                    >
                      {/* # */}
                      <td className="py-3 px-3 font-bold text-slate-500">
                        {item.id}
                      </td>

                      {/* Booking ID */}
                      <td className="py-3 px-3 font-black text-black whitespace-nowrap">
                        {item.bookingId}
                      </td>

                      {/* Route */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{item.from}</span>
                          <span className="text-slate-400 font-normal">→</span>
                          <span>{item.to}</span>
                        </div>
                      </td>

                      {/* Travel Date & Time */}
                      <td className="py-3 px-3 font-medium text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.travelDateTime}</span>
                        </div>
                      </td>

                      {/* Driver: Avatar + Name */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.driverAvatar}
                            alt={item.driverName}
                            className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
                          />
                          <span className="font-bold text-black text-xs">
                            {item.driverName}
                          </span>
                        </div>
                      </td>

                      {/* Vehicle Plate with Car Icon */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
                          <Car className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          <span>{item.vehiclePlate}</span>
                        </div>
                      </td>

                      {/* Seats */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900">
                        {item.seats}
                      </td>

                      {/* Fare */}
                      <td className="py-3 px-3 font-black text-black whitespace-nowrap">
                        {item.fare}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              : 'bg-rose-50 text-rose-600 border-rose-100'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            <Pagination
              currentPage={currentPage}
              totalItems={passengerBookingHistory.length}
              itemsPerPage={entriesPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setEntriesPerPage}
              pageSizeOptions={[5, 10, 20]}
              itemLabel="bookings"
            />
          </div>
        ) : (
          /* Payment History Placeholder Tab */
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs text-center text-slate-500 font-bold">
            Payment History records will appear here.
          </div>
        )}
      </div>
    </div>
  );
}

