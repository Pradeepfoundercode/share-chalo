import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

import carCutout from '../../assets/common/White Compact Sedan on a Tree-Lined Road.png';
import hatchbackCutout from '../../assets/common/White Compact Hatchback Car Cutout.png';
import busCutout from '../../assets/common/commercial_bus.png';
import paleYellowWavesBg from '../../assets/common/Pale Yellow Layered Waves.png';
import {
  getCommissionSettingsApi,
  updateCommissionSettingsApi,
} from '../../services/commission.services';

// SVG Icons matching assets / dashboard / drivers
const PercentIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 16 20" fill="currentColor" className={className}>
    <path d="M13.62 0.53L12.78 0L7.15 9L1.53 18L2.38 18.53L3.22 19.06L8.85 10.06L14.47 1.06L13.62 0.53ZM0 4.03C0 5.96 1.57 7.53 3.5 7.53C5.43 7.53 7 5.96 7 4.03C7 2.1 5.43 0.53 3.5 0.53C1.57 0.53 0 2.1 0 4.03ZM3.5 2.53C4.33 2.53 5 3.2 5 4.03C5 4.86 4.33 5.53 3.5 5.53C2.67 5.53 2 4.86 2 4.03C2 3.2 2.67 2.53 3.5 2.53ZM9 15.03C9 16.96 10.57 18.53 12.5 18.53C14.43 18.53 16 16.96 16 15.03C16 13.1 14.43 11.53 12.5 11.53C10.57 11.53 9 13.1 9 15.03ZM14 15.03C14 15.86 13.33 16.53 12.5 16.53C11.67 16.53 11 15.86 11 15.03C11 14.2 11.67 13.53 12.5 13.53C13.33 13.53 14 14.2 14 15.03Z" />
  </svg>
);

const FrontCarIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 20 18" fill="currentColor" className={className}>
    <path d="M18.78 6.15002L17.41 2.05002C17.2118 1.45146 16.8294 0.930888 16.3175 0.562705C15.8057 0.194521 15.1905 -0.00242267 14.56 2.24957e-05H5.45C4.81984 -0.000899276 4.20539 0.196637 3.69382 0.564606C3.18226 0.932575 2.79955 1.45229 2.6 2.05002L1.23 6.15002C0.51 6.45002 0 7.17002 0 7.99002V12.99C0 13.73 0.41 14.37 1 14.71V16.99C1 17.54 1.45 17.99 2 17.99H3C3.55 17.99 4 17.54 4 16.99V14.99H16V16.99C16 17.54 16.45 17.99 17 17.99H18C18.55 17.99 19 17.54 19 16.99V14.71C19.3023 14.5355 19.5536 14.2849 19.7291 13.9832C19.9045 13.6814 19.9979 13.3391 20 12.99V7.99002C20 7.16002 19.49 6.45002 18.77 6.15002H18.78ZM5.45 1.99002H14.57C14.7796 1.98948 14.9842 2.05484 15.1546 2.17686C15.3251 2.29889 15.4529 2.4714 15.52 2.67002L16.63 5.99002H3.4L4.51 2.67002C4.57709 2.4714 4.7049 2.29889 4.87537 2.17686C5.04584 2.05484 5.25036 1.98948 5.46 1.99002H5.45ZM2.01 12.99V7.99002H18.01V12.99H2.01Z" />
  </svg>
);

const SideBusIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="11" rx="2" />
    <line x1="2" y1="11" x2="22" y2="11" />
    <line x1="8" y1="6" x2="8" y2="11" />
    <line x1="14" y1="6" x2="14" y2="11" />
    <circle cx="6.5" cy="17" r="1.8" fill="currentColor" />
    <circle cx="17.5" cy="17" r="1.8" fill="currentColor" />
  </svg>
);

const CalculatorIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="3" />
    <rect x="7" y="5" width="10" height="3.5" rx="1" fill="currentColor" fillOpacity="0.2" />
    <circle cx="8" cy="12" r="1" fill="currentColor" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <circle cx="16" cy="12" r="1" fill="currentColor" />
    <circle cx="8" cy="15.5" r="1" fill="currentColor" />
    <circle cx="12" cy="15.5" r="1" fill="currentColor" />
    <circle cx="16" cy="15.5" r="1" fill="currentColor" />
    <circle cx="8" cy="19" r="1" fill="currentColor" />
    <circle cx="12" cy="19" r="1" fill="currentColor" />
    <circle cx="16" cy="19" r="1" fill="currentColor" />
  </svg>
);

const RulesDocIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const CreditCardIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <circle cx="6" cy="15" r="1" fill="currentColor" />
  </svg>
);

