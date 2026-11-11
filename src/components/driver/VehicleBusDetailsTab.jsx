import React, { useState } from 'react';

import coachBusCutout from '../../assets/Share Chalo Coach Bus.png';
import carCutout from '../../assets/White Compact Hatchback Car Cutout.png';

// High-resolution sharp bus images directly requested by the user
import busHighRes1 from '../../assets/White_Share_Chalo_Bus_on_Tree_Lined_Road.png';
import busHighRes2 from '../../assets/White_Coach_Bus_on_a_Tree_Lined_Road.png';
import busHighRes3 from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
import busPhoto4 from '../../assets/bus_photo_4.png';
import busPhoto5 from '../../assets/bus_photo_5.png';

import carFrontImg from '../../assets/White Baleno Hatchback on a Tree-Lined Road.png';
import carRearImg from '../../assets/White Maruti Suzuki Baleno Rear View.png';
import carSideImg from '../../assets/White Compact Sedan on a Tree-Lined Road.png';
import carDashImg from '../../assets/Modern Suzuki Cabin Dashboard View.png';
import carInteriorImg from '../../assets/Beige Leather Car Interior.png';

export default function VehicleBusDetailsTab({ driver }) {
  const isBus = driver.vehicleType === 'Commercial Bus';

  // Bus configuration states matching screenshot
  const [busType, setBusType] = useState(driver.busType || 'Seater');
  const [acType, setAcType] = useState(driver.acType || 'AC');
  const [seatArrangement, setSeatArrangement] = useState(driver.seatArrangement || '2 × 2');

  const busPhotos = [
    { img: busHighRes1, label: 'Front View' },
    { img: busHighRes2, label: 'Rear / Side View' },
    { img: busHighRes3, label: 'Side Profile' },
    { img: busPhoto4, label: 'Passenger Interior' },
    { img: busPhoto5, label: 'Driver Cockpit' },
  ];

  const carPhotos = [
    { img: carFrontImg, label: 'Front View' },
    { img: carRearImg, label: 'Rear View' },
    { img: carSideImg, label: 'Side View' },
    { img: carDashImg, label: 'Dashboard' },
    { img: carInteriorImg, label: 'Interior Seats' },
  ];

  return (
    <div className="space-y-4">
      {/* =========================================================
          ROW 1: Vehicle Details (Col 7) + Bus/Car Configuration (Col 5)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left: Vehicle Details (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                {isBus ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="18" height="15" rx="2" />
                    <circle cx="7.5" cy="18" r="2" />
                    <circle cx="16.5" cy="18" r="2" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-black text-black">
                Vehicle Details
              </h3>
            </div>

            {/* Content: Bus/Car Image + Specs Table */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-3">
              {/* Image Cutout */}
              <div className="sm:col-span-5 flex justify-center p-1">
                <img
                  src={isBus ? coachBusCutout : (driver.vehicleImg || carCutout)}
                  alt={driver.model}
                  className="w-full max-w-[220px] h-auto object-contain drop-shadow-sm select-none"
                />
              </div>

              {/* Specs Table */}
              <div className="sm:col-span-7 space-y-1.5 text-xs sm:text-[13px]">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Vehicle Type</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.vehicleType}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Registration No.</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.regNo || driver.plate}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Brand</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.brand || (isBus ? 'Tata' : 'Maruti Suzuki')}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Model</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.model || (isBus ? 'Starbus Ultra' : 'Swift Dzire')}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Color</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.color || (isBus ? 'White & Yellow' : 'White')}</span>
                </div>

                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-5 text-slate-700 font-bold">Fuel Type</span>
                  <span className="col-span-1 text-slate-400">:</span>
                  <span className="col-span-6 text-black font-bold">{driver.fuelType || (isBus ? 'Diesel' : 'Petrol / CNG')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Bus Configuration (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="p-1 bg-amber-100/70 rounded-xl text-amber-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black text-black">
                {isBus ? 'Bus Configuration' : 'Vehicle Configuration'}
              </h3>
            </div>

            {/* Options list */}
            <div className="space-y-3.5 pt-3 text-xs sm:text-[13px]">
              {/* Bus Type: Seater | Sleeper | Semi-Sleeper */}
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold">Bus Type</span>
                <div className="flex items-center gap-1.5">
                  {['Seater', 'Sleeper', 'Semi-Sleeper'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBusType(type)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                        busType === type
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* AC Type: AC | Non-AC */}
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold">AC Type</span>
                <div className="flex items-center gap-1.5">
                  {['AC', 'Non-AC'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setAcType(type)}
                      className={`px-4 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                        acType === type
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Arrangement: 2 × 2 | 2 × 3 | 1 × 2 */}
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-bold">Seat Arrangement</span>
                <div className="flex items-center gap-1.5">
                  {['2 × 2', '2 × 3', '1 × 2'].map((arr) => (
                    <button
                      key={arr}
                      onClick={() => setSeatArrangement(arr)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                        seatArrangement === arr
                          ? 'bg-[#fed011] text-black shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {arr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total Seats */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-slate-700 font-bold">Total Seats</span>
                <span className="px-4 py-0.5 bg-amber-100/70 text-black font-black rounded-lg text-xs sm:text-sm">
                  {driver.totalSeats || (isBus ? 45 : 5)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          ROW 2: Bus / Vehicle Photos (Full-Width Card)
          ========================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
          <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="18" height="15" rx="2" />
              <circle cx="7.5" cy="18" r="2" />
              <circle cx="16.5" cy="18" r="2" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-black text-black">
            {isBus ? 'Bus Photos' : 'Vehicle Photos'}
          </h3>
        </div>

        {/* 5 Photos Grid (No blur, no eye overlay) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
          {(isBus ? busPhotos : carPhotos).map((item, idx) => (
            <div
              key={idx}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center transition-all shadow-2xs"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
