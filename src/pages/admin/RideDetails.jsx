import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Play,
  Calendar,
  Phone,
  Mail,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { getTripByIdApi } from '../../services/trip.services';
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';
import coachBusCutout from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
import paleYellowWavesBg from '../../assets/drivers/Pale Yellow Layered Waves.png';
import vehicleCarIcon from '../../assets/drivers/bus-vehicle.svg';
import briefcaseIcon from '../../assets/drivers/briefcase-icon.svg';
import amitAvatar from '../../assets/amit_kumar_photo.png';

// Assets & Icons
import routeDetailsIcon from '../../assets/dashboard/akar-icons_location.svg';
import destinationIcon from '../../assets/dashboard/b526c866-7ce7-4c15-848e-ed8378b03085 36.svg';
import pickupIcon from '../../assets/dashboard/b526c866-7ce7-4c15-848e-ed8378b03085 38.svg';
import driverDetailsIcon from '../../assets/drivers/assigned-driver.svg';
import vehicleDetailsIcon from '../../assets/drivers/bus-vehicle.svg';
import selectedRouteIcon from '../../assets/dashboard/road-icon.svg';
import totalDistanceIcon from '../../assets/dashboard/opposite-arrows-icon.svg';
import rideInfoIcon from '../../assets/dashboard/info-icon-transparent.svg';
import totalSeatsIcon from '../../assets/drivers/seat-arrangement.svg';
import bookedSeatsIcon from '../../assets/dashboard/group-users-icon.svg';
import availableSeatsIcon from '../../assets/drivers/seat-icon.svg';
import farePerSeatIcon from '../../assets/drivers/b526c866-7ce7-4c15-848e-ed8378b03085 23.svg';
import totalRideFareIcon from '../../assets/dashboard/database-icon-transparent.svg';
import passengerListIcon from '../../assets/dashboard/Group (9).svg';
import cancelledByDriverIcon from '../../assets/dashboard/Group (10).svg';
import cancellationReasonIcon from '../../assets/dashboard/chat-message-icon-transparent.svg';
import cancellationDateTimeIcon from '../../assets/dashboard/72658f49-1c99-42c0-b972-a95bf219ed1e 9.svg';

import { Pagination, DetailsHeader } from '../../components/common';

// Format status (e.g. in_progress -> In Progress)
const formatStatus = (s) => {
  if (!s) return 'Upcoming';
  return String(s)
    .trim()
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
};

// Format date and time
const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return { date: '-', time: '-' };
  try {
    let dateFormatted = dateStr;
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      dateFormatted = d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    let timeFormatted = timeStr || '';
    if (timeStr && timeStr.includes(':')) {
      const parts = timeStr.split(':');
      const hour = parseInt(parts[0], 10);
      const min = parts[1];
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const h12 = hour % 12 || 12;
      timeFormatted = `${String(h12).padStart(2, '0')}:${min} ${ampm}`;
    } else if (!timeStr && !isNaN(d.getTime())) {
      timeFormatted = d.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    }

    return { date: dateFormatted, time: timeFormatted || '-' };
  } catch {
    return { date: dateStr, time: timeStr || '-' };
  }
};

