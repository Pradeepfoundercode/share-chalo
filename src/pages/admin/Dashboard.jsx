import React, { useState } from 'react';
import goldenWavesBg from '../../assets/Golden Wavy Gradient Banner.png';
import driversIcon from '../../assets/Group (1).svg';
import passengersIcon from '../../assets/Group (6).svg';
import vehiclesIcon from '../../assets/Vector (9).svg';
import ticketIcon from '../../assets/9b7b1f4e-31be-4107-b99a-28592016c07c 1.svg';
import kycIcon from '../../assets/Vector (10).svg';
import totalFareIcon from '../../assets/57894e43-7aab-443c-a728-2b0743773904 2.svg';
import platformCommissionIcon from '../../assets/c5ce90bc-54d9-45f0-928a-8549a8e6ba69 1.svg';
import onlineCollectionIcon from '../../assets/57894e43-7aab-443c-a728-2b0743773904 3.svg';
import cashCollectionIcon from '../../assets/c5ce90bc-54d9-45f0-928a-8549a8e6ba69 2.svg';
import cashCommissionDueIcon from '../../assets/dashboard/commission-due.svg';
import withdrawalRequestsIcon from '../../assets/dashboard/wallets.svg';
import pendingSettlementsIcon from '../../assets/dashboard/refresh.svg';
import rideAnalyticsHeaderIcon from '../../assets/dashboard/ride-analytics.svg';
import publishedRidesIcon from '../../assets/dashboard/car-yellow.svg';
import upcomingRidesIcon from '../../assets/dashboard/calender-yellow.svg';
import activeRidesIcon from '../../assets/dashboard/play-button-green.svg';
import completedRidesIcon from '../../assets/dashboard/completed-rides.svg';
import pendingApprovalsHeaderIcon from '../../assets/dashboard/pending-approvals.svg';
import driverKycApprovalIcon from '../../assets/dashboard/driver-kyc-approval.svg';
import vehicleDocsApprovalIcon from '../../assets/dashboard/vehicle-docs-approval.svg';
import withdrawalApprovalIcon from '../../assets/dashboard/wallets.svg';
import cashCommissionApprovalIcon from '../../assets/dashboard/cash-commission-approval.svg';
import {
  Users,
  User,
  Car,
  Ticket,
  Wallet,
  Coins,
  Percent,
  CreditCard,
  Banknote,
  RotateCcw,
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  X,
  PlayCircle,
  ShieldCheck,
  ChevronRight,
  FileText,
  IndianRupee,
  ChevronDown,
  Contact
} from 'lucide-react';

