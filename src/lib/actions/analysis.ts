'use server';

import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { smartSalesTrendAnalysis, SmartSalesTrendAnalysisInput, SmartSalesTrendAnalysisOutput } from '@/ai/flows/smart-sales-trend-analysis';
import { Sale } from '../types';

export async function getSalesAnalysis(): Promise<SmartSalesTrendAnalysisOutput> {
  const salesQuery = query(collection(db, 'sales'), orderBy('date', 'asc'));
  const salesSnapshot = await getDocs(salesQuery);
  
  if (salesSnapshot.empty) {
    return {
      popularProducts: [],
      salesPeaks: [],
      slowMovingItems: [],
      overallInsights: "No sales data available to analyze. Start by adding some sales records."
    }
  }

  const salesData = salesSnapshot.docs.map(doc => doc.data() as Sale);

  const analysisInput: SmartSalesTrendAnalysisInput = {
    salesData: salesData.map(sale => ({
      date: (sale.date as Timestamp).toDate().toISOString().split('T')[0],
      stockName: sale.stockName,
      kg: sale.kg,
    })),
  };

  try {
    const analysisResult = await smartSalesTrendAnalysis(analysisInput);
    return analysisResult;
  } catch (error) {
    console.error("Error running sales trend analysis:", error);
    throw new Error("Failed to generate sales analysis. Please try again later.");
  }
}
