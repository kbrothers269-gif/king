import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Building,
  Zap,
  Info,
  BadgeCheck,
} from 'lucide-react';

export const EasypaisaWithdrawModal: React.FC = () => {
  const {
    isEasypaisaOpen,
    setIsEasypaisaOpen,
    user,
    mobileWallets,
    withdrawToEasypaisa,
    usdToPkrRate,
  } = usePayPal();

  const [provider, setProvider] = useState<'easypaisa' | 'jazzcash' | 'raast'>('easypaisa');
  const [mobileNumber, setMobileNumber] = useState(user.easypaisaNumber || '0344-7234217');
  const [accountTitle, setAccountTitle] = useState(user.name.toUpperCase());
  const [usdAmountStr, setUsdAmountStr] = useState('100.00');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<any | null>(null);

  if (!isEasypaisaOpen) return null;

  const handleClose = () => {
    setIsEasypaisaOpen(false);
    setCompletedTxn(null);
  };

  const usdAmount = parseFloat(usdAmountStr) || 0;
  const pkrConverted = +(usdAmount * usdToPkrRate).toFixed(2);
  const maxUsd = user.balances.USD || 0;

  const handleQuickAmount = (val: number) => {
    setUsdAmountStr(val.toFixed(2));
  };

  const handleExecuteWithdrawal = async () => {
    if (usdAmount <= 0 || usdAmount > maxUsd || !mobileNumber.trim()) return;
    setIsProcessing(true);

    try {
      const txn = await withdrawToEasypaisa({
        usdAmount,
        mobileNumber: mobileNumber.trim(),
        accountTitle: accountTitle.trim() || user.name.toUpperCase(),
        provider,
        exchangeRate: usdToPkrRate,
      });
      setCompletedTxn(txn);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header with Easypaisa Green Header Banner */}
        <div className="bg-gradient-to-r from-[#00A859] via-[#008f4c] to-[#0070BA] p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white text-[#00A859] flex items-center justify-center font-black text-xl shadow-md shrink-0">
                EP
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight leading-tight">
                  Withdraw to Easypaisa
                </h3>
                <p className="text-xs text-white/90 font-medium">
                  ایزی پیسہ اکاؤنٹ میں فوری ٹرانسفر (Pakistan Instant Payout)
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* SBP Exemption Trust Pill */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/15 backdrop-blur-xs rounded-full px-3 py-1 text-xs text-white font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>State Bank of Pakistan (SBP) IT Remittance Exemption (0% Tax)</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {completedTxn ? (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-[#00A859] mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Rs {completedTxn.pkrAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR Sent!
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Transferred from your PayPal balance to {completedTxn.paymentMethod}
                </p>
              </div>

              {/* Simulated Pakistani SMS Alert */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 text-left border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="flex items-center gap-1 font-mono text-emerald-400">
                    <Smartphone className="w-3.5 h-3.5" />
                    SMS from 8558 (Easypaisa)
                  </span>
                  <span>Just now</span>
                </div>
                <p className="text-xs font-mono leading-relaxed text-slate-200">
                  Rs {completedTxn.pkrAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} received in your Easypaisa Mobile Account {mobileNumber} from PayPal International. New Balance: Rs {(user.balances.PKR).toLocaleString('en-US')}. TRX ID: {completedTxn.easypaisaRef}.
                </p>
              </div>

              {/* Official Payout Receipt */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{completedTxn.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Easypaisa Ref</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{completedTxn.easypaisaRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">USD Deducted</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">${Math.abs(completedTxn.amount).toFixed(2)} USD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Exchange Rate</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">1 USD = Rs {usdToPkrRate.toFixed(2)} PKR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transfer Fee</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Rs 0.00 (Free Promotional Rate)</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-bold text-xs rounded-full shadow transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-2">
                  Select Pakistani Payout Method
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'easypaisa', name: 'Easypaisa', subtitle: 'Telenor Bank', color: 'border-[#00A859]' },
                    { id: 'jazzcash', name: 'JazzCash', subtitle: 'Mobilink Bank', color: 'border-amber-600' },
                    { id: 'raast', name: 'Raast SBP', subtitle: 'Instant ID', color: 'border-emerald-700' },
                  ].map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setProvider(p.id as any);
                        if (p.id === 'easypaisa') setMobileNumber(user.easypaisaNumber || '0344-7234217');
                        if (p.id === 'jazzcash') setMobileNumber(user.jazzcashNumber || '0300-4491023');
                        if (p.id === 'raast') setMobileNumber(user.raastId || '923447234217@raast');
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        provider === p.id
                          ? 'border-[#00A859] bg-emerald-50/60 dark:bg-emerald-950/30 ring-2 ring-[#00A859]/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {p.subtitle}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Dual-Currency Input */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <span>Available PayPal USD Balance:</span>
                  <span className="font-extrabold text-[#0070BA] dark:text-sky-300 tabular-nums">
                    ${maxUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* USD Input */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      You Withdraw (USD)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        step="any"
                        min="1"
                        max={maxUsd}
                        value={usdAmountStr}
                        onChange={e => setUsdAmountStr(e.target.value)}
                        className="w-full pl-8 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-extrabold tabular-nums dark:text-white focus:ring-2 focus:ring-[#00A859]"
                      />
                    </div>
                  </div>

                  {/* PKR Calculated Output */}
                  <div>
                    <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                      Credited in Easypaisa (PKR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-600">Rs</span>
                      <div className="w-full pl-10 pr-3 py-2.5 bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-base font-extrabold tabular-nums text-emerald-800 dark:text-emerald-300">
                        {pkrConverted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick USD Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {[25, 50, 100, 250, 500].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAmount(val)}
                      className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-[#00A859] rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      ${val}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(maxUsd)}
                    className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-bold transition-colors ml-auto"
                  >
                    Withdraw All
                  </button>
                </div>

                {/* Exchange Rate Banner */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-700 pt-3">
                  <span>Live Conversion Rate:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    1 USD = Rs {usdToPkrRate.toFixed(2)} PKR
                  </span>
                </div>
              </div>

              {/* Mobile Account Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    {provider === 'easypaisa' ? 'Easypaisa Mobile Number' : provider === 'jazzcash' ? 'JazzCash Number' : 'Raast ID'}
                  </label>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>Instant Credit Verified</span>
                  </span>
                </div>

                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="0344-7234217"
                    value={mobileNumber}
                    onChange={e => setMobileNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold dark:text-white focus:ring-2 focus:ring-[#00A859]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Account Title (Recipient Name)
                  </label>
                  <input
                    type="text"
                    placeholder="MUHAMMAD AHMED"
                    value={accountTitle}
                    onChange={e => setAccountTitle(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase dark:text-white"
                  />
                </div>
              </div>

              {/* Transfer speed perk */}
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/80 rounded-2xl text-xs text-emerald-900 dark:text-emerald-200">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">Instant Delivery to Pakistan</span>
                  Funds arrive in your Easypaisa wallet in under 30 seconds with 24/7 SBP 1Link network integration.
                </div>
              </div>

              {/* Execute Button */}
              <button
                type="button"
                disabled={isProcessing || usdAmount <= 0 || usdAmount > maxUsd || !mobileNumber.trim()}
                onClick={handleExecuteWithdrawal}
                className="w-full py-4 bg-[#00A859] hover:bg-[#008f4c] text-white font-extrabold text-sm rounded-full shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 active:scale-98 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Connecting to Easypaisa Switch...</span>
                ) : usdAmount > maxUsd ? (
                  <span>Insufficient USD Balance</span>
                ) : (
                  <>
                    <span>Withdraw Rs {pkrConverted.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR to Easypaisa</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
