export type PaymentMethod = 'Telebirr' | 'M-Pesa' | 'CBE Birr' | 'Cash' | 'Card';

export interface Transaction {
  id: string;
  waiterId: string;
  waiterName: string;
  amount: number;
  tip: number;
  method: PaymentMethod;
  status: 'matched' | 'pending' | 'flagged';
  receiptId: string;
  transactionId?: string;
  timestamp: string;
  riskScore?: number;
}

export interface Waiter {
  id: string;
  name: string;
  totalSales: number;
  tipsCollected: number;
  activeShift: boolean;
}

export interface DailyStats {
  date: string;
  revenue: number;
  transactions: number;
}

export interface Discrepancy {
  id: string;
  type: 'amount_mismatch' | 'duplicate_receipt' | 'invalid_merchant';
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: string;
  transactionId: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  waiterId: string;
  timestamp: string;
}

export type Language = 'en' | 'am';