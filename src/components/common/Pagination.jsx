import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

/**
 * Universal Reusable Pagination Component across ALL tables in Share Chalo Admin Panel.
 *
 * Layout Structure:
 * - Left side: Show [ 10 ⌄ ] entries
 * - Right side: Showing 1–10 of 1,250  <  [ 1 2 3 4 5 ]  ...  125  >
 *
 * Exactly matches the standard design system (height 34px, rounded-lg, #fed011 active page).
 */
export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [5, 10, 25, 50],
  className = ''
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Render individual page button
  const renderPageBtn = (page, inGroup = false) => {
    const isActive = currentPage === page;
    if (inGroup) {
      return (
        <button
          key={page}
          onClick={() => onPageChange && onPageChange(page)}
          type="button"
          className={`min-w-[28px] sm:min-w-[32px] h-full px-2 sm:px-2.5 flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
            isActive
              ? 'bg-[#fed011] text-black rounded-md shadow-2xs font-extrabold'
              : 'text-slate-800 hover:bg-slate-100 rounded-md font-semibold'
          }`}
        >
          {page}
        </button>
      );
    }

    return (
      <button
        key={page}
        onClick={() => onPageChange && onPageChange(page)}
        type="button"
        className={`min-w-[28px] sm:min-w-[32px] h-8 sm:h-[34px] px-2.5 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-xs font-bold transition-all cursor-pointer shadow-2xs ${
          isActive
            ? 'bg-[#fed011] text-black border-transparent shadow-2xs font-extrabold'
            : 'text-slate-800 hover:bg-slate-100 font-semibold'
        }`}
      >
        {page}
      </button>
    );
  };

  // Render pagination items (grouping 1-5 or dynamic window)
  const renderPaginationItems = () => {
    if (totalPages <= 7) {
      return (
        <div className="flex items-center h-8 sm:h-[34px] bg-slate-50/80 border border-slate-200 rounded-lg p-0.5 gap-0.5 shadow-2xs">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) =>
            renderPageBtn(p, true)
          )}
        </div>
      );
    }

    // When total pages > 7: Group [ 1 2 3 4 5 ] ... [ totalPages ]
    let groupPages = [];
    if (currentPage <= 4) {
      groupPages = [1, 2, 3, 4, 5];
    } else if (currentPage >= totalPages - 3) {
      groupPages = [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      ];
    } else {
      groupPages = [
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2
      ];
    }

    const showLastSeparated = !groupPages.includes(totalPages);
    const showFirstSeparated = !groupPages.includes(1);

    return (
      <div className="flex items-center gap-1.5">
        {showFirstSeparated && (
          <>
            {renderPageBtn(1, false)}
            <span className="px-1 text-slate-400 font-bold select-none text-xs">
              ...
            </span>
          </>
        )}

        <div className="flex items-center h-8 sm:h-[34px] bg-slate-50/80 border border-slate-200 rounded-lg p-0.5 gap-0.5 shadow-2xs">
          {groupPages.map((p) => renderPageBtn(p, true))}
        </div>

        {showLastSeparated && (
          <>
            <span className="px-1 text-slate-400 font-bold select-none text-xs">
              ...
            </span>
            {renderPageBtn(totalPages, false)}
          </>
        )}
      </div>
    );
  };

  return (
    <div
      className={`p-3.5 sm:p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-700 bg-white ${className}`}
    >
      {/* Left: Show [ 10 v ] entries */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm font-semibold text-slate-800">Show</span>
        <div className="relative inline-flex items-center h-8 sm:h-[34px]">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              if (onItemsPerPageChange) onItemsPerPageChange(Number(e.target.value));
              if (onPageChange) onPageChange(1);
            }}
            className="h-full appearance-none border border-slate-200 rounded-lg pl-3 pr-7 text-xs font-bold text-slate-900 bg-white focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-700 pointer-events-none absolute right-2" />
        </div>
        <span className="text-xs sm:text-sm font-semibold text-slate-800">entries</span>
      </div>

      {/* Right: Showing 1–10 of 1,250 + Page Navigation */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 select-none">
        <span className="text-xs sm:text-sm font-semibold text-slate-800 whitespace-nowrap">
          Showing {startItem}–{endItem} of {totalItems.toLocaleString()}
        </span>

        <div className="flex items-center gap-1.5">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange && onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="w-8 h-8 sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            title="Previous Page"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Grouped Page Numbers */}
          {renderPaginationItems()}

          {/* Next Button */}
          <button
            onClick={() => onPageChange && onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="w-8 h-8 sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-lg border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-2xs"
            title="Next Page"
            type="button"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
