import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, DocumentData } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebase/admin';
import { smartSalesTrendAnalysis, SmartSalesTrendAnalysisInput, SmartSalesTrendAnalysisOutput } from '@/ai/flows/smart-sales-trend-analysis';

function getDb() {
  return getFirestore(getAdminApp());
}

export async function GET() {
  try {
    const db = getDb();
    const salesRef = db.collection('sales') as CollectionReference<DocumentData>;
    const snapshot = await salesRef.orderBy('date', 'asc').get();
    
    if (snapshot.empty) {
      return NextResponse.json({
        popularProducts: [],
        salesPeaks: [],
        slowMovingItems: [],
        overallInsights: "No sales data available to analyze. Start by adding some sales records."
      });
    }

    const salesData = snapshot.docs.map(doc => doc.data());

    const analysisInput: SmartSalesTrendAnalysisInput = {
      salesData: salesData.map((sale: any) => ({
        date: sale.date,
        stockName: sale.stockName,
        kg: sale.kg,
      })),
    };

    try {
      const analysisResult = await smartSalesTrendAnalysis(analysisInput);
      return NextResponse.json(analysisResult);
    } catch (aiError) {
      console.error("Error running sales trend analysis:", aiError);
      return NextResponse.json({ error: "Failed to generate sales analysis. Please try again later." }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}
