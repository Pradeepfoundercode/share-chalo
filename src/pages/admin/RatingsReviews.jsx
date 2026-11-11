import React, { useState, useMemo } from 'react';
import {
  Star,
  Users,
  User,
  MessageSquare,
  ListFilter,
  Car,
  Search,
  Calendar,
  ChevronDown,
  Download,
  MoreVertical,
  RotateCcw
} from 'lucide-react';
import { reviewsStats, reviewsList } from '../../data/reviewsData';
import Pagination from '../../components/common/Pagination';
import priyaAvatar from '../../assets/priya_sharma_avatar.png';
import arjunAvatar from '../../assets/arjun_singh_avatar.png';
import harshAvatar from '../../assets/harsh_singh_avatar_square.png';
import defaultAvatar from '../../assets/Smiling Man in Yellow Circular Frame.png';

export default function RatingsReviews() {
  const [activeTab, setActiveTab] = useState('All Reviews');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [dateRange, setDateRange] = useState('Select Date Range');

  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);

  // Tab definitions
  const tabs = [
    { id: 'All Reviews', label: 'All Reviews', icon: ListFilter },
    { id: 'Passenger Reviews', label: 'Passenger Reviews', icon: User },
    { id: 'Driver Reviews', label: 'Driver Reviews', icon: Car },
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
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const isFilled = i <= fullStars;
          return (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : hasHalf && i === fullStars + 1
                  ? 'text-amber-400 fill-amber-200'
                  : 'text-slate-200 fill-slate-200'
              }`}
            />
          );
        })}
        <span className="font-black text-xs sm:text-[13px] text-slate-900 ml-1.5 select-none">
          {rating.toFixed(1)}
        </span>
      </div>
    );
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
      if (searchTerm) {
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

      return true;
    });
  }, [activeTab, searchTerm, ratingFilter, roleFilter]);

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* =========================================================
          1. TOP ROW: 4 SUMMARY STATS CARDS
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* Card 1: Overall Rating */}
        <div className="bg-[#fffbeb] border border-amber-200/80 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 shrink-0 shadow-2xs">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500 stroke-[1.8]" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {reviewsStats.overallRating}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              Overall Rating
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {reviewsStats.overallSub}
            </p>
          </div>
        </div>

        {/* Card 2: Driver Rating */}
        <div className="bg-[#f0fdf4] border border-emerald-100/90 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <Users className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {reviewsStats.driverRating}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              Driver Rating
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {reviewsStats.driverSub}
            </p>
          </div>
        </div>

        {/* Card 3: Passenger Rating */}
        <div className="bg-[#fff1f2] border border-rose-100/90 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-100/80 flex items-center justify-center text-rose-500 shrink-0 shadow-2xs">
            <User className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {reviewsStats.passengerRating}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
              Passenger Rating
            </p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
              {reviewsStats.passengerSub}
            </p>
          </div>
        </div>

        {/* Card 4: Total Reviews */}
        <div className="bg-[#fefce8] border border-amber-100/90 rounded-3xl p-4 sm:p-5 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center text-amber-600 shrink-0 shadow-2xs">
            <MessageSquare className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-none">
              {reviewsStats.totalReviews}
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1">
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
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          3. SEARCH & CONTROLS FILTER BAR
          ========================================================= */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, ride ID or review..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs placeholder:text-slate-400"
          />
        </div>

        {/* Right Dropdowns & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Rating Filter Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRatingDropdownOpen(!ratingDropdownOpen)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Star className="w-3.5 h-3.5 text-slate-500" />
              <span>Rating: {ratingFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {ratingDropdownOpen && (
              <div className="absolute left-0 sm:right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-30 space-y-0.5">
                {['All', '5', '4', '3', '2', '1'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRatingFilter(r);
                      setRatingDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      ratingFilter === r
                        ? 'bg-amber-100/80 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {r === 'All' ? 'All Ratings' : `${r} Star`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* For: All Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>For: {roleFilter}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute left-0 sm:right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-2xl shadow-xl p-1 z-30 space-y-0.5">
                {['All', 'Driver', 'Passenger'].map((rf) => (
                  <button
                    key={rf}
                    onClick={() => {
                      setRoleFilter(rf);
                      setRoleDropdownOpen(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      roleFilter === rf
                        ? 'bg-amber-100/80 text-amber-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {rf === 'All' ? 'All Roles' : `For ${rf}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Select Date Range Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-30 space-y-0.5">
                {['Select Date Range', 'Today', 'Last 7 Days', 'This Month', 'Last 30 Days'].map(
                  (range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setDateDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        dateRange === range
                          ? 'bg-amber-100/80 text-amber-900'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {range}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Reset Filters */}
          {(searchTerm || ratingFilter !== 'All' || roleFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setRatingFilter('All');
                setRoleFilter('All');
                setDateRange('Select Date Range');
              }}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-slate-600 cursor-pointer shadow-2xs"
              title="Reset Filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Export Button */}
          <button className="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-800 shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors">
            <Download className="w-4 h-4 text-slate-600" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          4. RATINGS & REVIEWS DATA TABLE
          ========================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-[13px]">
            {/* Header Row with Yellow/Amber Tint */}
            <thead>
              <tr className="bg-[#feea98]/60 text-slate-900 font-black border-b border-amber-200/60">
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Reviewer</th>
                <th className="py-3 px-4">Review For</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 min-w-[240px]">Review</th>
                <th className="py-3 px-4">Ride ID</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-3 text-center"></th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-bold text-sm">
                    No reviews found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.slice(0, 5).map((item, idx) => (
                  <tr key={item.id} className="hover:bg-amber-50/20 transition-colors">
                    {/* Index */}
                    <td className="py-3 px-4 font-bold text-slate-500">{idx + 1}</td>

                    {/* Reviewer (Avatar + Name + Role) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={getReviewerAvatar(item)}
                          alt={item.reviewerName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-amber-300/80 bg-amber-50"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-tight whitespace-nowrap">
                            {item.reviewerName}
                          </p>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">
                            {item.reviewerRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Review For (Icon + Role + Name) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                          {item.targetRole === 'Driver' ? (
                            <Car className="w-4 h-4 stroke-[2.2]" />
                          ) : (
                            <User className="w-4 h-4 stroke-[2.2]" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight whitespace-nowrap">
                            {item.targetRole}
                          </p>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5 whitespace-nowrap">
                            {item.targetName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rating (Stars + Number) */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {renderStars(item.rating)}
                    </td>

                    {/* Review Text */}
                    <td className="py-3 px-4 font-semibold text-slate-700 leading-relaxed">
                      {item.reviewText}
                    </td>

                    {/* Ride ID Pill */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-block bg-[#fffdf0] border border-amber-200/80 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-2xs">
                        {item.rideId}
                      </span>
                    </td>

                    {/* Date & Time */}
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-600">
                      {item.dateTime}
                    </td>

                    {/* Action Menu (3-dots) */}
                    <td className="py-3 px-3 text-center">
                      <button
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-black transition-colors cursor-pointer"
                        title="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
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

