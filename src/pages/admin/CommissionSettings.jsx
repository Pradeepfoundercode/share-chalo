import React, { useState } from 'react';
import {
  Percent,
  Check,
  Car,
  Calculator,
  FileText,
  X,
  CreditCard,
  Banknote,
  Bus
} from 'lucide-react';
import { toast } from 'sonner';
import carCutout from '../../assets/White Compact Sedan on a Tree-Lined Road.png';
import hatchbackCutout from '../../assets/White Compact Hatchback Car Cutout.png';
import busCutout from '../../assets/commercial_bus.png';

export default function CommissionSettings() {
  const [rates, setRates] = useState({
    privateCar: 10,
    commercialCar: 12,
    commercialBus: 15,
  });

  const [isSaving, setIsSaving] = useState(false);
  const exampleFare = 5000;

  const handleRateChange = (vehicle, value) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0));
    setRates((prev) => ({
      ...prev,
      [vehicle]: num,
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Commission settings updated successfully!');
    }, 400);
  };

  return (
    <div className="space-y-4 sm:space-y-5 pb-6">
      {/* =========================================================
          1. TOP BANNER: PLATFORM COMMISSION
          ========================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50/90 via-amber-50/80 to-amber-100/60 border border-amber-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon + Title + Description */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Percent className="w-6 h-6 stroke-[2.8]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Platform Commission
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-0.5">
              Set commission percentage on the total ride fare for completed rides.
            </p>
          </div>
        </div>

        {/* Right: Active Status Badge */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-[#dcfce7] text-[#15803d] border border-emerald-200/80 shadow-2xs">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            Active
          </span>
        </div>

        {/* Soft Background Wave Decoration */}
        <div className="absolute right-0 bottom-0 pointer-events-none select-none opacity-20">
          <svg width="220" height="90" viewBox="0 0 220 90" fill="none">
            <path
              d="M0 90 C 80 40, 140 20, 220 0 L 220 90 Z"
              fill="#f59e0b"
            />
          </svg>
        </div>
      </div>

      {/* =========================================================
          2. MIDDLE ROW: VEHICLE-WISE COMMISSION & CALCULATION PREVIEW
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5">
        {/* Left Column: Vehicle-wise Commission (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Car className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Vehicle-wise Commission
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Set different commission rates for private and commercial vehicles.
                </p>
              </div>
            </div>

            {/* 3 Vehicle Rate Cards */}
            <div className="space-y-3">
              {/* Card 1: Private Car */}
              <div className="bg-[#fffdf0] border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-10 flex items-center justify-center shrink-0">
                    <img
                      src={carCutout}
                      alt="Private Car"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      Private Car
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      (Carpool / Ride Share)
                    </p>
                  </div>
                </div>

                {/* Number Input Box */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs shrink-0 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rates.privateCar}
                    onChange={(e) => handleRateChange('privateCar', e.target.value)}
                    className="w-10 text-center font-black text-slate-900 text-sm focus:outline-none"
                  />
                  <span className="text-sm font-bold text-slate-500 ml-1 select-none">
                    %
                  </span>
                </div>
              </div>

              {/* Card 2: Commercial Car */}
              <div className="bg-[#fffdf0] border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-10 flex items-center justify-center shrink-0">
                    <img
                      src={hatchbackCutout}
                      alt="Commercial Car"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      Commercial Car
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      (Taxi / Rental)
                    </p>
                  </div>
                </div>

                {/* Number Input Box */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs shrink-0 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rates.commercialCar}
                    onChange={(e) => handleRateChange('commercialCar', e.target.value)}
                    className="w-10 text-center font-black text-slate-900 text-sm focus:outline-none"
                  />
                  <span className="text-sm font-bold text-slate-500 ml-1 select-none">
                    %
                  </span>
                </div>
              </div>

              {/* Card 3: Commercial Bus */}
              <div className="bg-[#fffdf0] border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-10 flex items-center justify-center shrink-0">
                    <img
                      src={busCutout}
                      alt="Commercial Bus"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      Commercial Bus
                    </h4>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      (Bus / Intercity)
                    </p>
                  </div>
                </div>

                {/* Number Input Box */}
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs shrink-0 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200/50">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rates.commercialBus}
                    onChange={(e) => handleRateChange('commercialBus', e.target.value)}
                    className="w-10 text-center font-black text-slate-900 text-sm focus:outline-none"
                  />
                  <span className="text-sm font-bold text-slate-500 ml-1 select-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Commission Calculation Preview (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
                <Calculator className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Commission Calculation Preview
                </h3>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  Example: Total ride fare ₹{exampleFare.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-2xs">
              <table className="w-full text-left text-xs sm:text-[13px]">
                <thead>
                  <tr className="bg-[#feea98]/70 text-slate-900 font-black border-b border-amber-200/70">
                    <th className="py-2.5 px-4 font-black">Vehicle Type</th>
                    <th className="py-2.5 px-4 text-center font-black">Commission Rate</th>
                    <th className="py-2.5 px-4 text-right font-black">Commission Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold text-slate-900">
                  {/* Row 1: Private Car */}
                  <tr className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-700 stroke-[2.2]" />
                        <span>Private Car</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#fef9c3] text-black border border-amber-200/60 shadow-2xs">
                        {rates.privateCar}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm sm:text-base text-slate-900">
                      ₹{Math.round((exampleFare * rates.privateCar) / 100).toLocaleString()}
                    </td>
                  </tr>

                  {/* Row 2: Commercial Car */}
                  <tr className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-slate-700 stroke-[2.2]" />
                        <span>Commercial Car</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#fef9c3] text-black border border-amber-200/60 shadow-2xs">
                        {rates.commercialCar}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm sm:text-base text-slate-900">
                      ₹{Math.round((exampleFare * rates.commercialCar) / 100).toLocaleString()}
                    </td>
                  </tr>

                  {/* Row 3: Commercial Bus */}
                  <tr className="hover:bg-amber-50/20 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-slate-700 stroke-[2.2]" />
                        <span>Commercial Bus</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-[#fef9c3] text-black border border-amber-200/60 shadow-2xs">
                        {rates.commercialBus}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-sm sm:text-base text-slate-900">
                      ₹{Math.round((exampleFare * rates.commercialBus) / 100).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          3. BOTTOM CARD: PAYMENT & COMMISSION RULES
          ========================================================= */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
            <FileText className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
            Payment & Commission Rules
          </h3>
        </div>

        {/* 4 Rules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {/* Rule 1 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
              Commission will be charged only on completed rides.
            </p>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <X className="w-4 h-4 stroke-[3]" />
            </div>
            <p className="text-xs sm:text-[13px] font-semibold text-slate-700 leading-snug">
              No commission on cancelled rides.
            </p>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <CreditCard className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="text-xs sm:text-[13px] leading-snug">
              <span className="font-bold text-slate-900 block">Online Payment:</span>
              <span className="font-semibold text-slate-600">
                Commission is automatically deducted from the settlement.
              </span>
            </div>
          </div>

          {/* Rule 4 */}
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
              <Banknote className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="text-xs sm:text-[13px] leading-snug">
              <span className="font-bold text-slate-900 block">Cash Payment:</span>
              <span className="font-semibold text-slate-600">
                Driver will collect full fare from the passenger and pay the platform
                commission to admin (as per the set rate).
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
          disabled={isSaving}
          className="bg-[#fed011] hover:bg-[#fed011]/90 text-black font-extrabold text-sm sm:text-base px-12 py-3 rounded-2xl shadow-xs transition-all cursor-pointer flex items-center gap-2 active:scale-98 disabled:opacity-70"
        >
          <Check className="w-5 h-5 stroke-[3]" />
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );
}

