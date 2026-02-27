import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, lang: 'en' | 'am' = 'en') {
  const currency = lang === 'en' ? 'ETB' : 'ብር';
  return new Intl.NumberFormat(lang === 'en' ? 'en-ET' : 'am-ET', {
    style: 'currency',
    currency: 'ETB',
    currencyDisplay: 'narrowSymbol',
  }).format(amount).replace('ETB', currency);
}

export const translations = {
  en: {
    dashboard: 'Dashboard',
    waiterPortal: 'Waiter Portal',
    revenue: 'Revenue',
    transactions: 'Transactions',
    scanReceipt: 'Scan Receipt',
    matchPayment: 'Match Payment',
    recentActivity: 'Recent Activity',
    shift: 'Shift',
    tips: 'Tips',
    closeShift: 'Close Shift',
    history: 'History',
    settings: 'Settings',
    profile: 'Profile',
    matched: 'Matched',
    flagged: 'Flagged',
    pending: 'Pending',
    riskScore: 'Risk Score',
  },
  am: {
    dashboard: 'ዳሽቦርድ',
    waiterPortal: 'የአሳላፊ ፖርታል',
    revenue: 'ገቢ',
    transactions: 'ግብይቶች',
    scanReceipt: 'ደረሰኝ ይቃኙ',
    matchPayment: 'ክፍያ ያዛምዱ',
    recentActivity: 'የቅርብ ጊዜ እንቅስቃሴ',
    shift: 'ፈረቃ',
    tips: 'ጉርሻ',
    closeShift: 'ፈረቃ ዝጋ',
    history: 'ታሪክ',
    settings: 'ቅንብሮች',
    profile: 'መገለጫ',
    matched: 'የተዛመደ',
    flagged: 'የተጠቆመ',
    pending: 'በመጠባበቅ ላይ',
    riskScore: 'የስጋት ደረጃ',
  }
};