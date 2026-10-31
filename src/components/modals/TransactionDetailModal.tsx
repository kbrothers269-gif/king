import React from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  ShieldCheck,
  Download,
  RotateCcw,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
} from 'lucide-react';

export const TransactionDetailModal: React.FC = () => {
  const {
    selectedTransaction,
    setSelectedTransaction,
    refundTransaction,
    setIsSendOpen,
    setSendTargetContact,
    contacts,
  } = usePayPal();

  if (!selectedTransaction) return null;

  const txn = selectedTransaction;
  const isOutgoing = txn.amount < 0;
  const absAmount = Math.abs(txn.amount);

  const handleClose = () => setSelectedTransaction(null);

  const handleRepeatSend = () => {
    handleClose();
    const contact = contacts.find(c => c.name.toLowerCase() === txn.counterparty.toLowerCase());
    if (contact) {
      setSendTargetContact(contact);
    }
    setIsSendOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Transaction Details
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              {txn.id}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Hero Amount */}
          <div className="text-center py-2">
            <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center mb-3 bg-slate-100 dark:bg-slate-800">
              {txn.type === 'receive' || txn.type === 'refund' ? (
                <ArrowDownLeft className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              ) : txn.type === 'purchase' || txn.type === 'subscription' ? (
                <ShoppingBag className="w-7 h-7 text-[#0070BA] dark:text-sky-400" />
              ) : (
                <ArrowUpRight className="w-7 h-7 text-slate-700 dark:text-slate-300" />
              )}
            </div>

            <div
              className={`text-3xl font-extrabold tracking-tight tabular-nums ${
                txn.amount > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
              }`}
            >
              {txn.amount > 0 ? '+' : '-'}${absAmount.toFixed(2)} {txn.currency}
            </div>

            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">
              {txn.title}
            </div>
            <div className="text-xs text-slate-500">
              {txn.date}
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{txn.status}</span>
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Counterparty</span>
              <span className="font-semibold text-slate-900 dark:text-white">{txn.counterparty}</span>
            </div>

            {txn.counterpartyEmail && (
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient Email</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">{txn.counterpartyEmail}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Funding Method</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{txn.paymentMethod}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Fee charged</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {txn.fee > 0 ? `$${txn.fee.toFixed(2)}` : '$0.00 (Free)'}
              </span>
            </div>

            {txn.note && (
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2">
                <span className="text-slate-500">Note</span>
                <span className="italic font-medium text-slate-800 dark:text-slate-200 text-right max-w-[200px]">
                  &ldquo;{txn.note}&rdquo;
                </span>
              </div>
            )}

            {txn.pkrAmount && (
              <div className="flex justify-between bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl text-emerald-900 dark:text-emerald-200">
                <span className="font-semibold">PKR Converted Amount</span>
                <span className="font-extrabold tabular-nums">Rs {txn.pkrAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR</span>
              </div>
            )}

            {txn.exchangeRate && (
              <div className="flex justify-between">
                <span className="text-slate-500">Exchange Rate</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">1 USD = Rs {txn.exchangeRate.toFixed(2)} PKR</span>
              </div>
            )}

            {txn.easypaisaRef && (
              <div className="flex justify-between">
                <span className="text-slate-500">Easypaisa Ref</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{txn.easypaisaRef}</span>
              </div>
            )}

            {txn.invoiceId && (
              <div className="flex justify-between">
                <span className="text-slate-500">Invoice Ref</span>
                <span className="font-mono text-[#0070BA] dark:text-sky-400 font-semibold">{txn.invoiceId}</span>
              </div>
            )}
          </div>

          {/* Protection status */}
          {txn.protectionEligible && (
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <span className="font-bold block">PayPal Purchase Protection</span>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  This transaction is covered. If you didn&rsquo;t receive your item or it isn&rsquo;t as described, you can open a dispute.
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2 pt-1">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Official Receipt</span>
              </button>

              {isOutgoing && (
                <button
                  type="button"
                  onClick={handleRepeatSend}
                  className="flex-1 py-3 px-4 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Send Again</span>
                </button>
              )}
            </div>

            {/* Dispute / Refund simulation button if purchase or send */}
            {isOutgoing && txn.type !== 'refund' && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Request an instant demo refund for $${absAmount.toFixed(2)} back to your PayPal balance?`)) {
                    refundTransaction(txn.id);
                  }
                }}
                className="w-full py-2.5 text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 font-semibold rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Dispute / Instant Refund</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
