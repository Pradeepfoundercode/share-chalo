import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Search,
  Eye,
  Car,
  ChevronDown,
  Briefcase,
  Home,
  Activity,
  RotateCcw,
  Download,
  Filter,
  Loader2,
} from 'lucide-react';
import { getVehiclesApi } from '../../services/vehicle.services';
import carThumb from '../../assets/White Compact Hatchback Car Cutout.png';
import busThumb from '../../assets/commercial_bus.png';
import Pagination from '../../components/common/Pagination';
import StatsCards from '../../components/common/StatsCards';

// Assets for Stats Cards
import totalVehiclesIcon from '../../assets/drivers/vehicle-document.svg';
import activeVehiclesIcon from '../../assets/drivers/active-status-check.svg';
import blockedVehiclesIcon from '../../assets/drivers/blocked-cancelled.svg';
import inactiveVehiclesIcon from '../../assets/drivers/inactive-vehicles.svg';

export default function Vehicles() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [usageTypeFilter, setUsageTypeFilter] = useState('Usage Type');
  const [statusFilter, setStatusFilter] = useState('Status');

  const [usageTypeOpen, setUsageTypeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  // Fetch Vehicles API
  const { data: vehiclesResponse, isLoading } = useQuery({
    queryKey: ['admin-vehicles', currentPage, entriesPerPage],
    queryFn: () =>
      getVehiclesApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  // Extract raw vehicles array safely
  const rawVehicles = useMemo(() => {
    if (!vehiclesResponse) return [];
    if (Array.isArray(vehiclesResponse.data)) return vehiclesResponse.data;
    if (Array.isArray(vehiclesResponse.data?.vehicles)) return vehiclesResponse.data.vehicles;
    if (Array.isArray(vehiclesResponse.data?.rows)) return vehiclesResponse.data.rows;
    if (Array.isArray(vehiclesResponse.vehicles)) return vehiclesResponse.vehicles;
    return [];
  }, [vehiclesResponse]);

  // Map API vehicle items to consistent UI model
  const mappedVehicles = useMemo(() => {
    return rawVehicles.map((item, index) => {
      const id = item.vehicleId ?? item.id ?? item._id ?? index + 1;
      const vehicleId = item.vehicleId ?? item.id ?? (index + 1);
      const vehicleNumber =
        item.registrationNumber ||
        item.vehicleNumber ||
        item.number ||
        item.plateNumber ||
        `VH-${id}`;

      let vehicleType =
        item.vehicleType?.name ||
        item.vehicleTypeName ||
        item.vehicleType ||
        item.type ||
        'Car';
      if (typeof vehicleType === 'string') {
        const lower = vehicleType.toLowerCase();
        if (lower.includes('bus')) vehicleType = 'Bus';
        else if (lower.includes('car')) vehicleType = 'Car';
        else vehicleType = vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1);
      }

      let usageType =
        item.usageType ||
        item.usage ||
        item.category ||
        (item.isCommercial ? 'Commercial' : 'Private');
      if (typeof usageType === 'string') {
        const lower = usageType.toLowerCase();
        if (lower.includes('com')) usageType = 'Commercial';
        else if (lower.includes('priv')) usageType = 'Private';
        else usageType = usageType.charAt(0).toUpperCase() + usageType.slice(1);
      } else {
        usageType = 'Commercial';
      }

      const driver = item.driver || item.driverDetails || item.assignedDriver;
      const driverName =
        (typeof driver === 'object' ? driver?.name || driver?.fullName : driver) ||
        item.driverName ||
        'Unassigned';
      const driverAvatar =
        (typeof driver === 'object'
          ? driver?.profileImage || driver?.avatar || driver?.profilePhoto || driver?.image
          : null) ||
        item.driverAvatar ||
        item.profileImage ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
      const isTopDriver = Boolean(
        item.isTopDriver || (typeof driver === 'object' && driver?.isTopDriver)
      );

      const seats =
        item.seats ??
        item.seatingCapacity ??
        item.totalSeats ??
        item.capacity ??
        (vehicleType === 'Bus' ? 30 : 4);

      let status = item.status || 'Active';
      if (typeof status === 'string') {
        const lower = status.toLowerCase();
        if (lower === 'active' || lower === 'approved') status = 'Active';
        else if (lower === 'blocked' || lower === 'rejected') status = 'Blocked';
        else if (lower === 'inactive' || lower === 'pending') status = 'Inactive';
        else status = status.charAt(0).toUpperCase() + status.slice(1);
      }

      const defaultImg = vehicleType === 'Bus' ? busThumb : carThumb;
      const image =
        item.image ||
        item.photo ||
        item.vehiclePhoto ||
        (Array.isArray(item.photos) && item.photos[0]?.img) ||
        (Array.isArray(item.photos) && typeof item.photos[0] === 'string' && item.photos[0]) ||
        defaultImg;

      return {
        ...item,
        id,
        vehicleId,
        vehicleNumber,
        vehicleType,
        usageType,
        driverName,
        driverAvatar,
        isTopDriver,
        seats,
        status,
        image,
      };
    });
  }, [rawVehicles]);

  // Applied filter state (only triggers when "Apply" is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    usageType: 'Usage Type',
    status: 'Status',
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      usageType: usageTypeFilter,
      status: statusFilter,
    });
    setCurrentPage(1);
  };

  // Reset Filters
  const handleReset = () => {
    setSearchTerm('');
    setUsageTypeFilter('Usage Type');
    setStatusFilter('Status');
    setAppliedFilters({
      search: '',
      usageType: 'Usage Type',
      status: 'Status',
    });
    setCurrentPage(1);
  };

  // Filter logic (using appliedFilters, sorted ascending by vehicleId)
  const filteredVehicles = useMemo(() => {
    return mappedVehicles
      .filter((v) => {
        const matchesSearch =
          !appliedFilters.search ||
          (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(appliedFilters.search.toLowerCase())) ||
          (v.driverName && v.driverName.toLowerCase().includes(appliedFilters.search.toLowerCase()));

        const matchesUsageType =
          appliedFilters.usageType === 'Usage Type' ||
          v.usageType?.toLowerCase() === appliedFilters.usageType.toLowerCase();

        const matchesStatus =
          appliedFilters.status === 'Status' ||
          v.status?.toLowerCase() === appliedFilters.status.toLowerCase();

        return matchesSearch && matchesUsageType && matchesStatus;
      })
      .sort((a, b) => {
        const idA = Number(a.vehicleId ?? a.id ?? 0);
        const idB = Number(b.vehicleId ?? b.id ?? 0);
        return idA - idB;
      });
  }, [mappedVehicles, appliedFilters]);

  // Stats
  const stats = vehiclesResponse?.data?.stats || vehiclesResponse?.stats || vehiclesResponse?.data?.summary;
  const meta = vehiclesResponse?.meta || vehiclesResponse?.data?.meta;

  // Reusable StatsCards configuration
  const vehicleStatsItems = [
    {
      id: 1,
      label: 'Total Vehicles',
      value: stats?.totalVehicles ?? meta?.total ?? rawVehicles.length,
      image: totalVehiclesIcon,
      cardColor: 'bg-[#fffbeb] border-amber-200/80',
      iconBg: 'bg-amber-200/80',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 2,
      label: 'Active Vehicles',
      value:
        stats?.activeVehicles ??
        stats?.active ??
        rawVehicles.filter((v) => (v.status || '').toLowerCase() === 'active').length,
      image: activeVehiclesIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-emerald-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 3,
      label: 'Blocked Vehicles',
      value:
        stats?.blockedVehicles ??
        stats?.blocked ??
        rawVehicles.filter((v) => (v.status || '').toLowerCase() === 'blocked').length,
      image: blockedVehiclesIcon,
      cardColor: 'bg-[#fef2f2] border-rose-200/80',
      iconBg: 'bg-rose-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-5 h-5 sm:w-7 sm:h-7',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 4,
      label: 'Inactive Vehicles',
      value:
        stats?.inactiveVehicles ??
        stats?.inactive ??
        rawVehicles.filter(
          (v) =>
            (v.status || '').toLowerCase() === 'inactive' ||
            (v.status || '').toLowerCase() === 'pending'
        ).length,
      image: inactiveVehiclesIcon,
      cardColor: 'bg-[#faf5ff] border-purple-200/80',
      iconBg: 'bg-purple-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
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
        columns="grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        cardHeight="p-3.5 sm:p-3.5"
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
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Right: Dropdowns Group & Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2.5 sm:gap-2 w-full lg:w-auto">
          {/* Usage Type Filter */}
          <div className="relative w-full sm:w-40">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Usage Type
            </label>
            <button
              type="button"
              onClick={() => {
                setUsageTypeOpen(!usageTypeOpen);
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
          {(searchTerm || usageTypeFilter !== 'Usage Type' || statusFilter !== 'Status') && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Filter className="w-4 h-4 fill-black" />
            <span>Apply</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          TABLE CONTAINER (Ratings & Reviews Style)
          ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[900px]">
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5 text-center w-12 whitespace-nowrap">#</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Vehicle Number</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Usage Type</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Driver Name</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Seats</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex items-center justify-center gap-2 text-slate-500 font-semibold text-sm">
                      <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
                      Loading vehicles...
                    </div>
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-bold text-sm sm:text-base">
                    No vehicles found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle, index) => {
                  return (
                    <tr
                      key={vehicle.id}
                      onClick={() => navigate(`/vehicles/${vehicle.id}`, { state: { vehicle } })}
                      className="hover:bg-amber-50/20 transition-colors cursor-pointer"
                    >
                      {/* 1. Vehicle ID (Number only, no '#' symbol) */}
                      <td className="py-2 px-3.5 text-center font-bold text-slate-500 text-sm sm:text-base">
                        {vehicle.vehicleId ?? vehicle.id}
                      </td>

                      {/* 2. Vehicle Number Pill */}
                      <td className="py-2 px-3.5">
                        <span className="inline-block px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-bold tracking-wide text-xs sm:text-sm shadow-2xs">
                          {vehicle.vehicleNumber}
                        </span>
                      </td>

                      {/* 3. Usage Type Badge */}
                      <td className="py-2 px-3.5">
                        {vehicle.usageType === 'Commercial' ? (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            Commercial
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100/80 border border-slate-200/80">
                            Private
                          </span>
                        )}
                      </td>

                      {/* 6. Driver Avatar & Name */}
                      <td className="py-2 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={vehicle.driverAvatar}
                            alt={vehicle.driverName}
                            className="w-8.5 h-8.5 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                          />
                          <span className="font-bold text-slate-900 text-sm sm:text-base">
                            {vehicle.driverName}
                            {vehicle.isTopDriver && (
                              <span className="text-amber-500 ml-1 font-bold text-base">★</span>
                            )}
                          </span>
                        </div>
                      </td>

                      {/* 7. Seats */}
                      <td className="py-2 px-3.5 text-center font-bold text-slate-900 text-sm sm:text-base">
                        {vehicle.seats}
                      </td>

                      {/* 8. Status Badge */}
                      <td className="py-2 px-3.5 text-center">
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
                      <td className="py-2 px-3.5 text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/vehicles/${vehicle.id}`, { state: { vehicle } });
                          }}
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
          totalItems={meta?.total ?? filteredVehicles.length}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(size) => {
            setEntriesPerPage(size);
            setCurrentPage(1);
          }}
          pageSizeOptions={[5, 10, 20, 50]}
          itemLabel="vehicles"
        />
      </div>
    </div>
  );
}

