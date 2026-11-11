import React, { useState } from 'react';
import {
  Wallet,
  CreditCard,
  Coins,
  Percent,
  Clock,
  ArrowUpRight,
  FileText,
  Calendar,
  ChevronDown,
  TrendingUp,
  ChevronRight,
  ListFilter,
  IndianRupee,
  Banknote,
  Building2,
  Receipt,
  Check,
  Search,
  Filter,
  Download,
  RotateCcw
} from 'lucide-react';
import {
  financeStats,
  paymentDistribution,
  walletSettlementStats,
  earningsChartData,
  recentTransactionsList
} from '../../data/financeData';
import Pagination from '../../components/common/Pagination';

export default function Finance() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('01 Nov 2026 – 05 Nov 2026');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Tab pagination and search states (for non-overview tabs)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  // Tab Definitions matching screenshot
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: Wallet },
    { id: 'Online Payments', label: 'Online Payments', icon: CreditCard },
    { id: 'Cash Collections', label: 'Cash Collections', icon: Coins },
    { id: 'Commission', label: 'Commission', icon: Percent },
    { id: 'Cash Commission Due', label: 'Cash Commission Due', icon: Clock },
    { id: 'Withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
    { id: 'Settlements', label: 'Settlements', icon: FileText },
  ];

  const dateOptions = [
    'Today',
    'Yesterday',
    'Last 7 Days',
    '01 Nov 2026 – 05 Nov 2026',
    'This Month',
    'Last Month',
    'Custom Range'
  ];

  // Helper for Status Badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Success':
      case 'Completed':
      case 'Collected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            {status}
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
            <Clock className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600">
            Failed
          </span>
        );
      default:
        return <span className="text-xs font-semibold text-slate-700">{status}</span>;
    }
  };

  // Helper for Type Pill
  const renderTypePill = (type) => {
    switch (type) {
      case 'Ride Payment':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            {type}
          </span>
        );
      case 'Commission':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/60">
            {type}
          </span>
        );
      case 'Withdrawal':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
            {type}
          </span>
        );
      case 'Settlement':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
            {type}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            {type}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* =========================================================
          1. TOP HORIZONTAL NAVIGATION TABS
          ========================================================= */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          2. DASHBOARD TITLE & DATE FILTER ROW
          ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Finance Dashboard
        </h2>

        {/* Date Range Picker Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDatePickerOpen(!datePickerOpen)}
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>{dateRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </button>

          {datePickerOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-30 space-y-1">
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setDateRange(opt);
                    setDatePickerOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    dateRange === opt
                      ? 'bg-amber-100/70 text-amber-900'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          3. MAIN CONTENT: OVERVIEW OR TAB-SPECIFIC VIEW
          ========================================================= */}
      {activeTab === 'Overview' ? (
        <>
          {/* ----------------- ROW 1: 5 METRIC CARDS ----------------- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {/* Card 1: Total Bookings */}
            <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[115px]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Wallet className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700">Total Bookings</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {financeStats.totalBookings}
                </h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  ↑ {financeStats.bookingsGrowth}
                </p>
              </div>
            </div>

            {/* Card 2: Total Ride Amount */}
            <div className="bg-[#f0f9ff] border border-sky-100 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[115px]">
              <div className="w-10 h-10 rounded-xl bg-sky-100/80 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs font-black text-lg">
                <IndianRupee className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700">Total Ride Amount</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {financeStats.totalRideAmount}
                </h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  ↑ {financeStats.rideAmountGrowth}
                </p>
              </div>
            </div>

            {/* Card 3: Commission Earned */}
            <div className="bg-[#fefce8] border border-amber-100 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[115px]">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Percent className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700">Commission Earned</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {financeStats.commissionEarned}
                </h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  ↑ {financeStats.commissionGrowth}
                </p>
              </div>
            </div>

            {/* Card 4: Online Collections */}
            <div className="bg-[#faf5ff] border border-purple-100 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[115px]">
              <div className="w-10 h-10 rounded-xl bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <CreditCard className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700">Online Collections</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {financeStats.onlineCollections}
                </h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  ↑ {financeStats.onlineGrowth}
                </p>
              </div>
            </div>

            {/* Card 5: Cash Collections */}
            <div className="bg-[#fff1f2] border border-rose-100 rounded-2xl p-4 shadow-2xs flex flex-col justify-between min-h-[115px]">
              <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                <Banknote className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="mt-2">
                <p className="text-xs font-bold text-slate-700">Cash Collections</p>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mt-0.5">
                  {financeStats.cashCollections}
                </h3>
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                  ↑ {financeStats.cashGrowth}
                </p>
              </div>
            </div>
          </div>

          {/* ----------------- ROW 2: EARNINGS OVERVIEW & PAYMENT DISTRIBUTION ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Earnings Overview (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* Header with Title + Legend */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Earnings Overview
                  </h3>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                    <span className="text-slate-700">Ride Amount</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fed011]" />
                    <span className="text-slate-700">Commission</span>
                  </div>
                </div>
              </div>

              {/* Chart SVG Canvas */}
              <div className="relative w-full overflow-hidden select-none">
                <svg
                  viewBox="0 0 650 220"
                  className="w-full h-48 sm:h-56"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="financeGreenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#16a34a" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="70" y1="20" x2="630" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="55" x2="630" y2="55" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="90" x2="630" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="125" x2="630" y2="125" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="160" x2="630" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="70" y1="195" x2="630" y2="195" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Y-Axis Labels */}
                  <text x="60" y="24" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹1,50,000</text>
                  <text x="60" y="59" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹1,20,000</text>
                  <text x="60" y="94" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹90,000</text>
                  <text x="60" y="129" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹60,000</text>
                  <text x="60" y="164" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹30,000</text>
                  <text x="60" y="197" textAnchor="end" className="text-[10px] fill-slate-500 font-bold">₹0</text>

                  {/* Green Area Fill for Ride Amount */}
                  <path
                    d="M 110,140 Q 230,120 350,95 T 480,68 T 590,52 L 590,195 L 110,195 Z"
                    fill="url(#financeGreenGradient)"
                  />

                  {/* Green Line (Ride Amount) */}
                  <path
                    d="M 110,140 Q 230,120 350,95 T 480,68 T 590,52"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Green Dots */}
                  <circle cx="110" cy="140" r="4.5" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
                  <circle cx="230" cy="120" r="4.5" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
                  <circle cx="350" cy="95" r="4.5" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
                  <circle cx="480" cy="68" r="4.5" fill="#ffffff" stroke="#16a34a" strokeWidth="2.5" />
                  <circle cx="590" cy="52" r="5" fill="#ffffff" stroke="#16a34a" strokeWidth="3" />

                  {/* Yellow Line (Commission) */}
                  <path
                    d="M 110,185 Q 230,180 350,175 T 480,172 T 590,170"
                    fill="none"
                    stroke="#fed011"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />

                  {/* Yellow Dots */}
                  <circle cx="110" cy="185" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="230" cy="180" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="350" cy="175" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="480" cy="172" r="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
                  <circle cx="590" cy="170" r="4" fill="#ffffff" stroke="#f59e0b" strokeWidth="2.5" />
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between pl-20 pr-8 text-xs text-slate-500 font-bold mt-1">
                  <span>01 Nov</span>
                  <span>02 Nov</span>
                  <span>03 Nov</span>
                  <span>04 Nov</span>
                  <span>05 Nov</span>
                </div>
              </div>
            </div>

            {/* Right: Payment Distribution (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Payment Distribution
                </h3>
              </div>

              {/* Donut Chart & Legend Row */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-5 my-auto py-2">
                {/* Donut Circle SVG */}
                <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#f1f5f9"
                      strokeWidth="14"
                    />
                    {/* Green Segment: 66.7% (2 * PI * 38 * 0.667 = ~159.2) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#16a34a"
                      strokeWidth="14"
                      strokeDasharray="159.2 238.7"
                      strokeDashoffset="0"
                      strokeLinecap="round"
                    />
                    {/* Yellow Segment: 33.3% (offset = -163) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="38"
                      fill="transparent"
                      stroke="#fed011"
                      strokeWidth="14"
                      strokeDasharray="79.5 238.7"
                      strokeDashoffset="-162"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Inner text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-black text-slate-900 leading-tight">
                      ₹ 5,14,320
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 mt-0.5">
                      Total Amount
                    </span>
                  </div>
                </div>

                {/* Legend & Breakdown Details */}
                <div className="space-y-3 min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#16a34a] shrink-0" />
                      <span className="text-xs font-bold text-slate-700">Online Payments</span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5 pl-5.5">
                      {paymentDistribution.onlinePayments}{' '}
                      <span className="text-xs font-semibold text-slate-500">
                        ({paymentDistribution.onlinePercentage})
                      </span>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-xs bg-[#fed011] shrink-0" />
                      <span className="text-xs font-bold text-slate-700">Cash Payments</span>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5 pl-5.5">
                      {paymentDistribution.cashPayments}{' '}
                      <span className="text-xs font-semibold text-slate-500">
                        ({paymentDistribution.cashPercentage})
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ----------------- ROW 3: RECENT TRANSACTIONS & WALLET & SETTLEMENT ----------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Left: Recent Transactions Table (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListFilter className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      Recent Transactions
                    </h3>
                  </div>

                  <button
                    onClick={() => setActiveTab('Online Payments')}
                    className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    View All →
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-100">
                  <table className="w-full text-left text-xs sm:text-[13px]">
                    <thead>
                      <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60">
                        <th className="py-2.5 px-3">#</th>
                        <th className="py-2.5 px-3">Transaction ID</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Mode</th>
                        <th className="py-2.5 px-3">Date & Time</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                      {recentTransactionsList.slice(0, 5).map((txn) => (
                        <tr key={txn.id} className="hover:bg-amber-50/20 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-500">{txn.id}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {txn.txnId}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {renderTypePill(txn.type)}
                          </td>
                          <td className="py-2.5 px-3 font-black text-slate-900 whitespace-nowrap">
                            {txn.amount}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                            {txn.mode}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 text-xs">
                            {txn.dateTime}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {renderStatusBadge(txn.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Wallet & Settlement (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wallet className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Wallet & Settlement
                  </h3>
                </div>

                <div className="space-y-1.5 divide-y divide-slate-100">
                  {/* Item 1: Platform Wallet Balance */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <Wallet className="w-4 h-4 stroke-[2.3]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-900">
                          Platform Wallet Balance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {walletSettlementStats.platformWalletBalance}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 2: Cash Commission Due */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <Percent className="w-4 h-4 stroke-[2.3]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-900">
                          Cash Commission Due
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {walletSettlementStats.cashCommissionSub}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {walletSettlementStats.cashCommissionDue}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 3: Withdrawal Requests */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <Building2 className="w-4 h-4 stroke-[2.3]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-900">
                          Withdrawal Requests
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {walletSettlementStats.withdrawalRequestsSub}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {walletSettlementStats.withdrawalRequests}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 4: Last Settlement */}
                  <div className="flex items-center justify-between py-2.5 px-1 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <Receipt className="w-4 h-4 stroke-[2.3]" />
                      </div>
                      <div>
                        <p className="text-xs sm:text-[13px] font-bold text-slate-900">
                          Last Settlement
                        </p>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {walletSettlementStats.lastSettlementDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black text-slate-900">
                        {walletSettlementStats.lastSettlement}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* =========================================================
            4. TAB-SPECIFIC DATA TABLE VIEW (Online Payments, Cash, etc.)
            ========================================================= */
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Controls Bar: Search, Status, Export */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:border-amber-400 shadow-2xs cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Success">Success</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('All');
                }}
                className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold cursor-pointer shadow-2xs transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-[13px]">
              <thead>
                <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60">
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {recentTransactionsList
                  .filter((item) => {
                    if (statusFilter !== 'All' && item.status !== statusFilter) return false;
                    if (
                      searchTerm &&
                      !item.txnId.toLowerCase().includes(searchTerm.toLowerCase()) &&
                      !item.type.toLowerCase().includes(searchTerm.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  })
                  .map((txn, idx) => (
                    <tr key={txn.id} className="hover:bg-amber-50/20 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                        {txn.txnId}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{renderTypePill(txn.type)}</td>
                      <td className="py-3 px-4 font-black text-slate-900 whitespace-nowrap">
                        {txn.amount}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">{txn.mode}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-600 text-xs">
                        {txn.dateTime}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {renderStatusBadge(txn.status)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Reusable Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalItems={1250}
            itemsPerPage={entriesPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setEntriesPerPage}
            pageSizeOptions={[10, 25, 50]}
          />
        </div>
      )}
    </div>
  );
}

