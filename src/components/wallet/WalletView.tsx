import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  CreditCard,
  Building,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  Trash2,
  ArrowRightLeft,
  ShieldCheck,
  RotateCw,
  Wallet as WalletIcon,
  Globe,
  Smartphone,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Check,
} from 'lucide-react';
import { Currency } from '../../types/paypal';

export const WalletView: React.FC = () => {
  const {
    user,
    cards,
    banks,
    mobileWallets,
    removeCard,
    toggleCardLock,
    setDefaultCard,
    setIsAddCardOpen,
    setIsTransferOpen,
    setIsEasypaisaOpen,
    activeCurrency,
    setActiveCurrency,
    usdToPkrRate,
  } = usePayPal();

  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [revealedCardIds, setRevealedCardIds] = useState<Record<string, boolean>>({});
  const [copiedCardId, setCopiedCardId] = useState<string | null>(null);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('PKR');
  const [convertAmount, setConvertAmount] = useState('100.00');

  // Realistic exchange rates relative to 1 USD
  const exchangeRates: Record<Currency, number> = {
    USD: 1.0,
    PKR: usdToPkrRate,
    EUR: 0.92,
    GBP: 0.78,
    CAD: 1.36,
    JPY: 152.4,
  };

  const convertedValue = (parseFloat(convertAmount) || 0) * (exchangeRates[selectedCurrency] / exchangeRates.USD);

  const toggleFlip = (id: string) => {
    setFlippedCardId(prev => (prev === id ? null : id));
  };

  const toggleRevealCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedCardIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyCardData = (card: any, e: React.MouseEvent) => {
    e.stopPropagation();
    const data = `Card Type: ${card.brand.toUpperCase()}
Cardholder: ${card.cardholderName}
Card Number: ${card.fullNumber || '•••• •••• •••• ' + card.last4}
Expiry Date: ${card.expiryMonth}/${card.expiryYear}
CVV: ${card.cvv || '392'}
Spending Limit: $${card.spendingLimit || 5000}`;
    navigator.clipboard.writeText(data);
    setCopiedCardId(card.id);
    setTimeout(() => setCopiedCardId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Digital Wallet & Pakistani Accounts
          </h2>
          <p className="text-xs text-slate-500">
            Manage your Easypaisa wallet, Pakistani banks (Meezan, HBL), international cards, and multi-currency balances
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsEasypaisaOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00A859] hover:bg-[#008f4c] text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Withdraw to Easypaisa</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddCardOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-full shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Link Card or Bank</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Easypaisa Wallets, Cards & Banks */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* PAKISTANI MOBILE WALLETS SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Pakistani Mobile Wallets ({mobileWallets.length})
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                    Instant Payout Ready
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Withdraw your PayPal USD balance directly into Pakistani Rupees (PKR) with 0% remittance fee
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEasypaisaOpen(true)}
                className="text-xs font-bold text-[#00A859] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Withdraw Cash</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mobileWallets.map(wallet => (
                <div
                  key={wallet.id}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#00A859] dark:hover:border-[#00A859] bg-slate-50/50 dark:bg-slate-800/40 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-xs ${
                        wallet.provider === 'easypaisa'
                          ? 'bg-[#00A859]'
                          : wallet.provider === 'jazzcash'
                          ? 'bg-amber-600'
                          : 'bg-emerald-800'
                      }`}>
                        {wallet.provider === 'easypaisa' ? 'EP' : wallet.provider === 'jazzcash' ? 'JC' : 'RA'}
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900 dark:text-white capitalize flex items-center gap-1.5">
                          <span>{wallet.provider}</span>
                          {wallet.isDefault && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono font-semibold">
                          {wallet.mobileNumber}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <span className="text-[11px] text-slate-500 uppercase font-semibold">
                      {wallet.accountTitle}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEasypaisaOpen(true)}
                      className="px-3 py-1 bg-[#00A859] text-white hover:bg-[#008f4c] font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3" />
                      <span>Payout</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARDS SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Payment Cards ({cards.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Tap any card to flip and view security details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddCardOpen(true)}
                className="text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map(card => {
                const isFlipped = flippedCardId === card.id;
                return (
                  <div key={card.id} className="space-y-3">
                    {/* 3D Flip Card Container */}
                    <div
                      onClick={() => toggleFlip(card.id)}
                      className="cursor-pointer perspective-[1000px] select-none"
                    >
                      <div
                        className={`relative w-full aspect-[1.586/1] rounded-2xl text-white shadow-md transition-all duration-500 transform-style-3d ${
                          isFlipped ? 'rotate-y-180' : ''
                        } ${card.isLocked ? 'opacity-70 saturate-50' : ''}`}
                      >
                        {/* FRONT FACE */}
                        <div
                          className={`absolute inset-0 rounded-2xl p-5 bg-gradient-to-tr ${card.cardColor} backface-hidden flex flex-col justify-between overflow-hidden`}
                        >
                          <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />

                          <div className="flex justify-between items-start">
                            <span className="text-xs font-extrabold italic uppercase tracking-wider">
                              {card.brand === 'paypal-cashback' ? 'PayPal Cashback' : card.brand}
                            </span>
                            <div className="flex items-center gap-2">
                              {card.isLocked && (
                                <span className="flex items-center gap-1 text-[10px] bg-rose-500/80 px-2 py-0.5 rounded-full font-bold">
                                  <Lock className="w-2.5 h-2.5" />
                                  Locked
                                </span>
                              )}
                              {card.isDefault && (
                                <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Chip */}
                          <div className="w-10 h-7 rounded-sm bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-100 border border-amber-400 flex items-center justify-center">
                            <div className="w-7 h-4 border border-amber-600/40 rounded-xs flex items-center justify-around">
                              <div className="w-px h-full bg-amber-600/40" />
                              <div className="w-px h-full bg-amber-600/40" />
                            </div>
                          </div>

                          {/* Numbers */}
                          <div>
                            <div className="flex items-center justify-between font-mono text-sm sm:text-base font-bold tracking-wider text-shadow">
                              <span>
                                {revealedCardIds[card.id]
                                  ? (card.fullNumber || '•••• •••• •••• ' + card.last4)
                                  : '•••• •••• •••• ' + card.last4}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => toggleRevealCard(card.id, e)}
                                className="p-1 rounded-md bg-white/15 hover:bg-white/25 transition-colors"
                                title={revealedCardIds[card.id] ? "Hide Number" : "Reveal Full 16-Digit Number"}
                              >
                                {revealedCardIds[card.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <div className="flex justify-between items-end mt-2 text-[11px] text-white/80">
                              <span className="font-medium uppercase truncate max-w-[150px]">
                                {card.cardholderName}
                              </span>
                              <span className="font-mono">
                                {card.expiryMonth}/{card.expiryYear}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* BACK FACE */}
                        <div
                          className={`absolute inset-0 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 backface-hidden rotate-y-180 p-5 flex flex-col justify-between overflow-hidden border border-slate-700`}
                        >
                          <div className="w-full h-8 bg-slate-950 -mx-5 mt-2" />
                          <div className="space-y-1">
                            <div className="text-[9px] uppercase tracking-wider text-slate-400 text-right">
                              Security Code (CVV)
                            </div>
                            <div className="bg-white text-slate-900 font-mono text-xs font-bold py-1 px-3 text-right rounded-xs">
                              {card.cvv || '392'}
                            </div>
                          </div>
                          <div className="text-[9px] text-slate-400 text-center">
                            Tap to flip back · 24/7 Support: 1-888-221-1161
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions toolbar */}
                    <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleCardLock(card.id)}
                          className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0070BA] dark:hover:text-sky-400"
                        >
                          {card.isLocked ? <Unlock className="w-3.5 h-3.5 text-rose-500" /> : <Lock className="w-3.5 h-3.5" />}
                          <span>{card.isLocked ? 'Unlock' : 'Lock'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => copyCardData(card, e)}
                          className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0070BA] dark:hover:text-sky-400 ml-1.5"
                          title="Copy Full Card Details (نمبر اور سی وی وی کاپی کریں)"
                        >
                          {copiedCardId === card.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-emerald-600 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Data</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {!card.isDefault && (
                          <button
                            type="button"
                            onClick={() => setDefaultCard(card.id)}
                            className="font-semibold text-[#0070BA] dark:text-sky-400 hover:underline"
                          >
                            Set Default
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove card ending in ${card.last4}?`)) {
                              removeCard(card.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          title="Remove Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAKISTANI BANKS SECTION */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Pakistani Bank Accounts ({banks.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Direct wire deposit to Roshan Digital & Local Freelance Accounts
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {banks.map(bank => (
                <div
                  key={bank.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{bank.bankName}</span>
                        {bank.isDefault && (
                          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                            Primary Bank
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        IBAN: {bank.iban || `PK${bank.last4}••••••••••••`} · {bank.accountType}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsTransferOpen(true)}
                    className="px-4 py-1.5 text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full transition-colors"
                  >
                    Wire Transfer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Balances by Currency & Currency Converter */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Multi-Currency Balances */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#0070BA] dark:text-sky-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Currency Balances
              </h3>
            </div>

            <div className="space-y-3">
              {[
                { code: 'USD', name: 'US Dollar', symbol: '$', balance: user.balances.USD },
                { code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs ', balance: user.balances.PKR },
                { code: 'EUR', name: 'Euro', symbol: '€', balance: user.balances.EUR },
                { code: 'GBP', name: 'British Pound', symbol: '£', balance: user.balances.GBP },
                { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', balance: user.balances.CAD },
              ].map(cur => (
                <div
                  key={cur.code}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {cur.code} - {cur.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {cur.code === activeCurrency ? 'Primary currency' : 'Balance'}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {cur.symbol}{cur.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Exchange Calculator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                PKR Live Converter
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">From USD</label>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300">$</span>
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={e => setConvertAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl tabular-nums focus:outline-none dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">To Currency</label>
                <select
                  value={selectedCurrency}
                  onChange={e => setSelectedCurrency(e.target.value as Currency)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none dark:text-white font-medium"
                >
                  <option value="PKR">PKR (Rs) - Pakistani Rupee</option>
                  <option value="EUR">EUR (€) - European Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD (CA$) - Canadian Dollar</option>
                </select>
              </div>

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900 text-center">
                <span className="text-xs text-emerald-900 dark:text-emerald-200 block">
                  Estimated Easypaisa Value:
                </span>
                <span className="text-xl font-extrabold text-[#00A859] dark:text-emerald-300 tabular-nums">
                  {selectedCurrency === 'PKR' ? 'Rs ' : selectedCurrency === 'EUR' ? '€' : selectedCurrency === 'GBP' ? '£' : 'CA$'}
                  {convertedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {selectedCurrency}
                </span>
                <div className="text-[10px] text-slate-500 mt-1">
                  1 USD = Rs {usdToPkrRate.toFixed(2)} PKR · Free SBP Transfer
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
