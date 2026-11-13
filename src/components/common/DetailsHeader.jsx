import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bell, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

/**
 * DetailsHeader - Reusable Top Header Bar for all detail views
 *
 * Props:
 * @param {string} title - Page Title (e.g. "Driver Details", "Passenger Details")
 * @param {Array<{label: string, path?: string}>} breadcrumbs - List of breadcrumb items
 * @param {string} [backPath] - Fallback path when back arrow is clicked (defaults to breadcrumbs[0].path or -1)
 * @param {React.ReactNode} [rightActions] - Optional extra action buttons on the right side
 */
export default function DetailsHeader({
  title,
  breadcrumbs = [],
  backPath,
  rightActions,
}) {
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBack = () => {
    if (backPath) {
      navigate(backPath);
    } else if (breadcrumbs.length > 0 && breadcrumbs[0].path) {
      navigate(breadcrumbs[0].path);
    } else {
      navigate(-1);
    }
  };

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  // Determine display name consistently across all pages
  const displayName = admin?.username
    ? admin.username.split('@')[0]
    : admin?.name || 'Admin';

  return (
    <div className="flex items-center justify-between pb-3 sm:pb-4 pt-1 select-none">
      {/* Left: Back Button + Title + Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={handleBack}
          className="p-1.5 sm:p-1 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer text-slate-900 shrink-0"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5 text-black stroke-[2.4]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-black text-black leading-tight tracking-tight truncate">
            {title}
          </h1>

          {/* Breadcrumb row */}
          {breadcrumbs.length > 0 && (
            <p className="text-xs font-semibold text-black mt-0.5 flex items-center gap-1 flex-wrap">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                return (
                  <React.Fragment key={crumb.label + idx}>
                    {crumb.path && !isLast ? (
                      <span
                        onClick={() => navigate(crumb.path)}
                        className="hover:underline cursor-pointer"
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <span>{crumb.label}</span>
                    )}
                    {!isLast && <span className="mx-0.5">›</span>}
                  </React.Fragment>
                );
              })}
            </p>
          )}
        </div>
      </div>

      {/* Right: Notifications Bell + Admin Profile Pill + Custom Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2">
        {rightActions}

        {/* Notification Bell */}
        <button
          className="relative p-2 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 text-black stroke-[2.2]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 sm:pl-2 sm:pr-3 rounded-full bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors select-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#fed011] text-black flex items-center justify-center font-black text-xs shadow-2xs shrink-0">
              <User className="w-4 h-4 text-black stroke-[2.4]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-black hidden sm:inline-block truncate max-w-[120px]">
              {displayName}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-black stroke-[2.4] transition-transform duration-200 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 space-y-1">
              <div className="p-2 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  Share Chalo Admin
                </p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-slate-600" />
                Admin Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

