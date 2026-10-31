import React, { useState, useEffect } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import { Contact, Currency, Transaction } from '../../types/paypal';
import {
  X,
  Search,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building,
  Wallet,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';

export const SendMoneyModal: React.FC = () => {
  const {
    isSendOpen,
    setIsSendOpen,
    contacts,
    cards,
    banks,
    user,
    sendMoney,
    sendTargetContact,
    setSendTargetContact,
  } = usePayPal();

  // Steps: 'select_recipient' | 'enter_amount' | 'funding_source' | 'review' | 'success'
  const [step, setStep] = useState<'select_recipient' | 'enter_amount' | 'funding_source' | 'review' | 'success'>('select_recipient');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<{
    name: string;
    emailOrTag: string;
    avatarUrl?: string;
  } | null>(null);

  const [amountStr, setAmountStr] = useState('25.00');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState<'friends_family' | 'goods_services'>('friends_family');
  const [fundingSourceId, setFundingSourceId] = useState<string>('balance');
  const [isSending, setIsSending] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    if (sendTargetContact) {
      setSelectedRecipient({
        name: sendTargetContact.name,
        emailOrTag: sendTargetContact.tag || sendTargetContact.email,
        avatarUrl: sendTargetContact.avatarUrl,
      });
      setStep('enter_amount');
    }
  }, [sendTargetContact]);

  if (!isSendOpen) return null;

  const handleClose = () => {
    setIsSendOpen(false);
    setSendTargetContact(null);
    setSelectedRecipient(null);
    setStep('select_recipient');
    setSearchTerm('');
    setAmountStr('25.00');
    setNote('');
    setCategory('friends_family');
    setCompletedTxn(null);
  };

  const filteredContacts = contacts.filter(
    c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContact = (c: Contact) => {
    setSelectedRecipient({
      name: c.name,
      emailOrTag: c.tag || c.email,
      avatarUrl: c.avatarUrl,
    });
    setStep('enter_amount');
  };

  const handleManualRecipient = () => {
    if (!searchTerm.trim()) return;
    setSelectedRecipient({
      name: searchTerm.trim(),
      emailOrTag: searchTerm.trim(),
    });
    setStep('enter_amount');
  };

  const numAmount = parseFloat(amountStr) || 0;

  const handleConfirmSend = async () => {
    if (!selectedRecipient || numAmount <= 0) return;
    setIsSending(true);

    try {
      const txn = await sendMoney({
        recipientName: selectedRecipient.name,
        recipientEmailOrTag: selectedRecipient.emailOrTag,
        recipientAvatar: selectedRecipient.avatarUrl,
        amount: numAmount,
        currency,
        note,
        fundingSourceId,
        category,
      });
      setCompletedTxn(txn);
      setStep('success');
    } finally {
      setIsSending(false);
    }
  };

  const currencySymbols: Record<Currency, string> = {
    USD: '$',
    PKR: 'Rs ',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    JPY: '¥',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {step === 'success' ? 'Payment Sent' : 'Send Money'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {step === 'select_recipient' && 'Choose who you want to pay'}
              {step === 'enter_amount' && 'Specify amount and message'}
              {step === 'funding_source' && 'Choose payment method'}
              {step === 'review' && 'Review details before sending'}
              {step === 'success' && 'Your money has been delivered'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: SELECT RECIPIENT */}
          {step === 'select_recipient' && (
            <div className="space-y-5">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Name, @username, email, or mobile"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleManualRecipient();
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070BA] dark:text-white"
                  autoFocus
                />
              </div>

              {searchTerm.trim().length > 0 && (
                <button
                  onClick={handleManualRecipient}
                  className="w-full flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-950/40 text-[#0070BA] dark:text-sky-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-semibold"
                >
                  <span>Pay &ldquo;{searchTerm}&rdquo;</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Frequent Contacts */}
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
                  Recent & Favorite Contacts
                </span>
                <div className="space-y-1.5">
                  {filteredContacts.map(c => (
                    <button
                      key={c.id}
                      onClick={() => handleSelectContact(c)}
                      className="w-full flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
                    >
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                        {c.avatarUrl ? (
                          <img
                            src={c.avatarUrl}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-slate-600 dark:text-slate-300">
                            {c.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate text-sm">
                          {c.name}
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {c.tag || c.email} {c.recentNote ? `· ${c.recentNote}` : ''}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#0070BA] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ENTER AMOUNT */}
          {step === 'enter_amount' && selectedRecipient && (
            <div className="space-y-6 text-center">
              {/* Recipient chip */}
              <div className="inline-flex items-center gap-2.5 p-2 pr-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-300 shrink-0">
                  {selectedRecipient.avatarUrl ? (
                    <img
                      src={selectedRecipient.avatarUrl}
                      alt={selectedRecipient.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-600">
                      {selectedRecipient.name[0]}
                    </div>
                  )}
                </div>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Paying {selectedRecipient.name}
                </span>
                <button
                  onClick={() => setStep('select_recipient')}
                  className="text-xs text-[#0070BA] dark:text-sky-400 hover:underline ml-1"
                >
                  Change
                </button>
              </div>

              {/* Big Amount Input */}
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-extrabold text-slate-400">
                  {currencySymbols[currency]}
                </span>
                <input
                  type="number"
                  step="any"
                  min="0.01"
                  value={amountStr}
                  onChange={e => setAmountStr(e.target.value)}
                  className="w-48 text-5xl font-extrabold text-slate-900 dark:text-white bg-transparent text-center focus:outline-none tabular-nums"
                  autoFocus
                />
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value as Currency)}
                  className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="USD">USD ($)</option>
                  <option value="PKR">PKR (Rs)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (CA$)</option>
                </select>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center justify-center gap-2">
                {['10', '25', '50', '100'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountStr(val)}
                    className={`px-3.5 py-1 text-xs font-semibold rounded-full border transition-colors ${
                      amountStr === val
                        ? 'bg-[#0070BA] text-white border-[#0070BA]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    +${val}
                  </button>
                ))}
              </div>

              {/* Note Input */}
              <div className="text-left space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  What&rsquo;s this payment for? (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dinner last night, Rent split, Gift"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0070BA] dark:text-white"
                />

                {/* Note Quick Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {['🍕 Dinner split', '🎉 Birthday gift', '🏠 Rent share', '☕️ Coffee & treats', '⚡️ Concert ticket'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNote(tag)}
                      className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Type: Friends & Family vs Goods & Services */}
              <div className="grid grid-cols-2 gap-3 text-left">
                <button
                  type="button"
                  onClick={() => setCategory('friends_family')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    category === 'friends_family'
                      ? 'border-[#0070BA] bg-blue-50/60 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="font-semibold text-xs text-slate-900 dark:text-white">
                    Friends and Family
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Free for both parties with PayPal balance or bank.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setCategory('goods_services')}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    category === 'goods_services'
                      ? 'border-[#0070BA] bg-blue-50/60 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1 font-semibold text-xs text-slate-900 dark:text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Goods & Services</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Includes PayPal Purchase Protection for qualified items.
                  </div>
                </button>
              </div>

              <button
                type="button"
                disabled={numAmount <= 0}
                onClick={() => setStep('funding_source')}
                className="w-full py-3.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-sm rounded-full shadow transition-all disabled:opacity-50 active:scale-98"
              >
                Continue to Payment Method
              </button>
            </div>
          )}

          {/* STEP 3: FUNDING SOURCE */}
          {step === 'funding_source' && (
            <div className="space-y-4">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Choose how to pay
              </span>

              {/* PayPal Balance Option */}
              <button
                type="button"
                onClick={() => setFundingSourceId('balance')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                  fundingSourceId === 'balance'
                    ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0070BA] dark:text-sky-300 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      PayPal Balance
                    </div>
                    <div className="text-xs text-slate-500 tabular-nums">
                      Available: ${user.balances.USD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
                {fundingSourceId === 'balance' && (
                  <CheckCircle2 className="w-5 h-5 text-[#0070BA]" />
                )}
              </button>

              {/* Linked Cards */}
              {cards.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFundingSourceId(c.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    fundingSourceId === c.id
                      ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {c.brand === 'paypal-cashback' ? 'PayPal Cashback Mastercard' : `${c.brand.toUpperCase()} Card`} •••• {c.last4}
                      </div>
                      <div className="text-xs text-slate-500">
                        Expires {c.expiryMonth}/{c.expiryYear} {c.isDefault ? '· Default' : ''}
                      </div>
                    </div>
                  </div>
                  {fundingSourceId === c.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#0070BA]" />
                  )}
                </button>
              ))}

              {/* Linked Banks */}
              {banks.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setFundingSourceId(b.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                    fundingSourceId === b.id
                      ? 'border-[#0070BA] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#0070BA]'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {b.bankName} •••• {b.last4}
                      </div>
                      <div className="text-xs text-slate-500">
                        {b.accountType} · Direct ACH
                      </div>
                    </div>
                  </div>
                  {fundingSourceId === b.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#0070BA]" />
                  )}
                </button>
              ))}

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setStep('enter_amount')}
                  className="w-1/3 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="w-2/3 py-3 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all active:scale-98"
                >
                  Review Payment
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 'review' && selectedRecipient && (
            <div className="space-y-5">
              <div className="text-center py-2">
                <div className="text-xs font-semibold text-slate-500">You are sending</div>
                <div className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1 tabular-nums">
                  {currencySymbols[currency]}{numAmount.toFixed(2)} {currency}
                </div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  to {selectedRecipient.name} ({selectedRecipient.emailOrTag})
                </div>
              </div>

              {/* Breakdown box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Transfer amount</span>
                  <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                    {currencySymbols[currency]}{numAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>PayPal fee</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    $0.00 Free
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Payment method</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {fundingSourceId === 'balance'
                      ? 'PayPal Balance'
                      : cards.find(c => c.id === fundingSourceId)
                      ? `${cards.find(c => c.id === fundingSourceId)?.brand.toUpperCase()} •••• ${cards.find(c => c.id === fundingSourceId)?.last4}`
                      : 'Bank Account'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Type</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {category === 'friends_family' ? 'Friends & Family' : 'Goods & Services'}
                  </span>
                </div>
                {note && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-2">
                    <span>Note</span>
                    <span className="font-medium text-slate-900 dark:text-white italic">&ldquo;{note}&rdquo;</span>
                  </div>
                )}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-bold text-sm text-slate-900 dark:text-white">
                  <span>Total Due</span>
                  <span className="tabular-nums">{currencySymbols[currency]}{numAmount.toFixed(2)} {currency}</span>
                </div>
              </div>

              {category === 'goods_services' && (
                <div className="flex items-start gap-2.5 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Eligible purchases are covered by PayPal Buyer Protection for 180 days.</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('funding_source')}
                  className="w-1/3 py-3 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleConfirmSend}
                  className="w-2/3 py-3 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSending ? 'Sending securely...' : `Send ${currencySymbols[currency]}${numAmount.toFixed(2)} Now`}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 'success' && completedTxn && (
            <div className="text-center py-4 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  You sent {currencySymbols[completedTxn.currency]}{Math.abs(completedTxn.amount).toFixed(2)}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Sent to {completedTxn.counterparty}
                </p>
              </div>

              {/* Receipt Card */}
              <div className="bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-xs text-left space-y-2">
                <div className="flex justify-between text-slate-500">
                  <span>Transaction ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{completedTxn.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Payment Method</span>
                  <span className="text-slate-700 dark:text-slate-300">{completedTxn.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Status</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold uppercase">Completed</span>
                </div>
                {completedTxn.note && (
                  <div className="flex justify-between text-slate-500">
                    <span>Note</span>
                    <span className="italic text-slate-700 dark:text-slate-300">&ldquo;{completedTxn.note}&rdquo;</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 py-3 px-4 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
