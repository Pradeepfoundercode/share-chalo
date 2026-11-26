import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bell,
  ChevronDown,
  XCircle,
  CheckCircle2,
  Phone,
  Mail,
  User,
  ShieldCheck,
  Clock,
  Eye,
  Download,
  X,
  FileText,
  Car,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/authStore';
import { DetailsHeader } from '../common';
import {
  reviewDriverProfileApi,
  reviewDriverKycApi,
  reviewDriverVehicleApi
} from '../../services/driver.services';
import personalInfoIcon from '../../assets/drivers/Group-9-f29c03.svg';
import vehicleDocumentIcon from '../../assets/drivers/vehicle-document.svg';
import vehicleYellowIcon from '../../assets/dashboard/car-yellow.svg';
import kycTabIcon from '../../assets/drivers/kyc-tab.svg';

export default function PendingVerificationView({ driver }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const admin = useAuthStore((state) => state.admin);

  // Stepper active step (1: Personal Details, 2: KYC & Documents, 3: Vehicle Details, 4: Review & Approve)
  const [activeStep, setActiveStep] = useState(1);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectRemark, setRejectRemark] = useState('');
  const [rejecting, setRejecting] = useState(false);

  // Ensure view starts from the very top when mounting or changing step
  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeStep, driver?.id]);

  const isProfileApproved = (driver.profileStatus || '').toLowerCase() === 'approved';
  const isProfileRejected = (driver.profileStatus || '').toLowerCase() === 'rejected';

  const isKycApproved = (driver.kycStatus || '').toLowerCase() === 'approved';
  const isKycRejected = (driver.kycStatus || '').toLowerCase() === 'rejected';

  const isVehicleApproved = (driver.vehicleStatus || '').toLowerCase() === 'approved';
  const isVehicleRejected = (driver.vehicleStatus || '').toLowerCase() === 'rejected';

  const hasVehicle = Boolean(
    driver.raw?.vehicle &&
    driver.vehicleStatus !== 'not_submitted' &&
    driver.brand !== '-'
  );

  const isVehicleNotSubmitted =
    !hasVehicle || (driver.vehicleStatus || '').toLowerCase() === 'not_submitted';

  const steps = [
    {
      num: 1,
      name: 'Personal Details',
      status: isProfileApproved
        ? 'Approved'
        : isProfileRejected
        ? 'Rejected'
        : 'In Review',
    },
    {
      num: 2,
      name: 'KYC & Documents',
      status: isKycApproved
        ? 'Approved'
        : isKycRejected
        ? 'Rejected'
        : 'Pending',
    },
    {
      num: 3,
      name: 'Vehicle Details',
      status: isVehicleApproved
        ? 'Approved'
        : isVehicleRejected
        ? 'Rejected'
        : isVehicleNotSubmitted
        ? 'Not Submitted'
        : 'Pending',
    },
    {
      num: 4,
      name: 'Review & Approve',
      status:
        isProfileApproved && isKycApproved && isVehicleApproved
          ? 'Approved'
          : isProfileRejected || isKycRejected || isVehicleRejected
          ? 'Rejected'
          : 'Pending',
    },
  ];

  const currentStepObj = steps.find((s) => s.num === activeStep) || steps[0];

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      let res;
      if (activeStep === 1) {
        res = await reviewDriverProfileApi(driver.id, { action: 'approved' });
        toast.success(res?.message || 'Profile details approved successfully!');
      } else if (activeStep === 2) {
        res = await reviewDriverKycApi(driver.id, { action: 'approved' });
        toast.success(res?.message || 'KYC documents approved successfully!');
      } else if (activeStep === 3) {
        if (!hasVehicle) {
          toast.error('Vehicle details have not been submitted yet.');
          return;
        }
        res = await reviewDriverVehicleApi(driver.id, { action: 'approved' });
        toast.success(res?.message || 'Vehicle details approved successfully!');
      } else if (activeStep === 4) {
        toast.success('Driver application review completed!');
      }

      // Invalidate driver details so page refreshes state from server
      await queryClient.invalidateQueries({
        queryKey: ['admin-driver-details'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['admin-drivers'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['drivers'],
      });

      // Move to next step if not the last step
      if (activeStep < 4) {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to approve.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = () => {
    setRejectRemark('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e) => {
    if (e) e.preventDefault();
    if (!rejectRemark.trim()) {
      toast.error('Please enter a rejection reason.');
      return;
    }

    try {
      setRejecting(true);
      let res;
      if (activeStep === 1) {
        res = await reviewDriverProfileApi(driver.id, {
          action: 'rejected',
          remark: rejectRemark.trim(),
        });
        toast.success(res?.message || 'Profile details rejected.');
      } else if (activeStep === 2) {
        res = await reviewDriverKycApi(driver.id, {
          action: 'rejected',
          remark: rejectRemark.trim(),
        });
        toast.success(res?.message || 'KYC documents rejected.');
      } else if (activeStep === 3) {
        res = await reviewDriverVehicleApi(driver.id, {
          action: 'rejected',
          remark: rejectRemark.trim(),
        });
        toast.success(res?.message || 'Vehicle details rejected.');
      }

      setRejectModalOpen(false);
      setRejectRemark('');

      await queryClient.invalidateQueries({
        queryKey: ['admin-driver-details'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['admin-drivers'],
      });
      await queryClient.invalidateQueries({
        queryKey: ['drivers'],
      });

      // Redirect to driver list page so the new list/table is re-fetched
      navigate('/drivers');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to reject.';
      toast.error(msg);
    } finally {
      setRejecting(false);
    }
  };

  const kycDocs = [
    {
      id: 'dl',
      title: 'Driving Licence',
      number: `DL No.: ${driver.dlNo || driver.licenseNumber || '-'}`,
      validity: `Valid Till: ${driver.dlValidity || '-'}`,
      status: driver.kycStatus
        ? driver.kycStatus.charAt(0).toUpperCase() + driver.kycStatus.slice(1)
        : 'Pending',
      previewImg: driver.dlImageUrl || '',
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'aadhaar',
      title: 'Identity Proof (Aadhaar)',
      number: `Aadhaar No.: ${driver.aadhaarNo || 'Aadhaar / National ID'}`,
      validity: null,
      status: driver.kycStatus
        ? driver.kycStatus.charAt(0).toUpperCase() + driver.kycStatus.slice(1)
        : 'Pending',
      previewImg: driver.identityProofUrl || '',
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'selfie',
      title: 'Selfie / Live Photo',
      subtitle: 'Verified at the time of registration',
      status: driver.profileStatus
        ? driver.profileStatus.charAt(0).toUpperCase() + driver.profileStatus.slice(1)
        : 'Approved',
      previewImg: driver.avatar || '',
      hasDownload: false,
      hasView: true,
      isSelfie: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-10 sm:pb-12 select-none">
      {/* =========================================================
          REUSABLE DETAILS HEADER BAR
          ========================================================= */}
      <DetailsHeader
        title="Driver Verification"
        breadcrumbs={[
          { label: 'Drivers', path: '/drivers' },
          { label: 'Verify Driver' },
        ]}
      />

      {/* =========================================================
          HORIZONTAL STEPPER TABS (1 to 5) - Full Width Coverage
          ========================================================= */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 sm:gap-3 border-b border-slate-200 pb-3 mb-4 sm:mb-5 w-full">
        {steps.map((step) => {
          const isActive = activeStep === step.num;
          return (
            <button
              key={step.num}
              onClick={() => setActiveStep(step.num)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#fed011] text-black font-black shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-50 font-bold'
              }`}
            >
              <span
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-black'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {step.num}
              </span>
              <span>{step.name}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================
          MAIN BODY: Left Sidebar + Right Content
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
        {/* =========================================================
            LEFT COLUMN (col-span-4): Driver Card + Verification Progress
            ========================================================= */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Driver Profile Header Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs flex items-center gap-3 sm:gap-4">
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-2xs bg-slate-50 flex items-center justify-center">
              <img
                src={driver.avatar}
                alt={driver.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5 min-w-0">
              <h3 className="text-base sm:text-lg font-black text-black leading-tight truncate">
                {driver.name}
              </h3>
              <p className="text-[11px] sm:text-sm font-bold text-black leading-tight">
                Driver ID: {driver.id}
              </p>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-black truncate leading-tight pt-1">
                <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black shrink-0" />
                <span>{driver.mobile || driver.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm font-bold text-black truncate leading-tight">
                <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-black shrink-0" />
                <span className="truncate">{driver.email}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Verification Progress & Vertical Steps Tracker */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            {/* Progress Header */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-black">
                  Verification Progress
                </h4>
                <span className="text-[11px] sm:text-sm font-bold text-black">
                  Step {activeStep} of 4
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-[#fed011] rounded-full transition-all duration-300"
                  style={{ width: `${(activeStep / 4) * 100}%` }}
                />
              </div>

              <p className="text-[11px] sm:text-xs font-bold text-black">
                {currentStepObj.name} ({currentStepObj.status})
              </p>
            </div>

            {/* Vertical Steps List */}
            <div className="space-y-1.5 pt-1">
              {steps.map((step) => {
                const isActive = step.num === activeStep;
                return (
                  <div
                    key={step.num}
                    onClick={() => setActiveStep(step.num)}
                    className={`flex items-center justify-between px-2.5 sm:px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-100/60 border-amber-300 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5">
                      <span
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-black shrink-0 ${
                          isActive
                            ? 'bg-[#fed011] text-black shadow-2xs'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {step.num}
                      </span>
                      <span className="text-[13px] sm:text-sm font-bold text-black">
                        {step.name}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        step.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : step.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : step.status === 'In Review'
                          ? 'bg-amber-100 text-amber-900 border-amber-200'
                          : step.status === 'Not Submitted'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN (col-span-8): Dynamic Content Based on activeStep
            ========================================================= */}
        <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4 sm:space-y-6">
            {/* =========================================================
                STEP 1: PERSONAL DETAILS
                ========================================================= */}
            {activeStep === 1 && (
              <>
                {/* Header */}
                <div className="flex items-start gap-2.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2 sm:mt-0.5">
                    <img src={personalInfoIcon} alt="Personal Details" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                      Personal Details
                    </h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                      Verify the driver's personal information submitted during registration.
                    </p>
                  </div>
                </div>

                {/* Content: Driver Profile Picture + Specifications */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-6 items-start pt-1 sm:pt-2">
                  <div className="md:col-span-4 flex justify-center">
                    <div className="w-24 h-28 sm:w-40 sm:h-44 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-50 flex items-center justify-center">
                      <img
                        src={driver.avatar}
                        alt={driver.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-1.5 sm:space-y-2 pt-2 sm:pt-0">
                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Full Name</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-black sm:font-bold text-[13px] sm:text-base">
                        {driver.name}
                      </span>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Mobile Number</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                        {driver.mobile || driver.phone}
                      </span>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Email</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm break-all">
                        {driver.email}
                      </span>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Date of Birth</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                        {driver.dob || '-'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start sm:items-center pb-1.5 sm:pb-1 border-b border-slate-100">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Gender</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm">
                        {driver.gender || '-'}
                      </span>
                    </div>

                    <div className="flex flex-col sm:grid sm:grid-cols-12 gap-0 sm:gap-1 items-start">
                      <span className="sm:col-span-4 text-slate-500 sm:text-black font-bold text-[11px] sm:text-sm">Address</span>
                      <span className="hidden sm:block sm:col-span-1 text-slate-400 font-bold">:</span>
                      <span className="sm:col-span-7 text-black font-bold sm:font-medium text-[12px] sm:text-sm leading-snug">
                        {driver.address || '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* =========================================================
                STEP 2: KYC & DOCUMENTS
                ========================================================= */}
            {activeStep === 2 && (
              <>
                {/* Header */}
                <div className="flex items-start gap-2.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2 sm:mt-0.5">
                    <img src={kycTabIcon} alt="KYC & Documents" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                      KYC &amp; Documents
                    </h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                      Verify the driver's driving license, identity proof, and live photo.
                    </p>
                  </div>
                </div>

                {/* List of KYC items */}
                <div className="space-y-3 pt-1">
                  {kycDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 transition-all gap-2 sm:gap-3"
                    >
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full">
                        <div
                          onClick={() => doc.previewImg && setPreviewPhoto({ img: doc.previewImg, title: doc.title })}
                          className="shrink-0 w-16 h-12 sm:w-20 sm:h-14 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center p-0.5 cursor-pointer hover:border-amber-400 transition-all"
                        >
                          <img
                            src={doc.previewImg}
                            alt={doc.title}
                            className={`w-full h-full ${doc.isSelfie ? 'object-cover' : 'object-contain'} rounded-lg`}
                          />
                        </div>

                        <div className="space-y-0.5 min-w-0 flex-1">
                          <h4 className="text-sm sm:text-base font-black text-black leading-tight truncate">
                            {doc.title}
                          </h4>

                          {doc.number && (
                            <p className="text-xs sm:text-[13px] font-semibold text-slate-800 truncate">
                              {doc.number}
                            </p>
                          )}

                          {doc.validity && (
                            <p className="text-xs sm:text-[13px] font-medium text-slate-500 truncate">
                              {doc.validity}
                            </p>
                          )}

                          {doc.subtitle && (
                            <p className="text-xs sm:text-[13px] font-medium text-slate-500 truncate">
                              {doc.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-end shrink-0 gap-1.5">
                        {doc.hasView && (
                          <button
                            onClick={() => doc.previewImg && setPreviewPhoto({ img: doc.previewImg, title: doc.title })}
                            className="p-1.5 sm:p-2 hover:bg-slate-200/70 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                            title="View Document"
                          >
                            <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </button>
                        )}

                        {doc.hasDownload && doc.previewImg && (
                          <a
                            href={doc.previewImg}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="p-1.5 sm:p-2 hover:bg-slate-200/70 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* =========================================================
                STEP 3: VEHICLE DETAILS
                ========================================================= */}
            {activeStep === 3 && (
              <>
                {/* Header */}
                <div className="flex items-start gap-2.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2 sm:mt-0.5">
                    <img src={vehicleYellowIcon} alt="Vehicle Details" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                      Vehicle Details
                    </h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                      Verify vehicle registration, specifications, and submitted documents.
                    </p>
                  </div>
                </div>

                {!hasVehicle ? (
                  /* Vehicle Not Submitted State: ONLY Heading */
                  <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700 mb-1">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      Vehicle Details Not Submitted
                    </h4>
                  </div>
                ) : (
                  /* Vehicle Details Submitted State */
                  <div className="space-y-4 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs sm:text-sm p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60">
                      <div className="sm:col-span-6 grid grid-cols-12 gap-1 pb-1 border-b sm:border-b-0 border-slate-100">
                        <span className="col-span-5 text-slate-600 font-bold">Vehicle Type</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.vehicleType}</span>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-12 gap-1 pb-1 border-b sm:border-b-0 border-slate-100">
                        <span className="col-span-5 text-slate-600 font-bold">Registration No.</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.regNo || '-'}</span>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-12 gap-1 pb-1 border-b sm:border-b-0 border-slate-100">
                        <span className="col-span-5 text-slate-600 font-bold">Brand</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.brand || '-'}</span>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-12 gap-1 pb-1 border-b sm:border-b-0 border-slate-100">
                        <span className="col-span-5 text-slate-600 font-bold">Model</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.model || '-'}</span>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-12 gap-1">
                        <span className="col-span-5 text-slate-600 font-bold">Capacity</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.capacity || driver.seatingCapacity || '-'}</span>
                      </div>

                      <div className="sm:col-span-6 grid grid-cols-12 gap-1">
                        <span className="col-span-5 text-slate-600 font-bold">Color</span>
                        <span className="col-span-1 text-slate-400">:</span>
                        <span className="col-span-6 font-bold text-black">{driver.color || '-'}</span>
                      </div>
                    </div>

                    {/* Vehicle Documents */}
                    {(driver.rcUrl || driver.insuranceUrl) && (
                      <div className="space-y-2 pt-1">
                        <h4 className="text-xs sm:text-sm font-black text-black">Vehicle Documents</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {driver.rcUrl && (
                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-white">
                              <span className="text-xs font-bold text-slate-900">RC (Registration)</span>
                              <button
                                onClick={() => setPreviewPhoto({ img: driver.rcUrl, title: 'RC (Registration Certificate)' })}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {driver.insuranceUrl && (
                            <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 bg-white">
                              <span className="text-xs font-bold text-slate-900">Insurance</span>
                              <button
                                onClick={() => setPreviewPhoto({ img: driver.insuranceUrl, title: 'Insurance Document' })}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-600 cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* =========================================================
                STEP 4: REVIEW & APPROVE
                ========================================================= */}
            {activeStep === 4 && (
              <>
                <div className="flex items-start gap-2.5 sm:gap-3 pb-2 sm:pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-100/70 flex items-center justify-center shrink-0 p-1.5 sm:p-2 sm:mt-0.5">
                    <ShieldCheck className="w-5 h-5 text-amber-800" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-black leading-tight">
                      Review &amp; Approve
                    </h3>
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5 sm:mt-1 leading-tight">
                      Verification breakdown across all driver onboarding stages.
                    </p>
                  </div>
                </div>

                {/* Section Review Cards */}
                <div className="space-y-3 pt-1">
                  {/* Card 1: Personal Details */}
                  <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 p-1.5">
                        <img src={personalInfoIcon} alt="Personal" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-black text-black">Personal Details</h4>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                              isProfileApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isProfileRejected
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-100 text-amber-900 border-amber-200'
                            }`}
                          >
                            {isProfileApproved ? 'Approved' : isProfileRejected ? 'Rejected' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {driver.name} • {driver.mobile || driver.phone} • {driver.email}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveStep(1)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {isProfileApproved ? 'View Details' : 'Review & Approve'} &rarr;
                    </button>
                  </div>

                  {/* Card 2: KYC & Documents */}
                  <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 p-1.5">
                        <img src={kycTabIcon} alt="KYC" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-black text-black">KYC &amp; Documents</h4>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                              isKycApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isKycRejected
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-100 text-amber-900 border-amber-200'
                            }`}
                          >
                            {isKycApproved ? 'Approved' : isKycRejected ? 'Rejected' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          DL: {driver.dlNo || driver.licenseNumber || '-'} • Aadhaar / ID: {driver.identityProofUrl ? 'Submitted' : 'Pending'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveStep(2)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {isKycApproved ? 'View Documents' : 'Review & Approve'} &rarr;
                    </button>
                  </div>

                  {/* Card 3: Vehicle Details */}
                  <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 p-1.5">
                        <img src={vehicleYellowIcon} alt="Vehicle" className="w-full h-full object-contain" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm sm:text-base font-black text-black">Vehicle Details</h4>
                          <span
                            className={`text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border ${
                              isVehicleApproved
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isVehicleRejected
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : isVehicleNotSubmitted
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-amber-100 text-amber-900 border-amber-200'
                            }`}
                          >
                            {isVehicleApproved
                              ? 'Approved'
                              : isVehicleRejected
                              ? 'Rejected'
                              : isVehicleNotSubmitted
                              ? 'Not Submitted'
                              : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          {hasVehicle
                            ? `${driver.brand} ${driver.model} (${driver.regNo || 'No Plate'})`
                            : 'Vehicle details have not been submitted yet.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveStep(3)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer shrink-0 self-start sm:self-auto"
                    >
                      {isVehicleApproved ? 'View Vehicle' : isVehicleNotSubmitted ? 'Check Status' : 'Review & Approve'} &rarr;
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bottom Action Area */}
          <div className="pt-4 sm:pt-8 mt-4 sm:mt-6 border-t border-slate-100 w-full">
            {activeStep === 1 && isProfileApproved ? (
              /* If profileStatus is approved, do not show Reject or Approve buttons */
              <div className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm w-fit mx-auto shadow-2xs">
                <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-emerald-600 shrink-0" />
                <span>Personal Details Approved</span>
              </div>
            ) : activeStep === 2 && isKycApproved ? (
              /* If kycStatus is approved */
              <div className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm w-fit mx-auto shadow-2xs">
                <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-emerald-600 shrink-0" />
                <span>KYC Documents Approved</span>
              </div>
            ) : activeStep === 3 && isVehicleApproved ? (
              /* If vehicleStatus is approved */
              <div className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm w-fit mx-auto shadow-2xs">
                <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-emerald-600 shrink-0" />
                <span>Vehicle Details Approved</span>
              </div>
            ) : activeStep === 4 ? (
              isProfileApproved && isKycApproved && isVehicleApproved ? (
                <div className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-sm w-fit mx-auto shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-emerald-600 shrink-0" />
                  <span>All Verification Steps Approved</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-bold text-xs sm:text-sm w-fit mx-auto shadow-2xs">
                  <AlertCircle className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-600 shrink-0" />
                  <span>
                    Pending Steps:{' '}
                    {[
                      !isProfileApproved && (isProfileRejected ? 'Personal Details (Rejected)' : 'Personal Details'),
                      !isKycApproved && (isKycRejected ? 'KYC & Documents (Rejected)' : 'KYC & Documents'),
                      !isVehicleApproved &&
                        (isVehicleNotSubmitted
                          ? 'Vehicle (Not Submitted)'
                          : isVehicleRejected
                          ? 'Vehicle Details (Rejected)'
                          : 'Vehicle Details'),
                    ]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              )
            ) : (
              <div className="flex flex-row items-center justify-center gap-2.5 sm:gap-6 w-full">
                {/* Reject Button */}
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-600 font-bold text-[13px] sm:text-base transition-all cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                  <span>Reject</span>
                </button>

                {/* Approve Button (or Not Submitted if activeStep === 3 and vehicle not submitted) */}
                {activeStep === 3 && isVehicleNotSubmitted ? (
                  <button
                    disabled
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 text-slate-500 font-bold text-[13px] sm:text-base cursor-not-allowed shadow-none"
                  >
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                    <span>Not Submitted</span>
                  </button>
                ) : (
                  <button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] sm:text-base transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Approving...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.4]" />
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rejection Remark Modal Popup */}
      {rejectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => !rejecting && setRejectModalOpen(false)}
        >
          <div
            className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 flex flex-col border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => !rejecting && setRejectModalOpen(false)}
              disabled={rejecting}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500 hover:text-slate-800 cursor-pointer disabled:opacity-50"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-[#fed011]/25 border border-[#fed011]/50 text-black flex items-center justify-center shrink-0">
                <XCircle className="w-5 h-5 stroke-[2.4] text-black" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 leading-tight">
                  Reject {currentStepObj.name}
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Provide a clear reason for the driver.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmReject} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Rejection Reason / Remark <span className="text-amber-600">*</span>
                </label>
                <textarea
                  value={rejectRemark}
                  onChange={(e) => setRejectRemark(e.target.value)}
                  placeholder="e.g. DL image is blurry, please upload again"
                  rows={4}
                  autoFocus
                  disabled={rejecting}
                  className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#fed011] focus:ring-2 focus:ring-[#fed011]/30 text-slate-900 placeholder:text-slate-400 transition-all resize-none font-medium"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => !rejecting && setRejectModalOpen(false)}
                  disabled={rejecting}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                     
                <button
                  type="submit"
                  disabled={rejecting || !rejectRemark.trim()}
                  className="px-5 py-2.5 rounded-xl bg-[#fed011] hover:bg-[#e5bc0f] text-black font-black text-xs sm:text-sm transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {rejecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-black" />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 stroke-[2.4] text-black" />
                      <span>Confirm Reject</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Full Preview Modal */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewPhoto(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-base font-black text-black mb-3">{previewPhoto.title || 'Document Preview'}</h4>
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={previewPhoto.img}
                alt={previewPhoto.title || 'Preview'}
                className="max-h-[68vh] w-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
