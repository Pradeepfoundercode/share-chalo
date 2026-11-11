import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  LogOut,
  ChevronDown,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export default function Header({ toggleSidebar, isSidebarOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logout = useAuthStore((state) => state.logout);
  const admin = useAuthStore((state) => state.admin);
  const navigate = useNavigate();
  const location = useLocation();

  // Helper to dynamically resolve title & subtitle for any current page
  const getPageInfo = () => {
    const path = location.pathname;

    if (path.startsWith('/vehicles/master')) {
      return {
        title: 'Vehicle Master Management',
        subtitle: 'Manage brands, models, colors and bus seat layout configurations.',
      };
    }
    if (path.startsWith('/vehicles')) {
      return {
        title: 'Vehicles Management',
        subtitle: 'Manage all registered vehicles',
      };
    }
    if (path.startsWith('/rides')) {
      return {
        title: 'Rides Management',
        subtitle: 'Manage all rides (Car & Bus)',
      };
    }
    if (path.startsWith('/drivers')) {
      return {
        title: 'Drivers Management',
        subtitle: 'Manage all drivers, verify documents and approve registrations.',
      };
    }
    if (path.startsWith('/passengers')) {
      return {
        title: 'Passengers Management',
        subtitle: 'Manage passenger accounts, bookings and activity.',
      };
    }
    if (path.startsWith('/bookings')) {
      return {
        title: 'Bookings Management',
        subtitle: 'Track and manage passenger seat bookings and status.',
      };
    }
    if (path.startsWith('/finance')) {
      return {
        title: 'Finance & Wallet',
        subtitle: 'Manage payments, commissions, collections and settlements',
      };
    }
    if (path.startsWith('/commission')) {
      return {
        title: 'Commission Settings',
        subtitle: 'Set commission percentage for different vehicle types',
      };
    }
    if (path.startsWith('/kyc')) {
      return {
        title: 'KYC Verification',
        subtitle: 'Review driver and vehicle verification requests.',
      };
    }
    if (path.startsWith('/routes')) {
      return {
        title: 'Routes & Locations',
        subtitle: 'Manage popular corridors, pickup points, and stops.',
      };
    }
    if (path.startsWith('/reviews')) {
      return {
        title: 'Ratings & Reviews',
        subtitle: 'View and manage ratings and reviews from passengers and drivers.',
      };
    }
    if (path.startsWith('/support')) {
      return {
        title: 'Support & Complaints',
        subtitle: 'Manage and resolve support requests and complaints from passengers and drivers.',
      };
    }
    if (path.startsWith('/notifications')) {
      return {
        title: 'Notifications Management',
        subtitle: 'Create, send and manage notifications for passengers and drivers.',
      };
    }
    if (path.startsWith('/analytics')) {
      return {
        title: 'Reports & Analytics',
        subtitle: 'Track rides, users, revenue and overall platform performance.',
      };
    }
    if (path.startsWith('/settings')) {
      return {
        title: 'Admin Settings',
        subtitle: 'Manage your profile details and update password.',
      };
    }

    // Default: Dashboard / Home
    const adminName = admin?.username ? admin.username.split('@')[0] : 'Admin';
    return {
      title: (
        <>
          Welcome, {adminName} <span className="inline-block">👋</span>
        </>
      ),
      subtitle: "Here's what's happening on Share Chalo today.",
    };
  };

  const pageInfo = getPageInfo();

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

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-100 px-3 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Toggle Button & Welcome Message (Desktop) / Search Bar (Mobile) */}
      <div className="flex items-center gap-2 sm:gap-3.5 flex-1 md:flex-initial min-w-0">
        <button
          onClick={toggleSidebar}
          title={isSidebarOpen ? 'Compact Sidebar' : 'Expand Sidebar'}
          className="p-1.5 sm:p-2 rounded-xl hover:bg-slate-100 hover:text-black transition-all flex items-center justify-center cursor-pointer shrink-0"
        >
          {isSidebarOpen ? (
            <X className="w-5 h-5 text-slate-900" strokeWidth={2.4} />
          ) : (
            <Menu className="w-5 h-5 text-slate-900" strokeWidth={2.4} />
          )}
        </button>

        {/* Desktop Page Title / Dynamic Subtitle (Hidden on Mobile) */}
        <div className="hidden md:block">
          <h1 className="text-base sm:text-lg md:text-2xl font-extrabold flex items-center gap-2 leading-tight truncate">
            {pageInfo.title}
          </h1>
          <p className="text-xs sm:text-sm block mt-0.5 font-normal text-slate-500 truncate">
            {pageInfo.subtitle}
          </p>
        </div>

        {/* Mobile/Small Device Search Bar (Replaces Welcome Message on Mobile) */}
        <div className="relative md:hidden flex-1 min-w-0 max-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Right: Search, Notifications & Admin Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-6 shrink-0 ml-2">
        {/* Search Bar (Desktop Only) */}
        <div className="relative hidden md:block w-80 lg:w-[440px] xl:w-[480px]">
          <Search className="w-4.5 h-4.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Driver, Passenger, Ride, Booking..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Right Group: Notification Bell & Profile */}
        <div className="flex items-center gap-1 sm:gap-2.5">
          {/* Notification Bell */}
          <button className="relative p-1.5 sm:p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" strokeWidth={2} />
            <span className="absolute top-1 right-1 sm:top-1.5 sm:right-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {/* Admin Profile with Down Arrow Dropdown */}
          <div className="relative pl-1 sm:pl-1.5 border-l border-slate-200" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1.5 sm:gap-2.5 py-1 px-1 sm:px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer select-none"
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-[#fed011] flex items-center justify-center text-black font-bold text-xs sm:text-sm shadow-xs shrink-0">
                {admin?.username ? admin.username.substring(0, 2).toUpperCase() : <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </div>
              <span className="text-sm font-bold text-slate-800 hidden sm:inline-block">
                {admin?.username ? admin.username.split('@')[0] : 'Admin'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 transition-transform duration-200 ${
                  dropdownOpen ? 'rotate-180 text-black' : ''
                }`}
              />
            </button>

            {/* Theme-matched Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Profile Card Header */}
                <div className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl mb-2 border border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-[#fed011] flex items-center justify-center text-black font-bold text-sm shadow-xs shrink-0">
                    {admin?.username ? admin.username.substring(0, 2).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {admin?.username || 'Admin'}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Share Chalo
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      toast.info('Profile details coming soon.');
                    }}
                    className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center text-slate-600 group-hover:text-amber-700 transition-colors shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:text-amber-800 transition-colors">
                      My Profile
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      toast.info('Settings coming soon.');
                    }}
                    className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-amber-50 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center text-slate-600 group-hover:text-amber-700 transition-colors shrink-0">
                      <Settings className="w-3.5 h-3.5" />
                    </div>
                    <span className="group-hover:text-amber-800 transition-colors">
                      Admin Settings
                    </span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="group w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg bg-red-100 group-hover:bg-red-200 flex items-center justify-center text-red-600 group-hover:text-red-700 transition-colors shrink-0">
                      <LogOut className="w-3.5 h-3.5" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}