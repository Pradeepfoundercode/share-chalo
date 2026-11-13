import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Eye,
  MapPin,
  Car,
  Users,
  Check
} from 'lucide-react';

import totalRidesIcon from '../../assets/drivers/vehicle-document.svg';
import totalPassengersIcon from '../../assets/drivers/passengers-orange.svg';
import totalEarningsIcon from '../../assets/drivers/rupee-symbol-transparent.svg';
import lastRideIcon from '../../assets/dashboard/calender-yellow.svg';

import { rideHistoryStats, rideHistoryList } from '../../data/rideHistoryData';
import Pagination from '../common/Pagination';

export default function RideHistoryTab({ driver }) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

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
              {rideHistoryStats.totalRides}
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
              {rideHistoryStats.totalPassengers}
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
              {rideHistoryStats.totalEarnings}
            </h3>
          </div>
        </div>

        {/* Card 4: Last Ride (Truncate Removed) */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 items-start">
          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2">
            <img src={lastRideIcon} alt="Last Ride" className="w-6 h-6 sm:w-9 sm:h-9 object-contain" />
          </div>
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 sm:text-black">Last Ride</p>
            {/* Removed truncate class so the text wraps naturally instead of showing ... */}
            <h3 className="text-[13px] sm:text-[15px] font-bold text-black leading-snug mt-0.5 break-words">
              {rideHistoryStats.lastRide}
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
              <span>{timeFilter}</span>
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 ml-0.5 sm:ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border border-slate-200 rounded-xl sm:rounded-2xl shadow-lg p-1.5 z-20 space-y-1">
                {['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
                      timeFilter === option
                        ? 'bg-[#fed011] text-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto no-scrollbar pb-2">
          <table className="w-full min-w-[850px] text-left text-sm sm:text-[15px] whitespace-nowrap">
            {/* Table Header: Yellow Banner */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-bold rounded-2xl border-y border-amber-200/60 text-[13px] sm:text-base">
                <th className="py-2.5 px-3 sm:px-4 rounded-l-xl font-bold">#</th>
                <th className="py-2.5 px-3 sm:px-4 font-bold">Ride ID</th>
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
              {rideHistoryList.map((ride, idx) => (
                <tr
                  key={ride.id}
                  className="hover:bg-slate-50/70 transition-colors text-slate-900"
                >
                  {/* # */}
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-500">
                    {ride.id}
                  </td>

                  {/* Ride ID */}
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-black">
                    {ride.rideId}
                  </td>

                  {/* Route */}
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
                      <span>{ride.from}</span>
                      <span className="text-slate-400 font-normal">→</span>
                      <span>{ride.to}</span>
                    </div>
                  </td>

                  {/* Trip Date & Time */}
                  <td className="py-2.5 px-3 sm:px-4 font-semibold text-slate-800">
                    {ride.tripDateTime}
                  </td>

                  {/* Passengers */}
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900 text-center">
                    {ride.passengers}
                  </td>

                  {/* Fare */}
                  <td className="py-2.5 px-3 sm:px-4 font-bold text-black">
                    {ride.fare}
                  </td>

                  {/* Status */}
                  <td className="py-2.5 px-3 sm:px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {ride.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-2.5 px-3 sm:px-4 text-center">
                    <button
                      className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer inline-flex justify-center items-center"
                      title="View Ride Details"
                    >
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reusable Pagination Component */}
        <div className="pt-2">
          <Pagination
            currentPage={currentPage}
            totalItems={rideHistoryList.length}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setEntriesPerPage}
            pageSizeOptions={[5, 10, 20]}
            itemLabel="rides"
          />
        </div>
      </div>
    </div>
  );
}