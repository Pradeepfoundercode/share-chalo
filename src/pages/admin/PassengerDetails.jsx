import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  MoreVertical,
  Check,
  Calendar,
  User,
  Phone,
  UserCheck,
  Clock,
  XCircle,
  Wallet,
  MapPin,
  Car,
  Eye,
  CreditCard,
  Mail,
  AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { passengersList, passengerBookingHistory } from '../../data/passengersData';
import { getUserByIdApi, updateUserStatusApi } from '../../services/user.services';
import Pagination from '../../components/common/Pagination';
import DetailsHeader from '../../components/common/DetailsHeader';

// Assets
import totalBookingIcon from '../../assets/common/calender-yellow.svg';
import completedRidesIcon from '../../assets/common/completed-rides.svg';
import cancelledRidesIcon from '../../assets/common/blocked-cancelled.svg';
import totalAmountIcon from '../../assets/passengers/total-amount.svg';
import amitAvatar from '../../assets/common/amit_kumar_photo.png';
import { queryClient } from '../../utils/queryClient';

// Helper to format ISO date strings
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

export default function PassengerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  // Fetch passenger / user details via API
  const { data: userResponse, isLoading, isError } = useQuery({
    queryKey: ['admin-user-details', id],
    queryFn: () => getUserByIdApi(id),
    enabled: Boolean(id),
  });

  const apiUser = userResponse?.data || userResponse;

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) =>
      updateUserStatusApi({
        userId: passenger.userId || passenger.id || id,
        status: newStatus,
      }),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ['admin-user-details', id],
      });
      queryClient.invalidateQueries({
        queryKey: ['admin-users'],
      });
      toast.success(response?.message || 'Status updated successfully');
      setMenuOpen(false);
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err?.message || 'Failed to update status';
      toast.error(msg);
    },
  });

  const handleUpdateStatus = (newStatus) => {
    updateStatusMutation.mutate(newStatus);
  };

  // Fallback to mock data if API is offline
  const matchedPassenger = useMemo(() => {
    return passengersList.find((p) => String(p.id) === id || String(p.passengerId) === id);
  }, [id]);

  // Unified passenger model combining API data and fallback
  const passenger = useMemo(() => {
    if (apiUser && (apiUser.userId != null || apiUser.name)) {
      return {
        id: apiUser.userId,
        userId: apiUser.userId,
        passengerId: apiUser.userId,
        name: apiUser.name || 'Passenger',
        mobile: apiUser.mobile || '-',
        email: apiUser.email || '-',
        gender: apiUser.gender || '',
        avatar: apiUser.imageUrl || '',
        status: apiUser.status || 'active',
        profileStatus: apiUser.profileStatus || 'verified',
        isPhoneVerified: apiUser.isPhoneVerified ?? true,
        registeredOn: apiUser.registeredOn,
        memberSince: formatDisplayDate(apiUser.registeredOn),
        lastLoginAt: apiUser.lastLoginAt,
        lastLoginFormatted: formatDisplayDate(apiUser.lastLoginAt),
        emergencyContact: {
          name: apiUser.emergencyContact?.name || '-',
          phone: apiUser.emergencyContact?.mobile || apiUser.emergencyContact?.phone || '-',
        },
        totalBookings: apiUser.totalBookings ?? 0,
        completedRides: apiUser.completedRides ?? 0,
        cancelledRides: apiUser.cancelledRides ?? 0,
        totalSpent:
          apiUser.totalAmountSpent != null
            ? `₹ ${Number(apiUser.totalAmountSpent).toLocaleString('en-IN', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}`
            : '₹ 0',
      };
    }

    if (matchedPassenger) {
      return {
        ...matchedPassenger,
        userId: matchedPassenger.id,
        status: matchedPassenger.accountStatus || 'active',
        profileStatus: 'verified',
        isPhoneVerified: matchedPassenger.isPhoneVerified ?? true,
        lastLoginFormatted: '-',
        emergencyContact: {
          name: matchedPassenger.emergencyContact?.name || '-',
          phone: matchedPassenger.emergencyContact?.phone || '-',
        },
        totalSpent: matchedPassenger.totalSpent || '₹ 0',
      };
    }

    return null;
  }, [apiUser, matchedPassenger]);

  const [activeTab, setActiveTab] = useState('booking');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (passenger?.status) {
      setIsBlocked(passenger.status.toLowerCase() === 'blocked');
    }
  }, [passenger?.status]);

  const handleToggleBlock = (blockStatus) => {
    setIsBlocked(blockStatus);
    setMenuOpen(false);
  };

  // Booking history (separate API will be integrated in future)
  const bookingHistory = useMemo(() => {
    if (apiUser?.bookingHistory && Array.isArray(apiUser.bookingHistory)) {
      return apiUser.bookingHistory;
    }
    if (matchedPassenger) {
      return passengerBookingHistory;
    }
    return [];
  }, [apiUser, matchedPassenger]);

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * entriesPerPage;
    return bookingHistory.slice(start, start + entriesPerPage);
  }, [bookingHistory, currentPage, entriesPerPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
        <DetailsHeader
          title="Passenger Details"
          breadcrumbs={[
            { label: 'Passengers', path: '/passengers' },
            { label: 'Passenger Details' },
          ]}
        />
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-xs flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading passenger details...</p>
        </div>
      </div>
    );
  }

  // Error / Not found state
  if (isError && !passenger) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
        <DetailsHeader
          title="Passenger Details"
          breadcrumbs={[
            { label: 'Passengers', path: '/passengers' },
            { label: 'Passenger Details' },
          ]}
        />
        <div className="bg-white rounded-3xl p-16 border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800">Passenger not found</h3>
          <p className="text-xs text-slate-500">Could not fetch passenger data for ID {id}.</p>
          <button
            onClick={() => navigate('/passengers')}
            className="px-4 py-2 bg-[#fed011] hover:bg-amber-400 text-black font-bold rounded-xl text-xs cursor-pointer"
          >
            Back to Passengers
          </button>
        </div>
      </div>
    );
  }

  if (!passenger) return null;

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
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-in fade-in zoom-in-95">
                <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Update Status
                </p>

                {/* Set Active */}
                <button
                  type="button"
                  disabled={updateStatusMutation.isPending || passenger.status?.toLowerCase() === 'active'}
                  onClick={() => handleUpdateStatus('active')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    passenger.status?.toLowerCase() === 'active'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-emerald-700 hover:bg-emerald-50 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Set Active</span>
                  </div>
                  {passenger.status?.toLowerCase() === 'active' && (
                    <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
                  )}
                </button>

                {/* Set Inactive */}
                <button
                  type="button"
                  disabled={updateStatusMutation.isPending || passenger.status?.toLowerCase() === 'inactive'}
                  onClick={() => handleUpdateStatus('inactive')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    passenger.status?.toLowerCase() === 'inactive'
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-amber-700 hover:bg-amber-50 disabled:opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Set Inactive</span>
                  </div>
                  {passenger.status?.toLowerCase() === 'inactive' && (
                    <Check className="w-3.5 h-3.5 text-amber-700 stroke-[3]" />
                  )}
                </button>

                {updateStatusMutation.isPending && (
                  <div className="px-3 py-1 text-center border-t border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500">Updating status...</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch pr-14">
            {/* 1. Passenger Profile Info (col-span-5) */}
            <div className="md:col-span-5 flex items-start gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-100 border border-slate-200">
                <img
                  src={passenger.avatar}
                  alt={passenger.name}
                  className="w-full h-full object-cover select-none"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = amitAvatar;
                  }}
                />
              </div>
              <div className="space-y-1.5 min-w-0 pt-0.5">
                {/* Name + profileStatus badge */}
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold text-black leading-tight truncate">
                    {passenger.name}
                  </h2>
                  {passenger.profileStatus && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-200 capitalize shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3] text-emerald-700" />
                      {passenger.profileStatus}
                    </span>
                  )}
                </div>

                {/* Passenger ID */}
                <p className="text-sm font-bold text-black">
                  Passenger ID: {passenger.passengerId}
                </p>

                {/* Mobile Number + isPhoneVerified showing exact value (true / false) */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-black">
                    <Phone className="w-3.5 h-3.5 text-black stroke-[2.2]" />
                    {passenger.mobile}
                  </span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-bold border ${passenger.isPhoneVerified
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border-rose-200'
                      }`}
                  >
                    {String(passenger.isPhoneVerified)}
                  </span>
                </div>

                {/* Email without slate styling */}
                {passenger.email && passenger.email !== '-' && (
                  <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-bold text-black">
                    <Mail className="w-3.5 h-3.5 text-black stroke-[2.2]" />
                    <span className="truncate max-w-[240px]">{passenger.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Member Since & Last Login (col-span-4) */}
            <div className="md:col-span-4 flex items-center justify-start md:border-l border-slate-300 md:pl-5 my-1">
              <div className="flex items-start gap-3.5">
                <Calendar className="w-7 h-7 text-black stroke-[2.2] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Member Since</p>
                    <p className="text-sm sm:text-base font-bold text-black mt-0.5">
                      {passenger.memberSince}
                    </p>
                  </div>
                  {passenger.lastLoginFormatted && passenger.lastLoginFormatted !== '-' && (
                    <div className="pt-1 border-t border-slate-100">
                      <p className="text-[11px] font-semibold text-slate-500">Last Login: {passenger.lastLoginFormatted}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Account Status (col-span-3) */}
            <div className="md:col-span-3 flex items-center justify-start md:border-l border-slate-300 md:pl-5 my-1">
              <div className="flex items-center gap-3.5">
                <User className="w-7 h-7 text-black stroke-[2.2] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account Status</p>
                  <span
                    className={`inline-block px-3.5 py-0.5 rounded-full text-xs sm:text-sm font-bold border mt-1 capitalize ${
                      passenger.status?.toLowerCase() === 'blocked'
                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                        : passenger.status?.toLowerCase() === 'inactive'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-100/70 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {passenger.status}
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
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs sm:text-[13px] font-bold text-black">Contact Name</p>
                <p className="text-sm sm:text-base font-black text-black mt-0.5">
                  {passenger.emergencyContact?.name || '-'}
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
                  {passenger.emergencyContact?.phone || '-'}
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
                {passenger.totalBookings ?? 0}
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
                {passenger.completedRides ?? 0}
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
                {passenger.cancelledRides ?? 0}
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
                {passenger.totalSpent}
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
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer whitespace-nowrap ${activeTab === 'booking'
              ? 'bg-[#fed011] text-black shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
              }`}
          >
            <Calendar className="w-4 h-4 text-black stroke-[2.4]" />
            <span>Booking History</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap ${activeTab === 'payment'
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
                  {paginatedBookings.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-10 text-center text-slate-400 font-bold text-xs sm:text-sm">
                        No booking history records found for this passenger.
                      </td>
                    </tr>
                  ) : (
                    paginatedBookings.map((item, idx) => (
                      <tr
                        key={item.id || item.bookingId || idx}
                        className="hover:bg-slate-50/70 transition-colors text-slate-800"
                      >
                        {/* # */}
                        <td className="py-3 px-3 font-bold text-slate-500">
                          {(currentPage - 1) * entriesPerPage + idx + 1}
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
                              src={item.driverAvatar || amitAvatar}
                              alt={item.driverName}
                              className="w-6 h-6 rounded-full object-cover shrink-0 border border-slate-200"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = amitAvatar;
                              }}
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
                            className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${item.status === 'Completed'
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Reusable Pagination Component */}
            {bookingHistory.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={bookingHistory.length}
                itemsPerPage={entriesPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setEntriesPerPage}
                pageSizeOptions={[5, 10, 20]}
                itemLabel="bookings"
              />
            )}
          </div>
        ) : (
          /* Payment History Placeholder Tab */
          <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xs text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <CreditCard className="w-6 h-6 stroke-[2]" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Payment History</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Payment history records will appear here once the payment history API is integrated.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
