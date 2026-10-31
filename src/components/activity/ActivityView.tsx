import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  Search,
  Filter,
  Download,
  ArrowDownLeft,
  ArrowUpRight,
  ShoppingBag,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Calendar,
} from 'lucide-react';
import { Transaction, TransactionType } from '../../types/paypal';

export const ActivityView: React.FC = () => {
  const { transactions, setSelectedTransaction } = usePayPal();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'receive' | 'send' | 'subscription' | 'purchase' | 'refund'>('all');

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;
    if (filterType === 'receive') return t.type === 'receive';
    if (filterType === 'send') return t.type === 'send';
    if (filterType === 'subscription') return t.type === 'subscription';
    if (filterType === 'purchase') return t.type === 'purchase';
    if (filterType === 'refund') return t.type === 'refund';
    return true;
  });

  // Calculate stats
  const totalIn = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

  // CSV download function
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date', 'Type', 'Title', 'Counterparty', 'Amount', 'Currency', 'Status', 'Payment Method', 'Fee', 'Note'];
    const rows = filtered.map(t => [
      t.id,
      t.date,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.counterparty.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.currency,
      t.status,
      `"${t.paymentMethod}"`,
      t.fee.toFixed(2),
      `"${(t.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `paypal_activity_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Activity & Statements
          </h2>
          <p className="text-xs text-slate-500">
            View detailed transactions, receipts, and export statements
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV Statement</span>
        </button>
      </div>

      {/* Cashflow Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Received</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +${totalIn.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Total Spent / Sent</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              -${totalOut.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block">Net Activity</span>
            <span className={`text-2xl font-extrabold tabular-nums ${
              totalIn >= totalOut ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
            }`}>
              {totalIn >= totalOut ? '+' : '-'}${Math.abs(totalIn - totalOut).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0070BA] dark:text-sky-400 flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, merchant, transaction ID, or note..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0070BA] dark:text-white"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            {[
              { id: 'all', label: 'All' },
              { id: 'receive', label: 'Received' },
              { id: 'send', label: 'Sent' },
              { id: 'purchase', label: 'Shopping' },
              { id: 'subscription', label: 'Subscriptions' },
              { id: 'refund', label: 'Refunds' },
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-white dark:bg-slate-700 text-[#0070BA] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table / Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No transactions found
              </p>
              <p className="text-xs text-slate-400">
                Try adjusting your search query or filter criteria
              </p>
            </div>
          ) : (
            filtered.map(txn => {
              const isPositive = txn.amount > 0;
              return (
                <button
                  key={txn.id}
                  type="button"
                  onClick={() => setSelectedTransaction(txn)}
                  className="w-full py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl px-3 transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {txn.type === 'receive' || txn.type === 'refund' ? (
                        <ArrowDownLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      ) : txn.type === 'purchase' || txn.type === 'subscription' ? (
                        <ShoppingBag className="w-5 h-5 text-[#0070BA] dark:text-sky-400" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-[#0070BA] transition-colors">
                        {txn.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] text-slate-400">{txn.id}</span>
                        <span>·</span>
                        <span>{txn.date}</span>
                        <span>·</span>
                        <span className="truncate">{txn.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-4">
                    <div
                      className={`text-sm font-extrabold tabular-nums ${
                        isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {isPositive ? '+' : '-'}${Math.abs(txn.amount).toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      {txn.status}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
