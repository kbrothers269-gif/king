import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  ShieldCheck,
  Plus,
  Minus,
  CheckCircle2,
  X,
  Coins,
} from 'lucide-react';
import { CryptoAsset } from '../../types/paypal';

export const CryptoView: React.FC = () => {
  const { cryptoAssets, user, buyCrypto, sellCrypto } = usePayPal();

  const [activeModal, setActiveModal] = useState<{
    asset: CryptoAsset;
    mode: 'buy' | 'sell';
  } | null>(null);

  const [usdInput, setUsdInput] = useState('50.00');
  const [cryptoUnitsInput, setCryptoUnitsInput] = useState('0.001');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const totalPortfolioValue = cryptoAssets.reduce((acc, c) => acc + c.holdingValue, 0);

  const handleOpenBuy = (asset: CryptoAsset) => {
    setActiveModal({ asset, mode: 'buy' });
    setUsdInput('50.00');
    setActionSuccess(null);
  };

  const handleOpenSell = (asset: CryptoAsset) => {
    setActiveModal({ asset, mode: 'sell' });
    setCryptoUnitsInput((asset.holdingAmount / 2).toFixed(4));
    setActionSuccess(null);
  };

  const handleExecute = () => {
    if (!activeModal) return;

    if (activeModal.mode === 'buy') {
      const amount = parseFloat(usdInput) || 0;
      if (amount <= 0 || amount > user.balances.USD) {
        alert('Insufficient PayPal balance to complete this purchase.');
        return;
      }
      const ok = buyCrypto(activeModal.asset.id, amount);
      if (ok) {
        setActionSuccess(`Purchased ${(amount / activeModal.asset.currentPrice).toFixed(5)} ${activeModal.asset.symbol}!`);
        setTimeout(() => setActiveModal(null), 1500);
      }
    } else {
      const units = parseFloat(cryptoUnitsInput) || 0;
      if (units <= 0 || units > activeModal.asset.holdingAmount) {
        alert('You do not hold that many units to sell.');
        return;
      }
      const ok = sellCrypto(activeModal.asset.id, units);
      if (ok) {
        setActionSuccess(`Sold ${units.toFixed(5)} ${activeModal.asset.symbol} for $${(units * activeModal.asset.currentPrice).toFixed(2)} USD!`);
        setTimeout(() => setActiveModal(null), 1500);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            PayPal Crypto & PYUSD
          </h2>
          <p className="text-xs text-slate-500">
            Buy, sell, and hold Bitcoin, Ethereum, and PayPal USD stablecoin with zero hidden fees
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-500 block">Total Crypto Holdings</span>
          <span className="text-2xl font-extrabold text-[#0070BA] dark:text-sky-300 tabular-nums">
            ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* PYUSD Spotlight Card */}
      <div className="relative bg-gradient-to-r from-[#003087] to-[#0070BA] rounded-3xl p-6 text-white shadow-md overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#00CFE8] uppercase tracking-wider">
              Featured Stablecoin
            </span>
            <h3 className="text-xl font-bold">PayPal USD (PYUSD)</h3>
            <p className="text-xs text-white/80 max-w-xl">
              100% backed by US dollar deposits, US Treasuries, and cash equivalents. Transfer between PayPal and Venmo without transfer fees.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleOpenBuy(cryptoAssets.find(c => c.id === 'pyusd') || cryptoAssets[0])}
            className="px-6 py-2.5 bg-white text-[#003087] font-bold text-xs rounded-full shadow hover:bg-slate-100 transition-all self-start md:self-auto shrink-0"
          >
            Buy PYUSD
          </button>
        </div>
      </div>

      {/* Crypto Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cryptoAssets.map(asset => {
          const isUp = asset.change24h >= 0;
          return (
            <div
              key={asset.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-base shadow-xs"
                    style={{ backgroundColor: asset.color }}
                  >
                    {asset.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 dark:text-white">
                      {asset.name}
                    </h4>
                    <span className="text-xs font-semibold text-slate-500 font-mono">
                      {asset.symbol}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div
                    className={`text-xs font-bold flex items-center justify-end gap-0.5 tabular-nums ${
                      isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isUp ? '+' : ''}{asset.change24h}%</span>
                  </div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="h-10 w-full">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <polyline
                    fill="none"
                    stroke={isUp ? '#10B981' : '#F43F5E'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={asset.sparkline
                      .map((val, idx) => {
                        const min = Math.min(...asset.sparkline);
                        const max = Math.max(...asset.sparkline);
                        const range = max - min || 1;
                        const x = (idx / (asset.sparkline.length - 1)) * 100;
                        const y = 28 - ((val - min) / range) * 24;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>

              {/* Holdings breakdown */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <span className="text-slate-500 block">Your Holding</span>
                  <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                    {asset.holdingAmount.toFixed(4)} {asset.symbol}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Value</span>
                  <span className="font-extrabold text-slate-900 dark:text-white tabular-nums">
                    ${asset.holdingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Buy & Sell Actions */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenBuy(asset)}
                  className="flex-1 py-2.5 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Buy
                </button>
                <button
                  type="button"
                  disabled={asset.holdingAmount <= 0}
                  onClick={() => handleOpenSell(asset)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold rounded-xl transition-colors disabled:opacity-40"
                >
                  Sell
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BUY / SELL MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {activeModal.mode} {activeModal.asset.name}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {actionSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <span className="font-bold text-sm text-slate-900 dark:text-white block">
                  {actionSuccess}
                </span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {activeModal.mode === 'buy' ? (
                  <div>
                    <label className="text-slate-500 block mb-1">
                      USD Amount to Spend (Balance: ${user.balances.USD.toFixed(2)})
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-slate-400">$</span>
                      <input
                        type="number"
                        value={usdInput}
                        onChange={e => setUsdInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm dark:text-white tabular-nums"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Estimated: {((parseFloat(usdInput) || 0) / activeModal.asset.currentPrice).toFixed(5)} {activeModal.asset.symbol}
                    </span>
                  </div>
                ) : (
                  <div>
                    <label className="text-slate-500 block mb-1">
                      Units to Sell (Holding: {activeModal.asset.holdingAmount.toFixed(4)})
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={cryptoUnitsInput}
                      onChange={e => setCryptoUnitsInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold text-sm dark:text-white tabular-nums"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Estimated USD Payout: ${((parseFloat(cryptoUnitsInput) || 0) * activeModal.asset.currentPrice).toFixed(2)}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExecute}
                  className="w-full py-3 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow"
                >
                  Confirm {activeModal.mode.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
