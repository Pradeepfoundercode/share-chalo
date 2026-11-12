import React from 'react';
import vehicleDocumentIcon from '../../assets/drivers/f5a5f448-ccdf-4eed-ac86-f5f78f3ddfd3 8.svg';
import driverKycIcon from '../../assets/drivers/Group-9-f29c03.svg';
import {
  Check,
  Eye,
  Download
} from 'lucide-react';

import docDlPreview from '../../assets/doc_dl_preview.png';
import docAadhaarPreview from '../../assets/doc_aadhaar_preview.png';
import docSelfiePreview from '../../assets/doc_selfie_preview.png';
import docRcPreview from '../../assets/Screenshot 2026-11-05 120222.png';
import docInsurancePreview from '../../assets/Screenshot 2026-11-05 120222.png';
import docPucPreview from '../../assets/Screenshot 2026-11-05 120222.png';
import docCommercialPermitPreview from '../../assets/Screenshot 2026-11-05 120222.png';
import docFitnessPreview from '../../assets/Screenshot 2026-11-05 120222.png';
import docRoutePermitPreview from '../../assets/Screenshot 2026-11-05 120222.png';

export default function KycDocumentsTab({ driver }) {
  const isBus = driver.vehicleType === 'Commercial Bus';

  const kycDocs = [
    {
      id: 'dl',
      title: 'Driving Licence',
      number: `DL No.: ${driver.dlNo || 'BR012345678901'}`,
      validity: `Valid Till: ${driver.dlValidity || '14 Aug 2030'}`,
      status: 'Approved',
      previewImg: docDlPreview,
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'aadhaar',
      title: 'Identity Proof (Aadhaar)',
      number: `Aadhaar No.: ${driver.aadhaarNo || 'XXXX-XXXX-6789'}`,
      validity: null,
      status: 'Approved',
      previewImg: docAadhaarPreview,
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'selfie',
      title: 'Selfie / Live Photo',
      subtitle: 'Verified at the time of registration',
      status: 'Approved',
      previewImg: docSelfiePreview,
      hasDownload: false,
      hasView: true,
      isSelfie: true,
    },
  ];

  const vehicleDocs = isBus
    ? [
        {
          id: 'rc',
          title: 'RC (Registration Certificate)',
          subtitle: `Reg. No.: ${driver.regNo || driver.plate || 'BR01PC7890'}`,
          status: 'Approved',
          previewImg: docRcPreview,
        },
        {
          id: 'insurance',
          title: 'Insurance',
          detail1: 'Policy No.: ICICI/4567890',
          detail2: 'Valid Till: 20 Sep 2027',
          status: 'Approved',
          previewImg: docInsurancePreview,
        },
        {
          id: 'puc',
          title: 'PUC (Pollution Under Control)',
          detail1: 'Certificate No.: PUC/BR/2026/12345',
          detail2: 'Valid Till: 18 Mar 2027',
          status: 'Approved',
          previewImg: docPucPreview,
        },
        {
          id: 'commercial_permit',
          title: 'Commercial Permit',
          detail1: 'Permit No.: CP/BR/2026/6789',
          detail2: 'Valid Till: 31 Dec 2027',
          status: 'Approved',
          previewImg: docCommercialPermitPreview,
        },
        {
          id: 'fitness',
          title: 'Fitness Certificate',
          detail1: 'Certificate No.: FC/BR/2026/4456',
          detail2: 'Valid Till: 31 Dec 2027',
          status: 'Approved',
          previewImg: docFitnessPreview,
        },
        {
          id: 'route_permit',
          title: 'Route Permit',
          detail1: 'Permit No.: RP/BR/2026/7788',
          detail2: 'Route: Patna - Ranchi - Dhanbad',
          status: 'Approved',
          previewImg: docRoutePermitPreview,
        },
      ]
    : [
        {
          id: 'rc',
          title: 'RC (Registration Certificate)',
          subtitle: `Reg. No.: ${driver.regNo || driver.plate || 'BR01PB4567'}`,
          status: 'Approved',
          previewImg: docRcPreview,
        },
        {
          id: 'insurance',
          title: 'Insurance',
          detail1: 'Policy No.: HDFC/9876543',
          detail2: 'Valid Till: 15 Oct 2027',
          status: 'Approved',
          previewImg: docInsurancePreview,
        },
        {
          id: 'puc',
          title: 'PUC (Pollution Under Control)',
          detail1: 'Certificate No.: PUC/BR/2026/8899',
          detail2: 'Valid Till: 05 Jun 2027',
          status: 'Approved',
          previewImg: docPucPreview,
        },
      ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start">
      {/* =========================================================
          LEFT CARD: KYC Documents (Driver) - col-span-6
          ========================================================= */}
      <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 flex items-center justify-center shrink-0">
            <img src={driverKycIcon} alt="KYC Documents (Driver)" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-black">
            KYC Documents (Driver)
          </h3>
        </div>

        {/* List of KYC items */}
        <div className="space-y-3 sm:space-y-4 pt-1">
          {kycDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 transition-all gap-2 sm:gap-3"
            >
              {/* Top/Left preview + text */}
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 w-full">
                {/* Document Thumbnail Preview (Responsive sizing) */}
                <div className="shrink-0 w-16 h-12 sm:w-24 sm:h-15 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center p-0.5">
                  <img
                    src={doc.previewImg}
                    alt={doc.title}
                    className={`w-full h-full ${doc.isSelfie ? 'object-cover' : 'object-contain'} rounded-lg`}
                  />
                </div>

                {/* Details (Truncated on mobile to prevent overflow) */}
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

              {/* Bottom/Right Action buttons & status tag (Stacks on mobile) */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 mt-1 sm:mt-0 border-t sm:border-0 border-slate-200/50 shrink-0 gap-2.5">
                <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                  {doc.status}
                </span>

                <div className="flex items-center gap-1">
                  {doc.hasView && (
                    <button
                      className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                      title="View Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {doc.hasDownload && (
                    <button
                      className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                      title="Download Document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================
          RIGHT CARD: Vehicle Documents - col-span-6
          ========================================================= */}
      <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-4.5 border border-slate-200/80 shadow-xs space-y-2.5">
        {/* Card Header */}
        <div className="flex items-center gap-2.5 pb-1.5 border-b border-slate-100">
          <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
            <img src={vehicleDocumentIcon} alt="Vehicle Documents" className="w-full h-full object-contain" />
          </div>
          <h3 className="text-sm sm:text-base font-black text-black">
            Vehicle Documents ({isBus ? 'Commercial Bus' : 'Private Car'})
          </h3>
        </div>

        {/* List of Vehicle Documents */}
        <div className="space-y-2.5 sm:space-y-2 pt-0.5">
          {vehicleDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 transition-all gap-2 sm:gap-2.5"
            >
              {/* Top/Left preview + text */}
              <div className="flex items-center gap-3 min-w-0 w-full">
                {/* Thumbnail Preview */}
                <div className="shrink-0 w-14 h-10 sm:w-16 sm:h-11 rounded-lg sm:rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center p-0.5">
                  <img
                    src={doc.previewImg}
                    alt={doc.title}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-sm sm:text-base font-black text-black leading-tight truncate">
                    {doc.title}
                  </h4>

                  {doc.subtitle && (
                    <p className="text-[11px] sm:text-[13px] font-bold text-slate-800 truncate">
                      {doc.subtitle}
                    </p>
                  )}

                  {doc.detail1 && (
                    <p className="text-[11px] sm:text-[13px] font-semibold text-slate-700 leading-tight truncate">
                      {doc.detail1}
                    </p>
                  )}

                  {doc.detail2 && (
                    <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 leading-tight truncate">
                      {doc.detail2}
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom/Right Action buttons & status tag */}
              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto pt-2 sm:pt-0 mt-1 sm:mt-0 border-t sm:border-0 border-slate-200/50 shrink-0 gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Check className="w-3 h-3 stroke-[3]" />
                  {doc.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                    title="View Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    className="p-1.5 hover:bg-slate-200/60 rounded-full transition-colors text-slate-600 hover:text-black cursor-pointer"
                    title="Download Document"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}