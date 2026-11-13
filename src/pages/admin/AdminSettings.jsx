import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import defaultAdminAvatar from '../../assets/harsh_singh_avatar_square.png';

// -------------------------------------------------------------
// ZOD VALIDATION SCHEMAS
// -------------------------------------------------------------
const profileSchema = z.object({
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .min(3, 'Full name must be at least 3 characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address'),
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9+ ]{10,15}$/, 'Please enter a valid 10-digit mobile number'),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .min(6, 'Password must be at least 6 characters'),
    newPassword: z
      .string()
      .min(1, 'New password is required')
      .min(6, 'New password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New password and Confirm password do not match',
    path: ['confirmPassword'],
  });

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('Admin Profile');

  const profileCardRef = useRef(null);
  const passwordCardRef = useRef(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'Change Password' && passwordCardRef.current) {
      passwordCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tab === 'Admin Profile' && profileCardRef.current) {
      profileCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [profileImage, setProfileImage] = useState(defaultAdminAvatar);

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

  // -------------------------------------------------------------
  // REACT HOOK FORM: Profile Form
  // -------------------------------------------------------------
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
    },
    mode: 'onTouched',
  });

  const onProfileSubmit = (data) => {
    triggerToast('Admin profile details updated successfully!');
  };

  // -------------------------------------------------------------
  // REACT HOOK FORM: Password Form
  // -------------------------------------------------------------
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const onPasswordSubmit = (data) => {
    resetPasswordForm();
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
      <div className="flex items-center gap-2 pl-2 sm:pl-3">
        <button
          type="button"
          onClick={() => handleTabClick('Admin Profile')}
          className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-[15px] font-bold transition-all cursor-pointer shadow-2xs ${
            activeTab === 'Admin Profile'
              ? 'bg-[#fed011] text-black shadow-xs font-black'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.2]" />
          <span>Admin Profile</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick('Change Password')}
          className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-[15px] font-bold transition-all cursor-pointer shadow-2xs ${
            activeTab === 'Change Password'
              ? 'bg-[#fed011] text-black shadow-xs font-black'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 stroke-[2.2]" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Main 2-Column Split: Centered with wider width, compact height & increased gap */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-7 sm:gap-9 lg:gap-10 items-stretch">
        {/* =========================================================
            LEFT COLUMN: ADMIN PROFILE CARD
            ========================================================= */}
        <div ref={profileCardRef} className="scroll-mt-20 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner */}
            <div className="px-4 py-2.5 bg-[#fffdf0] border-b border-amber-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <User className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Admin Profile
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 font-semibold">
                  View and update your admin profile details.
                </p>
              </div>
            </div>

            {/* Profile Form Fields */}
            <form onSubmit={handleProfileSubmit(onProfileSubmit)} id="profileForm" className="p-4 space-y-2.5">
              {/* Center Profile Avatar with Camera Button */}
              <div className="flex justify-center pb-0.5">
                <div className="relative">
                  {/* Avatar Circle - enlarged image */}
                  <div className="w-24 h-24 sm:w-26 sm:h-26 rounded-full border-2 border-amber-300 p-0.5 bg-amber-50 flex items-center justify-center shadow-xs overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Admin"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white">
                        <User className="w-12 h-12 text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Camera upload badge */}
                  <label className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[#fed011] hover:bg-amber-400 border-2 border-white flex items-center justify-center text-slate-950 cursor-pointer shadow-sm transition-colors">
                    <Camera className="w-4 h-4 stroke-[2.2]" />
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
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type="text"
                    {...registerProfile('fullName')}
                    placeholder="Enter full name"
                    className={`w-full h-10.5 pl-10.5 pr-3.5 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none shadow-2xs transition-colors ${
                      profileErrors.fullName
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                </div>
                {profileErrors.fullName && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {profileErrors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type="email"
                    {...registerProfile('email')}
                    placeholder="Enter email address"
                    className={`w-full h-10.5 pl-10.5 pr-3.5 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none shadow-2xs transition-colors ${
                      profileErrors.email
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                </div>
                {profileErrors.email && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {profileErrors.email.message}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  Mobile Number <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type="tel"
                    {...registerProfile('mobile')}
                    placeholder="Enter mobile number"
                    className={`w-full h-10.5 pl-10.5 pr-3.5 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 focus:outline-none shadow-2xs transition-colors ${
                      profileErrors.mobile
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                </div>
                {profileErrors.mobile && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {profileErrors.mobile.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Update Profile Button */}
          <div className="p-4 pt-1 flex justify-center">
            <button
              type="submit"
              form="profileForm"
              disabled={isProfileSubmitting}
              className="h-10.5 px-9 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-70"
            >
              <Save className="w-4.5 h-4.5 stroke-[2.4]" />
              <span>{isProfileSubmitting ? 'Updating...' : 'Update Profile'}</span>
            </button>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: CHANGE PASSWORD CARD
            ========================================================= */}
        <div ref={passwordCardRef} className="scroll-mt-20 bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div>
            {/* Header Banner */}
            <div className="px-4 py-2.5 bg-[#fffdf0] border-b border-amber-200/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fed011] text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-2xs">
                <Lock className="w-5 h-5 stroke-[2.4]" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug">
                  Change Password
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 font-semibold">
                  Update your login password.
                </p>
              </div>
            </div>

            {/* Password Form Fields */}
            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} id="passwordForm" className="p-4 space-y-3">
              {/* Current Password */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  Current Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    {...registerPassword('currentPassword')}
                    placeholder="Enter current password"
                    className={`w-full h-10.5 pl-10.5 pr-10 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-2xs transition-colors ${
                      passwordErrors.currentPassword
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                  >
                    {showCurrent ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    {...registerPassword('newPassword')}
                    placeholder="Enter new password"
                    className={`w-full h-10.5 pl-10.5 pr-10 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-2xs transition-colors ${
                      passwordErrors.newPassword
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                  >
                    {showNew ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm sm:text-[15px] font-bold text-slate-900 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4.5 h-4.5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    {...registerPassword('confirmPassword')}
                    placeholder="Confirm new password"
                    className={`w-full h-10.5 pl-10.5 pr-10 bg-white border rounded-xl text-sm sm:text-base font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none shadow-2xs transition-colors ${
                      passwordErrors.confirmPassword
                        ? 'border-rose-400 focus:border-rose-500 ring-1 ring-rose-200'
                        : 'border-slate-200 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4.5 h-4.5" />
                    ) : (
                      <Eye className="w-4.5 h-4.5" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-xs font-bold text-rose-500 mt-1 pl-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Update Password Button */}
          <div className="p-4 pt-1 flex justify-center">
            <button
              type="submit"
              form="passwordForm"
              disabled={isPasswordSubmitting}
              className="h-10.5 px-9 rounded-xl bg-[#fed011] hover:bg-amber-400 text-black text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors disabled:opacity-70"
            >
              <KeyRound className="w-4.5 h-4.5 stroke-[2.4]" />
              <span>{isPasswordSubmitting ? 'Updating...' : 'Update Password'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
