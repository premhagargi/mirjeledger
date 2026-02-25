'use server';

import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Purchase, Sale, Stock } from '../types';

export async function getDashboardSummary() {
  try {
    const purchasesSnap = await getDocs(collection(db, 'purchases'));
    const totalPurchaseAmount = purchasesSnap.docs
      .map((doc) => doc.data() as Purchase)
      .reduce((sum, purchase) => sum + purchase.totalAmount, 0);

    const salesSnap = await getDocs(collection(db, 'sales'));
    const totalSalesAmount = salesSnap.docs
      .map((doc) => doc.data() as Sale)
      .reduce((sum, sale) => sum + sale.totalAmount, 0);

    const stockSnap = await getDocs(collection(db, 'stocks'));
    const totalStockCount = stockSnap.size;

    return {
      totalPurchaseAmount,
      totalSalesAmount,
      totalStockCount,
    };
  } catch (error) {
    console.error('Error getting dashboard summary:', error);
    throw new Error('Could not fetch dashboard summary data.');
  }
}
