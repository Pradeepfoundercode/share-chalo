import React, { useState, useMemo } from 'react';
import {
  Star,
  ListFilter,
  Search,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreVertical
} from 'lucide-react';
import { reviewsStats, reviewsList } from '../../data/reviewsData';
import Pagination from '../../components/common/Pagination';
import priyaAvatar from '../../assets/priya_sharma_avatar.png';
import arjunAvatar from '../../assets/arjun_singh_avatar.png';
import harshAvatar from '../../assets/harsh_singh_avatar_square.png';
import defaultAvatar from '../../assets/Smiling Man in Yellow Circular Frame.png';
import group10Icon from '../../assets/dashboard/Group (10).svg';
import driverIcon from '../../assets/dashboard/50faa1d6-f73a-4c77-b528-d5ff6b3e8fa5 1.svg';
import reviewsStarIcon from '../../assets/dashboard/reviews-star.svg';
import reviewsDriverIcon from '../../assets/dashboard/reviews-driver-rating.svg';
import reviewsPassengerIcon from '../../assets/dashboard/reviews-passenger-rating.svg';
import reviewsChatIcon from '../../assets/dashboard/reviews-chat-bubble.svg';

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
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  const handleReset = () => {
    setSearchTerm('');
    setRatingFilter('All');
    setRoleFilter('All');
    setStartDate('');
    setEndDate('');
    setTempStart('');
    setTempEnd('');
    setCurrentPage(1);
  };

  // Tab definitions
  const tabs = [
    { id: 'All Reviews', label: 'All Reviews', icon: ListFilter },
    { id: 'Passenger Reviews', label: 'Passenger Reviews', iconImg: group10Icon },
    { id: 'Driver Reviews', label: 'Driver Reviews', iconImg: driverIcon },
  ];

  // Helper to pick avatar for reviewer
  const getReviewerAvatar = (item) => {
    if (item.reviewerName === 'Priya Sharma') return priyaAvatar;
    if (item.reviewerName === 'Neha Gupta' || item.reviewerName === 'Anjali Sharma')
      return priyaAvatar;
    if (item.reviewerName === 'Amit Verma') return arjunAvatar;
    if (item.reviewerName === 'Rahul Singh' || item.reviewerName === 'Manoj Yadav')
      return harshAvatar;
    return defaultAvatar;
  };

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
        <span className="font-black text-sm sm:text-base text-slate-900 ml-1.5 select-none">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  // Helper to parse date
  const parseReviewDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split(',')[0].trim().split(' ');
    if (parts.length >= 3) {
      const day = parseInt(parts[0], 10);
      const monthNames = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
      };
      const month = monthNames[parts[1]];
      const year = parseInt(parts[2], 10);
      if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  };

  // Filtered reviews logic
  const filteredReviews = useMemo(() => {
    return reviewsList.filter((item) => {
      // Tab Filter
      if (activeTab === 'Passenger Reviews' && item.reviewerRole !== 'Passenger') {
        return false;
      }
      if (activeTab === 'Driver Reviews' && item.reviewerRole !== 'Driver') {
        return false;
      }

      // Search Filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName =
          item.reviewerName.toLowerCase().includes(query) ||
          item.targetName.toLowerCase().includes(query);
        const matchesRide = item.rideId.toLowerCase().includes(query);
        const matchesReview = item.reviewText.toLowerCase().includes(query);
        if (!matchesName && !matchesRide && !matchesReview) return false;
      }

      // Rating Filter
      if (ratingFilter !== 'All') {
        const star = Number(ratingFilter);
        if (Math.floor(item.rating) !== star) return false;
      }

      // Role Filter (For: All / Driver / Passenger)
      if (roleFilter !== 'All') {
        if (item.targetRole !== roleFilter) return false;
      }

      // Review Date Filter
      if (startDate || endDate) {
        const reviewDate = parseReviewDate(item.dateTime);
        if (reviewDate) {
          if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            if (reviewDate < start) return false;
          }
          if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (reviewDate > end) return false;
          }
        }
      }

      return true;
    });
  }, [activeTab, searchTerm, ratingFilter, roleFilter, startDate, endDate]);

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
              {reviewsStats.overallRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Overall Rating
            </p>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
              {reviewsStats.overallSub}
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
              {reviewsStats.driverRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Driver Rating
            </p>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
              {reviewsStats.driverSub}
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
              {reviewsStats.passengerRating}
            </h3>
            <p className="text-sm sm:text-base font-bold text-slate-900 leading-tight mt-0.5 truncate">
              Passenger Rating
            </p>
            <p className="text-xs sm:text-[13px] font-medium text-slate-500 leading-tight mt-0.5 truncate">
              {reviewsStats.passengerSub}
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
              {reviewsStats.totalReviews}
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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10.5 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Dropdowns Group */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-end gap-2">
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
                        setCurrentPage(1);
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
                        setCurrentPage(1);
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
                      setCurrentPage(1);
                    }}
                    className="flex-1 h-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs font-bold shadow-xs cursor-pointer transition-colors"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-bold text-black bg-[#fed011] hover:bg-amber-400 rounded-xl shadow-xs transition-all cursor-pointer w-full sm:w-auto shrink-0"
          >
            <Download className="w-4 h-4 stroke-[2.4]" />
            <span>Export</span>
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
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60 text-sm sm:text-base">
                <th className="py-2.5 px-3.5">#</th>
                <th className="py-2.5 px-3.5">Reviewer</th>
                <th className="py-2.5 px-3.5">Review For</th>
                <th className="py-2.5 px-3.5">Rating</th>
                <th className="py-2.5 px-3.5 min-w-[260px]">Review</th>
                <th className="py-2.5 px-3.5">Ride ID</th>
                <th className="py-2.5 px-3.5">Date & Time</th>
                <th className="py-2.5 px-2.5 text-center"></th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold text-sm sm:text-base">
                    No reviews found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.slice(0, 5).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Index */}
                    <td className="py-2 px-3.5 font-bold text-slate-500 text-sm sm:text-base">{idx + 1}</td>

                    {/* Reviewer (Avatar + Name + Role) */}
                    <td className="py-2 px-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={getReviewerAvatar(item)}
                          alt={item.reviewerName}
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

                    {/* Review For (Icon + Role + Name) */}
                    <td className="py-2 px-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 shadow-2xs">
                          {item.targetRole === 'Driver' ? (
                            <img src={driverIcon} alt="Driver" className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" />
                          ) : (
                            <img src={group10Icon} alt="Passenger" className="w-5 h-5 sm:w-5.5 sm:h-5.5 object-contain" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm sm:text-base leading-tight whitespace-nowrap">
                            {item.targetRole}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-0.5 whitespace-nowrap">
                            {item.targetName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rating (Stars + Number) */}
                    <td className="py-2 px-3.5 whitespace-nowrap">
                      {renderStars(item.rating)}
                    </td>

                    {/* Review Text */}
                    <td className="py-2 px-3.5 font-medium text-slate-800 text-xs sm:text-sm leading-snug">
                      {item.reviewText}
                    </td>

                    {/* Ride ID Pill */}
                    <td className="py-2 px-3.5 whitespace-nowrap">
                      <span className="inline-block bg-[#fffdf0] border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs sm:text-sm font-bold text-slate-900 shadow-2xs">
                        {item.rideId}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-2 px-3.5 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-700">
                      {item.dateTime}
                    </td>

                    {/* Action Menu (3-dots) */}
                    <td className="py-2 px-2.5 text-center">
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-black transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* =========================================================
            5. REUSABLE PAGINATION FOOTER
            ========================================================= */}
        <Pagination
          currentPage={currentPage}
          totalItems={12460}
          itemsPerPage={entriesPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setEntriesPerPage}
          pageSizeOptions={[5, 10, 25, 50]}
        />
      </div>
    </div>
  );
}

