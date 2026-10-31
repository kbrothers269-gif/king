import React from 'react';
import { usePayPal } from '../../context/PayPalContext';
import {
  Home,
  Wallet,
  Clock,
  Sparkles,
  Send,
  QrCode,
  Battery,
  Wifi,
  Signal,
  X,
} from 'lucide-react';

interface MobileDeviceFrameProps {
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({ children }) => {
  const {
    isMobilePreview,
    setIsMobilePreview,
    currentTab,
    setCurrentTab,
    setIsSendOpen,
    setIsQRCodeOpen,
  } = usePayPal();

  if (!isMobilePreview) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900/90 dark:bg-slate-950 p-4 sm:p-8 flex items-center justify-center animate-in fade-in duration-200">
      {/* Phone container */}
      <div className="relative w-full max-w-[420px] h-[870px] bg-slate-950 rounded-[50px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-4 border-slate-700/80 ring-1 ring-slate-800 flex flex-col overflow-hidden">
        
        {/* Dynamic Island Notch */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950/80" />
        </div>

        {/* Screen Bezel */}
        <div className="relative w-full h-full bg-[#F5F7FA] dark:bg-slate-950 rounded-[40px] overflow-hidden flex flex-col">
          
          {/* iOS Status Bar */}
          <div className="h-11 px-7 flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200 shrink-0 z-40 select-none">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* Phone Scroll Content */}
          <div className="flex-1 overflow-y-auto px-4 py-2 pb-24">
            {children}
          </div>

          {/* Floating Mobile Bottom Tab Bar */}
          <nav className="absolute bottom-0 inset-x-0 h-18 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 items-center px-2 z-40">
            <button
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'home' ? 'text-[#0070BA] dark:text-[#38BDF8]' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Home</span>
            </button>

            <button
              onClick={() => setCurrentTab('wallet')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'wallet' ? 'text-[#0070BA] dark:text-[#38BDF8]' : 'text-slate-500'
              }`}
            >
              <Wallet className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Wallet</span>
            </button>

            {/* Central Floating Pay / QR Button */}
            <button
              onClick={() => setIsSendOpen(true)}
              className="flex flex-col items-center justify-center h-full -mt-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#0070BA] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <Send className="w-5 h-5 ml-0.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 mt-1">Send</span>
            </button>

            <button
              onClick={() => setCurrentTab('activity')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'activity' ? 'text-[#0070BA] dark:text-[#38BDF8]' : 'text-slate-500'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Activity</span>
            </button>

            <button
              onClick={() => setCurrentTab('deals')}
              className={`flex flex-col items-center justify-center h-full transition-colors ${
                currentTab === 'deals' ? 'text-[#0070BA] dark:text-[#38BDF8]' : 'text-slate-500'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">Deals</span>
            </button>
          </nav>

          {/* iOS Home Indicator Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full z-50 pointer-events-none" />
        </div>
      </div>

      {/* Floating Exit Mobile Mode Button */}
      <button
        onClick={() => setIsMobilePreview(false)}
        className="fixed top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-full text-xs font-bold shadow-2xl hover:bg-slate-100 transition-all z-50"
      >
        <X className="w-4 h-4" />
        <span>Exit Phone View</span>
      </button>
    </div>
  );
};
