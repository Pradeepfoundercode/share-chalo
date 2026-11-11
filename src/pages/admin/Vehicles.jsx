import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Car,
  CheckCircle2,
  Ban,
  Clock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Home,
  Activity
} from 'lucide-react';
import { vehiclesStats, vehiclesList } from '../../data/vehiclesData';
import Pagination from '../../components/common/Pagination';

export default function Vehicles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('Vehicle Type');
  const [usageTypeFilter, setUsageTypeFilter] = useState('Usage Type');
  const [statusFilter, setStatusFilter] = useState('Status');

  const [vehicleTypeOpen, setVehicleTypeOpen] = useState(false);
  const [usageTypeOpen, setUsageTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Filter logic
  const filteredVehicles = vehiclesList.filter((v) => {
    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVehicleType =
      vehicleTypeFilter === 'Vehicle Type' || v.vehicleType === vehicleTypeFilter;

    const matchesUsageType =
      usageTypeFilter === 'Usage Type' || v.usageType === usageTypeFilter;

    const matchesStatus =
      statusFilter === 'Status' || v.status === statusFilter;

    return matchesSearch && matchesVehicleType && matchesUsageType && matchesStatus;
  });

  return (
    <div className="space-y-4 select-none pb-8">
      {/* =========================================================
          STATS CARDS (4 Columns)
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Vehicles - Soft Amber/Yellow tinted background */}
        <div className="bg-[#fffdf2] rounded-2xl p-4.5 border border-amber-200/70 shadow-2xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-100/90 text-amber-500 flex items-center justify-center shrink-0">
            <Car className="w-7 h-7 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Total Vehicles</p>
            <h3 className="text-2xl sm:text-[28px] font-bold text-black leading-tight mt-0.5">
              {vehiclesStats.totalVehicles}
            </h3>
          </div>
        </div>

        {/* Card 2: Active Vehicles - Soft Green tinted background */}
        <div className="bg-[#f2fdf5] rounded-2xl p-4.5 border border-emerald-200/70 shadow-2xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Active Vehicles</p>
            <h3 className="text-2xl sm:text-[28px] font-bold text-black leading-tight mt-0.5">
              {vehiclesStats.activeVehicles}
            </h3>
          </div>
        </div>

        {/* Card 3: Blocked Vehicles - Soft Rose/Red tinted background */}
        <div className="bg-[#fff4f5] rounded-2xl p-4.5 border border-rose-200/70 shadow-2xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-100/90 text-rose-600 flex items-center justify-center shrink-0">
            <Ban className="w-7 h-7 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Blocked Vehicles</p>
            <h3 className="text-2xl sm:text-[28px] font-bold text-black leading-tight mt-0.5">
              {vehiclesStats.blockedVehicles}
            </h3>
          </div>
        </div>

        {/* Card 4: Inactive Vehicles - Soft Purple/Lavender tinted background */}
        <div className="bg-[#fbf7ff] rounded-2xl p-4.5 border border-purple-200/70 shadow-2xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-purple-100/90 text-purple-600 flex items-center justify-center shrink-0">
            <Clock className="w-7 h-7 stroke-[2.3]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">Inactive Vehicles</p>
            <h3 className="text-2xl sm:text-[28px] font-bold text-black leading-tight mt-0.5">
              {vehiclesStats.inactiveVehicles}
            </h3>
          </div>
        </div>
      </div>

      {/* =========================================================
          FILTER BAR (Search input + 3 Dropdown Filters)
          ========================================================= */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by vehicle number or driver name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 shadow-2xs transition-all"
          />
        </div>

        {/* Right: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Vehicle Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setVehicleTypeOpen(!vehicleTypeOpen);
                setUsageTypeOpen(false);
                setStatusOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Car className="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
              <span>{vehicleTypeFilter}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {vehicleTypeOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-30 space-y-1">
                {['Vehicle Type', 'Car', 'Bus'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setVehicleTypeFilter(type);
                      setVehicleTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
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

          {/* Usage Type Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setUsageTypeOpen(!usageTypeOpen);
                setVehicleTypeOpen(false);
                setStatusOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Briefcase className="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
              <span>{usageTypeFilter}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {usageTypeOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-30 space-y-1">
                {['Usage Type', 'Commercial', 'Private'].map((usage) => (
                  <button
                    key={usage}
                    onClick={() => {
                      setUsageTypeFilter(usage);
                      setUsageTypeOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
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

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => {
                setStatusOpen(!statusOpen);
                setVehicleTypeOpen(false);
                setUsageTypeOpen(false);
              }}
              className="flex items-center gap-2.5 px-4 py-3 bg-white border border-slate-200/90 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-2xs cursor-pointer transition-all"
            >
              <Activity className="w-4.5 h-4.5 text-slate-600 stroke-[2.2]" />
              <span>{statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {statusOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-30 space-y-1">
                {['Status', 'Active', 'Blocked', 'Inactive'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setStatusFilter(status);
                      setStatusOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                      statusFilter === status
                        ? 'bg-amber-50 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          TABLE CONTAINER
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs sm:text-[13px] font-bold text-slate-900 uppercase tracking-wider">
                <th className="py-3.5 px-3.5 pl-5 text-center w-12">#</th>
                <th className="py-3.5 px-3.5">Vehicle Number</th>
                <th className="py-3.5 px-2"></th>
                <th className="py-3.5 px-3.5">Vehicle Type</th>
                <th className="py-3.5 px-3.5">Usage Type</th>
                <th className="py-3.5 px-3.5">Driver Name</th>
                <th className="py-3.5 px-3.5 text-center">Seats</th>
                <th className="py-3.5 px-3.5 text-center">Status</th>
                <th className="py-3.5 px-3.5 pr-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-bold text-slate-700">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold text-base">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => {
                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* 1. Row Index */}
                      <td className="py-3 px-3.5 pl-5 text-center text-slate-900 font-bold text-sm">
                        {index + 1}
                      </td>

                      {/* 2. Vehicle Number Pill */}
                      <td className="py-3 px-3.5">
                        <span className="inline-block px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold tracking-wide text-xs sm:text-[13px]">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>

                      {/* 3. Vehicle Thumbnail */}
                      <td className="py-3 px-2">
                        <div className="w-16 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50/60">
                          <img
                            src={vehicle.image}
                            alt={vehicle.vehicleNumber}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>

                      {/* 4. Vehicle Type */}
                      <td className="py-3 px-3.5 text-slate-800 font-bold text-[14.5px]">
                        {vehicle.vehicleType}
                      </td>

                      {/* 5. Usage Type Badge */}
                      <td className="py-3 px-3.5">
                        {vehicle.usageType === 'Commercial' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            <Briefcase className="w-4 h-4 text-emerald-600 stroke-[2.2]" />
                            Commercial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-slate-700 bg-slate-100/80 border border-slate-200/80">
                            <Home className="w-4 h-4 text-slate-600 stroke-[2.2]" />
                            Private
                          </span>
                        )}
                      </td>

                      {/* 6. Driver Avatar & Name */}
                      <td className="py-3 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={vehicle.driverAvatar}
                            alt={vehicle.driverName}
                            className="w-9 h-9 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                          />
                          <span className="font-bold text-slate-900 text-sm">
                            {vehicle.driverName}
                            {vehicle.isTopDriver && (
                              <span className="text-amber-500 ml-1 font-bold text-base">★</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 7. Seats */}
                      <td className="py-3 px-3.5 text-center font-bold text-slate-900 text-sm">
                        {vehicle.seats}
                      </td>

                      {/* 8. Status Badge */}
                      <td className="py-3 px-3.5 text-center">
                        {vehicle.status === 'Active' ? (
                          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                            Active
                          </span>
                        ) : vehicle.status === 'Blocked' ? (
                          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100/80">
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100/80">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* 9. Action Button */}
                      <td className="py-3 px-3.5 pr-5 text-center">
                        <button
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Vehicle"
                        >
                          <Eye className="w-5 h-5 text-slate-800" />
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
            PAGINATION FOOTER (Reusable Component)
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={124}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
          itemLabel="vehicles"
        />
      </div>
    </div>
  );
}

