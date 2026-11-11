import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login';
import MainLayout from '../layout/MainLayout';
import Dashboard from '../pages/admin/Dashboard';
import Drivers from '../pages/admin/Drivers';
import DriverDetails from '../pages/admin/DriverDetails';
import Passengers from '../pages/admin/Passengers';
import PassengerDetails from '../pages/admin/PassengerDetails';
import Vehicles from '../pages/admin/Vehicles';
import VehicleDetails from '../pages/admin/VehicleDetails';
import VehicleMaster from '../pages/admin/VehicleMaster';
import Rides from '../pages/admin/Rides';
import RideDetails from '../pages/admin/RideDetails';
import Finance from '../pages/admin/Finance';
import CommissionSettings from '../pages/admin/CommissionSettings';
import RatingsReviews from '../pages/admin/RatingsReviews';
import SupportComplaints from '../pages/admin/SupportComplaints';
import ComplaintDetails from '../pages/admin/ComplaintDetails';
import ReportsAnalytics from '../pages/admin/ReportsAnalytics';
import Notifications from '../pages/admin/Notifications';
import CreateNotification from '../pages/admin/CreateNotification';
import NotificationDetails from '../pages/admin/NotificationDetails';
import AdminSettings from '../pages/admin/AdminSettings';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
     
      <Route path="/login" element={<Login />} />

      
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="drivers/:id" element={<DriverDetails />} />
          <Route path="passengers" element={<Passengers />} />
          <Route path="passengers/:id" element={<PassengerDetails />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/list" element={<Vehicles />} />
          <Route path="vehicles/master" element={<VehicleMaster />} />
          <Route path="vehicles/:id" element={<VehicleDetails />} />
          <Route path="rides" element={<Rides />} />
          <Route path="rides/:id" element={<RideDetails />} />
          <Route path="finance" element={<Finance />} />
          <Route path="commission" element={<CommissionSettings />} />
          <Route path="reviews" element={<RatingsReviews />} />
          <Route path="support" element={<SupportComplaints />} />
          <Route path="support/:id" element={<ComplaintDetails />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="notifications/create" element={<CreateNotification />} />
          <Route path="notifications/:id" element={<NotificationDetails />} />
          <Route path="analytics" element={<ReportsAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
  );
}
