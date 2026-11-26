import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  Search,
  Download,
  Filter,
  Loader2
} from 'lucide-react';
import { getFinanceOverviewApi } from '../../services/finance.services';
import {
  financeStats,
  paymentDistribution,
  walletSettlementStats,
  earningsChartData,
  recentTransactionsList
} from '../../data/financeData';
import Pagination from '../../components/common/Pagination';

// SVG Icons matching assets / dashboard / drivers
const WalletIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path d="M18 4.99752H15V0.997525C15 0.667525 14.84 0.357525 14.57 0.177525C14.4376 0.0847292 14.2843 0.0261237 14.1238 0.00693101C13.9633 -0.0122617 13.8005 0.00855451 13.65 0.0675249L1.28 4.81752C0.51 5.10752 0 5.86752 0 6.68752V17.9975C0 19.0975 0.9 19.9975 2 19.9975H18C19.1 19.9975 20 19.0975 20 17.9975V6.99752C20 5.89752 19.1 4.99752 18 4.99752ZM13 2.45753V4.99752H6.39L13 2.45753ZM2 17.9975V6.99752H18V8.99753H13C11.9 8.99753 11 9.89752 11 10.9975V13.9975C11 15.0975 11.9 15.9975 13 15.9975H18V17.9975H2ZM18 13.9975H13V10.9975H18V13.9975Z" />
  </svg>
);

const CreditCardIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6" cy="15" r="1" fill="currentColor" />
  </svg>
);

const CoinsIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M0 12.6656V14C0 15.1031 2.6875 16 6 16C9.3125 16 12 15.1031 12 14V12.6656C10.7094 13.575 8.35 14 6 14C3.65 14 1.29062 13.575 0 12.6656ZM10 4C13.3125 4 16 3.10313 16 2C16 0.896875 13.3125 0 10 0C6.6875 0 4 0.896875 4 2C4 3.10313 6.6875 4 10 4ZM0 9.3875V11C0 12.1031 2.6875 13 6 13C9.3125 13 12 12.1031 12 11V9.3875C10.7094 10.45 8.34688 11 6 11C3.65313 11 1.29062 10.45 0 9.3875ZM13 9.73125C14.7906 9.38437 16 8.74063 16 8V6.66563C15.275 7.17812 14.2094 7.52813 13 7.74375V9.73125ZM6 5C2.6875 5 0 6.11875 0 7.5C0 8.88125 2.6875 10 6 10C9.3125 10 12 8.88125 12 7.5C12 6.11875 9.3125 5 6 5ZM12.8531 6.75938C14.7281 6.42188 16 5.75938 16 5V3.66563C14.8906 4.45 12.9844 4.87188 10.9781 4.97188C11.9 5.41875 12.5781 6.01875 12.8531 6.75938Z" />
  </svg>
);

const PercentIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 20" fill="currentColor" className={className}>
    <path d="M13.62 0.53L12.78 0L7.15 9L1.53 18L2.38 18.53L3.22 19.06L8.85 10.06L14.47 1.06L13.62 0.53ZM0 4.03C0 5.96 1.57 7.53 3.5 7.53C5.43 7.53 7 5.96 7 4.03C7 2.1 5.43 0.53 3.5 0.53C1.57 0.53 0 2.1 0 4.03ZM3.5 2.53C4.33 2.53 5 3.2 5 4.03C5 4.86 4.33 5.53 3.5 5.53C2.67 5.53 2 4.86 2 4.03C2 3.2 2.67 2.53 3.5 2.53ZM9 15.03C9 16.96 10.57 18.53 12.5 18.53C14.43 18.53 16 16.96 16 15.03C16 13.1 14.43 11.53 12.5 11.53C10.57 11.53 9 13.1 9 15.03ZM14 15.03C14 15.86 13.33 16.53 12.5 16.53C11.67 16.53 11 15.86 11 15.03C11 14.2 11.67 13.53 12.5 13.53C13.33 13.53 14 14.2 14 15.03Z" />
  </svg>
);

const ClockIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="18.5" stroke="currentColor" strokeWidth="4" />
    <path d="M24 12.5V24H32" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WithdrawalsIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

const SettlementsIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const RupeeIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="M6 13l8.5 8" />
    <path d="M6 13h3a4.5 4.5 0 0 0 0-9" />
  </svg>
);

const BanknoteIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2.5" />
    <circle cx="12" cy="12" r="3" />
    <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="3" />
    <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="3" />
  </svg>
);

const BankBuildingIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21h18" />
    <path d="M3 10h18" />
    <path d="M5 10v8" />
    <path d="M9 10v8" />
    <path d="M15 10v8" />
    <path d="M19 10v8" />
    <path d="M12 3L2 8h20L12 3z" />
  </svg>
);

const ReceiptIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 2v19l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="10" x2="16" y2="10" />
    <line x1="8" y1="14" x2="13" y2="14" />
  </svg>
);

const ListBulletIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="9" y1="6" x2="21" y2="6" />
    <line x1="9" y1="12" x2="21" y2="12" />
    <line x1="9" y1="18" x2="21" y2="18" />
    <circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none" />
    <circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const TrendingUpIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default function Finance() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [dateRange, setDateRange] = useState('01 Nov 2026 – 05 Nov 2026');
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Tab pagination and search states (for non-overview tabs)
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    status: 'All',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchTerm,
      status: statusFilter,
    });
    setCurrentPage(1);
  };

  // Fetch Finance Overview API
  const { data: financeResponse, isLoading } = useQuery({
    queryKey: ['admin-finance-overview'],
    queryFn: () => getFinanceOverviewApi(),
  });

  const apiData = financeResponse?.data;

  // Summary Metrics
  const summaryData = useMemo(() => {
    if (apiData?.summary) {
      const s = apiData.summary;
      return {
        totalBookings: Number(s.totalBookings || 0).toLocaleString('en-IN'),
        totalRideAmount: `₹ ${Number(s.totalRideAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        commissionEarned: `₹ ${Number(s.commissionAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        commissionRateText: s.commissionRate ? `${s.commissionRate}% Rate` : '↑ +18.2%',
        onlineCollections: `₹ ${Number(s.onlineCollections || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        cashCollections: `₹ ${Number(s.cashCollections || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
      };
    }
    return {
      totalBookings: financeStats.totalBookings,
      totalRideAmount: financeStats.totalRideAmount,
      commissionEarned: financeStats.commissionEarned,
      commissionRateText: '↑ ' + financeStats.commissionGrowth,
      onlineCollections: financeStats.onlineCollections,
      cashCollections: financeStats.cashCollections,
    };
  }, [apiData]);

  // Payment Distribution
  const paymentDistData = useMemo(() => {
    if (apiData?.paymentDistribution && Array.isArray(apiData.paymentDistribution)) {
      const onlineObj = apiData.paymentDistribution.find(
        (p) => (p.mode || '').toLowerCase() === 'online'
      ) || { amount: 0, percentage: 0 };
      const cashObj = apiData.paymentDistribution.find(
        (p) => (p.mode || '').toLowerCase() === 'cash'
      ) || { amount: 0, percentage: 0 };

      const totalAmt = Number(apiData?.summary?.totalRideAmount ?? (onlineObj.amount + cashObj.amount));
      const onlinePct = onlineObj.percentage ?? (totalAmt > 0 ? (onlineObj.amount / totalAmt) * 100 : 0);
      const cashPct = cashObj.percentage ?? (totalAmt > 0 ? (cashObj.amount / totalAmt) * 100 : 0);

      const circumference = 238.7;
      const onlineDash = (onlinePct / 100) * circumference;
      const cashDash = (cashPct / 100) * circumference;

      return {
        totalAmount: `₹ ${totalAmt.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        onlinePayments: `₹ ${Number(onlineObj.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        onlinePercentage: `${onlinePct}%`,
        cashPayments: `₹ ${Number(cashObj.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        cashPercentage: `${cashPct}%`,
        onlineDash,
        cashDash,
      };
    }

    return {
      totalAmount: paymentDistribution.totalAmount,
      onlinePayments: paymentDistribution.onlinePayments,
      onlinePercentage: paymentDistribution.onlinePercentage,
      cashPayments: paymentDistribution.cashPayments,
      cashPercentage: paymentDistribution.cashPercentage,
      onlineDash: 159.2,
      cashDash: 79.5,
    };
  }, [apiData]);

  // Earnings Chart Data & Dynamic Curve
  const chartItems = useMemo(() => {
    if (
      apiData?.earningsOverview &&
      Array.isArray(apiData.earningsOverview) &&
      apiData.earningsOverview.length > 0
    ) {
      return apiData.earningsOverview.map((item) => {
        const d = new Date(item.date);
        const dayLabel = !isNaN(d.getTime())
          ? d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
          : item.date;
        return {
          day: dayLabel,
          rideAmount: Number(item.rideAmount || 0),
          commission: Number(item.commission || 0),
        };
      });
    }
    return earningsChartData;
  }, [apiData]);

  const chartConfig = useMemo(() => {
    const maxVal = Math.max(
      ...chartItems.map((c) => Math.max(c.rideAmount, c.commission)),
      100
    );
    const magnitude = Math.pow(10, Math.max(Math.floor(Math.log10(maxVal)), 1));
    const ceilMax = Math.ceil(maxVal / magnitude) * magnitude || 100;

    const getY = (val) => 195 - (val / ceilMax) * 175;

    const n = chartItems.length;
    let points = [];
    if (n === 1) {
      const yRide = getY(chartItems[0].rideAmount);
      const yComm = getY(chartItems[0].commission);
      points = [
        { x: 110, yRide, yComm, item: chartItems[0] },
        { x: 350, yRide, yComm, item: chartItems[0] },
        { x: 590, yRide, yComm, item: chartItems[0] },
      ];
    } else {
      const step = (590 - 110) / (n - 1);
      points = chartItems.map((item, idx) => ({
        x: 110 + idx * step,
        yRide: getY(item.rideAmount),
        yComm: getY(item.commission),
        item,
      }));
    }

    const ridePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.yRide}`, '');
    const rideAreaPath = `${ridePath} L ${points[points.length - 1].x},195 L ${points[0].x},195 Z`;
    const commPath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x},${p.yComm}`, '');

    const yLevels = [
      { y: 20, val: ceilMax },
      { y: 55, val: Math.round(ceilMax * 0.8) },
      { y: 90, val: Math.round(ceilMax * 0.6) },
      { y: 125, val: Math.round(ceilMax * 0.4) },
      { y: 160, val: Math.round(ceilMax * 0.2) },
      { y: 195, val: 0 },
    ];

    return { points, ridePath, rideAreaPath, commPath, yLevels };
  }, [chartItems]);

  // Recent Transactions Data (strictly from API, empty if none)
  const recentTransactionsDisplay = useMemo(() => {
    if (apiData?.recentTransactions && Array.isArray(apiData.recentTransactions)) {
      return apiData.recentTransactions.map((txn, idx) => {
        const formattedType = txn.type
          ? txn.type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
          : 'Ride Payment';
        const formattedMode = txn.mode
          ? txn.mode.charAt(0).toUpperCase() + txn.mode.slice(1).toLowerCase()
          : 'Cash';
        const dt = txn.dateTime
          ? new Date(txn.dateTime).toLocaleString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })
          : '-';
        return {
          id: idx + 1,
          txnId: txn.transactionId || (txn.bookingId ? `TXN${txn.bookingId}` : idx + 1),
          bookingId: txn.bookingId,
          type: formattedType,
          amount: `₹ ${Number(txn.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
          mode: formattedMode,
          dateTime: dt,
          status: txn.status || 'Success',
          driver: txn.driver,
          passenger: txn.passenger,
        };
      });
    }
    return [];
  }, [apiData]);

  // Wallet & Settlement Data
  const settlementData = useMemo(() => {
    if (apiData?.walletSettlement) {
      const w = apiData.walletSettlement;
      return {
        platformWalletBalance: `₹ ${Number(w.platformWalletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        cashCommissionDue: `₹ ${Number(w.cashCommissionDue || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        withdrawalRequests: `₹ ${Number(w.pendingWithdrawalRequests || 0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`,
        lastSettlement: w.lastSettlement
          ? `₹ ${Number(w.lastSettlement).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
          : '₹ 0',
        lastSettlementDate:
          w.lastSettlementDate || (w.lastSettlement ? 'Completed' : 'No settlements yet'),
      };
    }
    return {
      platformWalletBalance: walletSettlementStats.platformWalletBalance,
      cashCommissionDue: walletSettlementStats.cashCommissionDue,
      withdrawalRequests: walletSettlementStats.withdrawalRequests,
      lastSettlement: walletSettlementStats.lastSettlement,
      lastSettlementDate: walletSettlementStats.lastSettlementDate,
    };
  }, [apiData]);

  // Tab Definitions matching screenshot
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: WalletIcon },
    { id: 'Online Payments', label: 'Online Payments', icon: CreditCardIcon },
    { id: 'Cash Collections', label: 'Cash Collections', icon: CoinsIcon },
    { id: 'Commission', label: 'Commission', icon: PercentIcon },
    { id: 'Cash Commission Due', label: 'Cash Commission Due', icon: ClockIcon },
    { id: 'Withdrawals', label: 'Withdrawals', icon: WithdrawalsIcon },
    { id: 'Settlements', label: 'Settlements', icon: SettlementsIcon },
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
                setSearchTerm('');
                setStatusFilter('All');
                setStatusDropdownOpen(false);
                setAppliedFilters({ search: '', status: 'All' });
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
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Finance Dashboard
          </h2>
          {isLoading && (
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          )}
        </div>

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
            <div className="bg-[#f0fdf4] border border-emerald-100 rounded-2xl px-4 py-3.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <WalletIcon className="w-5.5 h-5.5 text-emerald-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">Total Bookings</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
                  {summaryData.totalBookings}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  ↑ {financeStats.bookingsGrowth}
                </p>
              </div>
            </div>

            {/* Card 2: Total Ride Amount */}
            <div className="bg-[#f0f9ff] border border-sky-100 rounded-2xl px-4 py-3.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-100/90 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <RupeeIcon className="w-5.5 h-5.5 text-sky-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">Total Ride Amount</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
                  {summaryData.totalRideAmount}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  ↑ {financeStats.rideAmountGrowth}
                </p>
              </div>
            </div>

            {/* Card 3: Commission Earned */}
            <div className="bg-[#fefce8] border border-amber-100 rounded-2xl px-4 py-3.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <PercentIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">Commission Earned</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
                  {summaryData.commissionEarned}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  {summaryData.commissionRateText}
                </p>
              </div>
            </div>

            {/* Card 4: Online Collections */}
            <div className="bg-[#faf5ff] border border-purple-100 rounded-2xl px-4 py-3.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-100/90 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                <CreditCardIcon className="w-5.5 h-5.5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">Online Collections</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
                  {summaryData.onlineCollections}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
                  ↑ {financeStats.onlineGrowth}
                </p>
              </div>
            </div>

            {/* Card 5: Cash Collections */}
            <div className="bg-[#fff1f2] border border-rose-100 rounded-2xl px-4 py-3.5 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-100/90 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                <BanknoteIcon className="w-5.5 h-5.5 text-rose-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-[13px] font-bold text-slate-700 truncate">Cash Collections</p>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight mt-0.5">
                  {summaryData.cashCollections}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-emerald-600 mt-0.5">
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
                  <TrendingUpIcon className="w-5 h-5 text-emerald-600" />
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
                  {chartConfig.yLevels.map((lvl) => (
                    <line
                      key={lvl.y}
                      x1="70"
                      y1={lvl.y}
                      x2="630"
                      y2={lvl.y}
                      stroke={lvl.y === 195 ? '#cbd5e1' : '#e2e8f0'}
                      strokeWidth={lvl.y === 195 ? '1.2' : '1'}
                    />
                  ))}

                  {/* Y-Axis Labels */}
                  {chartConfig.yLevels.map((lvl) => (
                    <text
                      key={lvl.y}
                      x="60"
                      y={lvl.y + 4}
                      textAnchor="end"
                      className="text-[11px] fill-slate-700 font-bold"
                    >
                      ₹{lvl.val >= 1000 ? `${Math.round(lvl.val / 1000)}k` : lvl.val}
                    </text>
                  ))}

                  {/* Green Area Fill for Ride Amount */}
                  <path
                    d={chartConfig.rideAreaPath}
                    fill="url(#financeGreenGradient)"
                  />

                  {/* Green Line (Ride Amount) */}
                  <path
                    d={chartConfig.ridePath}
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Green Dots */}
                  {chartConfig.points.map((p, idx) => (
                    <circle
                      key={`green-${idx}`}
                      cx={p.x}
                      cy={p.yRide}
                      r="4.5"
                      fill="#ffffff"
                      stroke="#16a34a"
                      strokeWidth="2.5"
                    />
                  ))}

                  {/* Yellow Line (Commission) */}
                  <path
                    d={chartConfig.commPath}
                    fill="none"
                    stroke="#fed011"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  />

                  {/* Yellow Dots */}
                  {chartConfig.points.map((p, idx) => (
                    <circle
                      key={`yellow-${idx}`}
                      cx={p.x}
                      cy={p.yComm}
                      r="3.5"
                      fill="#ffffff"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                  ))}
                </svg>

                {/* X-Axis Labels */}
                <div className="flex justify-between pl-20 pr-8 text-xs text-slate-500 font-bold mt-1">
                  {chartItems.map((c, i) => (
                    <span key={i}>{c.day}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Payment Distribution (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              {/* Header */}
              <div className="flex items-center gap-2 mb-2">
                <PercentIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Payment Distribution
                </h3>
              </div>

              {/* Donut Chart & Legend Row */}
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-5 my-auto py-2">
                {/* Donut Circle SVG */}
                <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
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
                    {/* Green Segment: Online Payments */}
                    {paymentDistData.onlineDash > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#16a34a"
                        strokeWidth="14"
                        strokeDasharray={`${paymentDistData.onlineDash} 238.7`}
                        strokeDashoffset="0"
                        strokeLinecap="round"
                      />
                    )}
                    {/* Yellow Segment: Cash Payments */}
                    {paymentDistData.cashDash > 0 && (
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#fed011"
                        strokeWidth="14"
                        strokeDasharray={`${paymentDistData.cashDash} 238.7`}
                        strokeDashoffset={`-${paymentDistData.onlineDash}`}
                        strokeLinecap="round"
                      />
                    )}
                  </svg>

                  {/* Inner text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-base font-black text-slate-900 leading-tight">
                      {paymentDistData.totalAmount}
                    </span>
                    <span className="text-xs font-bold text-slate-500 mt-0.5">
                      Total Amount
                    </span>
                  </div>
                </div>

                {/* Legend & Breakdown Details */}
                <div className="space-y-3.5 min-w-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-xs bg-[#16a34a] shrink-0" />
                      <span className="text-sm font-bold text-slate-800">Online Payments</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5 pl-6">
                      {paymentDistData.onlinePayments}{' '}
                      <span className="text-xs sm:text-[13px] font-bold text-slate-500">
                        ({paymentDistData.onlinePercentage})
                      </span>
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-xs bg-[#fed011] shrink-0" />
                      <span className="text-sm font-bold text-slate-800">Cash Payments</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900 mt-0.5 pl-6">
                      {paymentDistData.cashPayments}{' '}
                      <span className="text-xs sm:text-[13px] font-bold text-slate-500">
                        ({paymentDistData.cashPercentage})
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
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <ListBulletIcon className="w-5.5 h-5.5 text-emerald-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
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
                <div className="overflow-x-auto scrollbar-thin rounded-xl border border-slate-200/80 shadow-xs">
                  <table className="w-full text-left text-[13px] sm:text-sm">
                    <thead>
                      <tr className="bg-[#feea98]/60 text-slate-900 font-bold border-b border-amber-200/60">
                        <th className="py-3 px-3.5">#</th>
                        <th className="py-3 px-3.5">Transaction ID</th>
                        <th className="py-3 px-3.5">Type</th>
                        <th className="py-3 px-3.5">Amount</th>
                        <th className="py-3 px-3.5">Mode</th>
                        <th className="py-3 px-3.5">Date & Time</th>
                        <th className="py-3 px-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold text-slate-800">
                      {recentTransactionsDisplay.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                            No recent transactions found
                          </td>
                        </tr>
                      ) : (
                        recentTransactionsDisplay.slice(0, 5).map((txn) => (
                          <tr key={txn.id} className="hover:bg-amber-50/20 transition-colors">
                            <td className="py-3 px-3.5 font-bold text-slate-500">{txn.id}</td>
                            <td className="py-3 px-3.5 font-bold text-slate-900 whitespace-nowrap">
                              <div>{txn.txnId}</div>
                              {(txn.passenger || txn.driver) && (
                                <div className="text-[11px] font-normal text-slate-500">
                                  {txn.passenger?.name ? `Pass: ${txn.passenger.name}` : ''}
                                  {txn.passenger?.name && txn.driver?.name ? ' • ' : ''}
                                  {txn.driver?.name ? `Driver: ${txn.driver.name}` : ''}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {renderTypePill(txn.type)}
                            </td>
                            <td className="py-3 px-3.5 font-black text-slate-900 whitespace-nowrap">
                              {txn.amount}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap text-slate-700 font-semibold">
                              {txn.mode}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 text-xs sm:text-[13px] font-semibold">
                              {txn.dateTime}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {renderStatusBadge(txn.status)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right: Wallet & Settlement (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3.5">
                  <WalletIcon className="w-5.5 h-5.5 text-emerald-600" />
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    Wallet & Settlement
                  </h3>
                </div>

                <div className="space-y-2 divide-y divide-slate-100">
                  {/* Item 1: Platform Wallet Balance */}
                  <div className="flex items-center justify-between py-3 px-1.5 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <WalletIcon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Platform Wallet Balance
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {settlementData.platformWalletBalance}
                      </span>
                      <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 2: Cash Commission Due */}
                  <div className="flex items-center justify-between py-3 px-1.5 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <PercentIcon className="w-4.5 h-4.5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Cash Commission Due
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {walletSettlementStats.cashCommissionSub}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {settlementData.cashCommissionDue}
                      </span>
                      <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 3: Withdrawal Requests */}
                  <div className="flex items-center justify-between py-3 px-1.5 hover:bg-slate-50/70 rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <BankBuildingIcon className="w-5 h-5 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Withdrawal Requests
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {walletSettlementStats.withdrawalRequestsSub}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {settlementData.withdrawalRequests}
                      </span>
                      <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
                    </div>
                  </div>

                  {/* Item 4: Last Settlement - Soft Rose Background Banner matching screenshot */}
                  <div className="flex items-center justify-between py-3 px-3 bg-[#fff1f2] hover:bg-rose-100/60 rounded-2xl transition-colors cursor-pointer mt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100/90 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                        <ReceiptIcon className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Last Settlement
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          {settlementData.lastSettlementDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-base sm:text-lg font-black text-slate-900">
                        {settlementData.lastSettlement}
                      </span>
                      <ChevronRight className="w-4.5 h-4.5 text-slate-400" />
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
        <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Controls Bar: Search, Status, Export */}
          <div className="p-3.5 sm:p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder={`Search in ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Custom Status Dropdown */}
              <div className="relative w-full sm:w-38">
                <button
                  type="button"
                  onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                  className="w-full flex items-center justify-between px-3.5 py-2 text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
                >
                  <span className="truncate">
                    {statusFilter === 'All' ? 'All Statuses' : statusFilter}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      statusDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {statusDropdownOpen && (
                  <div className="absolute left-0 sm:left-auto right-0 mt-1.5 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                    {['All Statuses', 'Success', 'Completed', 'Pending'].map((status) => {
                      const isSelected =
                        status === 'All Statuses'
                          ? statusFilter === 'All' || statusFilter === 'All Statuses'
                          : statusFilter === status;
                      return (
                        <button
                          key={status}
                          type="button"
                          onClick={() => {
                            setStatusFilter(status === 'All Statuses' ? 'All' : status);
                            setStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#fed011] text-black shadow-2xs'
                              : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                          }`}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Filter className="w-4 h-4 fill-black" />
                <span>Apply</span>
              </button>

              <button
                type="button"
                onClick={() => alert(`Exporting ${activeTab} data...`)}
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.4]" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs sm:text-sm min-w-[850px]">
              <thead>
                <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                  <th className="py-2.5 px-3.5 text-center w-12 whitespace-nowrap">#</th>
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Transaction ID</th>
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Type</th>
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Amount</th>
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Mode</th>
                  <th className="py-2.5 px-3.5 whitespace-nowrap">Date & Time</th>
                  <th className="py-2.5 px-3.5 text-center whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
                {recentTransactionsDisplay
                  .filter((item) => {
                    if (
                      appliedFilters.status !== 'All' &&
                      appliedFilters.status !== 'All Statuses' &&
                      item.status !== appliedFilters.status
                    ) {
                      return false;
                    }
                    if (
                      appliedFilters.search &&
                      !String(item.txnId).toLowerCase().includes(appliedFilters.search.toLowerCase()) &&
                      !String(item.type).toLowerCase().includes(appliedFilters.search.toLowerCase())
                    ) {
                      return false;
                    }
                    return true;
                  }).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  recentTransactionsDisplay
                    .filter((item) => {
                      if (
                        appliedFilters.status !== 'All' &&
                        appliedFilters.status !== 'All Statuses' &&
                        item.status !== appliedFilters.status
                      ) {
                        return false;
                      }
                      if (
                        appliedFilters.search &&
                        !String(item.txnId).toLowerCase().includes(appliedFilters.search.toLowerCase()) &&
                        !String(item.type).toLowerCase().includes(appliedFilters.search.toLowerCase())
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
                    ))
                )}
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

