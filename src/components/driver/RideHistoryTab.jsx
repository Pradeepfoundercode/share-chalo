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
import { rideHistoryStats, rideHistoryList } from '../../data/rideHistoryData';
import Pagination from '../common/Pagination';

export default function RideHistoryTab({ driver }) {
  const [timeFilter, setTimeFilter] = useState('Last 30 Days');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  return (
    <div className="space-y-5">
      {/* =========================================================
          TOP ROW: 4 Summary Stats Cards
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Rides */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
            <Car className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Rides</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {rideHistoryStats.totalRides}
            </h3>
          </div>
        </div>

        {/* Card 2: Total Passengers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Passengers</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {rideHistoryStats.totalPassengers}
            </h3>
          </div>
        </div>

        {/* Card 3: Total Earnings */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0 font-bold text-lg">
            ₹
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Earnings</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {rideHistoryStats.totalEarnings}
            </h3>
          </div>
        </div>

        {/* Card 4: Last Ride */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Last Ride</p>
            <h3 className="text-sm sm:text-[15px] font-black text-black leading-tight mt-0.5">
              {rideHistoryStats.lastRide}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          TABLE CONTAINER: Ride History Table + Filter Dropdown
          ========================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        {/* Table Top Header: Title + Filter Button */}
        <div className="flex items-center justify-between pb-2">
          <h3 className="text-base sm:text-lg font-black text-black">
            Ride History
          </h3>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 cursor-pointer shadow-2xs transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>{timeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-20 space-y-1">
                {['Last 7 Days', 'Last 30 Days', 'Last 3 Months', 'All Time'].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            {/* Table Header: Yellow Banner */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-bold rounded-2xl border-y border-amber-200/60">
                <th className="py-3 px-4 rounded-l-xl font-black">#</th>
                <th className="py-3 px-4 font-black">Ride ID</th>
                <th className="py-3 px-4 font-black">Route</th>
                <th className="py-3 px-4 font-black">Trip Date &amp; Time</th>
                <th className="py-3 px-4 font-black">Passengers</th>
                <th className="py-3 px-4 font-black">Fare</th>
                <th className="py-3 px-4 font-black">Status</th>
                <th className="py-3 px-4 rounded-r-xl font-black text-center">Action</th>
              </tr>
            </thead>

            {/* Table Rows */}
            <tbody className="divide-y divide-slate-100">
              {rideHistoryList.map((ride, idx) => (
                <tr
                  key={ride.id}
                  className="hover:bg-slate-50/70 transition-colors text-slate-800"
                >
                  {/* # */}
                  <td className="py-4 px-4 font-bold text-slate-500">
                    {ride.id}
                  </td>

                  {/* Ride ID */}
                  <td className="py-4 px-4 font-black text-black">
                    {ride.rideId}
                  </td>

                  {/* Route */}
                  <td className="py-4 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{ride.from}</span>
                      <span className="text-slate-400 font-normal">→</span>
                      <span>{ride.to}</span>
                    </div>
                  </td>

                  {/* Trip Date & Time */}
                  <td className="py-4 px-4 font-medium text-slate-700">
                    {ride.tripDateTime}
                  </td>

                  {/* Passengers */}
                  <td className="py-4 px-4 font-bold text-slate-900 pl-8">
                    {ride.passengers}
                  </td>

                  {/* Fare */}
                  <td className="py-4 px-4 font-black text-black">
                    {ride.fare}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {ride.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 text-center">
                    <button
                      className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer"
                      title="View Ride Details"
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
          totalItems={rideHistoryList.length}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 20]}
          itemLabel="rides"
        />
      </div>
    </div>
  );
}

