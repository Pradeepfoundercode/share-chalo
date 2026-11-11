import React from 'react';
import steeringWheelIcon from '../../assets/Bold Black Steering Wheel Icon.png';

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
              <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h3 className="text-base font-black text-black">
                Bus Seat Configuration
              </h3>
            </div>

            {/* List of configuration rows */}
            <div className="space-y-4 text-xs sm:text-[13px] pt-1">
              {/* Bus Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="3" width="18" height="15" rx="2" />
                    <circle cx="7.5" cy="18" r="2" />
                    <circle cx="16.5" cy="18" r="2" />
                  </svg>
                  <span>Bus Type</span>
                </div>
                <span className="px-4 py-1 rounded-lg font-bold text-xs bg-[#fed011] text-black shadow-2xs">
                  {driver.seatType || 'Seater'}
                </span>
              </div>

              {/* AC Type */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 3v18M3 12h18M6.5 6.5l11 11M6.5 17.5l11-11" />
                  </svg>
                  <span>AC Type</span>
                </div>
                <span className="px-5 py-1 rounded-lg font-bold text-xs bg-[#fed011] text-black shadow-2xs">
                  {driver.acType || 'AC'}
                </span>
              </div>

              {/* Seat Arrangement */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                    <path d="M5 18v2M19 18v2" />
                  </svg>
                  <span>Seat Arrangement</span>
                </div>
                <span className="px-4 py-1 rounded-lg font-bold text-xs bg-[#fed011] text-black shadow-2xs">
                  {driver.seatArrangement || '2 × 2'}
                </span>
              </div>

              {/* Total Rows */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="m12 2 10 5-10 5L2 7l10-5Z" />
                    <path d="m2 17 10 5 10-5" />
                    <path d="m2 12 10 5 10-5" />
                  </svg>
                  <span>Total Rows</span>
                </div>
                <span className="text-black font-bold pr-2">
                  11
                </span>
              </div>

              {/* Seats per Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-slate-700 font-bold">
                  <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                    <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                  </svg>
                  <span>Seats per Row</span>
                </div>
                <span className="text-black font-bold pr-2">
                  4
                </span>
              </div>

              {/* Total Seats Banner */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-100/60 border border-amber-200/70 mt-3">
                <div className="flex items-center gap-2 font-black text-black">
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Total Seats</span>
                </div>
                <span className="text-base font-black text-black pr-1">
                  {driver.totalSeats || 45}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Seat Layout (45 Seats) (col-span-8)
            ========================================================= */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Title + Legend Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
              {/* Title */}
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" />
                  <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z" />
                  <path d="M5 18v2M19 18v2" />
                </svg>
                <h3 className="text-base font-black text-black">
                  Seat Layout ({driver.totalSeats || 45} Seats)
                </h3>
              </div>

              {/* Legends: Available (45), Blocked (0), Reserved (0) */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-[#bbf7d0] border border-[#22c55e]" />
                  Available (45)
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-slate-300 border border-slate-400" />
                  Blocked (0)
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-rose-300 border border-rose-400" />
                  Reserved (0)
                </span>
              </div>
            </div>

            {/* Custom SVG/CSS Coach Bus Outer Blueprint (No Scroll, Bigger Height, Clean Borders) */}
            <div className="mt-5 w-full flex items-center justify-center py-2">
              <div className="w-full bg-white border-2 border-black rounded-r-[28px] rounded-l-[40px] p-3 sm:p-4 flex items-stretch shadow-xs relative">
                {/* Left Bus Front Cabin */}
                <div className="w-14 sm:w-16 shrink-0 flex flex-col justify-between items-center pr-2 border-r border-slate-200 py-1 relative">
                  {/* Front Curved Windshield Line */}
                  <div className="absolute -left-1 top-4 bottom-4 w-1.5 bg-slate-200/80 rounded-full" />

                  {/* Steering Wheel + Driver Label */}
                  <div className="flex flex-col items-center gap-1 mt-1">
                    <img
                      src={steeringWheelIcon}
                      alt="Steering Wheel"
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                    <span className="text-[10px] sm:text-[11px] font-black text-black">
                      Driver
                    </span>
                  </div>

                  {/* Entry Step / Stairs */}
                  <div className="w-8 h-8 rounded-md border border-amber-400 bg-amber-50/80 flex flex-col justify-evenly p-1 shadow-2xs">
                    <div className="h-0.5 bg-amber-400 rounded-full" />
                    <div className="h-0.5 bg-amber-400 rounded-full" />
                    <div className="h-0.5 bg-amber-400 rounded-full" />
                  </div>
                </div>

                {/* Main Passenger Deck (Inner Border Frame) */}
                <div className="flex-1 ml-2 sm:ml-3 border border-slate-300 rounded-2xl p-2 sm:p-3 flex flex-col justify-between gap-6 sm:gap-8 bg-[#fafbfc]/50">
                  {/* Top Row: A & B Seats */}
                  <div className="grid grid-cols-11 gap-1 sm:gap-1.5 w-full">
                    {topRows.map((col) => (
                      <div key={`col-top-${col.num}`} className="flex gap-0.5 sm:gap-1">
                        {col.seats.map((seat) => (
                          <div
                            key={seat}
                            className="flex-1 h-9 sm:h-12 rounded-lg bg-[#bbf7d0] border border-[#22c55e] text-slate-900 font-black text-[9px] sm:text-[11px] flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                          >
                            {seat}
                          </div>
                        ))}
                        {col.seats.length === 1 && (
                          <div className="flex-1 h-9 sm:h-12" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Bottom Row: C & D Seats */}
                  <div className="grid grid-cols-11 gap-1 sm:gap-1.5 w-full">
                    {bottomRows.map((col) => (
                      <div key={`col-bot-${col.num}`} className="flex gap-0.5 sm:gap-1">
                        {col.seats.map((seat) => (
                          <div
                            key={seat}
                            className="flex-1 h-9 sm:h-12 rounded-lg bg-[#bbf7d0] border border-[#22c55e] text-slate-900 font-black text-[9px] sm:text-[11px] flex items-center justify-center shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                          >
                            {seat}
                          </div>
                        ))}
                        {col.seats.length === 1 && (
                          <div className="flex-1 h-9 sm:h-12" />
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
