import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin';
import { PurchaseSchema } from '@/lib/schemas';

function getDb() {
  return getFirestore(getAdminApp());
}

export async function GET() {
  try {
    const db = getDb();
    const purchasesRef = db.collection('purchases') as CollectionReference<DocumentData>;
    const snapshot = await purchasesRef.orderBy('date', 'desc').get();
    const purchases = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json({ error: 'Failed to fetch purchases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = PurchaseSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { date, agentId, stockId, kg, bags, rate } = validatedFields.data;

    const db = getDb();
    
    // Get agent name
    const agentDoc = await db.collection('agents').doc(agentId).get();
    const stockDoc = await db.collection('stocks').doc(stockId).get();

    if (!agentDoc.exists || !stockDoc.exists) {
      return NextResponse.json({ error: 'Agent or Stock not found' }, { status: 400 });
    }

    const agentData = agentDoc.data() as any;
    const stockData = stockDoc.data() as any;
    const agentName = agentData?.name;
    const stockName = stockData?.name;

    const totalAmount = kg * rate;

    const purchasesRef = db.collection('purchases') as CollectionReference<DocumentData>;
    const docRef = await purchasesRef.add({
      date,
      agentId,
      agentName,
      stockId,
      stockName,
      kg,
      bags,
      rate,
      totalAmount,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Purchase created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json({ error: 'Failed to create purchase' }, { status: 500 });
  }
}
