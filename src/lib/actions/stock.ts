'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { StockSchema } from '../schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getStocks() {
  const q = query(collection(db, 'stocks'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
}

export async function addStock(values: z.infer<typeof StockSchema>) {
  const validatedFields = StockSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { name, type } = validatedFields.data;

  await addDoc(collection(db, 'stocks'), {
    name,
    type,
    createdAt: serverTimestamp(),
  });

  revalidatePath('/stock');
}

export async function updateStock(id: string, values: z.infer<typeof StockSchema>) {
  const validatedFields = StockSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { name, type } = validatedFields.data;
  const docRef = doc(db, 'stocks', id);
  await updateDoc(docRef, { name, type });

  revalidatePath('/stock');
}

export async function deleteStock(id: string) {
  const docRef = doc(db, 'stocks', id);
  await deleteDoc(docRef);

  revalidatePath('/stock');
}
