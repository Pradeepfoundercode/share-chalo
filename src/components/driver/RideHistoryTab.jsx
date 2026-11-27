import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  ChevronDown,
  Eye,
  MapPin,
  Car,
  Users,
  Check,
  Loader2,
  AlertCircle,
  RotateCcw
} from 'lucide-react';

import totalRidesIcon from '../../assets/common/car-yellow.svg';
import totalPassengersIcon from '../../assets/common/passengers-orange.svg';
import totalEarningsIcon from '../../assets/drivers/rupee-symbol-transparent.svg';
import lastRideIcon from '../../assets/common/calender-yellow.svg';

import { getDriverRideHistoryApi } from '../../services/driver.services';
import Pagination from '../common/Pagination';

export default function RideHistoryTab({ driver }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const driverId = driver?.id || id;

  const [statusFilter, setStatusFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  // ========================================
  // GET DRIVER RIDE HISTORY API (React Query)
  // ========================================
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['driver-ride-history', driverId, currentPage, entriesPerPage, statusFilter],
    queryFn: () =>
      getDriverRideHistoryApi(driverId, {
        page: currentPage,
        limit: entriesPerPage,
        status: statusFilter,
      }),
    enabled: Boolean(driverId),
  });

  const apiData = responseData?.data;
  const summary = apiData?.summary;
  const rides = apiData?.rides || [];
  const meta = responseData?.meta;
  const totalItems = meta?.total ?? rides.length;

  // Format date helper
  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const dateFormatted = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const timeFormatted = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return `${dateFormatted}, ${timeFormatted}`;
    } catch {
      return dateStr;
    }
  };

  // Status badge helper
  const renderStatusBadge = (status) => {
    const s = (status || '').toLowerCase().replace(/_/g, ' ');
    if (s === 'completed') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 capitalize">
          Completed
        </span>
      );
    }
    if (s === 'in progress') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-600 border border-sky-100 capitalize">
          In Progress
        </span>
      );
    }
    if (s === 'cancelled' || s === 'canceled') {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 capitalize">
          Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 capitalize">
        {status || 'Upcoming'}
      </span>
    );
  };

  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const currentFilterLabel =
    filterOptions.find((o) => o.value === statusFilter)?.label || 'All Status';

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* =========================================================
          TOP ROW: 4 Summary Stats Cards
          ========================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Rides */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 items-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2">
            <img src={totalRidesIcon} alt="Total Rides" className="w-6 h-6 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black">Total Rides</p>
            <h3 className="text-[17px] sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {isLoading ? '...' : (summary?.totalRides ?? 0)}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Passengers */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 items-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 p-1">
            <img src={totalPassengersIcon} alt="Total Passengers" className="w-7 h-7 sm:w-11 sm:h-11 object-contain" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black">Total Passengers</p>
            <h3 className="text-[17px] sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {isLoading ? '...' : (summary?.totalPassengers ?? 0).toLocaleString('en-IN')}
            </h3>
          </div>
        </div>

        {/* Card 3: Total Earnings */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 items-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 p-2 sm:p-3.5">
            <img src={totalEarningsIcon} alt="Total Earnings" className="w-4 h-4 sm:w-6 sm:h-6 object-contain" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black">Total Earnings</p>
            <h3 className="text-[17px] sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {isLoading
                ? '...'
                : `₹${Number(summary?.totalEarnings ?? 0).toLocaleString('en-IN')}`}
            </h3>
          </div>
        </div>

        {/* Card 4: Last Ride */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 items-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2">
            <img src={lastRideIcon} alt="Last Ride" className="w-6 h-6 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black">Last Ride</p>
            <h3 className="text-[13px] sm:text-[15px] font-bold text-black leading-snug mt-0.5 break-words">
              {isLoading
                ? '...'
                : summary?.lastRide?.rideDateTime
                ? formatDateTime(summary.lastRide.rideDateTime)
                : typeof summary?.lastRide === 'string'
                ? formatDateTime(summary.lastRide)
                : '-'}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          TABLE CONTAINER: Ride History Table + Filter Dropdown
          ========================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
        {/* Table Top Header: Title + Filter Button */}
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[15px] sm:text-lg font-bold text-black">
            Ride History
          </h3>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] sm:text-sm font-bold text-slate-800 cursor-pointer shadow-2xs transition-all"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
              <span>{currentFilterLabel}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 ml-0.5 sm:ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-lg p-1.5 z-20 space-y-1">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setCurrentPage(1);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      statusFilter === option.value
                        ? 'bg-[#fed011] text-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto no-scrollbar pb-2">
          <table className="w-full min-w-[1050px] text-left text-sm sm:text-[15px] whitespace-nowrap">
            {/* Table Header: Yellow Banner */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-bold rounded-2xl border-y border-amber-200/60 text-[13px] sm:text-base">
                <th className="py-2.5 px-3 sm:px-4 rounded-l-xl font-bold">#</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Ride ID</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">From</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">To</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Route</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Trip Date &amp; Time</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold text-center">Passengers</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Fare</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Status</th>
                <th className="py-2.5 px-3 sm:px-4 rounded-r-xl font-bold text-center">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-500 font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#fed011]" />
                      <span>Loading ride history...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-rose-500">
                      <AlertCircle className="w-6 h-6" />
                      <p className="text-sm font-bold">
                        {error?.response?.data?.message || 'Failed to load ride history'}
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : rides.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-medium text-sm">
                    No ride history found for this driver.
                  </td>
                </tr>
              ) : (
                rides.map((ride, idx) => {
                  const displayIndex = (currentPage - 1) * entriesPerPage + idx + 1;
                  const rideDisplayId =
                    ride.id != null || ride.rideId != null
                      ? String(ride.id ?? ride.rideId).replace(/^RD/i, '')
                      : '-';
                  const fromLoc = ride.from || ride.route?.from || '-';
                  const toLoc = ride.to || ride.route?.to || '-';

                  return (
                    <tr
                      key={ride.rideId || idx}
                      className="hover:bg-slate-50/70 transition-colors text-slate-900 cursor-pointer"
                      onClick={() => ride.rideId && navigate(`/rides/${ride.rideId}`)}
                    >
                      {/* # */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-500">
                        {displayIndex}
                      </td>

                      {/* Ride ID */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-black">
                        {rideDisplayId}
                      </td>

                      {/* From */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-800">
                        <span className="max-w-[200px] truncate block" title={fromLoc}>
                          {fromLoc}
                        </span>
                      </td>

                      {/* To */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-800">
                        <span className="max-w-[200px] truncate block" title={toLoc}>
                          {toLoc}
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0" />
                          <span>{fromLoc}</span>
                          <span className="text-slate-400 font-normal">→</span>
                          <span>{toLoc}</span>
                        </div>
                      </td>

                      {/* Trip Date & Time */}
                      <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-800">
                        {formatDateTime(ride.rideDateTime || ride.tripDateTime)}
                      </td>

                      {/* Passengers */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 text-center">
                        {ride.passengers ?? 0}
                      </td>

                      {/* Fare */}
                      <td className="py-2.5 px-3 sm:px-4 font-bold text-black">
                        ₹{Number(ride.fare ?? 0).toLocaleString('en-IN')}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 sm:px-4">
                        {renderStatusBadge(ride.status)}
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 sm:px-4 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ride.rideId) navigate(`/rides/${ride.rideId}`);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer inline-flex justify-center items-center"
                          title="View Ride Details"
                        >
                          <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Component */}
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(newLimit) => {
              setEntriesPerPage(newLimit);
              setCurrentPage(1);
            }}
            pageSizeOptions={[10, 20, 50]}
            itemLabel="rides"
          />
        </div>
      </div>
    </div>
  );
}