export type Currency = 'USD' | 'PKR' | 'EUR' | 'GBP' | 'CAD' | 'JPY';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  tag: string; // e.g. @mahmed_pk
  avatarUrl: string;
  paypalMeUrl: string;
  accountType: 'Personal' | 'Premier' | 'Business';
  country: string;
  city: string;
  memberSince: string;
  balances: Record<Currency, number>;
  pendingBalance: number;
  rewardPoints: number; // 100 pts = $1.00
  savingsApy: number; // e.g. 4.30%
  savingsBalance: number;
  easypaisaNumber?: string;
  jazzcashNumber?: string;
  raastId?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  tag: string;
  phone: string;
  avatarUrl: string;
  recentNote?: string;
  favorite?: boolean;
}

export type PaymentMethodType = 'balance' | 'card' | 'bank' | 'easypaisa' | 'jazzcash';

export interface PaymentCard {
  id: string;
  type: 'card';
  cardholderName: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'paypal-cashback';
  last4: string;
  fullNumber?: string;
  cvv?: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  isLocked: boolean;
  cardColor: string;
  spendingLimit?: number;
  cashbackRate?: string;
}

export interface BankAccount {
  id: string;
  type: 'bank';
  bankName: string;
  accountType: 'Checking' | 'Savings' | 'Islamic Current' | 'Asaan Account' | 'Freelancer Account';
  last4: string;
  routingNumber: string; // or IBAN / Branch Code
  iban?: string;
  isDefault: boolean;
  instantTransferEligible: boolean;
}

export interface MobileWalletAccount {
  id: string;
  type: 'mobile_wallet';
  provider: 'easypaisa' | 'jazzcash' | 'raast';
  accountTitle: string;
  mobileNumber: string; // e.g. 0344-7234217
  isDefault: boolean;
  status: 'active' | 'pending';
}

export type TransactionType = 'send' | 'receive' | 'purchase' | 'subscription' | 'transfer' | 'refund';
export type TransactionStatus = 'completed' | 'pending' | 'cancelled';
export type PaymentCategory = 'friends_family' | 'goods_services' | 'shopping' | 'bills' | 'banking' | 'pakistan_withdrawal';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  counterparty: string;
  counterpartyEmail?: string;
  counterpartyAvatar?: string;
  amount: number;
  currency: Currency;
  pkrAmount?: number; // Equivalent converted PKR for Easypaisa/Pakistani transfers
  exchangeRate?: number; // e.g. 278.50 PKR/USD
  date: string;
  rawDate: number; // timestamp
  status: TransactionStatus;
  category: PaymentCategory;
  paymentMethod: string;
  fee: number;
  note?: string;
  protectionEligible: boolean;
  invoiceId?: string;
  easypaisaRef?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  recipientName: string;
  recipientEmail: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  currency: Currency;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  note?: string;
}

export interface CryptoAsset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change24h: number;
  holdingAmount: number;
  holdingValue: number;
  sparkline: number[];
  color: string;
  iconSvg?: string;
}

export interface DealOffer {
  id: string;
  merchant: string;
  logo: string;
  category: string;
  cashback: string;
  terms: string;
  expires: string;
  activated: boolean;
}
