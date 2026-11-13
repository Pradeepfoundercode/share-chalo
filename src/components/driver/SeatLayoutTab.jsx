import React from 'react';
import steeringWheelIcon from '../../assets/Bold Black Steering Wheel Icon.png';
import busConfigIcon from '../../assets/drivers/bus-config.svg';
import seatLayoutSectionIcon from '../../assets/drivers/seat-layout-section.svg';

// Custom Row Icons requested by user
import busTypeIcon from '../../assets/drivers/bus-vehicle.svg';
import acTypeIcon from '../../assets/drivers/ac-type.svg';
import seatArrangementIcon from '../../assets/drivers/seat-arrangement.svg';
import totalRowsIcon from '../../assets/drivers/total-rows.svg';
import totalSeatsIcon from '../../assets/drivers/total-seats.svg';

export default function SeatLayoutTab({ driver }) {
  // 11 rows: 1 to 11
  // Top: A, B (Row 11 has only 11A as per screenshot)
  // Bottom: C, D (Row 11 has only 11C as per screenshot)
  const topRows = [
    { num: 1, seats: ['1A', '1B'] },
    { num: 2, seats: ['2A', '2B'] },
    { num: 3, seats: ['3A', '3B'] },
    { num: 4, seats: ['4A', '4B'] },
    { num: 5, seats: ['5A', '5B'] },
    { num: 6, seats: ['6A', '6B'] },
    { num: 7, seats: ['7A', '7B'] },
    { num: 8, seats: ['8A', '8B'] },
    { num: 9, seats: ['9A', '9B'] },
    { num: 10, seats: ['10A', '10B'] },
    { num: 11, seats: ['11A'] },
  ];

  const bottomRows = [
    { num: 1, seats: ['1C', '1D'] },
    { num: 2, seats: ['2C', '2D'] },
    { num: 3, seats: ['3C', '3D'] },
    { num: 4, seats: ['4C', '4D'] },
    { num: 5, seats: ['5C', '5D'] },
    { num: 6, seats: ['6C', '6D'] },
    { num: 7, seats: ['7C', '7D'] },
    { num: 8, seats: ['8C', '8D'] },
    { num: 9, seats: ['9C', '9D'] },
    { num: 10, seats: ['10C', '10D'] },
    { num: 11, seats: ['11C'] },
  ];

  return (
    <div className="space-y-4">
      {/* Main Grid: Left Configuration Card + Right Seat Layout Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* =========================================================
            LEFT COLUMN: Bus Seat Configuration (col-span-4)
            ========================================================= */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                <img src={busConfigIcon} alt="Bus Seat Configuration" className="w-full h-full object-contain" />
              </div>
              <h3 className="text-base font-black text-black">
                Bus Seat Configuration
              </h3>
            </div>

            {/* List of configuration rows */}
            <div className="space-y-4 text-sm sm:text-base pt-1">
              {/* Bus Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={busTypeIcon} alt="Bus Type" className="w-full h-full object-contain" />
                  </div>
                  <span>Bus Type</span>
                </div>
                <span className="px-4 py-1 rounded-lg font-bold text-xs sm:text-sm bg-[#fed011] text-black shadow-2xs">
                  {driver.seatType || 'Seater'}
                </span>
              </div>

              {/* AC Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={acTypeIcon} alt="AC Type" className="w-full h-full object-contain" />
                  </div>
                  <span>AC Type</span>
                </div>
                <span className="px-5 py-1 rounded-lg font-bold text-xs sm:text-sm bg-[#fed011] text-black shadow-2xs">
                  {driver.acType || 'AC'}
                </span>
              </div>

              {/* Seat Arrangement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={seatArrangementIcon} alt="Seat Arrangement" className="w-full h-full object-contain" />
                  </div>
                  <span>Seat Arrangement</span>
                </div>
                <span className="px-4 py-1 rounded-lg font-bold text-xs sm:text-sm bg-[#fed011] text-black shadow-2xs">
                  {driver.seatArrangement || '2 × 2'}
                </span>
              </div>

              {/* Total Rows */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={totalRowsIcon} alt="Total Rows" className="w-full h-full object-contain" />
                  </div>
                  <span>Total Rows</span>
                </div>
                <span className="text-black font-bold pr-2">
                  11
                </span>
              </div>

              {/* Seats per Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-700 font-bold">
                  <div className="w-5.5 h-5.5 flex items-center justify-center shrink-0">
                    <img src={seatArrangementIcon} alt="Seats per Row" className="w-full h-full object-contain" />
                  </div>
                  <span>Seats per Row</span>
                </div>
                <span className="text-black font-bold pr-2">
                  4
                </span>
              </div>

              {/* Total Seats */}
              <div className="-mx-2.5 px-2.5 py-2 rounded-2xl bg-[#fef5d8] flex items-center justify-between">
                <div className="flex items-center gap-3 text-black font-bold">
                  <div className="w-7 h-7 flex items-center justify-center shrink-0">
                    <img src={totalSeatsIcon} alt="Total Seats" className="w-full h-full object-contain" />
                  </div>
                  <span>Total Seats</span>
                </div>
                <span className="text-black font-bold pr-2">
                  {driver.totalSeats || 45}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Seat Layout (45 Seats) (col-span-8)
            ========================================================= */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between max-sm:overflow-hidden">
          <div>
            {/* Header with Title + Legend Tags (Fixed for Mobile to stay in one row) */}
            <div className="flex flex-wrap max-sm:flex-col max-sm:items-start items-center justify-between gap-3 max-sm:gap-2.5 pb-3 border-b border-slate-100">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 max-sm:w-7 max-sm:h-7 flex items-center justify-center shrink-0">
                  <img src={seatLayoutSectionIcon} alt="Seat Layout" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-base font-black text-black">
                  Seat Layout ({driver.totalSeats || 45} Seats)
                </h3>
              </div>

              {/* Legends: Available (45), Blocked (0), Reserved (0) */}
              <div className="flex items-center gap-2 text-xs font-bold max-sm:flex-nowrap max-sm:w-full max-sm:justify-between">
                <span className="inline-flex items-center gap-1.5 max-sm:gap-1.5 px-2.5 py-1 max-sm:px-1.5 max-sm:py-0.5 rounded-lg max-sm:rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap max-sm:text-[10px]">
                  <span className="w-2.5 h-2.5 max-sm:w-2 max-sm:h-2 rounded-[3px] bg-[#bbf7d0] border border-[#22c55e]" />
                  Available (45)
                </span>
                <span className="inline-flex items-center gap-1.5 max-sm:gap-1.5 px-2.5 py-1 max-sm:px-1.5 max-sm:py-0.5 rounded-lg max-sm:rounded-md bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap max-sm:text-[10px]">
                  <span className="w-2.5 h-2.5 max-sm:w-2 max-sm:h-2 rounded-[3px] bg-slate-300 border border-slate-400" />
                  Blocked (0)
                </span>
                <span className="inline-flex items-center gap-1.5 max-sm:gap-1.5 px-2.5 py-1 max-sm:px-1.5 max-sm:py-0.5 rounded-lg max-sm:rounded-md bg-rose-50 text-rose-700 border border-rose-200 whitespace-nowrap max-sm:text-[10px]">
                  <span className="w-2.5 h-2.5 max-sm:w-2 max-sm:h-2 rounded-[3px] bg-rose-300 border border-rose-400" />
                  Reserved (0)
                </span>
              </div>
            </div>

            {/* Custom SVG/CSS Coach Bus Outer Blueprint */}
            <div className="mt-5 w-full flex items-center justify-center py-2">
              <div className="w-full bg-white border-2 max-sm:border-2 border-black rounded-r-[28px] max-sm:rounded-r-[20px] rounded-l-[40px] max-sm:rounded-l-[28px] p-3 sm:p-4 max-sm:p-2 flex items-stretch shadow-xs relative">
                
                {/* Left Bus Front Cabin */}
                <div className="w-14 sm:w-16 max-sm:w-10 shrink-0 flex flex-col justify-between items-center pr-2 max-sm:pr-1.5 border-r border-slate-200 max-sm:border-r-[1px] py-1 max-sm:py-1 relative">
                  {/* Front Curved Windshield Line */}
                  <div className="absolute -left-1 max-sm:-left-0.5 top-4 max-sm:top-3 bottom-4 max-sm:bottom-3 w-1.5 max-sm:w-1 bg-slate-200/80 rounded-full" />

                  {/* Steering Wheel + Driver Label */}
                  <div className="flex flex-col items-center gap-1 max-sm:gap-0.5 mt-1 max-sm:mt-0.5">
                    <img
                      src={steeringWheelIcon}
                      alt="Steering Wheel"
                      className="w-7 h-7 sm:w-8 sm:h-8 max-sm:w-5 max-sm:h-5 object-contain"
                    />
                    <span className="text-[10px] sm:text-[11px] max-sm:text-[8px] font-black text-black">
                      Driver
                    </span>
                  </div>

                  {/* Entry Step / Stairs */}
                  <div className="w-8 h-8 max-sm:w-5 max-sm:h-5 rounded-md max-sm:rounded-sm border border-amber-400 max-sm:border-[1px] bg-amber-50/80 flex flex-col justify-evenly p-1 max-sm:p-0.5 shadow-2xs">
                    <div className="h-0.5 max-sm:h-[1px] bg-amber-400 rounded-full" />
                    <div className="h-0.5 max-sm:h-[1px] bg-amber-400 rounded-full" />
                    <div className="h-0.5 max-sm:h-[1px] bg-amber-400 rounded-full" />
                  </div>
                </div>

                {/* Main Passenger Deck (Inner Border Frame) */}
                <div className="flex-1 ml-2 sm:ml-3 max-sm:ml-2 border border-slate-300 max-sm:border-[1px] rounded-2xl max-sm:rounded-xl p-2 sm:p-3 max-sm:p-1.5 flex flex-col justify-between gap-6 sm:gap-8 max-sm:gap-3 bg-[#fafbfc]/50">
                  
                  {/* Top Row: A & B Seats */}
                  <div className="grid grid-cols-11 gap-1 sm:gap-1.5 max-sm:gap-0.5 w-full">
                    {topRows.map((col) => (
                      <div key={`col-top-${col.num}`} className="flex gap-0.5 sm:gap-1 max-sm:gap-0.5">
                        {col.seats.map((seat) => (
                          <div
                            key={seat}
                            className="flex-1 h-9 sm:h-12 max-sm:h-7 rounded-lg max-sm:rounded-[3px] bg-[#bbf7d0] border border-[#22c55e] text-slate-900 font-black text-[9px] sm:text-[11px] max-sm:text-[8px] max-sm:px-0 flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                          >
                            {seat}
                          </div>
                        ))}
                        {col.seats.length === 1 && (
                          <div className="flex-1 h-9 sm:h-12 max-sm:h-7" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: C & D Seats */}
                  <div className="grid grid-cols-11 gap-1 sm:gap-1.5 max-sm:gap-0.5 w-full">
                    {bottomRows.map((col) => (
                      <div key={`col-bot-${col.num}`} className="flex gap-0.5 sm:gap-1 max-sm:gap-0.5">
                        {col.seats.map((seat) => (
                          <div
                            key={seat}
                            className="flex-1 h-9 sm:h-12 max-sm:h-7 rounded-lg max-sm:rounded-[3px] bg-[#bbf7d0] border border-[#22c55e] text-slate-900 font-black text-[9px] sm:text-[11px] max-sm:text-[8px] max-sm:px-0 flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                          >
                            {seat}
                          </div>
                        ))}
                        {col.seats.length === 1 && (
                          <div className="flex-1 h-9 sm:h-12 max-sm:h-7" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM INFO CALLOUT NOTE (Exact text from screenshot)
          ========================================================= */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200/80 flex items-center gap-2.5 text-slate-700 text-xs sm:text-[13px] font-medium">
        <svg className="w-4 h-4 text-slate-500 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          This seat layout is configured by the driver in the Driver App at the time of vehicle registration.
        </span>
      </div>
    </div>
  );
}