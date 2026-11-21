import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Star,
  ListFilter,
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical,
  Loader2,
  AlertCircle,
  RotateCcw,
  Filter,
} from 'lucide-react';
import Pagination from '../../components/common/Pagination';
import group10Icon from '../../assets/dashboard/Group (10).svg';
import driverIcon from '../../assets/dashboard/50faa1d6-f73a-4c77-b528-d5ff6b3e8fa5 1.svg';
import reviewsStarIcon from '../../assets/dashboard/reviews-star.svg';
import reviewsDriverIcon from '../../assets/dashboard/reviews-driver-rating.svg';
import reviewsPassengerIcon from '../../assets/dashboard/reviews-passenger-rating.svg';
import reviewsChatIcon from '../../assets/dashboard/reviews-chat-bubble.svg';
import { getReviewsApi } from '../../services/review.services';

// Format Date & Time helper
const formatDateTime = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return String(dateStr);
  }
};

// Normalize API review to standard UI format
const normalizeReview = (r, idx) => {
  const reviewerName =
    r.reviewer?.name ||
    r.reviewerName ||
    r.fromUser?.name ||
    r.user?.name ||
    r.passengerName ||
    r.driverName ||
    '-';

  const reviewerRole =
    r.reviewer?.role ||
    r.reviewerRole ||
    r.reviewerType ||
    r.fromUser?.role ||
    r.role ||
    'Passenger';

  // Exact image from API (no fake image fallback)
  const reviewerAvatar =
    r.reviewer?.imageUrl ||
    r.reviewer?.avatar ||
    r.reviewer?.profileImage ||
    r.reviewer?.photo ||
    r.reviewer?.image ||
    r.reviewerAvatar ||
    r.reviewerPhoto ||
    r.reviewerImage ||
    r.avatar ||
    r.profileImage ||
    r.imageUrl ||
    r.photo ||
    r.image ||
    '';

  const targetName =
    r.reviewFor?.name ||
    r.reviewForName ||
    r.target?.name ||
    r.targetName ||
    r.toUser?.name ||
    (String(reviewerRole).toLowerCase() === 'passenger' ? r.driverName : r.passengerName) ||
    '-';

  const targetRole =
    r.reviewFor?.role ||
    r.reviewForRole ||
    r.targetRole ||
    r.targetType ||
    r.target?.role ||
    r.toUser?.role ||
    (String(reviewerRole).toLowerCase() === 'passenger' ? 'driver' : 'passenger');

  const targetAvatar =
    r.reviewFor?.imageUrl ||
    r.reviewFor?.avatar ||
    r.reviewFor?.profileImage ||
    r.reviewFor?.photo ||
    r.reviewFor?.image ||
    r.targetAvatar ||
    r.target?.imageUrl ||
    '';

  const rating = Number(r.rating ?? r.stars ?? r.score ?? 5);

  const reviewText =
    r.reviewText ||
    r.review ||
    r.comment ||
    r.feedback ||
    r.message ||
    '-';

  const rideId =
    r.rideId ||
    r.ride?.rideId ||
    r.rideCode ||
    (r.ride?.id ? `#${r.ride.id}` : null) ||
    r.tripId ||
    (r.id ? `#${r.id}` : '-');

  const dateTime = r.dateTime || r.createdAt || r.reviewDate || r.date;

  return {
    id: r.id ?? r.reviewId ?? r._id ?? idx,
    reviewerName,
    reviewerRole,
    reviewerAvatar,
    targetName,
    targetRole,
    rating,
    reviewText,
    rideId,
    dateTime: formatDateTime(dateTime),
    rawDate: dateTime,
  };
};

