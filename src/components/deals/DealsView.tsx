import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
  ExternalLink,
  Coins,
} from 'lucide-react';

export const DealsView: React.FC = () => {
  const { deals, toggleDealActivation, user, transferMoney } = usePayPal();
  const [redeemed, setRedeemed] = useState(false);

  const pointsValue = (user.rewardPoints / 100).toFixed(2);

  const handleRedeemPoints = () => {
    if (user.rewardPoints <= 0) return;
    setRedeemed(true);
    setTimeout(() => setRedeemed(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Deals & Cash Back
          </h2>
          <p className="text-xs text-slate-500">
            Earn automatic points and cash back when paying with PayPal at hundreds of popular stores
          </p>
        </div>
      </div>

      {/* Rewards Points Hero Banner */}
      <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/5 rounded-3xl p-6 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md">
            <Sparkles className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">
              PayPal Rewards Points
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {user.rewardPoints.toLocaleString()} <span className="text-sm font-semibold text-slate-500">points</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Redeemable for ${pointsValue} cash back directly into your PayPal USD balance
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRedeemPoints}
          className="px-6 py-3 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all shrink-0"
        >
          {redeemed ? '✓ Points Redeemed!' : `Redeem $${pointsValue} Cash Back`}
        </button>
      </div>

      {/* Deals Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Active Merchant Deals ({deals.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deals.map(deal => (
            <div
              key={deal.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-2xl flex items-center justify-center shrink-0">
                    {deal.logo}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {deal.merchant}
                    </h4>
                    <span className="text-xs text-slate-500">
                      {deal.category}
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs rounded-full">
                  {deal.cashback}
                </span>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                {deal.terms}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] text-slate-400">
                  {deal.expires}
                </span>

                <button
                  type="button"
                  onClick={() => toggleDealActivation(deal.id)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                    deal.activated
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {deal.activated && <CheckCircle2 className="w-3.5 h-3.5" />}
                  <span>{deal.activated ? 'Offer Activated' : 'Activate Deal'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
