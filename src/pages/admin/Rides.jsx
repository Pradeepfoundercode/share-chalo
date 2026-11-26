import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  Play,
  Car,
  CheckCircle2,
  XCircle,
  Search,
  Briefcase,
  Home,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  MapPin,
  Filter
} from 'lucide-react';
import { ridesStats, ridesList } from '../../data/ridesData';
import { getTripsApi } from '../../services/trip.services';
import Pagination from '../../components/common/Pagination';
import { StatsCards } from '../../components/common';

// Assets for Stats Cards & Vehicles
import totalRidesIcon from '../../assets/dashboard/calender-yellow.svg';
import upcomingRidesIcon from '../../assets/drivers/upcoming-rides.svg';
import ongoingRidesIcon from '../../assets/drivers/ongoing-rides.svg';
import completedRidesIcon from '../../assets/drivers/active-status-check.svg';
import cancelledRidesIcon from '../../assets/drivers/blocked-cancelled.svg';
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';
import busCutout from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
import amitAvatar from '../../assets/amit_kumar_photo.png';

// Helper to format ISO date time string
const formatDateTime = (dateStr) => {
  if (!dateStr) return { date: '-', time: '-' };
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return { date: dateStr, time: '' };
    const date = d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const time = d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return { date, time };
  } catch {
    return { date: dateStr, time: '' };
  }
};

