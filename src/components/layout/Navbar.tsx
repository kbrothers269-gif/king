import React from 'react';
import { usePayPal } from '../../context/PayPalContext';
import { PayPalLogo } from '../common/PayPalLogo';
import {
  Send,
  QrCode,
  Smartphone,
  Monitor,
  Moon,
  Sun,
  RotateCcw,
  FileText,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentTab,
    setCurrentTab,
    setIsSendOpen,
    setIsRequestOpen,
    setIsTransferOpen,
    setIsEasypaisaOpen,
    setIsPDFOpen,
    setIsBarcodeOpen,
    setIsQRCodeOpen,
    user,
    isMobilePreview,
    setIsMobilePreview,
    isDarkMode,
    toggleDarkMode,
    resetAllData,
  } = usePayPal();

  const handleNavClick = (tab: 'home' | 'activity' | 'wallet' | 'invoicing' | 'crypto' | 'deals') => {
    setCurrentTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text/logo element) */}
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 text-left focus:outline-none shrink-0"
            aria-label="PayPal Home"
          >
            <PayPalLogo size="md" />
          </button>

          {/* Zone 2: 4-5 single-line nav links with hover states */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-tight">
            <button
              onClick={() => handleNavClick('home')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'home'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                setIsSendOpen(true);
              }}
              className="text-slate-600 dark:text-slate-400 border-b-2 border-transparent hover:text-slate-900 dark:hover:text-slate-100 whitespace-nowrap shrink-0 transition-colors py-1"
            >
              Send & Request
            </button>
            <button
              onClick={() => handleNavClick('wallet')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'wallet'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Wallet
            </button>
            <button
              onClick={() => handleNavClick('activity')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'activity'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => handleNavClick('invoicing')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'invoicing'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Invoicing
            </button>
            <button
              onClick={() => handleNavClick('crypto')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'crypto'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Crypto
            </button>
            <button
              onClick={() => handleNavClick('deals')}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 border-b-2 ${
                currentTab === 'deals'
                  ? 'text-[#0070BA] border-[#0070BA] dark:text-[#38BDF8] dark:border-[#38BDF8]'
                  : 'text-slate-600 dark:text-slate-400 border-transparent hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              Deals
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* View Mode Toggle: Desktop / Mobile Phone View */}
            <button
              onClick={() => setIsMobilePreview(!isMobilePreview)}
              title={isMobilePreview ? "Switch to Desktop view" : "Switch to Mobile Phone view"}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Phone Frame View"
            >
              {isMobilePreview ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Data to Default */}
            <button
              onClick={() => {
                if (window.confirm('Reset PayPal data back to initial demo balances and transactions?')) {
                  resetAllData();
                }
              }}
              title="Reset Demo Data"
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Reset demo data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* App Barcode & Install Trigger */}
            <button
              onClick={() => setIsBarcodeOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-[#0070BA] dark:hover:text-[#38BDF8] rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Show App Barcode & QR Code (موبائل انسٹال بارکوڈ)"
              aria-label="App Barcode"
            >
              <QrCode className="w-4 h-4" />
            </button>

            {/* Official PDF Statement Button */}
            <button
              onClick={() => setIsPDFOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              title="Download Official Account Statement & Tax Certificate (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-rose-500" />
              <span>PDF Statement</span>
            </button>

            {/* Easypaisa Quick Withdraw Button */}
            <button
              onClick={() => setIsEasypaisaOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#00A859] hover:bg-[#008f4c] rounded-full shadow-xs transition-all active:scale-95 whitespace-nowrap shrink-0"
              title="Withdraw directly to Easypaisa"
            >
              <span>🇵🇰 Easypaisa</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => setIsSendOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-[#0070BA] hover:bg-[#003087] rounded-full shadow-sm hover:shadow transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Money</span>
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => setCurrentTab('wallet')}
              className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700 hover:ring-2 hover:ring-[#0070BA] transition-all ml-1 shrink-0"
              title={`${user.name} (${user.tag})`}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#003087] text-white flex items-center justify-center text-xs font-bold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
