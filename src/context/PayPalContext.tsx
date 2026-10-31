import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Contact,
  PaymentCard,
  BankAccount,
  MobileWalletAccount,
  Transaction,
  Invoice,
  CryptoAsset,
  DealOffer,
  Currency,
} from '../types/paypal';
import {
  INITIAL_USER,
  INITIAL_WALLETS,
  INITIAL_CONTACTS,
  INITIAL_CARDS,
  INITIAL_BANKS,
  INITIAL_TRANSACTIONS,
  INITIAL_INVOICES,
  INITIAL_CRYPTO,
  INITIAL_DEALS,
} from '../data/initialData';

interface SendMoneyParams {
  recipientName: string;
  recipientEmailOrTag: string;
  recipientAvatar?: string;
  amount: number;
  currency: Currency;
  note: string;
  fundingSourceId: string;
  category: 'friends_family' | 'goods_services';
}

interface RequestMoneyParams {
  recipients: Array<{ name: string; emailOrTag: string }>;
  amount: number;
  currency: Currency;
  note: string;
  splitEvenly: boolean;
}

interface TransferParams {
  amount: number;
  type: 'to_bank' | 'from_bank';
  bankId: string;
  speed: 'instant' | 'standard';
}

interface EasypaisaWithdrawParams {
  usdAmount: number;
  mobileNumber: string;
  accountTitle: string;
  provider: 'easypaisa' | 'jazzcash' | 'raast';
  exchangeRate?: number;
}

interface AddCardParams {
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'paypal-cashback';
}

