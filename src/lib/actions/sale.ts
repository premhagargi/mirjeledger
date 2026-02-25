'use server';

import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { SaleSchema } from '../schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Stock, Purchase } from '../types';

export async function getSales() {
  const q = query(collection(db, 'sales'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
}

export async function addSale(values: z.infer<typeof SaleSchema>) {
  const validatedFields = SaleSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { date, customerType, customerName, stockId, kg, bags, saleRate } = validatedFields.data;

  const stockDoc = await getDoc(doc(db, 'stocks', stockId));

  if (!stockDoc.exists()) {
    throw new Error('Stock not found');
  }

  const stockName = (stockDoc.data() as Stock).name;
  
  // Get the last purchase rate for this stock
  const purchaseQuery = query(
    collection(db, 'purchases'),
    where('stockId', '==', stockId),
    orderBy('date', 'desc'),
    limit(1)
  );
  const purchaseSnap = await getDocs(purchaseQuery);
  const purchaseRate = purchaseSnap.empty ? 0 : (purchaseSnap.docs[0].data() as Purchase).rate;
  
  const totalAmount = kg * saleRate;

  await addDoc(collection(db, 'sales'), {
    date,
    customerType,
    customerName: customerName || '',
    stockId,
    stockName,
    kg,
    bags,
    purchaseRate,
    saleRate,
    totalAmount,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/sales');
}

export async function getLatestPurchaseRate(stockId: string): Promise<number> {
    if (!stockId) return 0;
    
    const purchaseQuery = query(
        collection(db, 'purchases'),
        where('stockId', '==', stockId),
        orderBy('date', 'desc'),
        limit(1)
    );
    const purchaseSnap = await getDocs(purchaseQuery);
    if (purchaseSnap.empty) return 0;

    const latestPurchase = purchaseSnap.docs[0].data() as Purchase;
    return latestPurchase.rate;
}
