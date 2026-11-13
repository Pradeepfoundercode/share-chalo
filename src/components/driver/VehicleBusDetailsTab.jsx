import React, { useState } from 'react';
import { Eye, X } from 'lucide-react';

import coachBusCutout from '../../assets/Share_Chalo_Modern_Coach_Bus.png';
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
import vehiclePhotoIcon from '../../assets/drivers/vehicle-photo-tag.svg';
import vehicleYellowIcon from '../../assets/dashboard/car-yellow.svg';
import busConfigIcon from '../../assets/drivers/bus-config.svg';

export default function VehicleBusDetailsTab({ driver }) {
  const isBus = driver.vehicleType === 'Commercial Bus';

  // State for preview photo modal
  const [previewPhoto, setPreviewPhoto] = useState(null);

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
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={vehicleYellowIcon} alt="Vehicle Details" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-sm sm:text-base font-black text-black">
                {isBus ? 'Bus & Vehicle Details' : 'Vehicle Details'}
              </h3>
            </div>

            {/* Content: Bus/Car Image + Specs Table */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-3">
              {/* Image Cutout */}
              <div className="sm:col-span-5 flex justify-center p-0">
                <img
                  src={isBus ? coachBusCutout : (driver.vehicleImg || carCutout)}
                  alt={driver.model}
                  className="w-full max-h-[140px] object-contain drop-shadow-sm select-none"
                />
              </div>

              {/* Specs Table */}
              <div className="sm:col-span-7 space-y-1.5 text-xs sm:text-[13px] pl-2">
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
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={busConfigIcon} alt="Configuration" className="w-full h-full object-contain" />
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
          <div className="w-8 h-8 flex items-center justify-center shrink-0">
            <img src={vehiclePhotoIcon} alt="Vehicle Photos" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-black">
            {isBus ? 'Bus Photos' : 'Vehicle Photos'}
          </h3>
        </div>

        {/* 5 Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
          {(isBus ? busPhotos : carPhotos).map((item, idx) => (
            <div
              key={idx}
              onClick={() => setPreviewPhoto(item)}
              className="group relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 aspect-4/3 flex items-center justify-center cursor-pointer hover:border-amber-400 hover:shadow-xs transition-all shadow-2xs"
            >
              <img
                src={item.img}
                alt={item.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox / Modal for Photo Viewing */}
      {previewPhoto && (
        <div
          onClick={() => setPreviewPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-5 shadow-2xl relative border border-slate-200"
          >
            {/* Header with Close Button Only */}
            <div className="flex items-center justify-end pb-2">
              <button
                onClick={() => setPreviewPhoto(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Large Image Preview Only */}
            <div className="flex items-center justify-center bg-slate-50/70 rounded-2xl overflow-hidden max-h-[75vh]">
              <img
                src={typeof previewPhoto === 'string' ? previewPhoto : previewPhoto.img}
                alt="Preview"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl select-none shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