interface PayPalContextType {
  user: UserProfile;
  contacts: Contact[];
  cards: PaymentCard[];
  banks: BankAccount[];
  mobileWallets: MobileWalletAccount[];
  transactions: Transaction[];
  invoices: Invoice[];
  cryptoAssets: CryptoAsset[];
  deals: DealOffer[];
  activeCurrency: Currency;
  setActiveCurrency: (c: Currency) => void;
  usdToPkrRate: number;
  // Modals
  isSendOpen: boolean;
  setIsSendOpen: (open: boolean) => void;
  isRequestOpen: boolean;
  setIsRequestOpen: (open: boolean) => void;
  isTransferOpen: boolean;
  setIsTransferOpen: (open: boolean) => void;
  isEasypaisaOpen: boolean;
  setIsEasypaisaOpen: (open: boolean) => void;
  isPDFOpen: boolean;
  setIsPDFOpen: (open: boolean) => void;
  isBarcodeOpen: boolean;
  setIsBarcodeOpen: (open: boolean) => void;
  isQRCodeOpen: boolean;
  setIsQRCodeOpen: (open: boolean) => void;
  isAddCardOpen: boolean;
  setIsAddCardOpen: (open: boolean) => void;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (t: Transaction | null) => void;
  sendTargetContact: Contact | null;
  setSendTargetContact: (c: Contact | null) => void;
  // Actions
  sendMoney: (params: SendMoneyParams) => Promise<Transaction>;
  requestMoney: (params: RequestMoneyParams) => Promise<void>;
  transferMoney: (params: TransferParams) => Promise<Transaction>;
  withdrawToEasypaisa: (params: EasypaisaWithdrawParams) => Promise<Transaction>;
  addMobileWallet: (wallet: Omit<MobileWalletAccount, 'id'>) => void;
  addCard: (card: AddCardParams) => void;
  removeCard: (cardId: string) => void;
  toggleCardLock: (cardId: string) => void;
  setDefaultCard: (cardId: string) => void;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  markInvoicePaid: (invoiceId: string) => void;
  toggleDealActivation: (dealId: string) => void;
  buyCrypto: (cryptoId: string, usdAmount: number) => boolean;
  sellCrypto: (cryptoId: string, cryptoUnits: number) => boolean;
  refundTransaction: (transactionId: string) => void;
  resetAllData: () => void;
  // Search & Navigation
  currentTab: 'home' | 'activity' | 'wallet' | 'invoicing' | 'crypto' | 'deals';
  setCurrentTab: (tab: 'home' | 'activity' | 'wallet' | 'invoicing' | 'crypto' | 'deals') => void;
  isMobilePreview: boolean;
  setIsMobilePreview: (v: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const PayPalContext = createContext<PayPalContextType | undefined>(undefined);

const STORAGE_KEY = 'paypal_app_state_pk_v4';

export const PayPalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const usdToPkrRate = 278.50;

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [mobileWallets, setMobileWallets] = useState<MobileWalletAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_wallets`);
    return saved ? JSON.parse(saved) : INITIAL_WALLETS;
  });

  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_contacts`);
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [cards, setCards] = useState<PaymentCard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_cards`);
    return saved ? JSON.parse(saved) : INITIAL_CARDS;
  });

  const [banks, setBanks] = useState<BankAccount[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_banks`);
    return saved ? JSON.parse(saved) : INITIAL_BANKS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_txns`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  const [cryptoAssets, setCryptoAssets] = useState<CryptoAsset[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_crypto`);
    return saved ? JSON.parse(saved) : INITIAL_CRYPTO;
  });

  const [deals, setDeals] = useState<DealOffer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_deals`);
    return saved ? JSON.parse(saved) : INITIAL_DEALS;
  });

  const [activeCurrency, setActiveCurrency] = useState<Currency>('USD');
  const [currentTab, setCurrentTab] = useState<'home' | 'activity' | 'wallet' | 'invoicing' | 'crypto' | 'deals'>('home');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('paypal_theme') === 'dark';
  });

  // Modals state
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isEasypaisaOpen, setIsEasypaisaOpen] = useState(false);
  const [isPDFOpen, setIsPDFOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [isQRCodeOpen, setIsQRCodeOpen] = useState(false);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [sendTargetContact, setSendTargetContact] = useState<Contact | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_wallets`, JSON.stringify(mobileWallets));
  }, [mobileWallets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_contacts`, JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_cards`, JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_banks`, JSON.stringify(banks));
  }, [banks]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_txns`, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_crypto`, JSON.stringify(cryptoAssets));
  }, [cryptoAssets]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_deals`, JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('paypal_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('paypal_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const triggerConfetti = (colors?: string[]) => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: colors || ['#00A859', '#003087', '#0070BA', '#10B981'],
      });
    } catch {
      // fallback
    }
  };

  const withdrawToEasypaisa = async (params: EasypaisaWithdrawParams): Promise<Transaction> => {
    const rate = params.exchangeRate || usdToPkrRate;
    const pkrCredited = +(params.usdAmount * rate).toFixed(2);
    const providerName = params.provider === 'easypaisa' ? 'Easypaisa' : params.provider === 'jazzcash' ? 'JazzCash' : 'Raast';
    const epRef = `EP-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    // Deduct USD balance, credit PKR balance
    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        USD: Math.max(0, (prev.balances.USD || 0) - params.usdAmount),
        PKR: (prev.balances.PKR || 0) + pkrCredited,
      },
    }));

    const newTxn: Transaction = {
      id: `TRX-${params.provider.toUpperCase().slice(0, 2)}-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'transfer',
      title: `Withdrawn to ${providerName}`,
      subtitle: `Rs ${pkrCredited.toLocaleString('en-US', { minimumFractionDigits: 2 })} PKR credited to ${params.mobileNumber}`,
      counterparty: `${providerName} (${params.accountTitle})`,
      amount: -params.usdAmount,
      currency: 'USD',
      pkrAmount: pkrCredited,
      exchangeRate: rate,
      date: 'Just now',
      rawDate: Date.now(),
      status: 'completed',
      category: 'pakistan_withdrawal',
      paymentMethod: `${providerName} Account (${params.mobileNumber})`,
      fee: 0.00,
      protectionEligible: false,
      easypaisaRef: epRef,
      note: `Instant payout to ${providerName} mobile account · Live rate: Rs ${rate.toFixed(2)}/USD · 0% SBP Remittance Tax`,
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Green celebration confetti for Pakistani withdrawal!
    triggerConfetti(['#00A859', '#10B981', '#047857', '#F59E0B']);
    return newTxn;
  };

  const addMobileWallet = (wallet: Omit<MobileWalletAccount, 'id'>) => {
    const newWallet: MobileWalletAccount = {
      ...wallet,
      id: `wallet_${Date.now()}`,
    };
    setMobileWallets(prev => [...prev, newWallet]);
    triggerConfetti();
  };

  const sendMoney = async (params: SendMoneyParams): Promise<Transaction> => {
    const fee = params.category === 'goods_services' ? +(params.amount * 0.0299 + 0.49).toFixed(2) : 0;
    const isFromBalance = params.fundingSourceId === 'balance';

    if (isFromBalance) {
      setUser(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          [params.currency]: Math.max(0, (prev.balances[params.currency] || 0) - params.amount),
        },
        rewardPoints: prev.rewardPoints + Math.floor(params.amount * 1),
      }));
    }

    let fundingSourceName = 'PayPal Balance';
    if (params.fundingSourceId !== 'balance') {
      const card = cards.find(c => c.id === params.fundingSourceId);
      const bank = banks.find(b => b.id === params.fundingSourceId);
      const wallet = mobileWallets.find(w => w.id === params.fundingSourceId);
      if (card) {
        fundingSourceName = `${card.brand === 'paypal-cashback' ? 'PayPal Cashback' : card.brand.toUpperCase()} •••• ${card.last4}`;
      } else if (bank) {
        fundingSourceName = `${bank.bankName} •••• ${bank.last4}`;
      } else if (wallet) {
        fundingSourceName = `${wallet.provider.toUpperCase()} (${wallet.mobileNumber})`;
      }
    }

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}-PP`,
      type: 'send',
      title: params.recipientName,
      subtitle: params.note || (params.category === 'friends_family' ? 'Personal payment' : 'Goods & Services'),
      counterparty: params.recipientName,
      counterpartyEmail: params.recipientEmailOrTag.includes('@') ? params.recipientEmailOrTag : undefined,
      counterpartyAvatar: params.recipientAvatar,
      amount: -Math.abs(params.amount),
      currency: params.currency,
      pkrAmount: params.currency === 'USD' ? +(params.amount * usdToPkrRate).toFixed(2) : undefined,
      exchangeRate: params.currency === 'USD' ? usdToPkrRate : undefined,
      date: 'Just now',
      rawDate: Date.now(),
      status: 'completed',
      category: params.category,
      paymentMethod: fundingSourceName,
      fee,
      note: params.note,
      protectionEligible: params.category === 'goods_services',
    };

    setTransactions(prev => [newTxn, ...prev]);

    // Check contact exists
    const exists = contacts.some(
      c => c.name.toLowerCase() === params.recipientName.toLowerCase() ||
           c.email.toLowerCase() === params.recipientEmailOrTag.toLowerCase() ||
           c.tag.toLowerCase() === params.recipientEmailOrTag.toLowerCase()
    );
    if (!exists && params.recipientName) {
      const newContact: Contact = {
        id: `ct_${Date.now()}`,
        name: params.recipientName,
        email: params.recipientEmailOrTag.includes('@') ? params.recipientEmailOrTag : `${params.recipientName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        tag: params.recipientEmailOrTag.startsWith('@') ? params.recipientEmailOrTag : `@${params.recipientName.toLowerCase().replace(/\s+/g, '')}`,
        phone: '+92 300 0000000',
        avatarUrl: params.recipientAvatar || '',
        recentNote: params.note,
        favorite: false,
      };
      setContacts(prev => [newContact, ...prev]);
    }

    triggerConfetti();
    return newTxn;
  };

  const requestMoney = async (params: RequestMoneyParams) => {
    const totalAmount = params.splitEvenly ? +(params.amount / params.recipients.length).toFixed(2) : params.amount;

    for (const rec of params.recipients) {
      const newTxn: Transaction = {
        id: `REQ-${Math.floor(10000 + Math.random() * 90000)}-PP`,
        type: 'receive',
        title: `Money Request from ${rec.name}`,
        subtitle: params.note || 'Payment Request Sent',
        counterparty: rec.name,
        counterpartyEmail: rec.emailOrTag,
        amount: totalAmount,
        currency: params.currency,
        pkrAmount: params.currency === 'USD' ? +(totalAmount * usdToPkrRate).toFixed(2) : undefined,
        exchangeRate: params.currency === 'USD' ? usdToPkrRate : undefined,
        date: 'Pending',
        rawDate: Date.now(),
        status: 'pending',
        category: 'friends_family',
        paymentMethod: 'PayPal Balance Request',
        fee: 0,
        note: params.note,
        protectionEligible: false,
      };
      setTransactions(prev => [newTxn, ...prev]);
    }

    triggerConfetti();
  };

  const transferMoney = async (params: TransferParams): Promise<Transaction> => {
    const bank = banks.find(b => b.id === params.bankId) || banks[0];
    const isInstant = params.speed === 'instant';
    const fee = isInstant ? Math.min(25, Math.max(0.25, +(params.amount * 0.0175).toFixed(2))) : 0;

    if (params.type === 'to_bank') {
      setUser(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          USD: Math.max(0, (prev.balances.USD || 0) - params.amount - fee),
        },
      }));

      const newTxn: Transaction = {
        id: `TRF-${Math.floor(10000 + Math.random() * 90000)}-PP`,
        type: 'transfer',
        title: `Transfer to ${bank.bankName}`,
        subtitle: `${isInstant ? 'Instant Transfer' : 'Standard Transfer (1-2 days)'} to ${bank.bankName} •••• ${bank.last4}`,
        counterparty: bank.bankName,
        amount: -params.amount,
        currency: 'USD',
        pkrAmount: +(params.amount * usdToPkrRate).toFixed(2),
        exchangeRate: usdToPkrRate,
        date: 'Just now',
        rawDate: Date.now(),
        status: 'completed',
        category: 'banking',
        paymentMethod: 'PayPal Balance',
        fee,
        protectionEligible: false,
        note: `${isInstant ? 'Instant wire' : 'Standard ACH wire'}`,
      };

      setTransactions(prev => [newTxn, ...prev]);
      triggerConfetti();
      return newTxn;
    } else {
      setUser(prev => ({
        ...prev,
        balances: {
          ...prev.balances,
          USD: (prev.balances.USD || 0) + params.amount,
        },
      }));

      const newTxn: Transaction = {
        id: `ADD-${Math.floor(10000 + Math.random() * 90000)}-PP`,
        type: 'receive',
        title: `Added Cash from ${bank.bankName}`,
        subtitle: `Transferred from ${bank.bankName} •••• ${bank.last4}`,
        counterparty: bank.bankName,
        amount: params.amount,
        currency: 'USD',
        date: 'Just now',
        rawDate: Date.now(),
        status: 'completed',
        category: 'banking',
        paymentMethod: `${bank.bankName} •••• ${bank.last4}`,
        fee: 0,
        protectionEligible: false,
      };

      setTransactions(prev => [newTxn, ...prev]);
      triggerConfetti();
      return newTxn;
    }
  };

  const addCard = (cardData: AddCardParams) => {
    const newCard: PaymentCard = {
      id: `card_${Date.now()}`,
      type: 'card',
      cardholderName: cardData.cardholderName.toUpperCase(),
      brand: cardData.brand,
      last4: cardData.cardNumber.replace(/\s+/g, '').slice(-4) || '1234',
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      isDefault: cards.length === 0,
      isLocked: false,
      cardColor: cardData.brand === 'paypal-cashback'
        ? 'from-[#003087] via-[#00457C] to-[#0070BA]'
        : cardData.brand === 'amex'
        ? 'from-[#002663] via-[#005187] to-[#1E3A8A]'
        : 'from-[#004D40] via-[#00695C] to-[#00796B]',
      spendingLimit: 7500,
    };

    setCards(prev => [...prev, newCard]);
    triggerConfetti();
  };

  const removeCard = (cardId: string) => {
    setCards(prev => prev.filter(c => c.id !== cardId));
  };

  const toggleCardLock = (cardId: string) => {
    setCards(prev =>
      prev.map(c => (c.id === cardId ? { ...c, isLocked: !c.isLocked } : c))
    );
  };

  const setDefaultCard = (cardId: string) => {
    setCards(prev =>
      prev.map(c => ({
        ...c,
        isDefault: c.id === cardId,
      }))
    );
  };

  const createInvoice = (inv: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...inv,
      id: `inv_${Date.now()}`,
    };
    setInvoices(prev => [newInvoice, ...prev]);
    triggerConfetti();
  };

  const markInvoicePaid = (invoiceId: string) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          setUser(u => ({
            ...u,
            balances: {
              ...u.balances,
              [inv.currency]: (u.balances[inv.currency] || 0) + inv.total,
            },
          }));

          const newTxn: Transaction = {
            id: `INV-PAID-${Math.floor(1000 + Math.random() * 9000)}`,
            type: 'receive',
            title: `Invoice Paid: ${inv.recipientName}`,
            subtitle: `Invoice #${inv.invoiceNumber}`,
            counterparty: inv.recipientName,
            counterpartyEmail: inv.recipientEmail,
            amount: inv.total,
            currency: inv.currency,
            pkrAmount: inv.currency === 'USD' ? +(inv.total * usdToPkrRate).toFixed(2) : undefined,
            exchangeRate: inv.currency === 'USD' ? usdToPkrRate : undefined,
            date: 'Just now',
            rawDate: Date.now(),
            status: 'completed',
            category: 'goods_services',
            paymentMethod: 'PayPal International Invoice',
            fee: +(inv.total * 0.0299 + 0.49).toFixed(2),
            protectionEligible: true,
            invoiceId: inv.invoiceNumber,
          };
          setTransactions(t => [newTxn, ...t]);

          return { ...inv, status: 'paid' };
        }
        return inv;
      })
    );
    triggerConfetti();
  };

  const toggleDealActivation = (dealId: string) => {
    setDeals(prev =>
      prev.map(d => (d.id === dealId ? { ...d, activated: !d.activated } : d))
    );
  };

  const buyCrypto = (cryptoId: string, usdAmount: number): boolean => {
    if ((user.balances.USD || 0) < usdAmount) return false;

    const asset = cryptoAssets.find(c => c.id === cryptoId);
    if (!asset) return false;

    const unitsPurchased = usdAmount / asset.currentPrice;

    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        USD: (prev.balances.USD || 0) - usdAmount,
      },
    }));

    setCryptoAssets(prev =>
      prev.map(c => {
        if (c.id === cryptoId) {
          const newUnits = c.holdingAmount + unitsPurchased;
          return {
            ...c,
            holdingAmount: newUnits,
            holdingValue: newUnits * c.currentPrice,
          };
        }
        return c;
      })
    );

    const newTxn: Transaction = {
      id: `CRYPTO-BUY-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'purchase',
      title: `Bought ${asset.name}`,
      subtitle: `${unitsPurchased.toFixed(5)} ${asset.symbol} @ $${asset.currentPrice.toLocaleString()}`,
      counterparty: 'PayPal Digital Crypto',
      amount: -usdAmount,
      currency: 'USD',
      date: 'Just now',
      rawDate: Date.now(),
      status: 'completed',
      category: 'shopping',
      paymentMethod: 'PayPal Balance',
      fee: 0,
      protectionEligible: false,
    };
    setTransactions(t => [newTxn, ...t]);

    triggerConfetti();
    return true;
  };

  const sellCrypto = (cryptoId: string, cryptoUnits: number): boolean => {
    const asset = cryptoAssets.find(c => c.id === cryptoId);
    if (!asset || asset.holdingAmount < cryptoUnits) return false;

    const usdGained = cryptoUnits * asset.currentPrice;

    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        USD: (prev.balances.USD || 0) + usdGained,
      },
    }));

    setCryptoAssets(prev =>
      prev.map(c => {
        if (c.id === cryptoId) {
          const newUnits = c.holdingAmount - cryptoUnits;
          return {
            ...c,
            holdingAmount: newUnits,
            holdingValue: newUnits * c.currentPrice,
          };
        }
        return c;
      })
    );

    const newTxn: Transaction = {
      id: `CRYPTO-SELL-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'receive',
      title: `Sold ${asset.name}`,
      subtitle: `${cryptoUnits.toFixed(5)} ${asset.symbol} @ $${asset.currentPrice.toLocaleString()}`,
      counterparty: 'PayPal Digital Crypto',
      amount: usdGained,
      currency: 'USD',
      date: 'Just now',
      rawDate: Date.now(),
      status: 'completed',
      category: 'shopping',
      paymentMethod: 'PayPal Balance',
      fee: 0,
      protectionEligible: false,
    };
    setTransactions(t => [newTxn, ...t]);

    triggerConfetti();
    return true;
  };

  const refundTransaction = (transactionId: string) => {
    const txn = transactions.find(t => t.id === transactionId);
    if (!txn || txn.amount >= 0) return;

    const refundAmount = Math.abs(txn.amount);

    setUser(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [txn.currency]: (prev.balances[txn.currency] || 0) + refundAmount,
      },
    }));

    const refundTxn: Transaction = {
      id: `REFUND-${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'refund',
      title: `Refund: ${txn.title}`,
      subtitle: `Dispute/Refund credited to balance`,
      counterparty: txn.counterparty,
      amount: refundAmount,
      currency: txn.currency,
      date: 'Just now',
      rawDate: Date.now(),
      status: 'completed',
      category: txn.category,
      paymentMethod: 'PayPal Balance',
      fee: 0,
      protectionEligible: true,
      note: `Original Transaction Ref: ${txn.id}`,
    };

    setTransactions(prev => [refundTxn, ...prev]);
    setSelectedTransaction(refundTxn);
    triggerConfetti();
  };

  const resetAllData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    localStorage.removeItem(`${STORAGE_KEY}_wallets`);
    localStorage.removeItem(`${STORAGE_KEY}_contacts`);
    localStorage.removeItem(`${STORAGE_KEY}_cards`);
    localStorage.removeItem(`${STORAGE_KEY}_banks`);
    localStorage.removeItem(`${STORAGE_KEY}_txns`);
    localStorage.removeItem(`${STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${STORAGE_KEY}_crypto`);
    localStorage.removeItem(`${STORAGE_KEY}_deals`);
    setUser(INITIAL_USER);
    setMobileWallets(INITIAL_WALLETS);
    setContacts(INITIAL_CONTACTS);
    setCards(INITIAL_CARDS);
    setBanks(INITIAL_BANKS);
    setTransactions(INITIAL_TRANSACTIONS);
    setInvoices(INITIAL_INVOICES);
    setCryptoAssets(INITIAL_CRYPTO);
    setDeals(INITIAL_DEALS);
    setActiveCurrency('USD');
    setCurrentTab('home');
  };

  return (
    <PayPalContext.Provider
      value={{
        user,
        contacts,
        cards,
        banks,
        mobileWallets,
        transactions,
        invoices,
        cryptoAssets,
        deals,
        activeCurrency,
        setActiveCurrency,
        usdToPkrRate,
        isSendOpen,
        setIsSendOpen,
        isRequestOpen,
        setIsRequestOpen,
        isTransferOpen,
        setIsTransferOpen,
        isEasypaisaOpen,
        setIsEasypaisaOpen,
        isPDFOpen,
        setIsPDFOpen,
        isBarcodeOpen,
        setIsBarcodeOpen,
        isQRCodeOpen,
        setIsQRCodeOpen,
        isAddCardOpen,
        setIsAddCardOpen,
        selectedTransaction,
        setSelectedTransaction,
        sendTargetContact,
        setSendTargetContact,
        sendMoney,
        requestMoney,
        transferMoney,
        withdrawToEasypaisa,
        addMobileWallet,
        addCard,
        removeCard,
        toggleCardLock,
        setDefaultCard,
        createInvoice,
        markInvoicePaid,
        toggleDealActivation,
        buyCrypto,
        sellCrypto,
        refundTransaction,
        resetAllData,
        currentTab,
        setCurrentTab,
        isMobilePreview,
        setIsMobilePreview,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </PayPalContext.Provider>
  );
};

export const usePayPal = (): PayPalContextType => {
  const context = useContext(PayPalContext);
  if (!context) {
    throw new Error('usePayPal must be used within a PayPalProvider');
  }
  return context;
};
