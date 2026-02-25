'use server';

import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { PurchaseSchema } from '../schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import type { Agent, Stock } from '../types';

export async function getPurchases() {
  const q = query(collection(db, 'purchases'), orderBy('date', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
}

export async function addPurchase(values: z.infer<typeof PurchaseSchema>) {
  const validatedFields = PurchaseSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { date, agentId, stockId, kg, bags, rate } = validatedFields.data;

  const agentDoc = await getDoc(doc(db, 'agents', agentId));
  const stockDoc = await getDoc(doc(db, 'stocks', stockId));

  if (!agentDoc.exists() || !stockDoc.exists()) {
    throw new Error('Agent or Stock not found');
  }

  const agentName = (agentDoc.data() as Agent).name;
  const stockName = (stockDoc.data() as Stock).name;

  const totalAmount = kg * rate;

  await addDoc(collection(db, 'purchases'), {
    date,
    agentId,
    agentName,
    stockId,
    stockName,
    kg,
    bags,
    rate,
    totalAmount,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/purchases');
}
