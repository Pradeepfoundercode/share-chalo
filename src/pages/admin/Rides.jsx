import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Play,
  Car,
  CheckCircle2,
  XCircle,
  Search,
  Briefcase,
  Home,
  RotateCcw,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { ridesStats, ridesList } from '../../data/ridesData';
import Pagination from '../../components/common/Pagination';

export default function Rides() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Rides');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('Vehicle Type');
  const [usageTypeFilter, setUsageTypeFilter] = useState('Usage Type');
  const [rideDateFilter, setRideDateFilter] = useState('Ride Date');

  const [vehicleTypeOpen, setVehicleTypeOpen] = useState(false);
  const [usageTypeOpen, setUsageTypeOpen] = useState(false);
  const [rideDateOpen, setRideDateOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Status pills configuration
  const statusTabs = [
    { id: 'All Rides', label: 'All Rides', count: ridesStats.totalRides, icon: Calendar },
    { id: 'Upcoming', label: 'Upcoming', count: ridesStats.upcoming, icon: Calendar },
    { id: 'Ongoing', label: 'Ongoing', count: ridesStats.ongoing, icon: Play },
    { id: 'Completed', label: 'Completed', count: ridesStats.completed, icon: CheckCircle2 },
    { id: 'Cancelled', label: 'Cancelled', count: ridesStats.cancelled, icon: XCircle },
  ];

  // Filtering
  const filteredRides = ridesList.filter((ride) => {
    // Tab filter
    if (activeTab !== 'All Rides' && ride.status !== activeTab) {
      return false;
    }

    // Search filter
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      ride.rideId.toLowerCase().includes(term) ||
      ride.driverName.toLowerCase().includes(term) ||
      ride.vehicleNumber.toLowerCase().includes(term) ||
      ride.from.toLowerCase().includes(term) ||
      ride.to.toLowerCase().includes(term);

    // Dropdowns
    const matchesVehicleType =
      vehicleTypeFilter === 'Vehicle Type' || ride.vehicleType === vehicleTypeFilter;
    const matchesUsageType =
      usageTypeFilter === 'Usage Type' || ride.usageType === usageTypeFilter;

    return matchesSearch && matchesVehicleType && matchesUsageType;
  });

  const handleReset = () => {
    setSearchTerm('');
    setVehicleTypeFilter('Vehicle Type');
    setUsageTypeFilter('Usage Type');
    setRideDateFilter('Ride Date');
    setActiveTab('All Rides');
  };

  return (
    <div className="space-y-3.5 select-none pb-8">
      {/* =========================================================
          1. TOP 5 STATS CARDS
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* Card 1: Total Rides (Warm Yellow/Amber) */}
        <div className="bg-[#fffdf2] rounded-2xl p-3 sm:p-4 border border-amber-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-500 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-700">Total Rides</p>
            <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {ridesStats.totalRides}
            </h3>
          </div>
        </div>

        {/* Card 2: Upcoming (Mint Green) */}
        <div className="bg-[#f0fdf4] rounded-2xl p-3 sm:p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <div className="w-7 h-7 rounded-full border-2 border-emerald-600 flex items-center justify-center">
              <Play className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600 ml-0.5" />
            </div>
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-700">Upcoming</p>
            <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {ridesStats.upcoming}
            </h3>
          </div>
        </div>

        {/* Card 3: Ongoing (Soft Blue) */}
        <div className="bg-[#eff6ff] rounded-2xl p-3 sm:p-4 border border-blue-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100/80 text-blue-600 flex items-center justify-center shrink-0">
            <Car className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-700">Ongoing</p>
            <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {ridesStats.ongoing}
            </h3>
          </div>
        </div>

        {/* Card 4: Completed (Emerald Green) */}
        <div className="bg-[#f0fdf4] rounded-2xl p-3 sm:p-4 border border-emerald-200/70 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-700">Completed</p>
            <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {ridesStats.completed}
            </h3>
          </div>
        </div>

        {/* Card 5: Cancelled (Soft Pink/Red) */}
        <div className="bg-[#fef2f2] rounded-2xl p-3 sm:p-4 border border-rose-200/70 shadow-2xs flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-rose-100/80 text-rose-500 flex items-center justify-center shrink-0">
            <XCircle className="w-6 h-6 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-slate-700">Cancelled</p>
            <h3 className="text-xl sm:text-2xl font-bold text-black leading-tight mt-0.5">
              {ridesStats.cancelled}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. FILTER TABS (All Rides, Upcoming, Ongoing, Completed, Cancelled)
          ========================================================= */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-2 px-3.5 sm:px-4 rounded-xl text-xs sm:text-[13.5px] font-bold transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-amber-300/40'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2]" />
              <span>
                {tab.label} ({tab.count})
              </span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          3. SEARCH & DROPDOWN FILTERS BAR
          ========================================================= */}
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Ride ID, Driver, Vehicle Number or Route"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10.5 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-[13px] font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 shadow-2xs transition-all"
          />
        </div>

        {/* Right: Dropdown Filters & Reset */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Vehicle Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setVehicleTypeOpen(!vehicleTypeOpen);
                setUsageTypeOpen(false);
                setRideDateOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Car className="w-4 h-4 text-slate-500 stroke-[2.2]" />
              <span>{vehicleTypeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {vehicleTypeOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-30 space-y-0.5">
                {['Vehicle Type', 'Car', 'Bus'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setVehicleTypeFilter(type);
                      setVehicleTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      vehicleTypeFilter === type
                        ? 'bg-amber-50 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Usage Type Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setUsageTypeOpen(!usageTypeOpen);
                setVehicleTypeOpen(false);
                setRideDateOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Briefcase className="w-4 h-4 text-slate-500 stroke-[2.2]" />
              <span>{usageTypeFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {usageTypeOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-30 space-y-0.5">
                {['Usage Type', 'Commercial', 'Private'].map((usage) => (
                  <button
                    key={usage}
                    onClick={() => {
                      setUsageTypeFilter(usage);
                      setUsageTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      usageTypeFilter === usage
                        ? 'bg-amber-50 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {usage}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ride Date Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setRideDateOpen(!rideDateOpen);
                setVehicleTypeOpen(false);
                setUsageTypeOpen(false);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200/90 rounded-2xl text-[13px] font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Calendar className="w-4 h-4 text-slate-500 stroke-[2.2]" />
              <span>{rideDateFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            {rideDateOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-2xl shadow-lg p-1.5 z-30 space-y-0.5">
                {['Ride Date', 'Today', 'Yesterday', 'This Week'].map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setRideDateFilter(d);
                      setRideDateOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      rideDateFilter === d
                        ? 'bg-amber-50 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Action */}
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2.5 text-slate-600 hover:text-black font-bold text-[13px] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          4. RIDES TABLE
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs font-bold text-slate-900">
                <th className="py-2.5 px-2.5 pl-4 text-center w-9">#</th>
                <th className="py-2.5 px-3">Ride ID</th>
                <th className="py-2.5 px-3">Route (From → To)</th>
                <th className="py-2.5 px-3">Ride Date & Time</th>
                <th className="py-2.5 px-3">Vehicle</th>
                <th className="py-2.5 px-3">Driver</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-2.5 text-center">Seats</th>
                <th className="py-2.5 px-3 text-center">Fare (Seat)</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 pr-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-bold text-slate-700">
              {filteredRides.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-semibold text-sm">
                    No rides found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRides.map((ride, index) => {
                  return (
                    <tr
                      key={ride.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* 1. Index */}
                      <td className="py-2 px-2.5 pl-4 text-center text-slate-900 font-bold">
                        {index + 1}
                      </td>

                      {/* 2. Ride ID */}
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {ride.rideId}
                      </td>

                      {/* 3. Route */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900">
                          <span className="w-2 h-2 rounded-full border-2 border-emerald-500 shrink-0" />
                          <span>{ride.from}</span>
                          <span className="text-slate-400 mx-0.5">→</span>
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>{ride.to}</span>
                        </div>
                      </td>

                      {/* 4. Ride Date & Time */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>
                            {ride.date}, {ride.time}
                          </span>
                        </div>
                      </td>

                      {/* 5. Vehicle (Cutout + Plate) */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-11 h-6 flex items-center justify-center shrink-0">
                            <img
                              src={ride.vehicleImage}
                              alt={ride.vehicleType}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <span className="font-bold text-slate-900 text-xs">
                            {ride.vehicleNumber}
                          </span>
                        </div>
                      </td>

                      {/* 6. Driver (Avatar + Name) */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={ride.driverAvatar}
                            alt={ride.driverName}
                            className="w-7 h-7 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                          />
                          <span className="font-bold text-slate-900 text-xs">
                            {ride.driverName}
                          </span>
                        </div>
                      </td>

                      {/* 7. Type Badge */}
                      <td className="py-2 px-3">
                        {ride.usageType === 'Commercial' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            <Briefcase className="w-3 h-3 text-emerald-600 stroke-[2.2]" />
                            Commercial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200">
                            <Home className="w-3 h-3 text-slate-600 stroke-[2.2]" />
                            Private
                          </span>
                        )}
                      </td>

                      {/* 8. Seats */}
                      <td className="py-2 px-2.5 text-center font-bold text-slate-900 text-xs">
                        {ride.bookedSeats} / {ride.totalSeats}
                      </td>

                      {/* 9. Fare (Seat) */}
                      <td className="py-2 px-3 text-center font-bold text-slate-900 text-xs sm:text-[13px]">
                        ₹ {ride.fare}
                      </td>

                      {/* 10. Status Badge */}
                      <td className="py-2 px-3 text-center">
                        {ride.status === 'Completed' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            Completed
                          </span>
                        ) : ride.status === 'Ongoing' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100">
                            Ongoing
                          </span>
                        ) : ride.status === 'Upcoming' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-100">
                            Upcoming
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* 11. Action View Button */}
                      <td className="py-2 px-3 pr-4 text-center">
                        <button
                          onClick={() => navigate(`/rides/${ride.rideId}`)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Ride Details"
                        >
                          <Eye className="w-4 h-4 text-slate-700" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            5. PAGINATION FOOTER (Reusable Component)
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={1286}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="rides"
        />
      </div>
    </div>
  );
}

