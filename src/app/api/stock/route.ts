import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin';
import { StockSchema } from '@/lib/schemas';

function getDb() {
  return getFirestore(getAdminApp());
}

export async function GET() {
  try {
    const db = getDb();
    const stocksRef = db.collection('stocks') as CollectionReference<DocumentData>;
    const snapshot = await stocksRef.orderBy('createdAt', 'desc').get();
    const stocks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(stocks);
  } catch (error) {
    console.error('Error fetching stocks:', error);
    return NextResponse.json({ error: 'Failed to fetch stocks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = StockSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { name, type } = validatedFields.data;

    const db = getDb();
    const stocksRef = db.collection('stocks') as CollectionReference<DocumentData>;
    const docRef = await stocksRef.add({
      name,
      type,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Stock created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating stock:', error);
    return NextResponse.json({ error: 'Failed to create stock' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const validatedFields = StockSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { name, type } = validatedFields.data;
    const db = getDb();
    const docRef = db.collection('stocks').doc(id);
    await docRef.update({ name, type });

    return NextResponse.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Stock ID is required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('stocks').doc(id);
    await docRef.delete();

    return NextResponse.json({ message: 'Stock deleted successfully' });
  } catch (error) {
    console.error('Error deleting stock:', error);
    return NextResponse.json({ error: 'Failed to delete stock' }, { status: 500 });
  }
}
