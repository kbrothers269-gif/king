import React from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  QrCode,
  Building2,
  Plus,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Sparkles,
  CreditCard,
  Lock,
  ArrowRight,
  TrendingUp,
  Smartphone,
  Zap,
  FileText,
} from 'lucide-react';
import { Contact, Transaction, Currency } from '../../types/paypal';

export const DashboardView: React.FC = () => {
  const {
    user,
    contacts,
    cards,
    mobileWallets,
    transactions,
    setIsSendOpen,
    setIsRequestOpen,
    setIsTransferOpen,
    setIsEasypaisaOpen,
    setIsPDFOpen,
    setIsBarcodeOpen,
    setIsQRCodeOpen,
    setIsAddCardOpen,
    setSelectedTransaction,
    setSendTargetContact,
    setCurrentTab,
    activeCurrency,
    setActiveCurrency,
    usdToPkrRate,
  } = usePayPal();

  const handleContactClick = (c: Contact) => {
    setSendTargetContact(c);
    setIsSendOpen(true);
  };

  const recentTransactions = transactions.slice(0, 6);

  const currencySymbols: Record<Currency, string> = {
    USD: '$',
    PKR: 'Rs ',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    JPY: '¥',
  };

  const activeBalance = user.balances[activeCurrency] ?? 0;
  const pkrEquivalent = (user.balances.USD || 0) * usdToPkrRate;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner: Pakistan Freelance & Easypaisa Integration Alert */}
      <div className="bg-gradient-to-r from-emerald-600 via-[#00A859] to-[#0070BA] rounded-2xl p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white text-[#00A859] flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
            EP
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-tight">
                PayPal Pakistan Enabled · پاکستان میں فعال
              </span>
              <span className="bg-white/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Active
              </span>
            </div>
            <p className="text-xs text-white/90 mt-0.5">
              Receive international client payments in USD/EUR & withdraw directly to Easypaisa in Pakistani Rupees (PKR) at Rs {usdToPkrRate.toFixed(2)}/USD.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsEasypaisaOpen(true)}
            className="px-4 py-2 bg-white text-[#008f4c] hover:bg-slate-50 font-extrabold text-xs rounded-full shadow transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span>Withdraw to Easypaisa</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPDFOpen(true)}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-full border border-white/25 backdrop-blur-xs transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
            title="Download Official Account Statement & Tax Certificate (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-rose-300" />
            <span>PDF Statement</span>
          </button>

          <button
            type="button"
            onClick={() => setIsBarcodeOpen(true)}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-full border border-white/25 backdrop-blur-xs transition-all active:scale-95 whitespace-nowrap flex items-center gap-1.5"
            title="App Barcode & Install QR"
          >
            <QrCode className="w-3.5 h-3.5 text-[#00CFE8]" />
            <span>App Barcode</span>
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Layout: Left Main Column + Right Side Wallet & Perks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (8 cols): Balance Hero, Quick Contacts, Recent Activity */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Balance Hero Card */}
          <div className="relative bg-gradient-to-br from-[#003087] via-[#00457C] to-[#0070BA] rounded-3xl p-6 sm:p-8 text-white shadow-xl overflow-hidden">
            {/* Ambient Background Circles */}
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-xl" />
            <div className="absolute right-12 -bottom-20 w-80 h-80 rounded-full bg-[#00CFE8]/10 pointer-events-none blur-2xl" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                  <span>PayPal Balance</span>
                  <span className="text-white/40">·</span>
                  <div className="inline-flex bg-white/15 backdrop-blur-xs rounded-lg p-0.5">
                    {(['USD', 'PKR', 'EUR', 'GBP'] as const).map(cur => (
                      <button
                        key={cur}
                        type="button"
                        onClick={() => setActiveCurrency(cur)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-colors ${
                          activeCurrency === cur
                            ? 'bg-white text-[#003087]'
                            : 'text-white/70 hover:text-white'
                        }`}
                      >
                        {cur}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight tabular-nums break-words">
                  {currencySymbols[activeCurrency]}
                  {activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>

                {/* PKR Equivalent Preview */}
                <div className="mt-2 text-xs font-semibold text-emerald-300 flex items-center gap-2">
                  <span>🇵🇰 ≈ Rs {pkrEquivalent.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR in Pakistan</span>
                  <span className="text-white/40">·</span>
                  <span>Pending: ${user.pendingBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons Cluster */}
              <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
                {/* Prominent Easypaisa Instant Withdrawal CTA */}
                <button
                  type="button"
                  onClick={() => setIsEasypaisaOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#00A859] hover:bg-[#008f4c] text-white rounded-full text-xs font-black shadow-md active:scale-95 transition-all whitespace-nowrap"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Withdraw to Easypaisa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSendOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-[#003087] hover:bg-slate-100 rounded-full text-xs font-bold shadow-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsRequestOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xs rounded-full text-xs font-bold active:scale-95 transition-all whitespace-nowrap"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                  <span>Request</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsTransferOpen(true)}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xs rounded-full text-xs font-bold active:scale-95 transition-all whitespace-nowrap"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Bank Wire</span>
                </button>
              </div>
            </div>

            {/* Bottom Quick Row inside Hero */}
            <div className="relative z-10 border-t border-white/15 mt-6 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-white/90">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBarcodeOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#00CFE8]" />
                  <span>App Barcode & QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPDFOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-300" />
                  <span>Download PDF Statement</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setCurrentTab('wallet')}
                className="flex items-center gap-1 text-white/80 hover:text-white transition-colors"
              >
                <span>Easypaisa: {user.easypaisaNumber}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick-Send Contacts Carousel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Send Again
              </h3>
              <button
                type="button"
                onClick={() => setIsSendOpen(true)}
                className="text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline"
              >
                Search all contacts
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              <button
                type="button"
                onClick={() => setIsSendOpen(true)}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 group-hover:border-[#0070BA] group-hover:text-[#0070BA] group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/30 transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-2 truncate w-full">
                  Pay New
                </span>
              </button>

              {contacts.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleContactClick(c)}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 border-2 border-transparent group-hover:border-[#0070BA] group-hover:ring-2 group-hover:ring-[#0070BA]/20 transition-all shadow-xs">
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                        {c.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2 truncate w-full group-hover:text-[#0070BA] transition-colors">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity List */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Recent Activity (Pakistan & Global)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time ledger of incoming client payments, remittances, and Easypaisa payouts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentTab('activity')}
                className="text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({transactions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map(txn => {
                const isPositive = txn.amount > 0;
                const isEasypaisa = txn.category === 'pakistan_withdrawal' || txn.title.includes('Easypaisa');
                return (
                  <button
                    key={txn.id}
                    type="button"
                    onClick={() => setSelectedTransaction(txn)}
                    className="w-full py-3.5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 transition-colors group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        isEasypaisa
                          ? 'bg-emerald-100 text-[#00A859] dark:bg-emerald-950 dark:text-emerald-400'
                          : txn.type === 'receive' || txn.type === 'refund'
                          ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400'
                          : txn.type === 'purchase' || txn.type === 'subscription'
                          ? 'bg-slate-100 dark:bg-slate-800 text-[#0070BA] dark:text-sky-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        {isEasypaisa ? (
                          <Smartphone className="w-5 h-5" />
                        ) : txn.type === 'receive' || txn.type === 'refund' ? (
                          <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                        ) : txn.type === 'purchase' || txn.type === 'subscription' ? (
                          <ShoppingBag className="w-5 h-5 text-[#0070BA] dark:text-sky-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-[#0070BA] transition-colors">
                          {txn.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                          <span>{txn.date}</span>
                          <span className="text-slate-300 dark:text-slate-700">·</span>
                          <span className="truncate">{txn.subtitle}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0 pl-3">
                      <div
                        className={`text-sm font-bold tabular-nums ${
                          isPositive
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {isPositive ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)} USD
                      </div>
                      {txn.pkrAmount && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                          Rs {txn.pkrAmount.toLocaleString('en-US', { minimumFractionDigits: 0 })} PKR
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Easypaisa Wallet, Cards, Pakistani Banks */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Linked Pakistani Mobile Wallets Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Pakistani Wallets
                </h3>
                <p className="text-xs text-slate-500">
                  Instant withdrawal channels
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEasypaisaOpen(true)}
                className="text-xs font-bold text-[#00A859] hover:underline flex items-center gap-1"
              >
                <span>Withdraw</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {mobileWallets.map(w => (
                <div
                  key={w.id}
                  onClick={() => setIsEasypaisaOpen(true)}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#00A859] dark:hover:border-[#00A859] transition-all cursor-pointer bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${
                      w.provider === 'easypaisa'
                        ? 'bg-[#00A859] text-white'
                        : w.provider === 'jazzcash'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-800 text-white'
                    }`}>
                      {w.provider === 'easypaisa' ? 'EP' : w.provider === 'jazzcash' ? 'JC' : 'RA'}
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900 dark:text-white capitalize flex items-center gap-1.5">
                        <span>{w.provider}</span>
                        {w.isDefault && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {w.mobileNumber}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#00A859]">
                    Instant &rarr;
                  </span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsEasypaisaOpen(true)}
              className="w-full py-2.5 bg-[#00A859] hover:bg-[#008f4c] text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Transfer to Easypaisa Account</span>
            </button>
          </div>

          {/* Cards & Banks Mini Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Cards & Pakistani Banks
              </h3>
              <button
                type="button"
                onClick={() => setCurrentTab('wallet')}
                className="text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-3">
              {cards.map(card => (
                <div
                  key={card.id}
                  onClick={() => setCurrentTab('wallet')}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${card.cardColor} text-white shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-extrabold italic uppercase tracking-wider">
                      {card.brand === 'paypal-cashback' ? 'PayPal Cashback' : card.brand}
                    </span>
                    {card.isDefault && (
                      <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-sm tracking-widest mt-4">
                    •••• •••• •••• {card.last4}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-white/70 mt-2">
                    <span>{card.cardholderName}</span>
                    <span>EXP {card.expiryMonth}/{card.expiryYear}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Buyer Protection Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <span className="font-bold text-slate-900 dark:text-slate-200 block">
                SBP Remittance & PayPal Protection
              </span>
              Approved under State Bank of Pakistan IT export remittance channels. Zero withholding tax on approved freelancer accounts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
