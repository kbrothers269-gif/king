/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PayPalProvider, usePayPal } from './context/PayPalContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { WalletView } from './components/wallet/WalletView';
import { ActivityView } from './components/activity/ActivityView';
import { InvoicingView } from './components/invoicing/InvoicingView';
import { CryptoView } from './components/crypto/CryptoView';
import { DealsView } from './components/deals/DealsView';
import { SendMoneyModal } from './components/modals/SendMoneyModal';
import { RequestMoneyModal } from './components/modals/RequestMoneyModal';
import { TransferMoneyModal } from './components/modals/TransferMoneyModal';
import { QRCodeModal } from './components/modals/QRCodeModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { TransactionDetailModal } from './components/modals/TransactionDetailModal';
import { EasypaisaWithdrawModal } from './components/modals/EasypaisaWithdrawModal';
import { PDFStatementModal } from './components/modals/PDFStatementModal';
import { AppBarcodeModal } from './components/modals/AppBarcodeModal';
import { MobileDeviceFrame } from './components/mobile/MobileDeviceFrame';
import { PayPalLogo } from './components/common/PayPalLogo';
import { ShieldCheck, Lock, Globe } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentTab,
    isMobilePreview,
    setCurrentTab,
    isPDFOpen,
    setIsPDFOpen,
    isBarcodeOpen,
    setIsBarcodeOpen,
  } = usePayPal();

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'home':
        return <DashboardView />;
      case 'wallet':
        return <WalletView />;
      case 'activity':
        return <ActivityView />;
      case 'invoicing':
        return <InvoicingView />;
      case 'crypto':
        return <CryptoView />;
      case 'deals':
        return <DealsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MobileDeviceFrame>
          {renderActiveTab()}
        </MobileDeviceFrame>
      </main>

      {/* Modals */}
      <SendMoneyModal />
      <RequestMoneyModal />
      <TransferMoneyModal />
      <EasypaisaWithdrawModal />
      <QRCodeModal />
      <AddCardModal />
      <TransactionDetailModal />
      <PDFStatementModal isOpen={isPDFOpen} onClose={() => setIsPDFOpen(false)} />
      <AppBarcodeModal isOpen={isBarcodeOpen} onClose={() => setIsBarcodeOpen(false)} />

      {/* Footer */}
      {!isMobilePreview && (
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <PayPalLogo size="sm" />
                <span className="text-xs text-slate-500">
                  © 1999–2026 PayPal, Inc. All rights reserved.
                </span>
              </div>

              {/* Quick Footer Links */}
              <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-400">
                <button onClick={() => setCurrentTab('home')} className="hover:text-[#0070BA] transition-colors">
                  Help & Contact
                </button>
                <button onClick={() => setCurrentTab('wallet')} className="hover:text-[#0070BA] transition-colors">
                  Fees & Limits
                </button>
                <button onClick={() => setCurrentTab('activity')} className="hover:text-[#0070BA] transition-colors">
                  Security & Fraud Protection
                </button>
                <button onClick={() => setCurrentTab('deals')} className="hover:text-[#0070BA] transition-colors">
                  PayPal Rewards Terms
                </button>
                <button onClick={() => setCurrentTab('invoicing')} className="hover:text-[#0070BA] transition-colors">
                  Business Services
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
              PayPal, Inc. is licensed as a Money Transmitter by the New York State Department of Financial Services. PayPal Savings is provided by partner banks, Members FDIC. The PayPal Cashback Mastercard is issued by Synchrony Bank pursuant to a license by Mastercard International Incorporated.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PayPalProvider>
      <AppContent />
    </PayPalProvider>
  );
}
