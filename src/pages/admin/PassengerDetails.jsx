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
import { Pagination, DetailsHeader } from '../../components/common';

// Assets
import totalBookingIcon from '../../assets/dashboard/calender-yellow.svg';
import completedRidesIcon from '../../assets/dashboard/completed-rides.svg';
import cancelledRidesIcon from '../../assets/drivers/blocked-cancelled.svg';
import totalAmountIcon from '../../assets/drivers/total-amount.svg';

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
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Passenger Details"
        breadcrumbs={[
          { label: 'Passengers', path: '/passengers' },
          { label: 'Passenger Details' },
        ]}
      />

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

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch pr-14">
            {/* 1. Passenger Profile Info (col-span-5) */}
            <div className="lg:col-span-5 flex items-start gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-100 border border-slate-200">
                <img
                  src={passenger.avatar}
                  alt={passenger.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>
              <div className="space-y-1.5 min-w-0 pt-0.5">
                <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight truncate">
                  {passenger.name}
                </h2>
                <p className="text-sm font-bold text-black">
                  Passenger ID: {passenger.passengerId}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="flex items-center gap-1.5 text-sm font-bold text-black">
                    <Phone className="w-4 h-4 text-black stroke-[2.2]" />
                    {passenger.mobile}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Member Since (col-span-3) */}
            <div className="lg:col-span-3 flex items-center justify-start lg:border-l border-slate-300 lg:pl-5 my-1">
              <div className="flex items-center gap-3.5">
                <Calendar className="w-7 h-7 text-black stroke-[2.2] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-black">Member Since</p>
                  <p className="text-sm sm:text-base font-bold text-black mt-0.5">
                    {passenger.memberSince || '01 Nov 2026'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Account Status (col-span-4) */}
            <div className="lg:col-span-4 flex items-center justify-start lg:border-l border-slate-300 lg:pl-5 my-1">
              <div className="flex items-center gap-3.5">
                <User className="w-7 h-7 text-black stroke-[2.2] shrink-0" />
                <div>
                  <p className="text-sm font-bold text-black">Account Status</p>
                  <span
                    className={`inline-block px-3.5 py-0.5 rounded-full text-xs sm:text-sm font-bold border mt-0.5 ${
                      isBlocked
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : 'bg-emerald-100/70 text-emerald-700 border-emerald-200'
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
            EMERGENCY CONTACT DETAILS BANNER (Single Card with 3 Equal Sections & Divider Lines)
            ========================================================= */}
        <div className="bg-[#feea98]/50 border border-amber-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {/* 1. Emergency Contact Details Title */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-400 text-black rounded-xl shrink-0 shadow-2xs">
                <Phone className="w-5 h-5 stroke-[2.4]" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-black leading-tight">
                Emergency Contact Details
              </h3>
            </div>

            {/* 2. Contact Name */}
            <div className="flex items-center gap-3.5 md:border-l border-amber-300/80 md:pl-6">
              <div className="p-2 bg-white/80 rounded-xl text-black shrink-0 shadow-2xs border border-amber-200/60">
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs sm:text-[13px] font-bold text-black">Contact Name</p>
                <p className="text-sm sm:text-base font-black text-black mt-0.5">
                  {passenger.emergencyContact?.name || 'Rahul Sharma'}
                </p>
              </div>
            </div>

            {/* 3. Contact Number */}
            <div className="flex items-center gap-3.5 md:border-l border-amber-300/80 md:pl-6">
              <div className="p-2 bg-white/80 rounded-xl text-black shrink-0 shadow-2xs border border-amber-200/60">
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs sm:text-[13px] font-bold text-black">Contact Number</p>
                <p className="text-sm sm:text-base font-black text-black mt-0.5">
                  {passenger.emergencyContact?.phone || '+91 98765 43210'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            STATS ROW: 4 Summary Cards
            ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Total Bookings */}
          <div className="bg-[#fffdf0] rounded-2xl py-3 px-3.5 sm:px-4 border border-amber-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#fef3c7] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
              <img src={totalBookingIcon} alt="Total Bookings" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-black truncate">Total Bookings</p>
              <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
                {passenger.totalBookings || 24}
              </h3>
            </div>
          </div>

          {/* 2. Completed Rides */}
          <div className="bg-[#f0fdf4] rounded-2xl py-3 px-3.5 sm:px-4 border border-emerald-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#dcfce7] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
              <img src={completedRidesIcon} alt="Completed Rides" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-black truncate">Completed Rides</p>
              <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
                {passenger.completedRides || 22}
              </h3>
            </div>
          </div>

          {/* 3. Cancelled Rides */}
          <div className="bg-[#fff1f2] rounded-2xl py-3 px-3.5 sm:px-4 border border-rose-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#ffe4e6] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
              <img src={cancelledRidesIcon} alt="Cancelled Rides" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-black truncate">Cancelled Rides</p>
              <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
                {passenger.cancelledRides || 2}
              </h3>
            </div>
          </div>

          {/* 4. Total Amount Spent */}
          <div className="bg-[#faf5ff] rounded-2xl py-3 px-3.5 sm:px-4 border border-purple-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#f3e8ff] flex items-center justify-center shrink-0 p-1.5 shadow-2xs">
              <img src={totalAmountIcon} alt="Total Amount Spent" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] font-bold text-black truncate">Total Amount Spent</p>
              <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'booking'
                ? 'bg-[#fed011] text-black shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-50  font-bold'
            }`}
          >
            <Calendar className="w-4 h-4 text-black stroke-[2.4]" />
            <span>Booking History</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'payment'
                ? 'bg-[#fed011] text-black font-bold shadow-xs'
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
                  <tr className="bg-[#feea98]/60 text-slate-900 font-bold rounded-2xl border-y border-amber-200/60">
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
                      <td className="py-3 px-3 font-bold text-black whitespace-nowrap">
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
                      <td className="py-3 px-3 font-bold text-black whitespace-nowrap">
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

