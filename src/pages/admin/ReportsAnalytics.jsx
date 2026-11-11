import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Car,
  Layers,
  Users,
  Calendar,
  Download,
  ChevronDown,
  ArrowUp,
  CreditCard,
  Banknote,
  Percent,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  FileText
} from 'lucide-react';
import {
  analyticsSummary,
  rideTrendDaily,
  rideStatusData,
  revenueOverviewData,
  userOverviewData,
  topRoutesData,
  recentRidesAnalytics
} from '../../data/analyticsData';

export default function ReportsAnalytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [trendRange, setTrendRange] = useState('Daily');
  const [exportOpen, setExportOpen] = useState(false);

  // Tabs across the top
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: BarChart2 },
    { id: 'Ride Reports', label: 'Ride Reports', icon: Car },
    { id: 'Financial Reports', label: 'Financial Reports', icon: Banknote },
    { id: 'User Reports', label: 'User Reports', icon: Users }
  ];

  // Status badge helper for recent rides
  const renderRideStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            Completed
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200">
            Ongoing
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold text-slate-700 bg-slate-100">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* =========================================================
          1. TOP TAB BUTTONS + DATE RANGE + EXPORT BAR
          ========================================================= */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3">
        {/* Left 4 Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs font-black'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Date Filter + Green Export Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0 self-end xl:self-auto">
          {/* Date Picker Button */}
          <div className="relative">
            <button
              type="button"
              className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>01 Nov 2026 – 02 Nov 2026</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          {/* Export Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportOpen(!exportOpen)}
              className="h-10 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {exportOpen && (
              <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-30 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    alert('Exporting PDF Report...');
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-500" /> Export PDF
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Exporting CSV / Excel...');
                    setExportOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" /> Export CSV / Excel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          2. FIVE TOP METRIC CARDS
          ========================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Rides */}
        <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100/70 border border-emerald-200/50 flex items-center justify-center shrink-0 text-emerald-700">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {analyticsSummary.totalRides}
            </div>
            <div className="text-xs font-bold text-slate-700">Total Rides</div>
            <div className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑</span> {analyticsSummary.totalRidesChange}
            </div>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-sky-50/40 border border-sky-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-sky-100/70 border border-sky-200/50 flex items-center justify-center shrink-0 text-sky-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {analyticsSummary.totalBookings}
            </div>
            <div className="text-xs font-bold text-slate-700">Total Bookings</div>
            <div className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑</span> {analyticsSummary.totalBookingsChange}
            </div>
          </div>
        </div>

        {/* Total Passengers */}
        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-amber-100/70 border border-amber-200/50 flex items-center justify-center shrink-0 text-amber-900">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {analyticsSummary.totalPassengers}
            </div>
            <div className="text-xs font-bold text-slate-700">Total Passengers</div>
            <div className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑</span> {analyticsSummary.totalPassengersChange}
            </div>
          </div>
        </div>

        {/* Total Drivers */}
        <div className="bg-purple-50/40 border border-purple-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs">
          <div className="w-12 h-12 rounded-full bg-purple-100/70 border border-purple-200/50 flex items-center justify-center shrink-0 text-purple-700">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {analyticsSummary.totalDrivers}
            </div>
            <div className="text-xs font-bold text-slate-700">Total Drivers</div>
            <div className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑</span> {analyticsSummary.totalDriversChange}
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-emerald-50/40 border border-emerald-200/60 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100/70 border border-emerald-200/50 flex items-center justify-center shrink-0 text-emerald-700">
            <Banknote className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
              {analyticsSummary.totalRevenue}
            </div>
            <div className="text-xs font-bold text-slate-700">Total Revenue</div>
            <div className="text-[11px] font-extrabold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>↑</span> {analyticsSummary.totalRevenueChange}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. MIDDLE CHARTS: RIDE TREND (LINE) + RIDE STATUS (DONUT)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Ride Trend Area Chart (col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Ride Trend
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Number of rides over time.
                </p>
              </div>
            </div>

            {/* Daily / Weekly / Monthly Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-700">
              {['Daily', 'Weekly', 'Monthly'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setTrendRange(range)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    trendRange === range
                      ? 'bg-emerald-700 text-white font-extrabold shadow-2xs'
                      : 'hover:text-black'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart with Gradient and Tooltip Pill */}
          <div className="relative w-full h-56 pt-2 select-none">
            {/* 842 Rides Tooltip Pill pinned on the right */}
            <div className="absolute right-3 top-3 bg-emerald-700 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-xs flex items-center gap-1 z-10">
              842 Rides
            </div>

            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 650 180"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="rideTrendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Guide Lines */}
              {[30, 60, 90, 120, 150].map((y) => (
                <line
                  key={y}
                  x1="40"
                  y1={y}
                  x2="640"
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
              ))}

              {/* Y Axis Labels */}
              <text x="5" y="35" fontSize="10" fill="#94a3b8" fontWeight="600">1,000</text>
              <text x="12" y="65" fontSize="10" fill="#94a3b8" fontWeight="600">800</text>
              <text x="12" y="95" fontSize="10" fill="#94a3b8" fontWeight="600">600</text>
              <text x="12" y="125" fontSize="10" fill="#94a3b8" fontWeight="600">400</text>
              <text x="12" y="155" fontSize="10" fill="#94a3b8" fontWeight="600">200</text>
              <text x="25" y="175" fontSize="10" fill="#94a3b8" fontWeight="600">0</text>

              {/* Area Gradient Fill */}
              {/* Points calculation:
                  26 Oct: (55, 140)
                  27 Oct: (138, 120)
                  28 Oct: (222, 110)
                  29 Oct: (306, 95)
                  30 Oct: (390, 110)
                  31 Oct: (474, 85)
                  01 Nov: (558, 92)
                  02 Nov: (630, 45)
              */}
              <polygon
                points="55,140 138,120 222,110 306,95 390,110 474,85 558,92 630,45 630,170 55,170"
                fill="url(#rideTrendGrad)"
              />

              {/* Green Smooth Line */}
              <polyline
                points="55,140 138,120 222,110 306,95 390,110 474,85 558,92 630,45"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Dot Markers */}
              {[
                [55, 140],
                [138, 120],
                [222, 110],
                [306, 95],
                [390, 110],
                [474, 85],
                [558, 92],
                [630, 45]
              ].map(([cx, cy], idx) => (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="3.5"
                  fill="#ffffff"
                  stroke="#16a34a"
                  strokeWidth="2"
                />
              ))}

              {/* Active right point filled */}
              <circle cx="630" cy="45" r="4.5" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
            </svg>

            {/* X Axis Labels */}
            <div className="flex items-center justify-between pl-8 pr-2 pt-1 text-[10px] font-semibold text-slate-500">
              {rideTrendDaily.map((d) => (
                <span key={d.date}>{d.date}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Ride Status Donut Chart (col-span-4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-tight">
                Ride Status
              </h3>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-4 my-auto">
            {/* Donut graphic */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Total circumference: 2 * PI * 38 ≈ 238.76 */}
                {/* Completed: 77.5% -> 185 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#16a34a"
                  strokeWidth="14"
                  strokeDasharray="185 239"
                  strokeDashoffset="0"
                />
                {/* Upcoming: 8.1% -> 19.3 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#0284c7"
                  strokeWidth="14"
                  strokeDasharray="19.3 239"
                  strokeDashoffset="-185"
                />
                {/* Cancelled: 7.4% -> 17.6 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#dc2626"
                  strokeWidth="14"
                  strokeDasharray="17.6 239"
                  strokeDashoffset="-204.3"
                />
                {/* Ongoing: 7.0% -> 16.7 */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#fed011"
                  strokeWidth="14"
                  strokeDasharray="16.7 239"
                  strokeDashoffset="-221.9"
                />
              </svg>
              {/* Inner Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-sm font-black text-slate-900 leading-none">
                  3,842
                </span>
                <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                  Total Rides
                </span>
              </div>
            </div>

            {/* Legends & Counts List */}
            <div className="flex-1 w-full space-y-2 text-xs">
              {rideStatusData.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between text-slate-700"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="font-bold text-slate-800">{item.label}</span>
                  </div>
                  <div className="font-extrabold text-slate-900">
                    {item.count}{' '}
                    <span className="text-slate-400 font-semibold text-[11px]">
                      ({item.percentage})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. REVENUE OVERVIEW & USER OVERVIEW SUMMARY GRIDS
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Revenue Overview (col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              ₹
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900">Revenue Overview</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Earnings and collections summary for selected period.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* Total Fare */}
            <div className="p-3 rounded-xl bg-emerald-50/40 border border-emerald-200/60">
              <span className="text-base block mb-1">🪙</span>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {revenueOverviewData.totalFare}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">Total Fare</div>
            </div>

            {/* Platform Commission */}
            <div className="p-3 rounded-xl bg-sky-50/40 border border-sky-200/60">
              <span className="text-base block mb-1">🏦</span>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {revenueOverviewData.platformCommission}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Platform Commission <span className="text-sky-700 font-bold">{revenueOverviewData.commissionRate}</span>
              </div>
            </div>

            {/* Online Collection */}
            <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-200/60">
              <span className="text-base block mb-1">💳</span>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {revenueOverviewData.onlineCollection}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Online Collection
              </div>
            </div>

            {/* Cash Collection */}
            <div className="p-3 rounded-xl bg-amber-50/40 border border-amber-200/60">
              <span className="text-base block mb-1">💵</span>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {revenueOverviewData.cashCollection}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Cash Collection
              </div>
            </div>
          </div>
        </div>

        {/* User Overview (col-span-6) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
            <Users className="w-5 h-5 text-emerald-700" />
            <div>
              <h3 className="text-sm font-black text-slate-900">User Overview</h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Passengers and drivers on the platform.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {/* Passengers */}
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <Users className="w-4 h-4 text-emerald-600 mb-1" />
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {userOverviewData.passengers}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">Passengers</div>
              <div className="text-[10px] font-extrabold text-emerald-600">
                ↑ {userOverviewData.passengersGrowth}
              </div>
            </div>

            {/* Drivers */}
            <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
              <Car className="w-4 h-4 text-sky-600 mb-1" />
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {userOverviewData.drivers}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">Drivers</div>
              <div className="text-[10px] font-extrabold text-emerald-600">
                ↑ {userOverviewData.driversGrowth}
              </div>
            </div>

            {/* Active Users */}
            <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-200/60">
              <span className="text-base block mb-1">👥</span>
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {userOverviewData.activeUsers}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Active Users
              </div>
            </div>

            {/* Blocked Users */}
            <div className="p-3 rounded-xl bg-rose-50/40 border border-rose-200/60">
              <ShieldAlert className="w-4 h-4 text-rose-600 mb-1" />
              <div className="text-xs sm:text-sm font-black text-slate-900">
                {userOverviewData.blockedUsers}
              </div>
              <div className="text-[11px] font-semibold text-slate-600">
                Blocked Users
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          5. BOTTOM SPLIT: TOP ROUTES & RECENT RIDES
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Top Routes (col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <div>
                <h3 className="text-sm font-black text-slate-900">Top Routes</h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Most traveled routes by ride count.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3 w-8 text-center">#</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3 text-center">Total Rides</th>
                    <th className="py-2.5 px-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {topRoutesData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2.5 px-3 text-center font-bold text-slate-500">
                        {item.id}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {item.route}
                      </td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                        {item.totalRides}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900">
                        {item.revenue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Rides (col-span-7) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-black text-slate-900">Recent Rides</h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Latest ride activities on the platform.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/rides')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Ride ID</th>
                    <th className="py-2.5 px-3">Passenger</th>
                    <th className="py-2.5 px-3">Driver</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Fare</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-3 text-right">Date & Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {recentRidesAnalytics.map((ride) => (
                    <tr
                      key={ride.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-mono font-bold text-[11px] text-slate-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80">
                          {ride.rideId}
                        </span>
                      </td>

                      {/* Passenger */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={ride.passenger.avatar}
                            alt={ride.passenger.name}
                            className="w-5 h-5 rounded-full object-cover border border-amber-300"
                          />
                          <span className="font-semibold text-slate-900 text-xs">
                            {ride.passenger.name}
                          </span>
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <img
                            src={ride.driver.avatar}
                            alt={ride.driver.name}
                            className="w-5 h-5 rounded-full object-cover border border-amber-300"
                          />
                          <span className="font-semibold text-slate-900 text-xs">
                            {ride.driver.name}
                          </span>
                        </div>
                      </td>

                      {/* Route */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">
                        {ride.route}
                      </td>

                      {/* Fare */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-black text-slate-900">
                        {ride.fare}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {renderRideStatusBadge(ride.status)}
                      </td>

                      {/* Date & Time */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap text-[11px] text-slate-500 font-medium">
                        {ride.dateTime}
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
  );
}

