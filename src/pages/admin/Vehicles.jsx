import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Eye,
  Car,
  ChevronDown,
  Briefcase,
  Home,
  Activity,
  RotateCcw
} from 'lucide-react';
import { vehiclesStats, vehiclesList } from '../../data/vehiclesData';
import { Pagination, StatsCards } from '../../components/common';

// Assets for Stats Cards
import totalVehiclesIcon from '../../assets/drivers/vehicle-document.svg';
import activeVehiclesIcon from '../../assets/drivers/active-status-check.svg';
import blockedVehiclesIcon from '../../assets/drivers/blocked-cancelled.svg';
import inactiveVehiclesIcon from '../../assets/drivers/inactive-vehicles.svg';

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

  // Reset Filters
  const handleReset = () => {
    setSearchTerm('');
    setVehicleTypeFilter('Vehicle Type');
    setUsageTypeFilter('Usage Type');
    setStatusFilter('Status');
    setCurrentPage(1);
  };

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

  // Reusable StatsCards configuration matching user request icons
  const vehicleStatsItems = [
    {
      id: 1,
      label: 'Total Vehicles',
      value: vehiclesStats.totalVehicles,
      image: totalVehiclesIcon,
      cardColor: 'bg-[#fffbeb] border-amber-200/80',
      iconBg: 'bg-amber-200/80',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 2,
      label: 'Active Vehicles',
      value: vehiclesStats.activeVehicles,
      image: activeVehiclesIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-emerald-100',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 3,
      label: 'Blocked Vehicles',
      value: vehiclesStats.blockedVehicles,
      image: blockedVehiclesIcon,
      cardColor: 'bg-[#fef2f2] border-rose-200/80',
      iconBg: 'bg-rose-100',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 4,
      label: 'Inactive Vehicles',
      value: vehiclesStats.inactiveVehicles,
      image: inactiveVehiclesIcon,
      cardColor: 'bg-[#faf5ff] border-purple-200/80',
      iconBg: 'bg-purple-100',
      iconSize: 'w-7 h-7 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
  ];

  return (
    <div className="space-y-4 select-none pb-8">
      {/* =========================================================
          STATS CARDS (Reusable StatsCards - 4 Columns)
          ========================================================= */}
      <StatsCards
        items={vehicleStatsItems}
        columns="lg:grid-cols-4"
      />

      {/* =========================================================
          FILTER BAR (Search input + 3 Dropdown Filters + Reset)
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-3 sm:gap-2.5">
        {/* Left: Search input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="w-4.5 h-4.5 sm:w-5 sm:h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by vehicle number or driver name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Right: Dropdowns Group & Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-2 w-full lg:w-auto">
          {/* Vehicle Type Filter */}
          <div className="relative w-full sm:w-40">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Vehicle Type
            </label>
            <button
              type="button"
              onClick={() => {
                setVehicleTypeOpen(!vehicleTypeOpen);
                setUsageTypeOpen(false);
                setStatusOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{vehicleTypeFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  vehicleTypeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {vehicleTypeOpen && (
              <div className="absolute left-0 right-0 sm:right-auto mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['Vehicle Type', 'Car', 'Bus'].map((type) => {
                  const isSelected = vehicleTypeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setVehicleTypeFilter(type);
                        setVehicleTypeOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Usage Type Filter */}
          <div className="relative w-full sm:w-40">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Usage Type
            </label>
            <button
              type="button"
              onClick={() => {
                setUsageTypeOpen(!usageTypeOpen);
                setVehicleTypeOpen(false);
                setStatusOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{usageTypeFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  usageTypeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {usageTypeOpen && (
              <div className="absolute left-0 right-0 sm:right-auto mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['Usage Type', 'Commercial', 'Private'].map((usage) => {
                  const isSelected = usageTypeFilter === usage;
                  return (
                    <button
                      key={usage}
                      type="button"
                      onClick={() => {
                        setUsageTypeFilter(usage);
                        setUsageTypeOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {usage}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative w-full sm:w-40">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Status
            </label>
            <button
              type="button"
              onClick={() => {
                setStatusOpen(!statusOpen);
                setVehicleTypeOpen(false);
                setUsageTypeOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{statusFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  statusOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            {statusOpen && (
              <div className="absolute left-0 right-0 sm:right-auto mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['Status', 'Active', 'Blocked', 'Inactive'].map((status) => {
                  const isSelected = statusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setStatusFilter(status);
                        setStatusOpen(false);
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reset Action Button */}
          {(searchTerm || vehicleTypeFilter !== 'Vehicle Type' || usageTypeFilter !== 'Usage Type' || statusFilter !== 'Status') && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl transition-all cursor-pointer shadow-2xs"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================
          TABLE CONTAINER
          ========================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs sm:text-[13.5px] font-bold text-slate-900 uppercase tracking-wider">
                <th className="py-2.5 px-3 pl-4 text-center w-12">#</th>
                <th className="py-2.5 px-3">Vehicle Number</th>
                <th className="py-2.5 px-1.5"></th>
                <th className="py-2.5 px-3">Vehicle Type</th>
                <th className="py-2.5 px-3">Usage Type</th>
                <th className="py-2.5 px-3">Driver Name</th>
                <th className="py-2.5 px-3 text-center">Seats</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 pr-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[14.5px] font-bold text-slate-800">
              {filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-semibold text-base">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => {
                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                    >
                      {/* 1. Row Index */}
                      <td className="py-2 px-3 pl-4 text-center text-slate-900 font-bold text-[14.5px]">
                        {index + 1}
                      </td>

                      {/* 2. Vehicle Number Pill */}
                      <td className="py-2 px-3">
                        <span className="inline-block px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold tracking-wide text-xs sm:text-[13.5px]">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>

                      {/* 3. Vehicle Thumbnail */}
                      <td className="py-2 px-1.5">
                        <div className="w-14 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-50/60">
                          <img
                            src={vehicle.image}
                            alt={vehicle.vehicleNumber}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>

                      {/* 4. Vehicle Type */}
                      <td className="py-2 px-3 text-slate-900 font-bold text-[15px]">
                        {vehicle.vehicleType}
                      </td>

                      {/* 5. Usage Type Badge */}
                      <td className="py-2 px-3">
                        {vehicle.usageType === 'Commercial' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            <Briefcase className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
                            Commercial
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100/80 border border-slate-200/80">
                            <Home className="w-3.5 h-3.5 text-slate-600 stroke-[2.2]" />
                            Private
                          </span>
                        )}
                      </td>

                      {/* 6. Driver Avatar & Name */}
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={vehicle.driverAvatar}
                            alt={vehicle.driverName}
                            className="w-8.5 h-8.5 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                          />
                          <span className="font-bold text-slate-900 text-[14.5px]">
                            {vehicle.driverName}
                            {vehicle.isTopDriver && (
                              <span className="text-amber-500 ml-1 font-bold text-base">★</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 7. Seats */}
                      <td className="py-2 px-3 text-center font-bold text-slate-900 text-[15px]">
                        {vehicle.seats}
                      </td>

                      {/* 8. Status Badge */}
                      <td className="py-2 px-3 text-center">
                        {vehicle.status === 'Active' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                            Active
                          </span>
                        ) : vehicle.status === 'Blocked' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100/80">
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100/80">
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* 9. Action Button */}
                      <td className="py-2 px-3 pr-4 text-center">
                        <button
                          onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer inline-flex items-center justify-center"
                          title="View Vehicle"
                        >
                          <Eye className="w-4.5 h-4.5 text-slate-800" />
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