export default function RatingsReviews() {
  const [activeTab, setActiveTab] = useState('All Reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Calendar UI state for custom interactive picker
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 10, 1)); // Default Nov 2026
  const [tempStart, setTempStart] = useState('');
  const [tempEnd, setTempEnd] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(20);

  // Filters applied state (applied when user clicks "Apply" button or presses Enter)
  const [appliedFilters, setAppliedFilters] = useState({
    rating: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    search: undefined,
    targetRole: 'All',
  });

  const handleApply = () => {
    setCurrentPage(1);
    setAppliedFilters({
      rating: ratingFilter !== 'All' ? Number(ratingFilter) : undefined,
      dateFrom: startDate || undefined,
      dateTo: endDate || undefined,
      search: searchTerm.trim() || undefined,
      targetRole: roleFilter,
    });
  };

  // Scroll to top on page or tab change
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentPage, activeTab]);

  // Map active tab to reviewerRole query param
  const reviewerRoleParam =
    activeTab === 'Passenger Reviews'
      ? 'passenger'
      : activeTab === 'Driver Reviews'
      ? 'driver'
      : undefined;

  // Direct query parameters passed straight to API without unnecessary conditions
  const queryParams = {
    page: currentPage,
    limit: entriesPerPage,
    ...(reviewerRoleParam && { reviewerRole: reviewerRoleParam }),
    ...(appliedFilters.rating && { rating: appliedFilters.rating }),
    ...(appliedFilters.dateFrom && { dateFrom: appliedFilters.dateFrom }),
    ...(appliedFilters.dateTo && { dateTo: appliedFilters.dateTo }),
    ...(appliedFilters.search && { search: appliedFilters.search }),
  };

  // ========================================
  // GET REVIEWS API (React Query)
  // ========================================
  const {
    data: reviewsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['reviews', queryParams],
    queryFn: () => getReviewsApi(queryParams),
  });

  const apiData = reviewsResponse?.data;
  const meta = reviewsResponse?.meta;

  const rawReviews = useMemo(() => {
    if (Array.isArray(apiData?.reviews)) return apiData.reviews;
    if (Array.isArray(apiData?.items)) return apiData.items;
    if (Array.isArray(apiData?.rows)) return apiData.rows;
    if (Array.isArray(apiData)) return apiData;
    return [];
  }, [apiData]);

  const stats = apiData?.stats || apiData?.summary || reviewsResponse?.stats;

  const summaryStats = {
    overallRating: stats?.overallRating ?? stats?.averageRating ?? stats?.avgRating ?? 0,
    driverRating: stats?.driverRating ?? stats?.driverAvgRating ?? 0,
    passengerRating: stats?.passengerRating ?? stats?.passengerAvgRating ?? 0,
    totalReviews: stats?.totalReviews ?? meta?.total ?? rawReviews.length,
  };

  const allReviews = useMemo(() => {
    return rawReviews.map((r, idx) => normalizeReview(r, idx));
  }, [rawReviews]);

  const handleReset = () => {
    setSearchTerm('');
    setRatingFilter('All');
    setRoleFilter('All');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setCurrentPage(1);
    setAppliedFilters({
      rating: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      search: undefined,
      targetRole: 'All',
    });
  };

  // Tab definitions
  const tabs = [
    { id: 'All Reviews', label: 'All Reviews', icon: ListFilter },
    { id: 'Passenger Reviews', label: 'Passenger Reviews', iconImg: group10Icon },
    { id: 'Driver Reviews', label: 'Driver Reviews', iconImg: driverIcon },
  ];

  // Helper for rendering 5 stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFilled = i <= fullStars;
          return (
            <Star
              key={i}
              className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : hasHalf && i === fullStars + 1
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          );
        })}
      </div>
    );
  };

  // Filtered reviews: server handles activeTab (reviewerRole), rating, dateFrom, dateTo, search.
  // roleFilter (Review For dropdown) filters locally on targetRole if selected.
  const filteredReviews = useMemo(() => {
    return allReviews.filter((item) => {
      if (appliedFilters.targetRole && appliedFilters.targetRole !== 'All') {
        if (String(item.targetRole).toLowerCase() !== appliedFilters.targetRole.toLowerCase()) return false;
      }
      return true;
    });
  }, [allReviews, appliedFilters.targetRole]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* =========================================================
          1. TOP ROW: 4 SUMMARY STATS CARDS (Responsive)
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Overall Rating */}
        <div className="bg-[#fffdf5] border border-amber-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#feea98] flex items-center justify-center shrink-0 shadow-2xs">
            <img src={reviewsStarIcon} alt="Overall Rating" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl sm:text-[32px] font-black text-slate-900 leading-tight">
              {summaryStats.overallRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Overall Rating
            </p>
          </div>
        </div>

        {/* Card 2: Driver Rating */}
        <div className="bg-[#f0fdf4] border border-emerald-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#dcfce7] flex items-center justify-center shrink-0 shadow-2xs">
            <img src={reviewsDriverIcon} alt="Driver Rating" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl sm:text-[32px] font-black text-slate-900 leading-tight">
              {summaryStats.driverRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Driver Rating
            </p>
          </div>
        </div>

        {/* Card 3: Passenger Rating */}
        <div className="bg-[#fff1f2] border border-rose-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#fee2e2] flex items-center justify-center shrink-0 shadow-2xs">
            <img src={reviewsPassengerIcon} alt="Passenger Rating" className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl sm:text-[32px] font-black text-slate-900 leading-tight">
              {summaryStats.passengerRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Passenger Rating
            </p>
          </div>
        </div>

        {/* Card 4: Total Reviews */}
        <div className="bg-[#fffdf5] border border-amber-200/70 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-3.5 sm:gap-4.5">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#feea98] flex items-center justify-center shrink-0 shadow-2xs">
            <img src={reviewsChatIcon} alt="Total Reviews" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl sm:text-[32px] font-black text-slate-900 leading-tight">
              {summaryStats.totalReviews}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Total Reviews
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. FILTER TABS: All Reviews, Passenger Reviews, Driver Reviews
          ========================================================= */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                isActive
                  ? 'bg-[#fed011] text-black shadow-xs font-black'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.iconImg ? (
                <img src={tab.iconImg} alt={tab.label} className="w-4 h-4 object-contain" />
              ) : Icon ? (
                <Icon className="w-4 h-4 shrink-0" />
              ) : null}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          3. SEARCH & CONTROLS FILTER BAR (Responsive)
          ========================================================= */}
      <div className="bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-100 shadow-2xs flex flex-col xl:flex-row items-stretch xl:items-end justify-between gap-2.5">
        {/* Search by Name, Ride ID or Review */}
        <div className="relative flex-1 min-w-0 max-w-full xl:max-w-sm 2xl:max-w-md">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, ride ID or review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleApply();
            }}
            className="w-full pl-10.5 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-2 w-full xl:w-auto">
          {/* Rating Dropdown */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-2">
              Rating
            </label>
            <button
              type="button"
              onClick={() => {
                setRatingDropdownOpen(!ratingDropdownOpen);
                setRoleDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-36 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="truncate">{ratingFilter === 'All' ? 'All Ratings' : `${ratingFilter} Star`}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  ratingDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {ratingDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['All', '5', '4', '3', '2', '1'].map((r) => {
                  const isSelected = ratingFilter === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setRatingFilter(r);
                        setRatingDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {r === 'All' ? 'All Ratings' : `${r} Star`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review For / Role Dropdown */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Review For
            </label>
            <button
              type="button"
              onClick={() => {
                setRoleDropdownOpen(!roleDropdownOpen);
                setRatingDropdownOpen(false);
                setDatePickerOpen(false);
              }}
              className="w-full sm:w-42 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <img
                  src={roleFilter === 'Driver' ? driverIcon : group10Icon}
                  alt="Role"
                  className="w-3.5 h-3.5 object-contain opacity-70"
                />
                <span className="truncate">{roleFilter === 'All' ? 'All Roles' : `For ${roleFilter}`}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  roleDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Custom Dropdown Menu */}
            {roleDropdownOpen && (
              <div className="absolute left-0 max-sm:right-0 mt-1.5 sm:w-44 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95">
                {['All', 'Driver', 'Passenger'].map((rf) => {
                  const isSelected = roleFilter === rf;
                  return (
                    <button
                      key={rf}
                      type="button"
                      onClick={() => {
                        setRoleFilter(rf);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-[13px] font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#fed011] text-black shadow-2xs font-bold'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      {rf === 'All' ? 'All Roles' : `For ${rf}`}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Review Date Dropdown & Picker */}
          <div className="flex-1 sm:flex-initial relative max-sm:w-full">
            <label className="block text-xs font-bold text-slate-700 mb-1 max-sm:mt-1">
              Review Date
            </label>
            <button
              type="button"
              onClick={() => {
                if (!datePickerOpen) {
                  setTempStart(startDate);
                  setTempEnd(endDate);
                  if (startDate) {
                    const [y, m] = startDate.split('-').map(Number);
                    if (y && m) setCalendarViewDate(new Date(y, m - 1, 1));
                  }
                }
                setDatePickerOpen(!datePickerOpen);
                setRatingDropdownOpen(false);
                setRoleDropdownOpen(false);
              }}
              className="w-full sm:w-54 flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl border border-gray-200 bg-white text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
            >
              <span className="flex items-center gap-1.5 text-slate-700 truncate">
                <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">
                  {startDate || endDate
                    ? `${startDate ? startDate.split('-').reverse().join('-') : 'Start'} → ${endDate ? endDate.split('-').reverse().join('-') : 'End'}`
                    : 'Select Date Range'}
                </span>
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            </button>

            {/* Date Range Picker Popover with Custom Calendar View */}
            {datePickerOpen && (
              <div className="absolute right-0 max-sm:left-0 max-sm:right-auto mt-1.5 w-72 sm:w-68 max-w-[calc(100vw-2rem)] bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-40 space-y-2.5 animate-in fade-in zoom-in-95">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">
                      Review Date
                    </span>
                  </div>
                  {(tempStart || tempEnd || startDate || endDate) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTempStart('');
                        setTempEnd('');
                        setStartDate('');
                        setEndDate('');
                      }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Interactive Calendar Month View */}
                <div className="bg-slate-50/70 p-2 rounded-xl border border-slate-100">
                  {/* Month / Year Navigator */}
                  <div className="flex items-center justify-between mb-1.5 px-0.5">
                    <span className="text-[11px] font-bold text-slate-900">
                      {calendarViewDate.toLocaleString('default', {
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() - 1,
                              1
                            )
                          )
                        }
                        className="p-0.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCalendarViewDate(
                            new Date(
                              calendarViewDate.getFullYear(),
                              calendarViewDate.getMonth() + 1,
                              1
                            )
                          )
                        }
                        className="p-0.5 rounded-md hover:bg-white text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Day of week headers */}
                  <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                      <span key={d} className="text-[9px] font-bold text-slate-400">
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Days grid */}
                  <div className="grid grid-cols-7 gap-0.5">
                    {(() => {
                      const year = calendarViewDate.getFullYear();
                      const month = calendarViewDate.getMonth();
                      const firstDayIndex = new Date(year, month, 1).getDay();
                      const totalDays = new Date(year, month + 1, 0).getDate();
                      const days = [];

                      // Empty slots for start padding
                      for (let i = 0; i < firstDayIndex; i++) {
                        days.push(
                          <div key={`empty-${i}`} className="w-7 h-6.5 max-sm:mx-auto" />
                        );
                      }

                      // Month days
                      for (let day = 1; day <= totalDays; day++) {
                        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const isStart = tempStart === dateString;
                        const isEnd = tempEnd === dateString;
                        const inRange =
                          tempStart &&
                          tempEnd &&
                          dateString >= tempStart &&
                          dateString <= tempEnd;

                        days.push(
                          <button
                            key={dateString}
                            type="button"
                            onClick={() => {
                              if (!tempStart || (tempStart && tempEnd)) {
                                setTempStart(dateString);
                                setTempEnd('');
                              } else {
                                if (dateString < tempStart) {
                                  setTempStart(dateString);
                                  setTempEnd('');
                                } else {
                                  setTempEnd(dateString);
                                }
                              }
                            }}
                            className={`w-7 h-6.5 max-sm:mx-auto text-[11px] font-medium rounded-md flex items-center justify-center transition-all cursor-pointer ${
                              isStart || isEnd
                                ? 'bg-[#fed011] text-black font-bold shadow-2xs'
                                : inRange
                                ? 'bg-amber-100 text-amber-900 rounded-none max-sm:w-full'
                                : 'text-slate-700 hover:bg-white hover:text-slate-900'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-0.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempStart(startDate);
                      setTempEnd(endDate);
                      setDatePickerOpen(false);
                    }}
                    className="flex-1 h-8 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate(tempStart);
                      setEndDate(tempEnd);
                      setDatePickerOpen(false);
                    }}
                    className="flex-1 h-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            type="button"
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-gray-200 rounded-xl transition-all cursor-pointer max-sm:w-full max-sm:mt-1 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApply}
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer max-sm:w-full"
          >
            <Filter className="w-4 h-4 fill-black" />
            Apply
          </button>
        </div>
      </div>

      {/* =========================================================
          4. RATINGS & REVIEWS DATA TABLE (Responsive)
          ========================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs sm:text-sm min-w-[800px]">
            {/* Header Row with Yellow/Amber Tint */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-bold border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5 whitespace-nowrap">#</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Reviewer</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Review For</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Rating</th>
                <th className="py-2.5 px-3.5 min-w-[260px] whitespace-nowrap">Review</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Ride ID</th>
                <th className="py-2.5 px-3.5 whitespace-nowrap">Date & Time</th>
                <th className="py-2.5 px-2.5 text-center whitespace-nowrap"></th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-8 h-8 animate-spin text-[#fed011]" />
                      <p className="text-sm font-semibold text-slate-600">Loading reviews...</p>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <p className="text-sm font-bold text-slate-800">
                        Unable to load data
                      </p>
                      <button
                        onClick={() => refetch()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#fed011] text-black hover:bg-amber-400 transition-colors cursor-pointer shadow-xs mt-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold text-sm sm:text-base">
                    No reviews found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((item, idx) => {
                  const itemIndex = (currentPage - 1) * entriesPerPage + idx + 1;
                  return (
                    <tr key={item.id ?? idx} className="hover:bg-amber-50/20 transition-colors">
                      {/* Index */}
                      <td className="py-2.5 px-3.5 font-bold text-slate-500 text-sm sm:text-base">{itemIndex}</td>

                      {/* Reviewer (Avatar + Name + Role) */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.reviewerAvatar || ''}
                            alt={item.reviewerName || 'avatar'}
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 ring-2 ring-amber-300/80 bg-amber-50 shadow-2xs"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight whitespace-nowrap">
                              {item.reviewerName}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5">
                              {item.reviewerRole}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Review For (Icon + Name + Role) */}
                      <td className="py-2.5 px-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                            {String(item.targetRole).toLowerCase() === 'driver' ? (
                              <img src={driverIcon} alt="Driver" className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" />
                            ) : (
                              <img src={group10Icon} alt="Passenger" className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight whitespace-nowrap">
                              {item.targetName}
                            </p>
                            {item.targetRole && (
                              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-0.5 capitalize whitespace-nowrap">
                                {item.targetRole}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Rating (Stars + Number) */}
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        {renderStars(item.rating)}
                      </td>

                      {/* Review Text */}
                      <td className="py-2.5 px-3.5 font-medium text-slate-800 text-xs sm:text-sm leading-snug">
                        {item.reviewText}
                      </td>

                      {/* Ride ID Pill */}
                      <td className="py-2.5 px-3.5 whitespace-nowrap">
                        <span className="inline-block bg-[#fffdf0] border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold text-slate-900 shadow-2xs">
                          {item.rideId}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-2.5 px-3.5 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-700">
                        {item.dateTime}
                      </td>

                      {/* Action Menu (3-dots) */}
                      <td className="py-2.5 px-2.5 text-center">
                        <button
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-black transition-colors cursor-pointer"
                          title="Options"
                        >
                          <MoreVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            5. REUSABLE PAGINATION FOOTER
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={meta?.total ?? filteredReviews.length}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newLimit) => {
            setEntriesPerPage(newLimit);
            setCurrentPage(1);
          }}
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </div>
    </div>
  );
}