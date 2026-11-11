import React from 'react';
import {
  User,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* =========================================================
          LEFT CARD: KYC Documents (Driver) - col-span-6
          ========================================================= */}
      <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-base font-black text-black">
            KYC Documents (Driver)
          </h3>
        </div>

        {/* List of KYC items */}
        <div className="space-y-4 pt-1">
          {kycDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 transition-all gap-3"
            >
              {/* Left preview + text */}
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Document Thumbnail Preview */}
                <div className="shrink-0 w-24 h-15 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center p-0.5">
                  <img
                    src={doc.previewImg}
                    alt={doc.title}
                    className={`w-full h-full ${doc.isSelfie ? 'object-cover' : 'object-contain'} rounded-lg`}
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-sm font-black text-black leading-tight">
                    {doc.title}
                  </h4>

                  {doc.number && (
                    <p className="text-xs font-semibold text-slate-800">
                      {doc.number}
                    </p>
                  )}

                  {doc.validity && (
                    <p className="text-xs font-medium text-slate-500">
                      {doc.validity}
                    </p>
                  )}

                  {doc.subtitle && (
                    <p className="text-xs font-medium text-slate-500">
                      {doc.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action buttons & status tag */}
              <div className="shrink-0 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  {doc.status}
                </span>

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
          ))}
        </div>
      </div>

      {/* =========================================================
          RIGHT CARD: Vehicle Documents (Commercial Bus / Private Car) - col-span-6
          ========================================================= */}
      <div className="lg:col-span-6 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* Card Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <div className="p-1.5 bg-amber-100/70 rounded-xl text-amber-700">
            {isBus ? (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="18" height="15" rx="2" />
                <circle cx="7.5" cy="18" r="2" />
                <circle cx="16.5" cy="18" r="2" />
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            )}
          </div>
          <h3 className="text-base font-black text-black">
            Vehicle Documents ({isBus ? 'Commercial Bus' : 'Private Car'})
          </h3>
        </div>

        {/* List of Vehicle Documents */}
        <div className="space-y-3 pt-1">
          {vehicleDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:border-slate-300 transition-all gap-3"
            >
              {/* Left preview + text */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Thumbnail Preview */}
                <div className="shrink-0 w-16 h-11 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs flex items-center justify-center p-0.5">
                  <img
                    src={doc.previewImg}
                    alt={doc.title}
                    className="w-full h-full object-contain rounded-md"
                  />
                </div>

                {/* Details */}
                <div className="space-y-0.5 min-w-0">
                  <h4 className="text-xs sm:text-[13px] font-black text-black leading-tight">
                    {doc.title}
                  </h4>

                  {doc.subtitle && (
                    <p className="text-[11px] font-bold text-slate-800">
                      {doc.subtitle}
                    </p>
                  )}

                  {doc.detail1 && (
                    <p className="text-[11px] font-semibold text-slate-700 leading-tight">
                      {doc.detail1}
                    </p>
                  )}

                  {doc.detail2 && (
                    <p className="text-[10px] font-medium text-slate-500 leading-tight">
                      {doc.detail2}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Action buttons & status tag */}
              <div className="shrink-0 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Check className="w-3 h-3 stroke-[3]" />
                  {doc.status}
                </span>

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
          ))}
        </div>
      </div>
    </div>
  );
}