export default function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('Today');
  const [analyticsType, setAnalyticsType] = useState('Rides');

  const timeFilters = ['Today', 'This Week', 'This Month'];

  return (
    <div className="space-y-4">
      {/* Top Bar: Title & Time Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-2">
        <h2 className="text-xl sm:text-3xl font-bold tracking-tight">
          Dashboard
        </h2>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-[#fed011] text-black shadow-xs'
                  : 'bg-white hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}

          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50">
            <Calendar className="w-3.5 h-3.5" />
            <span>Custom Range</span>
          </button>
        </div>
      </div>

      {/* Row 1: 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Drivers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[120px] border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-13 h-13 rounded-full bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={driversIcon}
                alt="Total Drivers"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-tight">
                1,250
              </h3>
              <p className="text-sm font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                Total Drivers
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 translate-y-8">
              ↑ +4.8%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none select-none overflow-hidden opacity-90">
            <img
              src={goldenWavesBg}
              alt="Golden Wave"
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>

        {/* Card 2: Total Passengers */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[120px] border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-13 h-13 rounded-full bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={passengersIcon}
                alt="Total Passengers"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-tight">
                8,450
              </h3>
              <p className="text-sm font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                Total Passengers
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 translate-y-8">
              ↑ +6.3%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none select-none overflow-hidden opacity-90">
            <img
              src={goldenWavesBg}
              alt="Golden Wave"
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>

        {/* Card 3: Active Rides */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[120px] border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-13 h-13 rounded-full bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={vehiclesIcon}
                alt="Active Rides"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-tight">
                185
              </h3>
              <p className="text-sm font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                Active Rides
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 translate-y-8">
              ↑ +3.1%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none select-none overflow-hidden opacity-90">
            <img
              src={goldenWavesBg}
              alt="Golden Wave"
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>

        {/* Card 4: Total Bookings */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 min-h-[120px] border border-slate-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-13 h-13 rounded-full bg-[#fed011] flex items-center justify-center shrink-0 shadow-2xs">
              <img
                src={kycIcon}
                alt="Total Bookings"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-tight">
                520
              </h3>
              <p className="text-sm font-bold text-slate-800 mt-0.5 whitespace-nowrap">
                Total Bookings
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full shrink-0 translate-y-8">
              ↑ +5.9%
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-10 pointer-events-none select-none overflow-hidden opacity-90">
            <img
              src={goldenWavesBg}
              alt="Golden Wave"
              className="w-full h-full object-cover object-bottom"
            />
          </div>
        </div>
      </div>

      {/* Row 2: Financial Overview & Ride Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* Left: Financial Overview (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Financial Overview</h3>
            </div>

            {/* Changed from grid-cols-2 to grid-cols-1 sm:grid-cols-2 for small mobiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-200/70 flex items-center justify-center p-2 shrink-0">
                  <img src={totalFareIcon} alt="Total Ride Fare" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">Total Ride Fare</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    ₹ 12,50,000
                  </h4>
                </div>
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-200/70 flex items-center justify-center p-2 shrink-0">
                  <img src={platformCommissionIcon} alt="Platform Commission" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">Platform Commission</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    ₹ 1,25,000
                  </h4>
                </div>
              </div>

              <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-200/70 flex items-center justify-center p-2 shrink-0">
                  <img src={onlineCollectionIcon} alt="Online Collection" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">Online Collection</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    ₹ 9,50,000
                  </h4>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-200/70 flex items-center justify-center p-2 shrink-0">
                  <img src={cashCollectionIcon} alt="Cash Collection" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium truncate">Cash Collection</p>
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5 whitespace-nowrap">
                    ₹ 3,00,000
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-1 space-y-1.5 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  <img src={cashCommissionDueIcon} alt="Cash Commission Due" className="w-full h-full object-contain" />
                </div>
                <span>Cash Commission Due</span>
              </div>
              <span className="font-bold text-red-600">₹ 25,000</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  <img src={withdrawalRequestsIcon} alt="Withdrawal Requests" className="w-full h-full object-contain" />
                </div>
                <span>Withdrawal Requests</span>
              </div>
              <span className="font-bold text-slate-900">12 Requests</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                  <img src={pendingSettlementsIcon} alt="Pending Settlements" className="w-full h-full object-contain" />
                </div>
                <span>Pending Settlements</span>
              </div>
              <span className="font-bold text-slate-900">₹ 18,000</span>
            </div>
          </div>
        </div>

        {/* Right: Ride Analytics (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 flex items-center justify-center shrink-0">
                <img
                  src={rideAnalyticsHeaderIcon}
                  alt="Ride Analytics"
                  className="w-full h-full object-contain filter-amber"
                  style={{
                    filter: 'invert(75%) sepia(85%) saturate(1200%) hue-rotate(2deg) brightness(102%) contrast(101%)'
                  }}
                />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Ride Analytics
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              <div className="md:col-span-7 flex flex-col justify-between">
                <div className="flex justify-end mb-1">
                  <div className="flex items-center gap-1.5 border border-slate-200 bg-white px-2.5 py-0.5 rounded-lg text-xs font-bold text-slate-800 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors">
                    <span>{analyticsType}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-700 stroke-[2.5]" />
                  </div>
                </div>

                <div className="relative h-44 w-full">
                  <svg className="w-full h-full" viewBox="0 0 320 160">
                    <defs>
                      <linearGradient id="rideChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fed011" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#fed011" stopOpacity="0.03" />
                      </linearGradient>
                    </defs>

                    <line x1="30" y1="20" x2="310" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="46" x2="310" y2="46" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="72" x2="310" y2="72" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="98" x2="310" y2="98" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="124" x2="310" y2="124" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="150" x2="310" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />

                    <line x1="30" y1="20" x2="30" y2="150" stroke="#cbd5e1" strokeWidth="1.5" />

                    <text x="22" y="24" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">250</text>
                    <text x="22" y="50" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">200</text>
                    <text x="22" y="76" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">150</text>
                    <text x="22" y="102" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">100</text>
                    <text x="22" y="128" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">50</text>
                    <text x="22" y="154" fontSize="10" fontWeight="600" fill="#64748b" textAnchor="end">0</text>

                    <path
                      d="M 38,126 C 60,112 70,103 84,103 C 100,103 115,118 130,118 C 145,118 160,82 176,82 C 195,82 208,106 222,106 C 242,106 255,78 268,60 C 285,42 298,34 306,30 L 306,150 L 38,150 Z"
                      fill="url(#rideChartGradient)"
                    />

                    <path
                      d="M 38,126 C 60,112 70,103 84,103 C 100,103 115,118 130,118 C 145,118 160,82 176,82 C 195,82 208,106 222,106 C 242,106 255,78 268,60 C 285,42 298,34 306,30"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                    />

                    <circle cx="38" cy="126" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="84" cy="103" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="130" cy="118" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="176" cy="82" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="222" cy="106" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="268" cy="60" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                    <circle cx="306" cy="30" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                  </svg>
                </div>

                <div className="flex justify-between pl-8 pr-1 text-[11px] text-slate-700 font-bold mt-1.5">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              <div className="md:col-span-5 border border-slate-200/90 rounded-2xl p-2.5 bg-white space-y-1.5">
                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    <img src={publishedRidesIcon} alt="Total Published Rides" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-black text-slate-900 text-sm leading-tight tracking-tight">1,025</h5>
                    <p className="text-[10.5px] font-semibold text-slate-500 leading-none mt-0.5">Total Published Rides</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                    <img src={upcomingRidesIcon} alt="Upcoming Rides" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-black text-slate-900 text-sm leading-tight tracking-tight">320</h5>
                    <p className="text-[10.5px] font-semibold text-slate-500 leading-none mt-0.5">Upcoming Rides</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    <img src={activeRidesIcon} alt="Active Rides" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-black text-slate-900 text-sm leading-tight tracking-tight">185</h5>
                    <p className="text-[10.5px] font-semibold text-slate-500 leading-none mt-0.5">Active Rides</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                    <img src={completedRidesIcon} alt="Completed Rides" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-black text-slate-900 text-sm leading-tight tracking-tight">790</h5>
                    <p className="text-[10.5px] font-semibold text-slate-500 leading-none mt-0.5">Completed Rides</p>
                  </div>
                </div>

                <div className="h-px bg-slate-100" />

                <div className="flex items-center gap-2.5 py-0.5">
                  <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                    <X className="w-3.5 h-3.5 stroke-[2.8]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="font-black text-slate-900 text-sm leading-tight tracking-tight">50</h5>
                    <p className="text-[10.5px] font-semibold text-slate-500 leading-none mt-0.5">Cancelled Rides</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Booking Overview & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
        
        {/* Left: Booking Overview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 p-1">
                <img src={ticketIcon} alt="Booking Overview" className="w-9 h-9 object-contain" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Booking Overview</h3>
            </div>

            {/* Changed from single flex row to flex-col on mobile & row on desktop to avoid text overlapping */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-2 text-center pb-2">
              <div className="w-full sm:w-auto bg-[#fffbeb] border border-amber-200/90 rounded-2xl py-2 px-3 sm:px-4 shadow-2xs shrink-0">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">520</h4>
                <p className="text-[11px] font-bold text-slate-700 mt-0.5 whitespace-nowrap">Total Bookings</p>
              </div>

              {/* Grid for mobile stats, Flex for desktop stats */}
              <div className="grid grid-cols-3 sm:flex sm:flex-1 w-full sm:w-auto gap-y-3 sm:gap-y-0">
                <div className="py-1 px-0.5 sm:flex-1">
                  <h4 className="text-base sm:text-lg font-black text-[#f59e0b] leading-tight">48</h4>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Pending</p>
                </div>

                <div className="py-1 px-0.5 sm:flex-1">
                  <h4 className="text-base sm:text-lg font-black text-[#16a34a] leading-tight">410</h4>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Accepted</p>
                </div>

                <div className="py-1 px-0.5 sm:flex-1">
                  <h4 className="text-base sm:text-lg font-black text-[#dc2626] leading-tight">28</h4>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Rejected</p>
                </div>

                <div className="w-[1px] h-7 bg-slate-200 shrink-0 self-center hidden sm:block" />

                <div className="py-1 px-0.5 sm:flex-1">
                  <h4 className="text-base sm:text-lg font-black text-[#16a34a] leading-tight">385</h4>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Confirmed</p>
                </div>

                <div className="py-1 px-0.5 sm:flex-1">
                  <h4 className="text-base sm:text-lg font-black text-[#dc2626] leading-tight">50</h4>
                  <p className="text-[11px] font-bold text-slate-700 mt-0.5">Cancelled</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="border border-emerald-400/80 bg-[#f0fdf4]/60 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200/80 flex items-center justify-center shrink-0 p-1">
                  <img src={onlineCollectionIcon} alt="Online Bookings" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-700 leading-none">Online Bookings</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                    ₹ 35,00,000 <span className="text-[11px] font-bold">(77.8%)</span>
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#16a34a] h-full rounded-full" style={{ width: '77.8%' }} />
              </div>
            </div>

            <div className="border border-amber-400/80 bg-[#fffbeb]/60 rounded-2xl p-2.5 sm:p-3 flex flex-col justify-between">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200/80 flex items-center justify-center shrink-0 p-1">
                  <img src={cashCollectionIcon} alt="Cash Bookings" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-slate-700 leading-none">Cash Bookings</p>
                  <p className="text-xs sm:text-sm font-black text-slate-900 mt-1">
                    ₹ 10,00,000 <span className="text-[11px] font-bold">(22.2%)</span>
                  </p>
                </div>
              </div>
              <div className="w-full bg-slate-200/60 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#fed011] h-full rounded-full" style={{ width: '22.2%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Pending Approvals (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between mt-2 sm:mt-0">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 flex items-center justify-center shrink-0">
                  <img src={pendingApprovalsHeaderIcon} alt="Pending Approvals" className="w-full h-full object-contain" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Pending Approvals</h3>
              </div>

              <span className="bg-[#fed011] text-black text-xs font-bold px-3 py-1 rounded-full shadow-2xs">
                Action Required
              </span>
            </div>

            <div className="space-y-1 divide-y divide-slate-100">
              <div className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/60 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={driverKycApprovalIcon} alt="Driver KYC" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate sm:whitespace-normal">
                    Driver KYC Verification
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] sm:text-xs font-bold bg-[#fef9c3] text-black px-2.5 py-1 rounded-full whitespace-nowrap">
                    18 Pending
                  </span>
                  <ChevronRight className="w-4 h-4 text-black stroke-[2.2]" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/60 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={vehicleDocsApprovalIcon} alt="Vehicle Documents" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate sm:whitespace-normal">
                    Vehicle Documents
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] sm:text-xs font-bold bg-[#fef9c3] text-black px-2.5 py-1 rounded-full whitespace-nowrap">
                    12 Pending
                  </span>
                  <ChevronRight className="w-4 h-4 text-black stroke-[2.2]" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/60 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={withdrawalApprovalIcon} alt="Withdrawal Requests" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate sm:whitespace-normal">
                    Withdrawal Requests
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] sm:text-xs font-bold bg-[#fef9c3] text-black px-2.5 py-1 rounded-full whitespace-nowrap">
                    8 Pending
                  </span>
                  <ChevronRight className="w-4 h-4 text-black stroke-[2.2]" />
                </div>
              </div>

              <div className="flex items-center justify-between py-2 px-1 hover:bg-slate-50/60 rounded-lg transition-colors cursor-pointer">
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-2">
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={cashCommissionApprovalIcon} alt="Cash Commission Verification" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-slate-900 truncate sm:whitespace-normal">
                    Cash Commission Verification
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] sm:text-xs font-bold bg-[#fef9c3] text-black px-2.5 py-1 rounded-full whitespace-nowrap">
                    15 Pending
                  </span>
                  <ChevronRight className="w-4 h-4 text-black stroke-[2.2]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}