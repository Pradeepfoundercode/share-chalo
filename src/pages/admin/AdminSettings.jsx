import React, { useState } from 'react';
import {
  User,
  Lock,
  Mail,
  Phone,
  Camera,
  Eye,
  EyeOff,
  CheckCircle2,
  Save,
  KeyRound
} from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Admin Profile');

  // Profile Form state
  const [fullName, setFullName] = useState('Harsh Singh');
  const [email, setEmail] = useState('harsh@foundercodes.com');
  const [mobile, setMobile] = useState('+91 9236788668');
  const [profileImage, setProfileImage] = useState(null);

  // Password Form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Success Toasts
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    triggerToast('Admin profile details updated successfully!');
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and Confirm password do not match.');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    triggerToast('Password updated successfully!');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
      triggerToast('Profile photo updated!');
    }
  };

  return (
    <div className="space-y-3.5 pb-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          {toastMessage}
        </div>
      )}

      {/* Top Filter / Switch Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('Admin Profile')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
            activeTab === 'Admin Profile'
              ? 'bg-[#fed011] text-black shadow-xs font-black'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5 shrink-0" />
          <span>Admin Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('Change Password')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs ${
            activeTab === 'Change Password'
              ? 'bg-[#fed011] text-black shadow-xs font-black'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Main 2-Column Split: Both cards compact & identical height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* =========================================================
            LEFT COLUMN: ADMIN PROFILE CARD
            ========================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner */}
            <div className="px-5 py-3 bg-[#fffdf0] border-b border-amber-200/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                  Admin Profile
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                  View and update your admin profile details.
                </p>
              </div>
            </div>

            {/* Profile Form Fields */}
            <form onSubmit={handleUpdateProfile} id="profileForm" className="p-4 sm:p-5 space-y-3">
              {/* Center Profile Avatar with Camera Button */}
              <div className="flex justify-center pb-0.5">
                <div className="relative">
                  {/* Avatar Circle - compact */}
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full border-2 border-amber-300 p-0.5 bg-amber-50 flex items-center justify-center shadow-xs overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Admin"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white">
                        <User className="w-9 h-9 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Camera upload badge */}
                  <label className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#fed011] hover:bg-amber-400 border border-white flex items-center justify-center text-slate-950 cursor-pointer shadow-sm transition-colors">
                    <Camera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  required
                  className="w-full h-9.5 px-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full h-9.5 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    required
                    className="w-full h-9.5 pl-9 pr-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Update Profile Button */}
          <div className="p-4 sm:p-5 pt-0 flex justify-center">
            <button
              type="submit"
              form="profileForm"
              className="h-9.5 px-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Profile</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: CHANGE PASSWORD CARD
            ========================================================= */}
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner */}
            <div className="px-5 py-3 bg-[#fffdf0] border-b border-amber-200/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                  Change Password
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-600 font-medium">
                  Update your login password.
                </p>
              </div>
            </div>

            {/* Password Form Fields */}
            <form onSubmit={handleUpdatePassword} id="passwordForm" className="p-4 sm:p-5 space-y-3.5">
              {/* Current Password */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full h-9.5 pl-9 pr-9 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showCurrent ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full h-9.5 pl-9 pr-9 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showNew ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs sm:text-[13px] font-bold text-slate-900 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full h-9.5 pl-9 pr-9 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-400 shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Update Password Button */}
          <div className="p-4 sm:p-5 pt-0 flex justify-center">
            <button
              type="submit"
              form="passwordForm"
              className="h-9.5 px-8 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Update Password</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