export default function RideDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const tripId = useMemo(() => {
    if (!id) return '';
    return String(id).replace(/^RD/i, '');
  }, [id]);

  // Fetch Trip Details
  const {
    data: tripResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-trip-details', tripId],
    queryFn: () => getTripByIdApi(tripId),
    enabled: !!tripId,
  });

  const apiData = tripResponse?.data;

  // Map API response to UI model
  const ride = useMemo(() => {
    if (!apiData) return null;

    const isBus = (apiData.vehicle?.category || apiData.vehicle?.type || '')
      .toLowerCase()
      .includes('bus');
    const dt = formatDateTime(
      apiData.ride?.departureDate || apiData.ride?.rideDateTime,
      apiData.ride?.departureTime
    );

    return {
      rideId: apiData.ride?.rideId
        ? String(apiData.ride.rideId).startsWith('RD')
          ? apiData.ride.rideId
          : `RD${apiData.ride.rideId}`
        : id || 'RD1',
      status: formatStatus(apiData.ride?.status),
      date: dt.date,
      time: dt.time,
      vehicleType: isBus ? 'Bus' : 'Car',
      usageType: apiData.vehicle?.type || 'Commercial',
      vehicleImage: isBus ? coachBusCutout : carCutout,
      driver: {
        driverId: apiData.driver?.driverId ? `DR${apiData.driver.driverId}` : '-',
        name: apiData.driver?.name || 'Driver',
        phone: apiData.driver?.mobile || '-',
        email: apiData.driver?.email || '-',
        avatar: apiData.driver?.imageUrl || amitAvatar,
        isKycVerified: true,
      },
      vehicle: {
        number: apiData.vehicle?.registrationNumber || '-',
        brand: apiData.vehicle?.brand || '-',
        model: apiData.vehicle?.model || '-',
        color: apiData.vehicle?.color ? (apiData.vehicle.color.charAt(0).toUpperCase() + apiData.vehicle.color.slice(1).toLowerCase()) : '-',
        type: isBus ? 'Bus' : 'Car',
        usage: apiData.vehicle?.type || 'Commercial',
        seatingCapacity: apiData.vehicle?.seatCapacity
          ? `${apiData.vehicle.seatCapacity} Seats`
          : apiData.seats?.total
          ? `${apiData.seats.total} Seats`
          : '-',
      },
      route: {
        pickup: apiData.route?.pickup?.address || '-',
        destination: apiData.route?.drop?.address || '-',
        selectedRoute: `${apiData.route?.pickup?.address || 'Pickup'} → ${
          apiData.route?.drop?.address || 'Destination'
        }`,
        totalDistance: apiData.route?.distanceKm != null ? `${apiData.route.distanceKm} km` : '-',
      },
      info: {
        totalSeats: apiData.seats?.total ?? apiData.vehicle?.seatCapacity ?? 0,
        bookedSeats: apiData.seats?.booked ?? 0,
        availableSeats:
          apiData.seats?.left ??
          Math.max(0, (apiData.seats?.total ?? 0) - (apiData.seats?.booked ?? 0)),
        farePerSeat: apiData.ride?.farePerKmPerSeat ?? 0,
        totalRideFare: apiData.fare?.totalRideFare ?? 0,
        collectedFare: apiData.fare?.collectedFare ?? 0,
      },
      passengers: (apiData.passengers || []).map((p, idx) => ({
        id: p.bookingId || p.userId || idx + 1,
        bookingId: p.bookingId ?? idx + 1,
        name: p.name || 'Passenger',
        avatar: p.imageUrl || amitAvatar,
        phone: p.mobile || '-',
        seats: p.seats != null ? p.seats : '-',
        bookingStatus: formatStatus(p.status),
        fare: p.fare != null ? p.fare : 0,
        paymentStatus: p.paymentStatus
          ? p.paymentStatus.charAt(0).toUpperCase() + p.paymentStatus.slice(1).toLowerCase()
          : 'Paid',
        paymentMethod: p.paymentMethod
          ? p.paymentMethod.charAt(0).toUpperCase() + p.paymentMethod.slice(1).toLowerCase()
          : 'Cash',
        dropPoint: p.dropPoint?.address || '-',
        dropPointType: p.dropPointType
          ? p.dropPointType.charAt(0).toUpperCase() + p.dropPointType.slice(1).toLowerCase()
          : 'Dropped',
        distanceKm: p.distanceKm != null ? `${p.distanceKm} km` : '-',
      })),
      cancellation: apiData.cancellation || null,
    };
  }, [apiData, id]);

  // Paginated passenger list
  const paginatedPassengers = useMemo(() => {
    if (!ride?.passengers) return [];
    const start = (currentPage - 1) * entriesPerPage;
    return ride.passengers.slice(start, start + entriesPerPage);
  }, [ride?.passengers, currentPage, entriesPerPage]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4 select-none pb-12">
        <DetailsHeader
          title="Ride Details"
          breadcrumbs={[{ label: 'Rides', path: '/rides' }, { label: 'Ride Details' }]}
        />
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError || !ride) {
    return (
      <div className="space-y-4 select-none pb-12">
        <DetailsHeader
          title="Ride Details"
          breadcrumbs={[{ label: 'Rides', path: '/rides' }, { label: 'Ride Details' }]}
        />
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center flex flex-col items-center justify-center gap-3">
          <AlertTriangle className="w-10 h-10 text-rose-500" />
          <h3 className="text-sm font-bold text-slate-800">Trip details not found</h3>
          <p className="text-xs text-slate-500">Trip data could not be fetched for ID {id}.</p>
          <button
            onClick={() => navigate('/rides')}
            className="px-4 py-2 bg-[#fed011] hover:bg-amber-400 text-black font-bold rounded-xl text-xs cursor-pointer"
          >
            Back to Rides
          </button>
        </div>
      </div>
    );
  }

  const isOngoingOrProgress =
    ride.status.toLowerCase().includes('progress') || ride.status.toLowerCase() === 'ongoing';
  const isCompleted = ride.status.toLowerCase() === 'completed';
  const isCancelled =
    ride.status.toLowerCase() === 'cancelled' || ride.status.toLowerCase() === 'canceled';

  const infoCards = [
    {
      label: 'Total Seats',
      value: ride.info.totalSeats,
      icon: totalSeatsIcon,
      bg: 'bg-[#fffdf2]',
      border: 'border-amber-200/70',
      iconBg: 'bg-amber-100',
    },
    {
      label: 'Booked Seats',
      value: ride.info.bookedSeats,
      icon: bookedSeatsIcon,
      bg: 'bg-[#f0fdf4]',
      border: 'border-emerald-200/70',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Available Seats',
      value: ride.info.availableSeats,
      icon: availableSeatsIcon,
      bg: 'bg-[#eff6ff]',
      border: 'border-blue-200/70',
      iconBg: 'bg-blue-100',
    },
    {
      label: 'Fare / Km / Seat',
      value: `₹ ${ride.info.farePerSeat}`,
      icon: farePerSeatIcon,
      bg: 'bg-[#faf5ff]',
      border: 'border-purple-200/70',
      iconBg: 'bg-purple-100',
    },
    {
      label: 'Total Ride Fare',
      value: `₹ ${
        typeof ride.info.totalRideFare === 'number'
          ? ride.info.totalRideFare.toLocaleString()
          : ride.info.totalRideFare
      }`,
      icon: totalRideFareIcon,
      bg: 'bg-[#fffdf2]',
      border: 'border-amber-300/80',
      iconBg: 'bg-amber-200',
    },
    {
      label: 'Collected Fare',
      value: `₹ ${
        typeof ride.info.collectedFare === 'number'
          ? ride.info.collectedFare.toLocaleString()
          : ride.info.collectedFare
      }`,
      icon: totalRideFareIcon,
      bg: 'bg-[#f0fdf4]',
      border: 'border-emerald-200/80',
      iconBg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="space-y-4 select-none pb-12">
      {/* 1. Header */}
      <DetailsHeader
        title="Ride Details"
        breadcrumbs={[{ label: 'Rides', path: '/rides' }, { label: 'Ride Details' }]}
      />

      {/* 2. Hero Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-90">
          <img
            src={paleYellowWavesBg}
            alt="Waves Banner"
            className="w-full h-full object-cover sm:object-fill object-center"
          />
        </div>

        <div className="w-full p-4 sm:px-6 lg:px-8 sm:py-5 flex flex-wrap items-center justify-between gap-4 md:gap-8 relative z-10">
          {/* Left: Vehicle cutout + Ride ID + Status */}
          <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
            <div className="w-24 h-16 sm:w-36 sm:h-20 lg:w-44 lg:h-22 flex items-center justify-center shrink-0">
              <img
                src={ride.vehicleImage}
                alt={ride.vehicleType}
                className="max-w-full max-h-full object-contain select-none transition-transform hover:scale-105 drop-shadow-sm"
              />
            </div>

            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Ride ID
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-black tracking-tight leading-none">
                {ride.rideId}
              </h2>
              <div className="pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-[13px] font-bold shadow-2xs ${
                    isOngoingOrProgress
                      ? 'bg-amber-400 text-black font-black'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : isCancelled
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-500 text-white'
                  }`}
                >
                  <Play
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${
                      isOngoingOrProgress ? 'fill-black text-black' : 'fill-white text-white'
                    }`}
                  />
                  <span>{ride.status}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-300/80 shrink-0" />

          {/* Middle: Date & Time */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-white/95 border border-slate-200/90 flex items-center justify-center text-slate-700 shadow-2xs shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-[11px] sm:text-xs font-bold text-slate-500">Ride Date & Time</p>
              <p className="text-sm sm:text-base lg:text-lg font-black text-black whitespace-nowrap">
                {ride.date}, {ride.time}
              </p>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-300/80 shrink-0" />

          {/* Right: Vehicle & Usage Type */}
          <div className="flex sm:flex-col items-center sm:items-start gap-2 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-2xs">
              <img src={vehicleCarIcon} alt={ride.vehicleType} className="w-3.5 h-3.5 object-contain" />
              <span>{ride.vehicleType}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-2xs">
              <img src={briefcaseIcon} alt={ride.usageType} className="w-3.5 h-3.5 object-contain" />
              <span>{ride.usageType}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Driver & Vehicle Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        {/* Driver */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <img src={driverDetailsIcon} alt="Driver" className="w-6 h-6 object-contain" />
            </div>
            <h3 className="text-base sm:text-[17px] font-bold text-black">Driver Details</h3>
          </div>

          <div className="flex items-center gap-4 pt-0.5">
            <img
              src={ride.driver.avatar}
              alt={ride.driver.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = amitAvatar;
              }}
            />
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-black truncate">{ride.driver.name}</h4>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{ride.driver.phone}</span>
              </div>
              {ride.driver.email !== '-' && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate max-w-[200px]">{ride.driver.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Vehicle */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <img src={vehicleDetailsIcon} alt="Vehicle" className="w-6 h-6 object-contain" />
            </div>
            <h3 className="text-base sm:text-[17px] font-bold text-black">Vehicle Details</h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-y-2 gap-x-4 text-xs pt-0.5">
            <div>
              <span className="text-slate-500 font-semibold">Vehicle Number :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{ride.vehicle.number}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Brand :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{ride.vehicle.brand}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Model :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{ride.vehicle.model}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Color :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5 capitalize">
                {ride.vehicle.color}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Vehicle Type :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{ride.vehicle.type}</p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Usage Type :</span>
              <div className="mt-0.5">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                  {ride.vehicle.usage}
                </span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Seating Capacity :</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{ride.vehicle.seatingCapacity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Route Details */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <img src={routeDetailsIcon} alt="Route" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">Route Details</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Pickup & Destination */}
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <img src={pickupIcon} alt="Pickup" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Pickup Location</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.pickup}</p>
              </div>
            </div>

            <div className="border-l-2 border-dashed border-slate-300 h-3.5 ml-2.5 -my-1" />

            <div className="flex items-start gap-3">
              <img src={destinationIcon} alt="Drop" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Destination</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{ride.route.destination}</p>
              </div>
            </div>
          </div>

          {/* Selected Route */}
          <div className="space-y-2.5 md:pl-4">
            <div className="flex items-start gap-2.5">
              <img src={selectedRouteIcon} alt="Route" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Selected Route</p>
                <p className="text-xs sm:text-[13.5px] font-bold text-slate-900 mt-0.5">
                  {ride.route.selectedRoute}
                </p>
              </div>
            </div>
          </div>

          {/* Total Distance */}
          <div className="space-y-2.5 md:pl-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <img src={totalDistanceIcon} alt="Distance" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Distance</p>
                <p className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">{ride.route.totalDistance}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Ride Information (5 Cards) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <img src={rideInfoIcon} alt="Info" className="w-6 h-6 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">Ride Information</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-0.5">
          {infoCards.map((c, i) => (
            <div
              key={i}
              className={`${c.bg} ${c.border} rounded-xl p-2.5 sm:p-3 border shadow-2xs flex items-center gap-3 ${
                c.fullOnMobile ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0`}>
                <img src={c.icon} alt={c.label} className="w-6 h-6 object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-600">{c.label}</p>
                <h4 className="text-lg sm:text-xl font-black text-black mt-0.5">{c.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Passenger List Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden p-3.5 sm:p-4 space-y-3">
        <div className="flex items-center gap-2.5 text-slate-900 border-b border-slate-100 pb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <img src={passengerListIcon} alt="Passengers" className="w-5 h-5 object-contain" />
          </div>
          <h3 className="text-base sm:text-[17px] font-bold text-black">
            Passenger List ({ride.passengers?.length || 0})
          </h3>
        </div>

        <div className="rounded-xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fef9ec] border-b border-amber-100/60 text-xs font-bold text-slate-900">
                  <th className="py-2.5 px-3 pl-4 text-center w-10 whitespace-nowrap">#</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Booking ID</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Passenger Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Mobile Number</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Seats</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Drop Point</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Drop Type</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Distance</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Fare</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Payment Method</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">Payment Status</th>
                  <th className="py-2.5 px-3 pr-4 text-center whitespace-nowrap">Booking Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-[13px] font-bold text-slate-700">
                {paginatedPassengers.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-center text-slate-400 font-semibold text-xs">
                      No passengers booked for this ride.
                    </td>
                  </tr>
                ) : (
                  paginatedPassengers.map((p, index) => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 1. Index */}
                      <td className="py-2.5 px-3 pl-4 text-center text-slate-900 font-bold whitespace-nowrap">
                        {(currentPage - 1) * entriesPerPage + index + 1}
                      </td>

                      {/* 2. Exact Booking ID */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                        {p.bookingId}
                      </td>

                      {/* 3. Passenger Avatar & Name */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-7 h-7 rounded-full object-cover border border-amber-300 ring-1 ring-amber-100 shrink-0"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = amitAvatar;
                            }}
                          />
                          <span className="font-bold text-slate-900">{p.name}</span>
                        </div>
                      </td>

                      {/* 4. Mobile Number */}
                      <td className="py-2.5 px-3 text-slate-800 font-medium whitespace-nowrap">
                        {p.phone}
                      </td>

                      {/* 5. Seats */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                        {p.seats}
                      </td>

                      {/* 6. Drop Point */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-xs font-semibold text-slate-700">
                        {p.dropPoint}
                      </td>

                      {/* 7. Drop Type */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-100 capitalize">
                          {p.dropPointType}
                        </span>
                      </td>

                      {/* 8. Distance */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 whitespace-nowrap">
                        {p.distanceKm}
                      </td>

                      {/* 9. Fare */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900 whitespace-nowrap">
                        ₹ {p.fare}
                      </td>

                      {/* 10. Payment Method */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 capitalize">
                          {p.paymentMethod}
                        </span>
                      </td>

                      {/* 11. Payment Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            p.paymentStatus.toLowerCase() === 'paid'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                              : 'text-amber-700 bg-amber-50 border border-amber-100'
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>

                      {/* 12. Booking Status */}
                      <td className="py-2.5 px-3 pr-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 whitespace-nowrap">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          {p.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={ride.passengers?.length || 0}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setEntriesPerPage}
            pageSizeOptions={[5, 10, 20]}
            itemLabel="passengers"
          />
        </div>
      </div>

      {/* 7. Cancellation Details (Only if cancelled) */}
      {(isCancelled || ride.cancellation) && (
        <div className="bg-[#fff8f8] rounded-2xl border border-rose-200/80 shadow-2xs p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose-600 border-b border-rose-100 pb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <XCircle className="w-4 h-4 stroke-[2.3]" />
            </div>
            <h3 className="text-base sm:text-[17px] font-bold text-black">Cancellation Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 divide-y sm:divide-y-0 sm:divide-x divide-rose-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <img src={cancelledByDriverIcon} alt="Cancelled By" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Cancelled By</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {ride.cancellation?.cancelledBy || 'Driver'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:pl-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <img src={cancellationReasonIcon} alt="Reason" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Cancellation Reason</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {ride.cancellation?.reason || 'Ride Cancelled'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:pl-4">
              <div className="w-9 h-9 rounded-xl bg-white border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <img src={cancellationDateTimeIcon} alt="Date & Time" className="w-5 h-5 object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Cancellation Date & Time</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {ride.cancellation?.dateTime || '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
