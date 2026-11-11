import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { motion, AnimatePresence } from 'motion/react';

export default function MainLayout() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => !prev);
    }
  };

  const isSidebarExpanded =
    typeof window !== 'undefined' && window.innerWidth < 1024
      ? mobileOpen
      : !isCollapsed;

  const isDetailsPage =
    location.pathname.startsWith('/drivers/') ||
    location.pathname.startsWith('/passengers/') ||
    location.pathname.startsWith('/rides/') ||
    (location.pathname.startsWith('/vehicles/') && location.pathname !== '/vehicles/master');

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Mobile Animated Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {!isDetailsPage && (
          <Header
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarExpanded}
          />
        )}

        <main className={`flex-1 overflow-y-auto ${isDetailsPage ? 'p-3 sm:p-4 lg:p-5' : 'p-4 sm:p-5 lg:p-6'}`}>
          <div className={`${isDetailsPage ? 'w-full' : 'max-w-[1400px] mx-auto'}`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
