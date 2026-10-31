import React, { useState } from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Send,
  Eye,
  Printer,
  X,
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../../types/paypal';

export const InvoicingView: React.FC = () => {
  const { invoices, createInvoice, markInvoicePaid } = usePayPal();

  const [isCreating, setIsCreating] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // New Invoice form state
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-20');
  const [notes, setNotes] = useState('Net 15 days payment terms. PayPal Buyer & Seller Protection applies.');
  const [taxRate, setTaxRate] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Design Consultation & Prototype', quantity: 1, unitPrice: 500, amount: 500 },
  ]);

  const handleAddItem = () => {
    setItems(prev => [
      ...prev,
      { id: String(Date.now()), description: '', quantity: 1, unitPrice: 100, amount: 100 },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: 'description' | 'quantity' | 'unitPrice', val: any) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          updated.amount = (Number(updated.quantity) || 0) * (Number(updated.unitPrice) || 0);
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const taxAmount = (subtotal * (Number(taxRate) || 0)) / 100;
  const total = Math.max(0, subtotal + taxAmount - (Number(discount) || 0));

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim() || items.length === 0) return;

    createInvoice({
      invoiceNumber: `INV-2026-0${Math.floor(10 + Math.random() * 90)}`,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      date: 'Today',
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discount,
      total,
      currency: 'USD',
      status: 'sent',
      note: notes,
    });

    setIsCreating(false);
    setRecipientName('');
    setRecipientEmail('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            PayPal Invoicing
          </h2>
          <p className="text-xs text-slate-500">
            Create, send, and track professional client invoices with instant online checkout
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0070BA] hover:bg-[#003087] text-white text-xs font-bold rounded-full shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Invoice</span>
        </button>
      </div>

      {/* Invoices List */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Invoices ({invoices.length})
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {invoices.map(inv => (
            <div
              key={inv.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0070BA] dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {inv.recipientName}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      #{inv.invoiceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Due: {inv.dueDate} · {inv.items.length} line item(s) · {inv.recipientEmail}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-base font-extrabold text-slate-900 dark:text-white tabular-nums">
                  ${inv.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>

                <button
                  type="button"
                  onClick={() => setViewingInvoice(inv)}
                  className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Preview Invoice"
                >
                  <Eye className="w-4 h-4" />
                </button>

                {inv.status !== 'paid' && (
                  <button
                    type="button"
                    onClick={() => markInvoicePaid(inv.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Simulate Payment</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                New PayPal Invoice
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Bill To (Client Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Studio LLC"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Client Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              {/* Line items table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Items / Services
                  </span>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs font-semibold text-[#0070BA] dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map(it => (
                    <div key={it.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Description of item or service"
                        value={it.description}
                        onChange={e => handleUpdateItem(it.id, 'description', e.target.value)}
                        className="flex-3 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                        required
                      />
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={it.quantity}
                        onChange={e => handleUpdateItem(it.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-center dark:text-white"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Price"
                        value={it.unitPrice}
                        onChange={e => handleUpdateItem(it.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-24 px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-right dark:text-white"
                      />
                      <span className="w-20 text-xs font-bold text-slate-800 dark:text-slate-200 text-right tabular-nums">
                        ${it.amount.toFixed(2)}
                      </span>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(it.id)}
                          className="p-1 text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals Calculation */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-bold tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Tax (%):</span>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-right"
                  />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500">Discount ($):</span>
                  <input
                    type="number"
                    value={discount}
                    onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-white dark:bg-slate-900 border rounded-lg text-right"
                  />
                </div>
                <div className="flex justify-between font-extrabold text-sm border-t border-slate-200 dark:border-slate-700 pt-2 text-[#0070BA] dark:text-sky-300">
                  <span>Total Amount Due:</span>
                  <span className="tabular-nums">${total.toFixed(2)} USD</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Notes & Payment Terms
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0070BA] hover:bg-[#003087] text-white font-bold text-xs rounded-full shadow transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Invoice via PayPal</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* VIEW INVOICE MODAL */}
      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold">Invoice #{viewingInvoice.invoiceNumber}</h3>
                <span className="text-xs text-slate-500">Status: {viewingInvoice.status.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewingInvoice(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <div>
                  <span className="text-slate-400 block font-semibold">BILLED TO</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{viewingInvoice.recipientName}</span>
                  <span className="text-slate-500 block">{viewingInvoice.recipientEmail}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block font-semibold">DUE DATE</span>
                  <span className="font-bold text-slate-900 dark:text-white">{viewingInvoice.dueDate}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 space-y-2">
                {viewingInvoice.items.map(it => (
                  <div key={it.id} className="flex justify-between">
                    <span>{it.description} (x{it.quantity})</span>
                    <span className="font-semibold tabular-nums">${it.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-extrabold text-sm text-[#0070BA] dark:text-sky-300">
                <span>Total:</span>
                <span className="tabular-nums">${viewingInvoice.total.toFixed(2)} USD</span>
              </div>

              {viewingInvoice.note && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 italic">
                  &ldquo;{viewingInvoice.note}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
