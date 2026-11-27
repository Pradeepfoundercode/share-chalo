import React, { useState } from 'react';
import vehicleDocumentIcon from '../../assets/drivers/vehicle-document.svg';
import driverKycIcon from '../../assets/drivers/Group-9-f29c03.svg';
import {
  Check,
  Eye,
  Download,
  X
} from 'lucide-react';

export default function KycDocumentsTab({ driver }) {
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const handleDownload = async (url, title) => {
    if (!url) return;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      const extension = url.split('.').pop()?.split(/[?#]/)[0] || 'jpg';
      const cleanTitle = (title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.download = `${cleanTitle}_${driver.id || 'doc'}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback for CORS or direct navigation
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.download = `${(title || 'document').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  const isBus =
    driver.vehicleCategory?.toLowerCase() === 'bus' ||
    (driver.vehicleType || '').toLowerCase().includes('bus');

  const kycDocs = [
    {
      id: 'dl',
      title: 'Driving Licence',
      number: `DL No.: ${driver.dlNo || '-'}`,
      validity: `Valid Till: ${driver.dlValidity || '-'}`,
      status: driver.kycStatus ? (driver.kycStatus.charAt(0).toUpperCase() + driver.kycStatus.slice(1)) : 'Approved',
      previewImg: driver.dlImageUrl || '',
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'aadhaar',
      title: 'Identity Proof (Aadhaar)',
      number: `Aadhaar No.: ${driver.aadhaarNo || 'XXXX-XXXX-6789'}`,
      validity: null,
      status: driver.kycStatus ? (driver.kycStatus.charAt(0).toUpperCase() + driver.kycStatus.slice(1)) : 'Approved',
      previewImg: driver.identityProofUrl || '',
      hasDownload: true,
      hasView: true,
    },
    {
      id: 'selfie',
      title: 'Selfie / Live Photo',
      subtitle: 'Verified at the time of registration',
      status: driver.profileStatus ? (driver.profileStatus.charAt(0).toUpperCase() + driver.profileStatus.slice(1)) : 'Approved',
      previewImg: driver.avatar || '',
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
        subtitle: `Reg. No.: ${driver.regNo || driver.plate || '-'}`,
        status: driver.vehicleStatus ? (driver.vehicleStatus.charAt(0).toUpperCase() + driver.vehicleStatus.slice(1)) : 'Approved',
        previewImg: driver.rcUrl || '',
      },
      {
        id: 'insurance',
        title: 'Insurance',
        detail1: 'Policy No.: ICICI/4567890',
        detail2: 'Valid Till: 20 Sep 2027',
        status: 'Approved',
        previewImg: driver.insuranceUrl || '',
      },
      {
        id: 'puc',
        title: 'PUC (Pollution Under Control)',
        detail1: 'Certificate No.: PUC/BR/2026/12345',
        detail2: 'Valid Till: 18 Mar 2027',
        status: 'Approved',
        previewImg: driver.pucCertificateUrl || '',
      },
      {
        id: 'commercial_permit',
        title: 'Commercial Permit',
        detail1: 'Permit No.: CP/BR/2026/6789',
        detail2: `Valid Till: ${driver.permitValidity || '-'}`,
        status: 'Approved',
        previewImg: driver.permitUrl || '',
      },
      {
        id: 'fitness',
        title: 'Fitness Certificate',
        detail1: 'Certificate No.: FC/BR/2026/4456',
        detail2: 'Valid Till: 31 Dec 2027',
        status: 'Approved',
        previewImg: driver.fitnessCertificateUrl || '',
      },
      {
        id: 'route_permit',
        title: 'Route Permit',
        detail1: 'Permit No.: RP/BR/2026/7788',
        detail2: 'Route: Intercity Express',
        status: 'Approved',
        previewImg: driver.routePermitUrl || '',
      },
    ]
    : [
      {
        id: 'rc',
        title: 'RC (Registration Certificate)',
        subtitle: `Reg. No.: ${driver.regNo || driver.plate || '-'}`,
        status: driver.vehicleStatus ? (driver.vehicleStatus.charAt(0).toUpperCase() + driver.vehicleStatus.slice(1)) : 'Approved',
        previewImg: driver.rcUrl || '',
      },
      {
        id: 'insurance',
        title: 'Insurance',
        detail1: 'Policy No.: HDFC/9876543',
        detail2: 'Valid Till: 15 Oct 2027',
        status: 'Approved',
        previewImg: driver.insuranceUrl || '',
      },
      {
        id: 'puc',
        title: 'PUC (Pollution Under Control)',
        detail1: 'Certificate No.: PUC/BR/2026/8899',
        detail2: 'Valid Till: 05 Jun 2027',
        status: 'Approved',
        previewImg: driver.pucCertificateUrl || '',
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
                      onClick={() => doc.previewImg && setPreviewPhoto({ img: doc.previewImg, title: doc.title })}
                      disabled={!doc.previewImg}
                      className={`p-1.5 rounded-full transition-colors ${doc.previewImg
                        ? 'hover:bg-slate-200/60 text-slate-600 hover:text-black cursor-pointer'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                      title={doc.previewImg ? 'View Document' : 'No document image available'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                  {doc.hasDownload && (
                    <button
                      onClick={() => doc.previewImg && handleDownload(doc.previewImg, doc.title)}
                      disabled={!doc.previewImg}
                      className={`p-1.5 rounded-full transition-colors ${doc.previewImg
                        ? 'hover:bg-slate-200/60 text-slate-600 hover:text-black cursor-pointer'
                        : 'text-slate-300 cursor-not-allowed'
                        }`}
                      title={doc.previewImg ? 'Download Document' : 'No document available to download'}
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
                    onClick={() => doc.previewImg && setPreviewPhoto({ img: doc.previewImg, title: doc.title })}
                    disabled={!doc.previewImg}
                    className={`p-1.5 rounded-full transition-colors ${doc.previewImg
                      ? 'hover:bg-slate-200/60 text-slate-600 hover:text-black cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                      }`}
                    title={doc.previewImg ? 'View Document' : 'No document image available'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => doc.previewImg && handleDownload(doc.previewImg, doc.title)}
                    disabled={!doc.previewImg}
                    className={`p-1.5 rounded-full transition-colors ${doc.previewImg
                      ? 'hover:bg-slate-200/60 text-slate-600 hover:text-black cursor-pointer'
                      : 'text-slate-300 cursor-not-allowed'
                      }`}
                    title={doc.previewImg ? 'Download Document' : 'No document available to download'}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full Preview Modal (Exact match to Pending Verification View) */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 flex flex-col items-center animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h4 className="text-base font-black text-black">
                {previewPhoto.title || 'Document Preview'}
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(previewPhoto.img, previewPhoto.title)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewPhoto(null)}
                  className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-full max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 border border-slate-200 p-2">
              <img
                src={previewPhoto.img}
                alt={previewPhoto.title || 'Preview'}
                className="max-h-[66vh] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}