const BanknoteIcon = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="6" width="20" height="12" rx="2.5" />
    <circle cx="12" cy="12" r="3" />
    <line x1="6" y1="12" x2="6.01" y2="12" strokeWidth="3" />
    <line x1="18" y1="12" x2="18.01" y2="12" strokeWidth="3" />
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function CommissionSettings() {
  const queryClient = useQueryClient();

  const [rates, setRates] = useState({
    1: 10,
    2: 12,
    3: 15,
  });

  // ========================================
  // GET COMMISSION SETTINGS API (React Query)
  // ========================================
  const {
    data: responseData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['commission-settings'],
    queryFn: getCommissionSettingsApi,
  });

  const apiData = responseData?.data;

  // Initialize/sync rates when API data loads
  useEffect(() => {
    if (apiData?.vehicleTypes && Array.isArray(apiData.vehicleTypes)) {
      const initialRates = {};
      apiData.vehicleTypes.forEach((v) => {
        initialRates[v.vehicleTypeId] = v.commissionRate;
      });
      setRates(initialRates);
    }
  }, [apiData]);

  // Fallback vehicle types if API returns empty
  const defaultVehicleTypes = [
    { vehicleTypeId: 1, vehicleTypeName: 'Private', commissionRate: 10, isActive: true },
    { vehicleTypeId: 2, vehicleTypeName: 'Commercial', commissionRate: 12, isActive: true },
    { vehicleTypeId: 3, vehicleTypeName: 'Bus', commissionRate: 15, isActive: true },
  ];

  const vehicleTypes =
    apiData?.vehicleTypes && apiData.vehicleTypes.length > 0
      ? apiData.vehicleTypes
      : defaultVehicleTypes;

  const exampleFare =
    apiData?.calculationPreview?.[0]?.totalRideFare || 5000;

  const getVehicleMeta = (v) => {
    const name = (v.vehicleTypeName || '').toLowerCase();
    if (name.includes('bus')) {
      return {
        image: busCutout,
        IconComponent: SideBusIcon,
      };
    }
    if (name.includes('commercial') || name.includes('taxi')) {
      return {
        image: hatchbackCutout,
        IconComponent: FrontCarIcon,
      };
    }
    return {
      image: carCutout,
      IconComponent: FrontCarIcon,
    };
  };

  const handleRateChange = (vehicleTypeId, value) => {
    if (value === '') {
      setRates((prev) => ({ ...prev, [vehicleTypeId]: '' }));
      return;
    }
    const cleanVal = String(value).replace(/\D/g, '');
    const num = Math.max(0, Math.min(100, Number(cleanVal) || 0));
    setRates((prev) => ({
      ...prev,
      [vehicleTypeId]: num,
    }));
  };

  // ========================================
  // UPDATE COMMISSION SETTINGS API (Mutation)
  // ========================================
  const updateCommissionMutation = useMutation({
    mutationFn: updateCommissionSettingsApi,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['commission-settings'] });
      toast.success(res?.message || 'Commission settings updated successfully!');
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message || 'Failed to update commission settings. Please try again.';
      toast.error(msg);
    },
  });

  const handleSave = () => {
    const payload = {
      platformEnabled: apiData?.platformEnabled ?? true,
      vehicleTypes: vehicleTypes.map((v) => ({
        vehicleTypeId: v.vehicleTypeId,
        commissionRate:
          rates[v.vehicleTypeId] !== undefined && rates[v.vehicleTypeId] !== ''
            ? Number(rates[v.vehicleTypeId])
            : Number(v.commissionRate) || 0,
        isActive: v.isActive !== undefined ? v.isActive : true,
      })),
    };

    updateCommissionMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#fed011]" />
        <p className="text-sm font-semibold text-slate-600">Loading commission settings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-16 flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <p className="text-sm font-bold text-slate-800">
          {error?.response?.data?.message || 'Failed to load commission settings'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#fed011] text-black hover:bg-amber-400 transition-colors cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* =========================================================
          1. TOP BANNER: PLATFORM COMMISSION
          ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex items-center gap-3 sm:gap-4">
        {/* Background Pale Yellow Layered Waves banner */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-90">
          <img
            src={paleYellowWavesBg}
            alt="Pale Yellow Waves"
            className="w-full h-full object-cover object-right sm:object-fill"
          />
        </div>

        {/* Left: Icon + Title + Description */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-10 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs">
            <PercentIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Platform Commission
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5 leading-snug">
              Set commission percentage on the total ride fare for completed rides.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. MIDDLE ROW: VEHICLE-WISE COMMISSION & CALCULATION PREVIEW
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Vehicle-wise Commission (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs">
                <FrontCarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-black" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  Vehicle-wise Commission
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5 leading-snug">
                  Set different commission rates for private and commercial vehicles.
                </p>
              </div>
            </div>

            {/* Dynamic Vehicle Rate Cards */}
            <div className="space-y-3 sm:space-y-3.5">
              {vehicleTypes.map((v) => {
                const meta = getVehicleMeta(v);
                const currentRate =
                  rates[v.vehicleTypeId] !== undefined
                    ? rates[v.vehicleTypeId]
                    : v.commissionRate;

                return (
                  <div
                    key={v.vehicleTypeId}
                    className="bg-[#fffdf0] border border-amber-200/80 rounded-xl sm:rounded-2xl px-3 py-3 sm:px-4 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3.5 shadow-2xs hover:border-amber-300 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                      <div className="w-16 h-10 sm:w-24 sm:h-14 flex items-center justify-center shrink-0">
                        <img
                          src={meta.image}
                          alt={v.vehicleTypeName}
                          className="max-h-full max-w-full object-contain scale-110 drop-shadow-2xs"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                          {v.vehicleTypeName}
                        </h4>
                      </div>
                    </div>

                    {/* Number Input Box */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg sm:rounded-xl px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 shadow-2xs shrink-0 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50">
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={currentRate}
                        onChange={(e) => handleRateChange(v.vehicleTypeId, e.target.value)}
                        className="w-7 sm:w-10 text-center font-bold text-slate-900 text-base sm:text-lg focus:outline-none bg-transparent"
                      />
                      <span className="text-base sm:text-lg font-bold text-slate-600 ml-0.5 select-none">
                        %
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Commission Calculation Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs">
                <CalculatorIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  Commission Calculation Preview
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
                  Example: Total ride fare ₹{Number(exampleFare).toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Preview Table Container */}
            <div className="overflow-x-auto rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-2xs no-scrollbar">
              <table className="w-full text-left text-xs sm:text-sm whitespace-nowrap sm:whitespace-normal">
                <thead>
                  <tr className="bg-[#feea98]/80 text-slate-900 font-bold border-b border-amber-200/80">
                    <th className="py-2.5 px-3 sm:py-3 sm:px-4 font-bold text-xs sm:text-sm">Vehicle Type</th>
                    <th className="py-2.5 px-2 sm:py-3 sm:px-4 text-center font-bold text-xs sm:text-sm">Commission Rate</th>
                    <th className="py-2.5 px-3 sm:py-3 sm:px-4 text-right font-bold text-xs sm:text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-900">
                  {vehicleTypes.map((v) => {
                    const meta = getVehicleMeta(v);
                    const IconComponent = meta.IconComponent;
                    const currentRate =
                      rates[v.vehicleTypeId] !== undefined && rates[v.vehicleTypeId] !== ''
                        ? Number(rates[v.vehicleTypeId])
                        : v.commissionRate;
                    const calculatedAmount = Math.round((exampleFare * currentRate) / 100);

                    return (
                      <tr key={v.vehicleTypeId} className="hover:bg-amber-50/20 transition-colors">
                        <td className="py-2.5 px-3 sm:py-3 sm:px-4">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 shrink-0" />
                            <span className="font-bold text-xs sm:text-sm">{v.vehicleTypeName}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 sm:py-3 sm:px-4 text-center">
                          <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-[13px] font-bold bg-[#fef9c3] text-slate-900 border border-amber-200/80 shadow-2xs">
                            {currentRate}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 sm:py-3 sm:px-4 text-right font-bold text-sm sm:text-base text-slate-900">
                          ₹{Number(calculatedAmount).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. BOTTOM CARD: PAYMENT & COMMISSION RULES
          ========================================================= */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs">
            <RulesDocIcon className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
          </div>
          <h3 className="text-base sm:text-xl font-bold text-slate-900 leading-tight">
            Payment & Commission Rules
          </h3>
        </div>

        {/* 4 Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pt-1">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              Commission will be charged only on completed rides.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-6.5 h-6.5 sm:w-7 sm:h-7 rounded-full bg-[#e11d48] text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <XIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 leading-relaxed">
              No commission on cancelled rides.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <CreditCardIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Online Payment:</span>
              <span className="font-semibold text-slate-600">
                Commission is automatically deducted from the settlement.
              </span>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3 sm:gap-3.5">
            <div className="w-7.5 h-7.5 sm:w-8 sm:h-8 rounded-xl bg-[#feea98] text-black flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <BanknoteIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
            </div>
            <div className="text-xs sm:text-sm leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">Cash Payment:</span>
              <span className="font-semibold text-slate-600">
                Driver collects the full fare and pays the platform commission.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          4. SAVE CHANGES ACTION BUTTON
          ========================================================= */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={handleSave}
          disabled={updateCommissionMutation.isPending}
          className="bg-[#fed011] hover:bg-[#fed011]/90 text-slate-950 font-bold text-xs sm:text-base px-8 sm:px-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-2 sm:gap-2.5 active:scale-98 disabled:opacity-70 w-full sm:w-auto justify-center"
        >
          {updateCommissionMutation.isPending ? (
            <Loader2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <Check className="w-4.5 h-4.5 sm:w-5 sm:h-5 stroke-[3]" />
          )}
          <span>{updateCommissionMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}