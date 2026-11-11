import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import sidebarLogo from '../../assets/sidebar_logo.png';
import shieldLogo from '../../assets/shield_transparent.png';

// Custom SVG Icons matching exact specifications
import dashboardIcon from '../../assets/Vector (4).svg';
import driversIcon from '../../assets/Group (1).svg';
import passengersIcon from '../../assets/Group (6).svg';
import vehiclesIcon from '../../assets/Vector (9).svg';
import ridesIcon from '../../assets/Vector (12).svg';
import bookingsIcon from '../../assets/Group (5).svg';
import financeIcon from '../../assets/Vector (11).svg';
import commissionIcon from '../../assets/Vector (8).svg';
import kycIcon from '../../assets/Vector (10).svg';
import routesIcon from '../../assets/Group (4).svg';
import reviewsIcon from '../../assets/Vector (6).svg';
import supportIcon from '../../assets/Group (2).svg';
import notificationsIcon from '../../assets/Vector (7).svg';
import analyticsIcon from '../../assets/Group (3).svg';
import settingsIcon from '../../assets/Vector (5).svg';

const menuItems = [
  { name: 'Dashboard', path: '/', icon: dashboardIcon },
  { name: 'Drivers', path: '/drivers', icon: driversIcon },
  { name: 'Passengers', path: '/passengers', icon: passengersIcon },
  {
    name: 'Vehicle Management',
    path: '/vehicles',
    icon: vehiclesIcon,
    hasSubmenu: true,
    submenus: [
      { name: 'Vehicle List', path: '/vehicles' },
      { name: 'Vehicle Master', path: '/vehicles/master' },
    ],
  },
  { name: 'Rides', path: '/rides', icon: ridesIcon },
  { name: 'Bookings', path: '/bookings', icon: bookingsIcon },
  { name: 'Finance & Wallet', path: '/finance', icon: financeIcon },
  { name: 'Commission Settings', path: '/commission', icon: commissionIcon },
  { name: 'KYC Verification', path: '/kyc', icon: kycIcon },
  { name: 'Routes & Locations', path: '/routes', icon: routesIcon },
  { name: 'Ratings & Reviews', path: '/reviews', icon: reviewsIcon },
  { name: 'Support & Complaints', path: '/support', icon: supportIcon },
  { name: 'Notifications', path: '/notifications', icon: notificationsIcon },
  { name: 'Reports & Analytics', path: '/analytics', icon: analyticsIcon },
  { name: 'Admin Settings', path: '/settings', icon: settingsIcon },
];

