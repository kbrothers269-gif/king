import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import { Currency } from '../../types/paypal';
import {
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Users,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

export const RequestMoneyModal: React.FC = () => {
  const { isRequestOpen, setIsRequestOpen, user, requestMoney, contacts } = usePayPal();

  const [activeTab, setActiveTab] = useState<'request' | 'split' | 'paypal_me'>('request');
  const [recipients, setRecipients] = useState<Array<{ name: string; emailOrTag: string }>>([
    { name: '', emailOrTag: '' },
  ]);
  const [totalAmount, setTotalAmount] = useState('60.00');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [note, setNote] = useState('Dinner last night 🍣');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isRequestOpen) return null;

  const handleClose = () => {
    setIsRequestOpen(false);
    setIsSuccess(false);
    setRecipients([{ name: '', emailOrTag: '' }]);
    setTotalAmount('60.00');
    setNote('');
  };

  const handleAddRecipient = () => {
    setRecipients(prev => [...prev, { name: '', emailOrTag: '' }]);
  };

  const handleRemoveRecipient = (idx: number) => {
    setRecipients(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateRecipient = (idx: number, field: 'name' | 'emailOrTag', val: string) => {
    setRecipients(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleSelectContact = (c: { name: string; tag: string; email: string }) => {
    // Fill first empty recipient or add new
    const emptyIdx = recipients.findIndex(r => !r.name.trim());
    if (emptyIdx !== -1) {
      handleUpdateRecipient(emptyIdx, 'name', c.name);
      handleUpdateRecipient(emptyIdx, 'emailOrTag', c.tag || c.email);
    } else {
      setRecipients(prev => [...prev, { name: c.name, emailOrTag: c.tag || c.email }]);
    }
  };

  const baseAmount = parseFloat(totalAmount) || 0;
  const tipAmount = activeTab === 'split' ? (baseAmount * tipPercent) / 100 : 0;
  const finalTotal = baseAmount + tipAmount;
  const validRecipientsCount = recipients.filter(r => r.name.trim()).length || 1;
  const perPersonShare = activeTab === 'split' ? finalTotal / (validRecipientsCount + 1) : baseAmount; // +1 includes user

  const handleSubmitRequest = async () => {
    const validRecipients = recipients.filter(r => r.name.trim()).map(r => ({
      name: r.name.trim(),
      emailOrTag: r.emailOrTag.trim() || `${r.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    }));

    if (validRecipients.length === 0 || baseAmount <= 0) return;

    setIsSubmitting(true);
    try {
      await requestMoney({
        recipients: validRecipients,
        amount: activeTab === 'split' ? perPersonShare : baseAmount,
        currency,
        note,
        splitEvenly: activeTab === 'split',
      });
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const customPaypalMeLink = `https://${user.paypalMeUrl}/${parseFloat(totalAmount) > 0 ? parseFloat(totalAmount).toFixed(2) : ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(customPaypalMeLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {isSuccess ? 'Requests Sent' : 'Request Money'}
            </h3>
            <p className="text-xs text-slate-500">
              Request funds or split expenses with friends
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
        {!isSuccess && (
          <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/40">
            <button
              onClick={() => setActiveTab('request')}
              className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'request'
                  ? 'border-[#0070BA] text-[#0070BA] dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Single Request
            </button>
            <button
              onClick={() => setActiveTab('split')}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'split'
                  ? 'border-[#0070BA] text-[#0070BA] dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Split a Bill</span>
            </button>
            <button
              onClick={() => setActiveTab('paypal_me')}
              className={`flex items-center gap-1.5 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'paypal_me'
                  ? 'border-[#0070BA] text-[#0070BA] dark:text-sky-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>PayPal.Me</span>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Payment Request Sent!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                We sent an instant notification to your recipients. When they pay, the money will appear directly in your PayPal balance.
              </p>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow"
              >
                Back to Dashboard
              </button>
            </div>
          ) : activeTab === 'paypal_me' ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0070BA] dark:text-sky-300 mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Personal PayPal.Me Link
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Share this link with anyone via text, email, or chat. They don&rsquo;t even need your bank info!
                </p>
              </div>

              {/* Link Box */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl">
                <span className="text-xs font-mono font-medium text-slate-800 dark:text-slate-200 truncate pr-2">
                  {customPaypalMeLink}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Custom amount for link */}
              <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Preset an amount in your link (optional)
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-slate-500">$</span>
                  <input
                    type="number"
                    value={totalAmount}
                    onChange={e => setTotalAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0070BA]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Amount */}
              <div className="text-center">
                <span className="text-xs font-semibold text-slate-500 block mb-1">
                  {activeTab === 'split' ? 'Total Bill Amount' : 'Amount to Request'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-3xl font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    step="any"
                    value={totalAmount}
                    onChange={e => setTotalAmount(e.target.value)}
                    className="w-40 text-4xl font-extrabold text-slate-900 dark:text-white bg-transparent text-center focus:outline-none tabular-nums"
                  />
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as Currency)}
                    className="text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Tip options for Bill Split */}
              {activeTab === 'split' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                    <span>Include Tip:</span>
                    <span className="text-[#0070BA] font-bold tabular-nums">
                      ${tipAmount.toFixed(2)} ({tipPercent}%)
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 15, 18, 20].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setTipPercent(pct)}
                        className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          tipPercent === pct
                            ? 'bg-[#0070BA] text-white border-[#0070BA]'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pct === 0 ? 'No tip' : `${pct}%`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Contacts Pills */}
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Quick select from contacts:
                </span>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {contacts.slice(0, 4).map(c => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectContact(c)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap shrink-0"
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-300 shrink-0">
                        {c.avatarUrl ? (
                          <img src={c.avatarUrl} alt={c.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] flex items-center justify-center h-full font-bold">{c.name[0]}</span>
                        )}
                      </div>
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipients Input List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Recipients ({recipients.length})
                  </span>
                  <button
                    type="button"
                    onClick={handleAddRecipient}
                    className="flex items-center gap-1 text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Person</span>
                  </button>
                </div>

                {recipients.map((r, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Name or @handle"
                      value={r.name}
                      onChange={e => handleUpdateRecipient(i, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Email or phone (optional)"
                      value={r.emailOrTag}
                      onChange={e => handleUpdateRecipient(i, 'emailOrTag', e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                    />
                    {recipients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(i)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Note / Reason
                </label>
                <input
                  type="text"
                  placeholder="What is this request for?"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-1 focus:ring-[#0070BA] dark:text-white"
                />
              </div>

              {/* Split Summary Box */}
              {activeTab === 'split' && (
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-blue-950 dark:text-blue-100 block">
                      Splitting between {validRecipientsCount + 1} people (including you)
                    </span>
                    <span className="text-[11px] text-blue-700 dark:text-blue-300">
                      Total with tip: ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#0070BA] dark:text-sky-300 block tabular-nums">
                      ${perPersonShare.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500">per person</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isSubmitting || baseAmount <= 0}
                onClick={handleSubmitRequest}
                className="w-full py-3.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all disabled:opacity-50 active:scale-98"
              >
                {isSubmitting
                  ? 'Sending Requests...'
                  : activeTab === 'split'
                  ? `Request $${perPersonShare.toFixed(2)} from ${validRecipientsCount} People`
                  : `Request $${baseAmount.toFixed(2)}`}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
