import React, { useState } from 'react';
import {
  ChevronDown,
  Search,
  Calendar,
  Download,
  Eye,
  Users,
  UserCheck,
  Ban,
  CalendarClock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { passengersStats, passengersList } from '../../data/passengersData';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../components/common/Pagination';

export default function Passengers() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [accountStatusFilter, setAccountStatusFilter] = useState('All Status');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('Registration Date');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter passengers
  const filteredPassengers = passengersList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passengerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      accountStatusFilter === 'All Status' || p.accountStatus === accountStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none pb-12">
      {/* =========================================================
          STATS CARDS (4 Columns)
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Passengers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Passengers</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {passengersStats.totalPassengers}
            </h3>
          </div>
        </div>

        {/* Card 2: Active Passengers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Passengers</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {passengersStats.activePassengers}
            </h3>
          </div>
        </div>

        {/* Card 3: Blocked Passengers */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose-100/70 text-rose-600 flex items-center justify-center shrink-0">
            <Ban className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Blocked Passengers</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {passengersStats.blockedPassengers}
            </h3>
          </div>
        </div>

        {/* Card 4: New This Month */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 text-amber-600 flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">New This Month</p>
            <h3 className="text-2xl font-black text-black leading-tight mt-0.5">
              {passengersStats.newThisMonth}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTER BAR: Search Box | Registration Date | Account Status | Export
          ========================================================= */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, mobile or passenger ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-400 shadow-2xs transition-all"
          />
        </div>

        {/* Right: Filters & Export */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Registration Date Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateFilterOpen(!dateFilterOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer shadow-2xs transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>{dateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {dateFilterOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-20 space-y-1">
                {['Registration Date', 'Today', 'This Week', 'This Month', 'Custom Range'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setDateFilter(opt);
                      setDateFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      dateFilter === opt
                        ? 'bg-[#fed011] text-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/80 hover:bg-slate-50 text-xs font-bold text-slate-800 cursor-pointer shadow-2xs transition-all"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 font-semibold leading-none">Account Status</span>
                <span className="mt-0.5">{accountStatusFilter}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 ml-1" />
            </button>

            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-20 space-y-1">
                {['All Status', 'Active', 'Blocked'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setAccountStatusFilter(status);
                      setStatusDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      accountStatusFilter === status
                        ? 'bg-[#fed011] text-black'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button (Yellow rounded button matching screenshot) */}
          <button
            onClick={() => alert('Exporting Passengers data...')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#fed011] hover:bg-[#fed011]/90 text-black font-black text-xs sm:text-sm cursor-pointer shadow-2xs transition-all"
          >
            <Download className="w-4 h-4 stroke-[2.4]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          PASSENGERS DATA TABLE (Card Container)
          ========================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs sm:text-sm">
            {/* Table Header: Yellow Banner */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black rounded-2xl border-y border-amber-200/60">
                <th className="py-3 px-3 rounded-l-xl">#</th>
                <th className="py-3 px-3">Passenger</th>
                <th className="py-3 px-3">Passenger ID</th>
                <th className="py-3 px-3">Mobile Number</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3 text-center">Total Bookings</th>
                <th className="py-3 px-3 text-center">Completed Rides</th>
                <th className="py-3 px-3 text-center">Cancelled Rides</th>
                <th className="py-3 px-3 text-center">Account Status</th>
                <th className="py-3 px-3 rounded-r-xl text-center">Action</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredPassengers.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-slate-50/70 transition-colors text-slate-800"
                >
                  {/* # */}
                  <td className="py-3 px-3 font-bold text-slate-500">
                    {p.id}
                  </td>

                  {/* Passenger: Avatar + Name */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={p.avatar}
                        alt={p.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200"
                      />
                      <span className="font-black text-black whitespace-nowrap">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  {/* Passenger ID */}
                  <td className="py-3 px-3 font-bold text-slate-700 whitespace-nowrap">
                    {p.passengerId}
                  </td>

                  {/* Mobile Number */}
                  <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                    {p.mobile}
                  </td>

                  {/* Email */}
                  <td className="py-3 px-3 font-semibold text-slate-700 whitespace-nowrap">
                    {p.email}
                  </td>

                  {/* Total Bookings */}
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {p.totalBookings}
                  </td>

                  {/* Completed Rides */}
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {p.completedRides}
                  </td>

                  {/* Cancelled Rides */}
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {p.cancelledRides}
                  </td>

                  {/* Account Status Badge: Active (Green) / Blocked (Red) */}
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${
                        p.accountStatus === 'Active'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                          : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}
                    >
                      {p.accountStatus}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => navigate(`/passengers/${p.id}`)}
                      className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 hover:text-black transition-colors cursor-pointer"
                      title="View Passenger Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            BOTTOM PAGINATION BAR (Reusable Component)
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={12486}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="passengers"
        />
      </div>
    </div>
  );
}

