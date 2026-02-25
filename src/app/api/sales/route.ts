import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin';
import { SaleSchema } from '@/lib/schemas';

function getDb() {
  return getFirestore(getAdminApp());
}

export async function GET() {
  try {
    const db = getDb();
    const salesRef = db.collection('sales') as CollectionReference<DocumentData>;
    const snapshot = await salesRef.orderBy('date', 'desc').get();
    const sales = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = SaleSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { date, customerType, customerName, stockId, kg, bags, saleRate } = validatedFields.data;

    const db = getDb();
    
    // Get stock name
    const stockDoc = await db.collection('stocks').doc(stockId).get();

    if (!stockDoc.exists) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 400 });
    }

    const stockData = stockDoc.data() as any;
    const stockName = stockData?.name;
    
    // Get the last purchase rate for this stock
    const purchasesSnapshot = await db.collection('purchases')
      .where('stockId', '==', stockId)
      .orderBy('date', 'desc')
      .limit(1)
      .get();
    
    let purchaseRate = 0;
    if (!purchasesSnapshot.empty) {
      const purchaseData = purchasesSnapshot.docs[0].data() as any;
      purchaseRate = purchaseData?.rate || 0;
    }
    
    const totalAmount = kg * saleRate;

    const salesRef = db.collection('sales') as CollectionReference<DocumentData>;
    const docRef = await salesRef.add({
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
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Sale created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating sale:', error);
    return NextResponse.json({ error: 'Failed to create sale' }, { status: 500 });
  }
}
