import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  Car,
  Briefcase,
  Check,
  Phone,
  FileText,
  FileSpreadsheet,
  Bus,
  Armchair
} from 'lucide-react';
import { vehiclesList } from '../../data/vehiclesData';
import { useAuthStore } from '../../store/authStore';
import { DetailsHeader } from '../../components/common';

export default function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const admin = useAuthStore((state) => state.admin);

  // Match vehicle by id or vehicleNumber, fallback to BR01PC5544 (id 5)
  const matchedVehicle = vehiclesList.find(
    (v) => String(v.id) === id || v.vehicleNumber.toLowerCase() === (id || '').toLowerCase()
  );

  const vehicle = matchedVehicle || vehiclesList[4]; // Default Tata Starbus BR01PC5544

  const isBus = vehicle.vehicleType === 'Bus';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-12 select-none">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Vehicle Details"
        breadcrumbs={[
          { label: 'Vehicles', path: '/vehicles' },
          { label: 'Vehicle Details' },
        ]}
      />

      <div className="space-y-2.5">
        {/* =========================================================
            TOP VEHICLE HERO CARD
            ========================================================= */}
        <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs relative overflow-hidden">
          {/* Subtle warm backdrop effect */}
          <div className="absolute right-0 bottom-0 w-96 h-full bg-linear-to-l from-amber-50/50 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 relative z-10">
            {/* Left: Bus/Vehicle Hero Image + Number + Badges */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="w-56 sm:w-64 h-26 flex items-center justify-center shrink-0">
                <img
                  src={vehicle.heroImage || vehicle.image}
                  alt={vehicle.vehicleNumber}
                  className="max-w-full max-h-full object-contain select-none"
                />
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-black tracking-tight leading-none">
                  {vehicle.vehicleNumber}
                </h2>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                  {/* Vehicle Type Pill */}
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Bus className="w-4 h-4 text-emerald-700" />
                    {vehicle.vehicleType}
                  </span>

                  {/* Usage Type Pill */}
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <Briefcase className="w-4 h-4 text-emerald-700 stroke-[2.2]" />
                    {vehicle.usageType}
                  </span>

                  {/* Status Pill */}
                  <span className="inline-flex items-center gap-2 text-[13px] font-bold text-white bg-emerald-600 px-3.5 py-1 rounded-full shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-white" />
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Spec Stat Box (Brand, Model, Seats) */}
            <div className="flex items-center gap-5 sm:gap-7 border-t lg:border-t-0 lg:border-l border-slate-100 pt-2.5 lg:pt-0 lg:pl-7 self-center">
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
                  <Car className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Brand</p>
                  <p className="text-base sm:text-lg font-bold text-black">{vehicle.brand || 'Tata'}</p>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-200 hidden sm:block" />

              {/* Model */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
                  <Car className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Model</p>
                  <p className="text-base sm:text-lg font-bold text-black">{vehicle.model || 'Starbus'}</p>
                </div>
              </div>

              <div className="w-px h-8 bg-slate-200 hidden sm:block" />

              {/* Seats */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700">
                  <Armchair className="w-5.5 h-5.5 stroke-[2]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500">Seats</p>
                  <p className="text-base sm:text-lg font-bold text-black">{vehicle.seats}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            ROW 2: Vehicle Information (Left) + Vehicle Photos & Bus Configuration (Right)
            ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
          {/* ----------------- LEFT COLUMN (col-span-5) ----------------- */}
          <div className="lg:col-span-5 space-y-2.5">
            {/* 1. Vehicle Information Card */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg">
                  <Car className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black">
                  Vehicle Information
                </h3>
              </div>

              <div className="space-y-1.5 pt-2 text-[13px] sm:text-sm">
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Vehicle Number</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.vehicleNumber}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Vehicle Type</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.vehicleType}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Usage Type</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.usageType}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Brand</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.brand || 'Tata'}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Model</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.model || 'Starbus'}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Color</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.color || 'White & Green'}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Seating Capacity</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.seats}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Bus Type</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.busType || 'Non-AC'}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Bus Category</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.busCategory || 'Seater'}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 items-center">
                  <span className="col-span-5 text-slate-700 font-bold">Manufacturing Year</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 font-bold text-black">{vehicle.mfgYear || '2023'}</span>
                </div>
              </div>
            </div>

            {/* 2. Assigned Driver Card */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg">
                  <Phone className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black">
                  Assigned Driver
                </h3>
              </div>

              <div className="flex items-center gap-3 pt-2.5">
                <img
                  src={vehicle.driverAvatar}
                  alt={vehicle.driverName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-amber-300 ring-2 ring-amber-100 shrink-0"
                />
                <div className="space-y-0.5">
                  <h4 className="text-base sm:text-lg font-bold text-black leading-tight">
                    {vehicle.driverName}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] sm:text-sm font-bold text-slate-800">
                      {vehicle.driverPhone || '+91 98765 43210'}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      Verified
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500">
                    Driver ID: {vehicle.driverId || 'DRV10045'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------- RIGHT COLUMN (col-span-7) ----------------- */}
          <div className="lg:col-span-7 space-y-2.5">
            {/* 1. Vehicle Photos Card */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg">
                  <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black">
                  Vehicle Photos
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {(vehicle.photos || []).map((photo, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-full h-20 sm:h-22 rounded-xl overflow-hidden border border-slate-200/80 bg-slate-50 shadow-2xs">
                      <img
                        src={photo.img}
                        alt={photo.label}
                        className="w-full h-full object-cover select-none"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-800 mt-1 text-center">
                      {photo.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Bus Configuration & Layout Card */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg">
                  <Armchair className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black">
                  Bus Configuration
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2">
                {/* Left: Spec Table */}
                <div className="sm:col-span-7 space-y-1.5 text-[13px] sm:text-sm">
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Seat Configuration</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.seatConfiguration || '2 × 2'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Total Rows</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.totalRows || 9}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Left Side Seats (per row)</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.leftSideSeats || 2}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Right Side Seats (per row)</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.rightSideSeats || 2}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Aisle Position</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.aislePosition || 'Center'}
                    </span>
                  </div>
                  <div className="grid grid-cols-12 gap-1 items-center">
                    <span className="col-span-6 text-slate-700 font-bold">Total Seating Capacity</span>
                    <span className="col-span-1 text-slate-400">:</span>
                    <span className="col-span-5 font-bold text-black">
                      {vehicle.configuration?.totalSeatingCapacity || 36}
                    </span>
                  </div>
                </div>

                {/* Right: Coach Seat Mini Layout Capsule (Exact representation) */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center">
                  <div className="w-30 bg-slate-50 border border-slate-300 rounded-xl p-2 shadow-2xs flex flex-col items-center">
                    {/* Driver Top indicator */}
                    <div className="w-full flex items-center justify-between pb-1 mb-1 border-b border-slate-200 text-xs font-bold text-slate-700 px-1">
                      <span className="text-xs">🛞</span>
                      <span>Driver</span>
                    </div>

                    {/* 2x2 Mini Seat Matrix (5 rows shown symbolically) */}
                    <div className="space-y-1 w-full">
                      {[1, 2, 3, 4, 5].map((row) => (
                        <div key={row} className="flex items-center justify-between px-1">
                          {/* Left 2 seats */}
                          <div className="flex gap-1">
                            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                          </div>
                          {/* Aisle */}
                          <div className="w-2" />
                          {/* Right 2 seats */}
                          <div className="flex gap-1">
                            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-xs bg-emerald-500 shadow-xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800 mt-1">
                    2 × 2 (36 Seats)
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Vehicle Documents Table */}
            <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="p-1.5 bg-amber-100/70 text-amber-700 rounded-lg">
                  <FileText className="w-4 h-4 stroke-[2.2]" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-black">
                  Vehicle Documents
                </h3>
              </div>

              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left text-[13px] sm:text-sm font-bold">
                  <thead>
                    <tr className="text-xs text-slate-700 border-b border-slate-100">
                      <th className="py-1.5 px-2.5 text-center w-8">#</th>
                      <th className="py-1.5 px-2.5">Document Name</th>
                      <th className="py-1.5 px-2.5">Document</th>
                      <th className="py-1.5 px-2.5 text-right">Validity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {(vehicle.documents || []).map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-1.5 px-2.5 text-center text-slate-900">{doc.id}</td>
                        <td className="py-1.5 px-2.5 text-slate-900 font-bold">{doc.name}</td>
                        <td className="py-1.5 px-2.5">
                          <span className="inline-flex items-center gap-1.5 text-blue-600 select-none">
                            <span className="w-4 h-4 rounded bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-bold">
                              PDF
                            </span>
                            {doc.linkText}
                          </span>
                        </td>
                        <td className="py-1.5 px-2.5 text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
                            {doc.validity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

