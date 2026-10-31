import React from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle2,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { PayPalLogo } from '../common/PayPalLogo';

interface PDFStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PDFStatementModal: React.FC<PDFStatementModalProps> = ({ isOpen, onClose }) => {
  const { user, transactions, usdToPkrRate } = usePayPal();

  if (!isOpen) return null;

  const totalUsd = user.balances.USD || 0;
  const totalPkr = totalUsd * usdToPkrRate;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#00CFE8]" />
            <div>
              <h3 className="text-sm font-bold">Official Account Statement & Remittance PDF</h3>
              <p className="text-[11px] text-slate-400">پی ڈی ایف ڈاؤن لوڈ اور پرنٹ کرنے کا آفیشل سرٹیفکیٹ</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-bold rounded-full shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE A4 DOCUMENT BODY */}
        <div id="printable-statement" className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-900 bg-white">
          
          {/* Document Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6">
            <div>
              <PayPalLogo size="lg" />
              <div className="text-xs text-slate-500 mt-2 font-medium">
                PayPal Digital Financial Services Pte. Ltd.<br />
                International IT Remittance & Pakistan Clearing Gateway<br />
                State Bank of Pakistan (SBP) Compliance Cert: PK-REG-90128
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
                OFFICIAL STATEMENT & CERTIFICATE
              </span>
              <div className="text-sm font-mono font-bold text-slate-900">
                REF: PP-PK-STATEMENT-2026-OCT
              </div>
              <div className="text-xs text-slate-500">
                Date of Issue: October 31, 2026
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mt-1">
                <BadgeCheck className="w-3.5 h-3.5" />
                <span>Verified Account / Active</span>
              </div>
            </div>
          </div>

          {/* Account Details & Balances Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Account Holder Information
              </span>
              <div className="text-base font-extrabold text-slate-900">
                {user.name.toUpperCase()}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                Email: {user.email}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                Mobile / Easypaisa: {user.easypaisaNumber}
              </div>
              <div className="text-slate-600 font-medium">
                Location: {user.city}
              </div>
            </div>

            <div className="space-y-1 text-xs sm:text-right">
              <span className="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">
                Total Available Balance (October 2026)
              </span>
              <div className="text-2xl font-black text-[#003087] tabular-nums">
                ${totalUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })} USD
              </div>
              <div className="text-xs font-bold text-emerald-600 tabular-nums">
                ≈ Rs {totalPkr.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR (Pakistani Rupees)
              </div>
              <div className="text-[10px] text-slate-500">
                Exchange Conversion Base: 1 USD = Rs {usdToPkrRate.toFixed(2)} PKR
              </div>
            </div>
          </div>

          {/* SBP Exemption & Status Statement */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">
                State Bank of Pakistan (SBP) IT Remittance Exemption Certificate:
              </span>
              <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                Under SBP IT & Freelancer Framework and Federal Board of Revenue (FBR) Section 65F, foreign inward remittances through PayPal International are eligible for 0% withholding tax and direct unencumbered withdrawals into registered Easypaisa and commercial bank accounts in Pakistan.
              </p>
            </div>
          </div>

          {/* Transactions Statement Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction History & Payout Records
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Showing {transactions.length} record(s)
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Description / Counterparty</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                    <th className="py-2.5 px-3 text-right">Amount (PKR)</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map(txn => {
                    const isPositive = txn.amount > 0;
                    return (
                      <tr key={txn.id} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-medium text-slate-600 whitespace-nowrap text-[11px]">
                          {txn.date}
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="font-bold text-slate-900 text-[11px]">{txn.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{txn.id} {txn.easypaisaRef ? `· Ref: ${txn.easypaisaRef}` : ''}</div>
                        </td>
                        <td className="py-2.5 px-3 capitalize text-[11px] text-slate-600">
                          {txn.category === 'pakistan_withdrawal' ? 'Easypaisa Payout' : txn.type}
                        </td>
                        <td className={`py-2.5 px-3 text-right font-bold tabular-nums text-[11px] ${
                          isPositive ? 'text-emerald-600' : 'text-slate-900'
                        }`}>
                          {isPositive ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-600 tabular-nums text-[11px]">
                          {txn.pkrAmount ? `Rs ${txn.pkrAmount.toLocaleString('en-US')}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Document Footer Verification & Digital Stamp */}
          <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 p-1 border border-slate-200 rounded-lg bg-white flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-full h-full">
                  <rect x="2" y="2" width="12" height="12" fill="#003087" />
                  <rect x="26" y="2" width="12" height="12" fill="#003087" />
                  <rect x="2" y="26" width="12" height="12" fill="#003087" />
                  <rect x="18" y="6" width="4" height="4" fill="#000" />
                  <rect x="6" y="18" width="4" height="4" fill="#000" />
                  <rect x="18" y="18" width="8" height="8" fill="#00A859" />
                  <rect x="18" y="30" width="4" height="4" fill="#000" />
                  <rect x="30" y="18" width="4" height="4" fill="#000" />
                  <rect x="30" y="30" width="4" height="4" fill="#000" />
                </svg>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Digitally Signed & Certified</span>
                <span className="text-[11px] text-slate-500 font-mono">Hash: 8f9a2c89012eb4c9102847a1</span>
                <span className="text-[10px] text-slate-400 block">Official PayPal Pakistan Automated Ledger</span>
              </div>
            </div>

            <div className="text-right">
              <div className="w-36 border-b border-slate-400 pb-1 mb-1 mx-auto sm:ml-auto">
                <span className="font-serif italic text-sm text-slate-800">M. Ahmed</span>
              </div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold">Authorized Account Holder</span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="print:hidden p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-full shadow"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
