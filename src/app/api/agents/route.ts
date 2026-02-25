import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, DocumentReference, Query, QuerySnapshot, DocumentData } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin';
import { AgentSchema } from '@/lib/schemas';

function getDb() {
  return getFirestore(getAdminApp());
}

export async function GET() {
  try {
    const db = getDb();
    const agentsRef = db.collection('agents') as CollectionReference<DocumentData>;
    const q = agentsRef.orderBy('createdAt', 'desc');
    const snapshot = await q.get();
    const agents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = AgentSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { name, phone } = validatedFields.data;

    const db = getDb();
    const agentsRef = db.collection('agents') as CollectionReference<DocumentData>;
    const docRef = await agentsRef.add({
      name,
      phone: phone || '',
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: docRef.id, message: 'Agent created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const validatedFields = AgentSchema.safeParse(data);

    if (!validatedFields.success) {
      return NextResponse.json({ error: 'Invalid fields', details: validatedFields.error }, { status: 400 });
    }

    const { name, phone } = validatedFields.data;
    const db = getDb();
    const docRef = db.collection('agents').doc(id);
    await docRef.update({ name, phone: phone || '' });

    return NextResponse.json({ message: 'Agent updated successfully' });
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

    const db = getDb();
    const docRef = db.collection('agents').doc(id);
    await docRef.delete();

    return NextResponse.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json({ error: 'Failed to delete agent' }, { status: 500 });
  }
}
