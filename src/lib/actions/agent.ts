'use server';

import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { AgentSchema } from '../schemas';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function getAgents() {
  const q = query(collection(db, 'agents'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
}

export async function addAgent(values: z.infer<typeof AgentSchema>) {
  const validatedFields = AgentSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }

  const { name, phone } = validatedFields.data;

  await addDoc(collection(db, 'agents'), {
    name,
    phone: phone || '',
    createdAt: serverTimestamp(),
  });

  revalidatePath('/agents');
}

export async function updateAgent(id: string, values: z.infer<typeof AgentSchema>) {
  const validatedFields = AgentSchema.safeParse(values);

  if (!validatedFields.success) {
    throw new Error('Invalid fields');
  }
  
  const { name, phone } = validatedFields.data;
  const docRef = doc(db, 'agents', id);
  await updateDoc(docRef, { name, phone: phone || '' });

  revalidatePath('/agents');
}

export async function deleteAgent(id: string) {
  const docRef = doc(db, 'agents', id);
  await deleteDoc(docRef);

  revalidatePath('/agents');
}