export default function Sidebar({
  isCollapsed,
  mobileOpen,
  onCloseMobile,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Vehicles submenu accordion open state (default open if on /vehicles)
  const [vehiclesOpen, setVehiclesOpen] = useState(
    location.pathname.startsWith('/vehicles')
  );

  return (
    <>
      {/* =========================================================
          1. MOBILE DRAWER SIDEBAR
          ========================================================= */}
      <div className="lg:hidden">
        <AnimatePresence>
          {mobileOpen && (
            <motion.aside
              key="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-[290px] bg-black text-white flex flex-col shadow-2xl select-none"
            >
              {/* Brand Header */}
              <div className="h-[105px] px-5 py-2 flex flex-col items-center justify-center relative shrink-0">
                <button
                  onClick={onCloseMobile}
                  className="absolute top-2 right-2 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
                  title="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>

                <img
                  src={sidebarLogo}
                  alt="Share Chalo"
                  className="w-[145px] h-auto object-contain select-none"
                />

                <div className="mt-1.5">
                  <span className="bg-[#fed011] text-black text-[11px] font-bold px-5 py-0.5 rounded-full inline-block tracking-wide shadow-xs">
                    Admin Panel
                  </span>
                </div>
              </div>

              {/* Mobile Menu List */}
              <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto scrollbar-none">
                {menuItems.map((item) => {
                  if (item.hasSubmenu) {
                    const isParentActive = location.pathname.startsWith(item.path);

                    return (
                      <div key={item.name} className="space-y-1">
                        <div
                          onClick={() => setVehiclesOpen(!vehiclesOpen)}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm sm:text-[14.5px] transition-all cursor-pointer ${
                            isParentActive
                              ? 'bg-[#fed011] text-black font-bold shadow-md shadow-amber-400/20'
                              : 'text-neutral-300 hover:text-white hover:bg-neutral-900/80 font-medium'
                          }`}
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div
                              className={`w-5.5 h-5.5 shrink-0 transition-colors ${
                                isParentActive ? 'bg-black' : 'bg-neutral-300'
                              }`}
                              style={{
                                mask: `url("${item.icon}") no-repeat center / contain`,
                                WebkitMask: `url("${item.icon}") no-repeat center / contain`,
                              }}
                            />
                            <span className="truncate">{item.name}</span>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              vehiclesOpen ? 'rotate-180' : ''
                            } ${isParentActive ? 'text-black' : 'text-neutral-400'}`}
                          />
                        </div>

                        {vehiclesOpen && (
                          <div className="pl-9 pr-2 space-y-1 pt-0.5">
                            {item.submenus.map((sub) => {
                              const isSubActive = location.pathname === sub.path;
                              return (
                                <NavLink
                                  key={sub.name}
                                  to={sub.path}
                                  onClick={onCloseMobile}
                                  className={`block px-3 py-2 rounded-lg text-[13px] font-bold transition-colors ${
                                    isSubActive
                                      ? 'text-amber-400 bg-neutral-900'
                                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                                  }`}
                                >
                                  {sub.name}
                                </NavLink>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  const isActive = location.pathname === item.path;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm sm:text-[14.5px] transition-all ${
                        isActive
                          ? 'bg-[#fed011] text-black font-bold shadow-md shadow-amber-400/20'
                          : 'text-neutral-300 hover:text-white hover:bg-neutral-900/80 font-medium'
                      }`}
                    >
                      <div
                        className={`w-5.5 h-5.5 shrink-0 transition-colors ${
                          isActive ? 'bg-black' : 'bg-neutral-300'
                        }`}
                        style={{
                          mask: `url("${item.icon}") no-repeat center / contain`,
                          WebkitMask: `url("${item.icon}") no-repeat center / contain`,
                        }}
                      />
                      <span className="truncate">{item.name}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* =========================================================
          2. DESKTOP SIDEBAR (Increased Width: 285px / Collapsed: 80px)
          ========================================================= */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 285 }}
        transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
        className="hidden lg:flex flex-col bg-black text-white shrink-0 select-none overflow-hidden h-full z-40 border-r border-neutral-900"
      >
        {/* Fixed Height Header */}
        <div className="h-[110px] flex flex-col items-center justify-center shrink-0 relative px-3 overflow-hidden">
          {isCollapsed ? (
            <img
              src={shieldLogo}
              alt="Share Chalo Shield"
              className="w-12 h-12 object-contain select-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center px-4 w-full mt-2">
              <img
                src={sidebarLogo}
                alt="Share Chalo"
                className="w-[160px] h-auto object-contain select-none"
              />
              <div className="mt-1.5">
                <span className="bg-[#fed011] text-black text-[11px] font-bold px-5 py-0.5 rounded-full inline-block tracking-wide whitespace-nowrap shadow-xs">
                  Admin Panel
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto overflow-x-hidden scrollbar-none">
          {menuItems.map((item) => {
            // Dropdown menu for Vehicles
            if (item.hasSubmenu) {
              const isParentActive = location.pathname.startsWith(item.path);

              return (
                <div key={item.name} className="space-y-1">
                  <div
                    onClick={() => {
                      if (isCollapsed) {
                        navigate(item.path);
                      } else {
                        setVehiclesOpen(!vehiclesOpen);
                      }
                    }}
                    title={item.name}
                    className={`transition-all duration-150 cursor-pointer ${
                      isCollapsed
                        ? 'w-[58px] h-11 mx-auto flex items-center justify-center rounded-xl'
                        : 'w-full h-11 px-4 flex items-center justify-between rounded-xl'
                    } ${
                      isParentActive
                        ? 'bg-[#fed011] text-black font-bold shadow-md shadow-amber-400/20'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900/80 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* SVG Mask Icon with slightly larger size */}
                      <div
                        className={`w-5.5 h-5.5 shrink-0 transition-colors ${
                          isParentActive ? 'bg-black' : 'bg-neutral-300'
                        }`}
                        style={{
                          mask: `url("${item.icon}") no-repeat center / contain`,
                          WebkitMask: `url("${item.icon}") no-repeat center / contain`,
                        }}
                      />

                      {!isCollapsed && (
                        <span className="text-[14.5px] font-bold whitespace-nowrap truncate">
                          {item.name}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          vehiclesOpen ? 'rotate-180' : ''
                        } ${isParentActive ? 'text-black' : 'text-neutral-400'}`}
                      />
                    )}
                  </div>

                  {/* Submenu Accordion Items */}
                  {!isCollapsed && vehiclesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pl-10 pr-2 space-y-1 pt-1 overflow-hidden"
                    >
                      {item.submenus.map((sub) => {
                        const isSubActive =
                          sub.path === '/vehicles'
                            ? location.pathname === '/vehicles' ||
                              location.pathname.startsWith('/vehicles/') && location.pathname !== '/vehicles/master'
                            : location.pathname === sub.path;

                        return (
                          <NavLink
                            key={sub.name}
                            to={sub.path}
                            className={`block px-3.5 py-2 rounded-xl text-[13px] font-bold transition-colors ${
                              isSubActive
                                ? 'text-amber-300 bg-neutral-900 border-l-2 border-amber-400 pl-3'
                                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/60'
                            }`}
                          >
                            {sub.name}
                          </NavLink>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              );
            }

            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                title={item.name}
                className={`transition-all duration-150 ${
                  isCollapsed
                    ? 'w-[58px] h-11 mx-auto flex items-center justify-center rounded-xl'
                    : 'w-full h-11 px-4 flex items-center gap-3.5 rounded-xl'
                } ${
                  isActive
                    ? 'bg-[#fed011] text-black font-bold shadow-md shadow-amber-400/20'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-900/80 font-medium'
                }`}
              >
                {/* SVG Mask Icon with slightly larger size */}
                <div
                  className={`w-5.5 h-5.5 shrink-0 transition-colors ${
                    isActive ? 'bg-black' : 'bg-neutral-300'
                  }`}
                  style={{
                    mask: `url("${item.icon}") no-repeat center / contain`,
                    WebkitMask: `url("${item.icon}") no-repeat center / contain`,
                  }}
                />

                {!isCollapsed && (
                  <span className="text-[14.5px] font-bold whitespace-nowrap truncate">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </motion.aside>
    </>
  );
}