// Helper to format status values cleanly (e.g. in_progress -> In Progress)
const formatStatusDisplay = (rawStatus) => {
  if (!rawStatus) return 'Upcoming';
  const s = String(rawStatus).trim();
  // Format snake_case to Title Case (e.g., in_progress -> In Progress)
  return s
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function Rides() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Rides');
  const [searchTerm, setSearchTerm] = useState('');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('All Vehicles');
  const [usageTypeFilter, setUsageTypeFilter] = useState('All Types');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [vehicleTypeOpen, setVehicleTypeOpen] = useState(false);
  const [usageTypeOpen, setUsageTypeOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Applied filters state (only applies when "Apply" button is clicked)
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    vehicleType: 'All Vehicles',
    usageType: 'All Types',
    startDate: '',
    endDate: '',
  });

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      vehicleType: vehicleTypeFilter,
      usageType: usageTypeFilter,
      startDate: startDate,
      endDate: endDate,
    });
    setCurrentPage(1);
  };

  // Calendar UI state for interactive date picker
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1));
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Fetch Trips using TanStack Query
  const { data: tripsResponse } = useQuery({
    queryKey: ['admin-trips', currentPage, entriesPerPage],
    queryFn: () =>
      getTripsApi({
        page: currentPage,
        limit: entriesPerPage,
      }),
  });

  // Extract raw trips array safely
  const rawTrips = useMemo(() => {
    if (!tripsResponse) return [];
    if (Array.isArray(tripsResponse.data)) return tripsResponse.data;
    if (Array.isArray(tripsResponse.data?.trips)) return tripsResponse.data.trips;
    if (Array.isArray(tripsResponse.trips)) return tripsResponse.trips;
    return [];
  }, [tripsResponse]);

  // Map API trips to UI model
  const rides = useMemo(() => {
    if (tripsResponse) {
      return rawTrips.map((trip, idx) => {
        const dt = formatDateTime(trip.rideDateTime || trip.createdAt || trip.date);
        const isBus =
          (trip.vehicleCategory || trip.vehicleType || '').toLowerCase().includes('bus');

        const usageType =
          (trip.usageType || trip.vehicleType || '').toLowerCase() === 'private'
            ? 'Private'
            : 'Commercial';

        const status = formatStatusDisplay(trip.status || trip.tripStatus);

        const rideIdDisplay = String(trip.id ?? trip.rideId ?? (idx + 1)).replace(/^RD/i, '');

        const fareVal =
          trip.farePerKmPerSeat ??
          trip.fare ??
          trip.price ??
          trip.pricePerSeat ??
          0;

        return {
          id: trip.id || trip.rideId || idx + 1,
          rideId: rideIdDisplay,
          from: trip.from || '-',
          to: trip.to || '-',
          date: dt.date,
          time: dt.time,
          rawDateTime: trip.rideDateTime || trip.createdAt,
          vehicleNumber: trip.vehicleNumber || trip.vehicleRegistrationNumber || trip.regNo || '-',
          vehicleType: isBus ? 'Bus' : 'Car',
          vehicleImage: isBus ? busCutout : carCutout,
          driverName: trip.driverName || trip.driver?.name || 'Driver',
          driverAvatar: trip.driverImageUrl || trip.driver?.avatar || amitAvatar,
          usageType: usageType,
          bookedSeats: trip.bookedSeats ?? trip.seatsBooked ?? 0,
          totalSeats: trip.totalSeats ?? trip.seatCapacity ?? (isBus ? 36 : 4),
          fare: fareVal,
          status: status,
        };
      });
    }

    return [];
  }, [rawTrips, tripsResponse]);

  // Stats cards configuration (using default image counts as requested since API does not return stats)
  const ridesStatsConfig = [
    {
      id: 1,
      label: 'Total Rides',
      value: ridesStats.totalRides,
      image: totalRidesIcon,
      cardColor: 'bg-[#fffbeb] border-amber-200/80',
      iconBg: 'bg-amber-200/80',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 2,
      label: 'Upcoming',
      value: ridesStats.upcoming,
      image: upcomingRidesIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-emerald-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 3,
      label: 'Ongoing',
      value: ridesStats.ongoing,
      image: ongoingRidesIcon,
      cardColor: 'bg-[#eff6ff] border-blue-200/80',
      iconBg: 'bg-blue-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 4,
      label: 'Completed',
      value: ridesStats.completed,
      image: completedRidesIcon,
      cardColor: 'bg-[#f0fdf4] border-emerald-200/80',
      iconBg: 'bg-emerald-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
    {
      id: 5,
      label: 'Cancelled',
      value: ridesStats.cancelled,
      image: cancelledRidesIcon,
      cardColor: 'bg-[#fef2f2] border-rose-200/80',
      iconBg: 'bg-rose-100',
      iconBoxSize: 'w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl',
      iconSize: 'w-6 h-6 sm:w-8 sm:h-8',
      labelClassName: 'text-xs font-bold text-black',
      valueClassName: 'text-xl sm:text-2xl font-black text-black',
    },
  ];

  // Status pills configuration (NO count numbers as requested)
  const statusTabs = [
    { id: 'All Rides', label: 'All Rides', icon: Calendar },
    { id: 'Upcoming', label: 'Upcoming', icon: Calendar },
    { id: 'Ongoing', label: 'Ongoing', icon: Play },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'Cancelled', label: 'Cancelled', icon: XCircle },
  ];

  // Filtering (using appliedFilters)
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      // Tab filter
      if (activeTab !== 'All Rides') {
        const activeLower = activeTab.toLowerCase();
        const rideStatusLower = (ride.status || '').toLowerCase();
        if (activeLower === 'ongoing') {
          if (!rideStatusLower.includes('ongoing') && !rideStatusLower.includes('progress')) {
            return false;
          }
        } else if (!rideStatusLower.includes(activeLower)) {
          return false;
        }
      }

      // Search filter (applied)
      const term = appliedFilters.search.toLowerCase();
      const matchesSearch =
        !appliedFilters.search ||
        ride.rideId.toLowerCase().includes(term) ||
        ride.driverName.toLowerCase().includes(term) ||
        ride.vehicleNumber.toLowerCase().includes(term) ||
        ride.from.toLowerCase().includes(term) ||
        ride.to.toLowerCase().includes(term);

      // Dropdowns (applied)
      const matchesVehicleType =
        appliedFilters.vehicleType === 'All Vehicles' || ride.vehicleType === appliedFilters.vehicleType;
      const matchesUsageType =
        appliedFilters.usageType === 'All Types' || ride.usageType === appliedFilters.usageType;

      // Date range filter (applied)
      let matchesDate = true;
      if (appliedFilters.startDate || appliedFilters.endDate) {
        const rideDateObj = new Date(ride.rawDateTime || ride.date);
        if (!isNaN(rideDateObj.getTime())) {
          if (appliedFilters.startDate) {
            const startObj = new Date(appliedFilters.startDate);
            startObj.setHours(0, 0, 0, 0);
            if (rideDateObj < startObj) matchesDate = false;
          }
          if (appliedFilters.endDate) {
            const endObj = new Date(appliedFilters.endDate);
            endObj.setHours(23, 59, 59, 999);
            if (rideDateObj > endObj) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesVehicleType && matchesUsageType && matchesDate;
    });
  }, [rides, activeTab, appliedFilters]);

  const handleReset = () => {
    setSearchTerm('');
    setVehicleTypeFilter('All Vehicles');
    setUsageTypeFilter('All Types');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setActiveTab('All Rides');
    setAppliedFilters({
      search: '',
      vehicleType: 'All Vehicles',
      usageType: 'All Types',
      startDate: '',
      endDate: '',
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-3.5 select-none pb-8">
      {/* =========================================================
          1. TOP 5 STATS CARDS (Reusable StatsCards)
          ========================================================= */}
      <StatsCards
        items={ridesStatsConfig}
        columns="grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
      />

      {/* =========================================================
          2. FILTER TABS (All Rides, Upcoming, Ongoing, Completed, Cancelled)
          ========================================================= */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 py-1">
        {statusTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 sm:px-4 rounded-xl text-xs sm:text-[13.5px] font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-amber-300/40'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[2.2] shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          3. SEARCH & DROPDOWN FILTERS BAR
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5">
        {/* Search by Ride ID, Driver, Vehicle Number or Route */}
        <div className="relative flex-1 min-w-[240px] max-w-md max-sm:max-w-full">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
            placeholder="Search by Ride ID, Driver, Vehicle Number..."
            className="w-full pl-10.5 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-wrap max-sm:flex-col items-end max-sm:items-stretch gap-2">
          {/* Vehicle Type */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-2">
              Vehicle Type
            </label>
            <button
              type="button"
              onClick={() => {
                setVehicleTypeOpen(!vehicleTypeOpen);
                setUsageTypeOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-42 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{vehicleTypeFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  vehicleTypeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {vehicleTypeOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['All Vehicles', 'Car', 'Bus'].map((type) => {
                  const isSelected = vehicleTypeFilter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        setVehicleTypeFilter(type);
                        setVehicleTypeOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
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

          {/* Usage Type */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Usage Type
            </label>
            <button
              type="button"
              onClick={() => {
                setUsageTypeOpen(!usageTypeOpen);
                setVehicleTypeOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-42 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{usageTypeFilter}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  usageTypeOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {usageTypeOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['All Types', 'Commercial', 'Private'].map((usage) => {
                  const isSelected = usageTypeFilter === usage;
                  return (
                    <button
                      key={usage}
                      type="button"
                      onClick={() => {
                        setUsageTypeFilter(usage);
                        setUsageTypeOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
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

          {/* Ride Date Dropdown & Picker */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Ride Date
            </label>
            <button
              type="button"
              onClick={() => {
                if (!datePickerOpen) {
                  setTempStart(startDate);
                  setTempEnd(endDate);
                  if (startDate) {
                    const [y, m] = startDate.split('-').map(Number);
                    if (y && m) setCalendarViewDate(new Date(y, m - 1, 1));
                  }
                }
                setDatePickerOpen(!datePickerOpen);
                setVehicleTypeOpen(false);
                setUsageTypeOpen(false);
              }}
              className="w-full sm:w-54 flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-1.5 text-slate-700 truncate text-xs sm:text-sm">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                {startDate || endDate
                  ? `${startDate ? startDate.split('-').reverse().join('-') : 'Start'} → ${endDate ? endDate.split('-').reverse().join('-') : 'End'}`
                  : 'Select Date Range'}
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Date Range Picker Popover with Custom Calendar View */}
            {datePickerOpen && (
              <div className="absolute right-0 max-sm:left-0 mt-1.5 sm:w-68 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 space-y-2.5 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">
                      Ride Date Range
                    </span>
                  </div>
                  {(tempStart || tempEnd || startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempStart('');
                        setTempEnd('');
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Interactive Calendar Month View */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      {calendarViewDate.toLocaleString('default', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-1 hover:bg-white rounded-md text-slate-600 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day of week headers */}
                  <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-[9px] font-bold text-slate-400">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {(() => {
                      const year = calendarViewDate.getFullYear();
                      const month = calendarViewDate.getMonth();
                      const firstDayIndex = new Date(year, month, 1).getDay();
                      const totalDays = new Date(year, month + 1, 0).getDate();
                      const days = [];

                      for (let i = 0; i < firstDayIndex; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="h-6 w-full" />
                        );
                      }

                      for (let day = 1; day <= totalDays; day++) {
                        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isStart = tempStart === dateString;
                        const isEnd = tempEnd === dateString;
                        const inRange =
                          tempStart &&
                          tempEnd &&
                          dateString >= tempStart &&
                          dateString <= tempEnd;

                        days.push(
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              if (!tempStart || (tempStart && tempEnd)) {
                                setTempStart(dateString);
                                setTempEnd('');
                              } else if (tempStart && !tempEnd) {
                                if (dateString < tempStart) {
                                  setTempEnd(tempStart);
                                  setTempStart(dateString);
                                } else {
                                  setTempEnd(dateString);
                                }
                              }
                            }}
                            className={`h-6 text-[10px] rounded-md font-medium transition-colors cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                                : inRange
                                ? 'bg-amber-100 text-amber-900 rounded-none max-sm:w-full'
                                : 'text-slate-700 hover:bg-white hover:text-slate-900'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-0.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempStart(startDate);
                      setTempEnd(endDate);
                      setDatePickerOpen(false);
                    }}
                    className="flex-1 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate(tempStart);
                      setEndDate(tempEnd);
                      setDatePickerOpen(false);
                      setCurrentPage(1);
                    }}
                    className="flex-1 h-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApplyFilters}
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer max-sm:w-full"
          >
            <Filter className="w-4 h-4 fill-black" />
            Apply
          </button>
        </div>
      </div>

      {/* =========================================================
          4. RIDES TABLE
          ========================================================= */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[1050px]">
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5 text-center w-12 whitespace-nowrap">#</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Ride ID</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Route (From → To)</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Ride Date & Time</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Vehicle</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Driver</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Type</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Total Seats</th>
                <th className="py-2.5 px-3 text-center whitespace-nowrap">Booked Seats</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Fare (Seat)</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Status</th>
                <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] font-bold text-slate-700">
              {filteredRides.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400 font-semibold text-sm">
                    No rides found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredRides.map((ride, index) => {
                  return (
                    <tr
                      key={ride.id}
                      onClick={() => navigate(`/rides/${ride.id || ride.rideId}`)}
                      className="hover:bg-amber-50/40 transition-colors cursor-pointer"
                    >
                      {/* 1. Index */}
                      <td className="py-2 px-2.5 pl-4 text-center text-slate-900 font-bold whitespace-nowrap">
                        {index + 1}
                      </td>

                      {/* 2. Ride ID */}
                      <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {ride.rideId}
                      </td>

                      {/* 3. Route */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full border-2 border-emerald-500 shrink-0" />
                          <span>{ride.from}</span>
                          <span className="text-slate-400 mx-0.5">→</span>
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                          <span>{ride.to}</span>
                        </div>
                      </td>

                      {/* 4. Ride Date & Time */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs whitespace-nowrap">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="whitespace-nowrap">
                            {ride.date}, {ride.time}
                          </span>
                        </div>
                      </td>

                      {/* 5. Vehicle (Plate Only) */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-xs">
                          {ride.vehicleNumber}
                        </span>
                      </td>

                      {/* 6. Driver (Avatar + Name) */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <img
                            src={ride.driverAvatar}
                            alt={ride.driverName}
                            className="w-7 h-7 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = amitAvatar;
                            }}
                          />
                          <span className="font-bold text-slate-900 text-xs">
                            {ride.driverName}
                          </span>
                        </div>
                      </td>

                      {/* 7. Type Badge */}
                      <td className="py-2 px-3 whitespace-nowrap">
                        {ride.usageType === 'Commercial' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                            Commercial
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 whitespace-nowrap">
                            Private
                          </span>
                        )}
                      </td>

                      {/* 8. Total Seats */}
                      <td className="py-2 px-2.5 text-center font-bold text-slate-900 text-xs whitespace-nowrap">
                        {ride.totalSeats}
                      </td>

                      {/* 9. Booked Seats */}
                      <td className="py-2 px-2.5 text-center font-bold text-slate-900 text-xs whitespace-nowrap">
                        {ride.bookedSeats}
                      </td>

                      {/* 10. Fare (Seat) */}
                      <td className="py-2 px-3 text-center font-bold text-slate-900 text-xs sm:text-[13px] whitespace-nowrap">
                        ₹ {ride.fare}
                      </td>

                      {/* 11. Status Badge */}
                      <td className="py-2 px-3 text-center whitespace-nowrap">
                        {ride.status.toLowerCase() === 'completed' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            {ride.status}
                          </span>
                        ) : ride.status.toLowerCase().includes('progress') || ride.status.toLowerCase() === 'ongoing' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                            {ride.status}
                          </span>
                        ) : ride.status.toLowerCase() === 'upcoming' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                            {ride.status}
                          </span>
                        ) : ride.status.toLowerCase() === 'cancelled' || ride.status.toLowerCase() === 'canceled' ? (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-100">
                            {ride.status}
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200">
                            {ride.status}
                          </span>
                        )}
                      </td>

                      {/* 11. Action View Button */}
                      <td className="py-2 px-3 pr-4 text-center">
                        <button
                          onClick={() => navigate(`/rides/${ride.id || ride.rideId}`)}
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
          totalItems={tripsResponse?.meta?.total ?? filteredRides.length}
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
