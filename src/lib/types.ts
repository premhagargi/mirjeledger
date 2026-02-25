import type { Timestamp } from 'firebase/firestore';

export type Stock = {
  id: string;
  name: string;
  type: 'tea' | 'coffee';
  createdAt: Timestamp;
};

export type Agent = {
  id: string;
  name: string;
  phone?: string;
  createdAt: Timestamp;
};

export type Purchase = {
  id: string;
  date: Timestamp;
  agentId: string;
  agentName: string;
  stockId: string;
  stockName: string;
  kg: number;
  bags: number;
  rate: number;
  totalAmount: number;
  createdAt: Timestamp;
};

export type Sale = {
  id: string;
  date: Timestamp;
  customerType: 'customer' | 'cash';
  customerName?: string;
  stockId: string;
  stockName: string;
  kg: number;
  bags: number;
  purchaseRate: number;
  saleRate: number;
  totalAmount: number;
  createdAt: Timestamp;
};