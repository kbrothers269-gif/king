import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  Camera,
  Share2,
  Download,
  Copy,
  Check,
  Store,
  Coffee,
  ShoppingBag,
} from 'lucide-react';

export const QRCodeModal: React.FC = () => {
  const { isQRCodeOpen, setIsQRCodeOpen, user, sendMoney } = usePayPal();
  const [activeTab, setActiveTab] = useState<'my_code' | 'scanner'>('my_code');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [scannerSuccess, setScannerSuccess] = useState<string | null>(null);

  if (!isQRCodeOpen) return null;

  const handleClose = () => {
    setIsQRCodeOpen(false);
    setScannerSuccess(null);
    setCustomAmount('');
  };

  const simulatedMerchants = [
    { name: 'Blue Bottle Coffee', amount: 6.25, icon: Coffee, desc: 'Single origin pour-over' },
    { name: 'Target Express #812', amount: 28.50, icon: Store, desc: 'Self-checkout register #4' },
    { name: 'Whole Foods Market', amount: 44.10, icon: ShoppingBag, desc: 'Fresh groceries & produce' },
  ];

  const handleSimulateScan = async (merchant: { name: string; amount: number; desc: string }) => {
    setScannerSuccess(`Processing payment to ${merchant.name}...`);
    try {
      await sendMoney({
        recipientName: merchant.name,
        recipientEmailOrTag: `${merchant.name.toLowerCase().replace(/\s+/g, '')}@merchant.paypal.com`,
        amount: merchant.amount,
        currency: 'USD',
        note: `In-Store QR Code payment: ${merchant.desc}`,
        fundingSourceId: 'balance',
        category: 'goods_services',
      });
      setScannerSuccess(`Paid $${merchant.amount.toFixed(2)} to ${merchant.name}!`);
      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch {
      setScannerSuccess('Failed to process payment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {activeTab === 'my_code' ? 'QR Code Payment' : 'Scan to Pay'}
            </h3>
            <p className="text-xs text-slate-500">
              Touch-free payments in person and in stores
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveTab('my_code')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'my_code'
                ? 'border-[#0070BA] text-[#0070BA] dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Show to Get Paid
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'scanner'
                ? 'border-[#0070BA] text-[#0070BA] dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'my_code' ? (
            <div className="text-center space-y-5">
              {/* Profile pill */}
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0 border border-slate-200 dark:border-slate-700">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-700">
                      {user.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                    {user.name}
                  </div>
                  <div className="text-xs text-[#0070BA] dark:text-sky-400 font-medium">
                    {user.tag}
                  </div>
                </div>
              </div>

              {/* Realistic SVG QR Code with high-fidelity modules */}
              <div className="inline-block p-4 bg-white rounded-3xl border-2 border-slate-100 shadow-md">
                <div className="relative w-52 h-52 bg-white flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" rx="4" fill="#003087" />
                    <rect x="8" y="8" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="12" y="12" width="12" height="12" rx="2" fill="#0070BA" />

                    <rect x="69" y="5" width="26" height="26" rx="4" fill="#003087" />
                    <rect x="72" y="8" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="76" y="12" width="12" height="12" rx="2" fill="#0070BA" />

                    <rect x="5" y="69" width="26" height="26" rx="4" fill="#003087" />
                    <rect x="8" y="72" width="20" height="20" rx="2" fill="#ffffff" />
                    <rect x="12" y="76" width="12" height="12" rx="2" fill="#0070BA" />

                    {/* QR Code data matrix pattern */}
                    <rect x="36" y="7" width="5" height="5" fill="#1E293B" />
                    <rect x="46" y="7" width="5" height="5" fill="#1E293B" />
                    <rect x="56" y="7" width="5" height="5" fill="#1E293B" />
                    <rect x="36" y="17" width="5" height="5" fill="#1E293B" />
                    <rect x="51" y="17" width="5" height="5" fill="#1E293B" />
                    <rect x="7" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="17" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="27" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="37" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="57" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="67" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="77" y="36" width="5" height="5" fill="#1E293B" />
                    <rect x="87" y="36" width="5" height="5" fill="#1E293B" />

                    <rect x="7" y="46" width="5" height="5" fill="#1E293B" />
                    <rect x="22" y="46" width="5" height="5" fill="#1E293B" />
                    <rect x="32" y="46" width="5" height="5" fill="#1E293B" />
                    <rect x="62" y="46" width="5" height="5" fill="#1E293B" />
                    <rect x="72" y="46" width="5" height="5" fill="#1E293B" />
                    <rect x="87" y="46" width="5" height="5" fill="#1E293B" />

                    <rect x="7" y="56" width="5" height="5" fill="#1E293B" />
                    <rect x="17" y="56" width="5" height="5" fill="#1E293B" />
                    <rect x="27" y="56" width="5" height="5" fill="#1E293B" />
                    <rect x="67" y="56" width="5" height="5" fill="#1E293B" />
                    <rect x="82" y="56" width="5" height="5" fill="#1E293B" />

                    <rect x="36" y="66" width="5" height="5" fill="#1E293B" />
                    <rect x="46" y="66" width="5" height="5" fill="#1E293B" />
                    <rect x="56" y="66" width="5" height="5" fill="#1E293B" />
                    <rect x="66" y="66" width="5" height="5" fill="#1E293B" />
                    <rect x="86" y="66" width="5" height="5" fill="#1E293B" />

                    <rect x="36" y="76" width="5" height="5" fill="#1E293B" />
                    <rect x="51" y="76" width="5" height="5" fill="#1E293B" />
                    <rect x="66" y="76" width="5" height="5" fill="#1E293B" />
                    <rect x="76" y="76" width="5" height="5" fill="#1E293B" />

                    <rect x="36" y="86" width="5" height="5" fill="#1E293B" />
                    <rect x="46" y="86" width="5" height="5" fill="#1E293B" />
                    <rect x="61" y="86" width="5" height="5" fill="#1E293B" />
                    <rect x="71" y="86" width="5" height="5" fill="#1E293B" />
                    <rect x="86" y="86" width="5" height="5" fill="#1E293B" />
                  </svg>

                  {/* PayPal Logo Badge in Center */}
                  <div className="absolute w-11 h-11 bg-white rounded-full shadow-md flex items-center justify-center border-2 border-[#0070BA]">
                    <span className="font-extrabold text-sm italic text-[#003087]">P</span>
                  </div>
                </div>
              </div>

              {/* Optional Amount Specification */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-left">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Specify amount to request (optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    placeholder="e.g. 15.00"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white tabular-nums"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://${user.paypalMeUrl}${customAmount ? `/${customAmount}` : ''}`);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="flex-1 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  title="Print / Save QR"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              {/* Simulated Camera Viewfinder */}
              <div className="relative w-full h-52 bg-slate-950 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-white border-2 border-slate-800">
                {/* Aiming Reticle */}
                <div className="relative w-36 h-36 border-2 border-dashed border-[#0070BA] rounded-2xl flex items-center justify-center">
                  {/* Laser Scan Animation */}
                  <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#00CFE8] to-transparent animate-pulse shadow-[0_0_8px_#00CFE8]" />
                  <span className="text-[11px] text-slate-400 font-mono">
                    Align QR in frame
                  </span>
                </div>

                {scannerSuccess && (
                  <div className="absolute inset-0 bg-slate-900/95 flex items-center justify-center p-4">
                    <span className="text-xs font-bold text-emerald-400 animate-in zoom-in-90">
                      {scannerSuccess}
                    </span>
                  </div>
                )}
              </div>

              {/* Simulated QR codes to tap & test */}
              <div className="text-left space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Simulated In-Store QR Terminals:
                </span>
                <div className="space-y-2">
                  {simulatedMerchants.map((m, idx) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSimulateScan(m)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0070BA] dark:text-sky-300 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              {m.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {m.desc}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-[#0070BA] dark:text-sky-400 block tabular-nums">
                            ${m.amount.toFixed(2)}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-[#0070BA] transition-colors">
                            Tap to Scan &rarr;
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
