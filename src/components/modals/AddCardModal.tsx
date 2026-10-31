import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  X,
  CreditCard,
  ShieldCheck,
  Lock,
  Wifi,
} from 'lucide-react';

export const AddCardModal: React.FC = () => {
  const { isAddCardOpen, setIsAddCardOpen, addCard } = usePayPal();

  const [cardholderName, setCardholderName] = useState('ALEX MORGAN');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('12');
  const [expiryYear, setExpiryYear] = useState('29');
  const [cvv, setCvv] = useState('');
  const [brand, setBrand] = useState<'visa' | 'mastercard' | 'amex' | 'paypal-cashback'>('visa');

  if (!isAddCardOpen) return null;

  const handleClose = () => {
    setIsAddCardOpen(false);
    setCardNumber('');
    setCvv('');
  };

  const handleCardNumberChange = (val: string) => {
    // Only numbers
    const clean = val.replace(/\D/g, '').slice(0, 16);
    // Format in groups of 4
    const formatted = clean.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);

    // Auto-detect brand
    if (clean.startsWith('4')) {
      setBrand('visa');
    } else if (clean.startsWith('5')) {
      setBrand('mastercard');
    } else if (clean.startsWith('3')) {
      setBrand('amex');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber.trim() || !cardholderName.trim()) return;

    addCard({
      cardholderName: cardholderName.trim(),
      cardNumber: cardNumber.replace(/\s+/g, ''),
      expiryMonth,
      expiryYear,
      cvv,
      brand,
    });
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Link a Card
            </h3>
            <p className="text-xs text-slate-500">
              Add a debit or credit card to your PayPal wallet
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
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Live Plastic Card Preview */}
          <div className="relative w-full aspect-[1.586/1] rounded-2xl p-5 text-white shadow-xl bg-gradient-to-tr from-[#003087] via-[#00457C] to-[#0070BA] flex flex-col justify-between overflow-hidden">
            {/* Background subtle watermark & sheen */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute top-0 right-0 p-5 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-white/70 rotate-90" />
              <span className="font-extrabold italic text-sm tracking-tight text-white/90">
                {brand === 'paypal-cashback' ? 'PayPal Cashback' : brand.toUpperCase()}
              </span>
            </div>

            {/* Chip */}
            <div className="w-11 h-8 rounded-md bg-gradient-to-tr from-amber-200 via-amber-300 to-amber-100 border border-amber-400 shadow-xs flex items-center justify-center">
              <div className="w-8 h-5 border border-amber-500/50 rounded-xs flex items-center justify-around">
                <div className="w-px h-full bg-amber-600/40" />
                <div className="w-px h-full bg-amber-600/40" />
              </div>
            </div>

            {/* Card Number */}
            <div>
              <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-shadow drop-shadow-sm">
                {cardNumber || '•••• •••• •••• 4829'}
              </div>
              <div className="flex justify-between items-end mt-3 text-xs">
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">
                    Cardholder
                  </div>
                  <div className="font-medium tracking-wide uppercase truncate max-w-[170px]">
                    {cardholderName || 'YOUR NAME'}
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">
                    Expires
                  </div>
                  <div className="font-mono font-medium">
                    {expiryMonth}/{expiryYear}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card Brand Selector */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                Card Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'visa', label: 'Visa' },
                  { id: 'mastercard', label: 'Mastercard' },
                  { id: 'amex', label: 'Amex' },
                  { id: 'paypal-cashback', label: 'PayPal (3%)' },
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBrand(b.id as any)}
                    className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                      brand === b.id
                        ? 'border-[#0070BA] bg-blue-50/70 dark:bg-blue-950/40 text-[#0070BA] dark:text-sky-400'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Number */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={e => handleCardNumberChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono tracking-wider focus:outline-none focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Name on Card
              </label>
              <input
                type="text"
                placeholder="Full name as printed on card"
                value={cardholderName}
                onChange={e => setCardholderName(e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs uppercase focus:outline-none focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                required
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Month
                </label>
                <select
                  value={expiryMonth}
                  onChange={e => setExpiryMonth(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                >
                  {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Year
                </label>
                <select
                  value={expiryYear}
                  onChange={e => setExpiryYear(e.target.value)}
                  className="w-full px-2.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                >
                  {['26', '27', '28', '29', '30', '31'].map(y => (
                    <option key={y} value={y}>20{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Security Code
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="CVV"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Your card data is encrypted end-to-end with PCI-DSS 256-bit security.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all active:scale-98"
            >
              Link Card to PayPal
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
