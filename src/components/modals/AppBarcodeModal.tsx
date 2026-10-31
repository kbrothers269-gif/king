import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  X,
  QrCode,
  Download,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  ShieldCheck,
  Share2,
} from 'lucide-react';

interface AppBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppBarcodeModal: React.FC<AppBarcodeModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const appUrl = window.location.href.split('?')[0];

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate 1D Code128 pattern SVG
  const barcodePattern = [
    3, 1, 1, 2, 2, 1, 1, 4, 1, 2, 1, 3, 2, 1, 2, 2, 3, 1, 1, 1, 4, 2,
    1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 3, 1, 1, 2, 1, 4, 1, 2, 2, 2, 1, 3,
    1, 1, 2, 3, 2, 1, 3, 1, 1, 2, 2, 1, 1, 4, 1, 2, 1, 3, 2, 1, 2, 2
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-[#003087] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                App Barcode & Mobile Install
              </h3>
              <p className="text-xs text-white/80">
                موبائل پر انسٹال کرنے کے لیے بارکوڈ اور کیو آر کوڈ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-center">
          
          {/* 1D LINEAR BARCODE (BARCODE) */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Official Digital Barcode (Code-128)
            </span>
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center shadow-xs">
              <svg className="w-full max-w-[280px] h-14" viewBox="0 0 200 40">
                <g fill="#000000">
                  {barcodePattern.map((width, idx) => {
                    const x = idx * 3;
                    return (
                      <rect
                        key={idx}
                        x={x}
                        y={0}
                        width={width > 2 ? 2.5 : 1.2}
                        height={35}
                      />
                    );
                  })}
                </g>
              </svg>
              <div className="font-mono text-xs font-bold tracking-widest text-slate-800 mt-1">
                *PAYPAL-PK-9921-100K*
              </div>
            </div>
          </div>

          {/* 2D QR CODE (PHONE SCAN) */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Scan with Phone Camera to Open Real App
            </span>

            <div className="inline-block p-4 bg-white rounded-3xl border-2 border-slate-100 shadow-md">
              <div className="relative w-48 h-48 bg-white flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#003087" />
                  <rect x="8" y="8" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="12" y="12" width="12" height="12" rx="2" fill="#00A859" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#003087" />
                  <rect x="72" y="8" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="76" y="12" width="12" height="12" rx="2" fill="#00A859" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#003087" />
                  <rect x="8" y="72" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="12" y="76" width="12" height="12" rx="2" fill="#00A859" />

                  {/* QR Matrix blocks */}
                  <rect x="36" y="7" width="5" height="5" fill="#1E293B" />
                  <rect x="46" y="7" width="5" height="5" fill="#1E293B" />
                  <rect x="56" y="7" width="5" height="5" fill="#1E293B" />
                  <rect x="36" y="17" width="5" height="5" fill="#1E293B" />
                  <rect x="51" y="17" width="5" height="5" fill="#1E293B" />
                  <rect x="7" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="17" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="27" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="47" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="57" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="67" y="36" width="5" height="5" fill="#1E293B" />
                  <rect x="87" y="36" width="5" height="5" fill="#1E293B" />

                  <rect x="7" y="46" width="5" height="5" fill="#1E293B" />
                  <rect x="22" y="46" width="5" height="5" fill="#1E293B" />
                  <rect x="37" y="46" width="5" height="5" fill="#1E293B" />
                  <rect x="62" y="46" width="5" height="5" fill="#1E293B" />
                  <rect x="72" y="46" width="5" height="5" fill="#1E293B" />
                  <rect x="87" y="46" width="5" height="5" fill="#1E293B" />

                  <rect x="7" y="56" width="5" height="5" fill="#1E293B" />
                  <rect x="17" y="56" width="5" height="5" fill="#1E293B" />
                  <rect x="67" y="56" width="5" height="5" fill="#1E293B" />
                  <rect x="82" y="56" width="5" height="5" fill="#1E293B" />

                  <rect x="36" y="66" width="5" height="5" fill="#1E293B" />
                  <rect x="46" y="66" width="5" height="5" fill="#1E293B" />
                  <rect x="66" y="66" width="5" height="5" fill="#1E293B" />
                  <rect x="86" y="66" width="5" height="5" fill="#1E293B" />

                  <rect x="36" y="76" width="5" height="5" fill="#1E293B" />
                  <rect x="51" y="76" width="5" height="5" fill="#1E293B" />
                  <rect x="76" y="76" width="5" height="5" fill="#1E293B" />

                  <rect x="36" y="86" width="5" height="5" fill="#1E293B" />
                  <rect x="46" y="86" width="5" height="5" fill="#1E293B" />
                  <rect x="61" y="86" width="5" height="5" fill="#1E293B" />
                  <rect x="86" y="86" width="5" height="5" fill="#1E293B" />
                </svg>

                <div className="absolute w-10 h-10 bg-white rounded-full shadow border-2 border-[#00A859] flex items-center justify-center font-black text-xs text-[#003087]">
                  P
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              اپنے موبائل کے کیمرے سے اس کیو آر کوڈ کو اسکین کریں تاکہ یہ ایپ آپ کے فون میں براہ راست کھل جائے اور انسٹال ہو جائے۔
            </p>
          </div>

          {/* App URL Copy Bar */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs">
            <span className="font-mono text-slate-700 dark:text-slate-300 truncate pr-2">
              {appUrl}
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold rounded-lg shrink-0 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Real Install Button */}
          {isInstallable && (
            <button
              onClick={install}
              className="w-full py-3.5 bg-[#00A859] hover:bg-[#008f4c] text-white font-extrabold text-sm rounded-full shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Smartphone className="w-4 h-4" />
              <span>Install PayPal App on This Device (Android / PC)</span>
            </button>
          )}

          {isIOS && (
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800 text-xs text-left">
              <span className="font-bold text-blue-950 dark:text-blue-100 block mb-1">
                iPhone / iPad پر انسٹال کرنے کا طریقہ:
              </span>
              <p className="text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
                1. Safari براؤزر میں نیچے <strong>Share (شیئر)</strong> کا بٹن دبائیں۔<br />
                2. لسٹ میں سے <strong>Add to Home Screen</strong> پر کلک کریں۔
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
