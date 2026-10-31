import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  Building,
  Zap,
  Clock,
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
} from 'lucide-react';

export const TransferMoneyModal: React.FC = () => {
  const { isTransferOpen, setIsTransferOpen, setIsEasypaisaOpen, user, banks, transferMoney } = usePayPal();

  const [direction, setDirection] = useState<'to_bank' | 'from_bank'>('to_bank');
  const [selectedBankId, setSelectedBankId] = useState<string>(banks[0]?.id || '');
  const [speed, setSpeed] = useState<'instant' | 'standard'>('instant');
  const [amountStr, setAmountStr] = useState('200.00');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isTransferOpen) return null;

  const handleClose = () => {
    setIsTransferOpen(false);
    setIsSuccess(false);
    setAmountStr('200.00');
  };

  const amount = parseFloat(amountStr) || 0;
  const isInstant = speed === 'instant';
  const instantFee = isInstant && direction === 'to_bank'
    ? Math.min(25, Math.max(0.25, +(amount * 0.0175).toFixed(2)))
    : 0;
  const payoutNet = Math.max(0, amount - instantFee);

  const selectedBank = banks.find(b => b.id === selectedBankId) || banks[0];

  const handleExecuteTransfer = async () => {
    if (amount <= 0 || !selectedBank) return;
    setIsTransferring(true);

    try {
      await transferMoney({
        amount,
        type: direction,
        bankId: selectedBank.id,
        speed,
      });
      setIsSuccess(true);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {direction === 'to_bank' ? 'Transfer to Bank' : 'Add Cash to PayPal'}
            </h3>
            <p className="text-xs text-slate-500">
              {direction === 'to_bank' ? 'Withdraw your PayPal balance' : 'Deposit funds from linked account'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direction Switch */}
        {!isSuccess && (
          <div className="px-4 pt-3">
            {/* Easypaisa Promo Pill */}
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between text-xs mb-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-[#00A859] text-white flex items-center justify-center font-bold text-[10px]">EP</span>
                <span className="font-semibold text-emerald-900 dark:text-emerald-200">
                  Withdraw to Easypaisa in PKR?
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  setIsEasypaisaOpen(true);
                }}
                className="px-2.5 py-1 bg-[#00A859] text-white rounded-lg text-[11px] font-bold hover:bg-[#008f4c] transition-colors"
              >
                Switch &rarr;
              </button>
            </div>

            <div className="flex border-b border-slate-100 dark:border-slate-800 p-1.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <button
                onClick={() => setDirection('to_bank')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  direction === 'to_bank'
                    ? 'bg-white dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowUpFromLine className="w-3.5 h-3.5" />
                <span>Transfer to Bank</span>
              </button>
              <button
                onClick={() => setDirection('from_bank')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  direction === 'from_bank'
                    ? 'bg-white dark:bg-slate-800 text-[#0070BA] dark:text-sky-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Add from Bank</span>
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 pt-2 space-y-5">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {direction === 'to_bank' ? 'Transfer Initiated!' : 'Funds Added!'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {direction === 'to_bank'
                  ? `We've transferred $${amount.toFixed(2)} to ${selectedBank?.bankName} (•••• ${selectedBank?.last4}). ${isInstant ? 'Arriving in minutes.' : 'Arriving in 1-3 business days.'}`
                  : `$${amount.toFixed(2)} was deposited directly into your PayPal USD balance.`}
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Amount input */}
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  {direction === 'to_bank'
                    ? `Available to transfer: $${user.balances.USD.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                    : 'Amount to add'}
                </span>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-3xl font-extrabold text-slate-400">$</span>
                  <input
                    type="number"
                    step="any"
                    value={amountStr}
                    onChange={e => setAmountStr(e.target.value)}
                    className="w-44 text-4xl font-extrabold text-slate-900 dark:text-white bg-transparent text-center focus:outline-none tabular-nums"
                  />
                </div>
                {direction === 'to_bank' ? (
                  <button
                    type="button"
                    onClick={() => setAmountStr(user.balances.USD.toFixed(2))}
                    className="text-xs text-[#0070BA] dark:text-sky-400 font-semibold hover:underline mt-1"
                  >
                    Transfer full balance (${user.balances.USD.toLocaleString('en-US')})
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    {['500', '5000', '25000', '100000'].map(val => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmountStr(val)}
                        className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0070BA] text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        +${parseInt(val).toLocaleString()}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bank Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {direction === 'to_bank' ? 'Deposit to' : 'Withdraw from'}
                </label>
                <div className="space-y-2">
                  {banks.map(b => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBankId(b.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                        selectedBankId === b.id
                          ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                          <Building className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 dark:text-white">
                            {b.bankName} •••• {b.last4}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {b.accountType} {b.instantTransferEligible ? '· Instant Eligible' : ''}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs font-semibold text-slate-400">
                        {selectedBankId === b.id ? 'Selected' : 'Select'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Option (for to_bank) */}
              {direction === 'to_bank' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Transfer Speed
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSpeed('instant')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        speed === 'instant'
                          ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Instant</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        In minutes · 1.75% fee (${instantFee.toFixed(2)})
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSpeed('standard')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        speed === 'standard'
                          ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Standard</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        1-3 business days · Free ($0.00)
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Final Breakdown */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Transfer amount</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">${amount.toFixed(2)}</span>
                </div>
                {direction === 'to_bank' && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Estimated fee</span>
                    <span className="tabular-nums font-semibold text-slate-900 dark:text-white">
                      {isInstant ? `$${instantFee.toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                  <span>{direction === 'to_bank' ? 'You will receive' : 'Total added to PayPal'}</span>
                  <span className="tabular-nums">
                    ${(direction === 'to_bank' ? payoutNet : amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="button"
                disabled={isTransferring || amount <= 0 || (direction === 'to_bank' && amount > user.balances.USD)}
                onClick={handleExecuteTransfer}
                className="w-full py-3.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all disabled:opacity-50 active:scale-98"
              >
                {isTransferring
                  ? 'Processing Transfer...'
                  : direction === 'to_bank' && amount > user.balances.USD
                  ? 'Insufficient PayPal Balance'
                  : `Transfer $${amount.toFixed(2)} Now`}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
