'use server';
/**
 * @fileOverview An AI agent for analyzing historical sales data to provide business insights.
 *
 * - smartSalesTrendAnalysis - A function that handles the sales trend analysis process.
 * - SmartSalesTrendAnalysisInput - The input type for the smartSalesTrendAnalysis function.
 * - SmartSalesTrendAnalysisOutput - The return type for the smartSalesTrendAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema
const SmartSalesDataEntrySchema = z.object({
  date: z.string().describe('Date of the sale in YYYY-MM-DD format.'),
  stockName: z.string().describe('Name of the stock item sold.'),
  kg: z.number().describe('Quantity of the stock item sold in kilograms.'),
});

const SmartSalesTrendAnalysisInputSchema = z.object({
  salesData: z.array(SmartSalesDataEntrySchema).describe('An array of historical sales data records.'),
});
export type SmartSalesTrendAnalysisInput = z.infer<typeof SmartSalesTrendAnalysisInputSchema>;

// Output schema
const PopularProductInsightSchema = z.object({
  stockName: z.string().describe('Name of the popular product.'),
  totalKgSold: z.number().describe('Total kilograms of this product sold.'),
  insight: z.string().describe('An insight or recommendation for this popular product.'),
});

const SalesPeakInsightSchema = z.object({
  dateRange: z.string().describe('Date range of the sales peak (e.g., "January 2023", "Q4 2022").'),
  totalKgSold: z.number().describe('Total kilograms sold during this sales peak period.'),
  insight: z.string().describe('An insight into why this sales peak occurred or what to do about it.'),
});

const SlowMovingItemInsightSchema = z.object({
  stockName: z.string().describe('Name of the slow-moving item.'),
  totalKgSold: z.number().describe('Total kilograms of this item sold over the analysis period.'),
  insight: z.string().describe('An insight or recommendation for this slow-moving item (e.g., "Consider a discount").'),
});

const SmartSalesTrendAnalysisOutputSchema = z.object({
  popularProducts: z.array(PopularProductInsightSchema).describe('A list of popular products based on sales data.'),
  salesPeaks: z.array(SalesPeakInsightSchema).describe('A list of periods with significant sales peaks.'),
  slowMovingItems: z.array(SlowMovingItemInsightSchema).describe('A list of slow-moving items.'),
  overallInsights: z.string().describe('A general summary of sales trends and actionable recommendations.'),
});
export type SmartSalesTrendAnalysisOutput = z.infer<typeof SmartSalesTrendAnalysisOutputSchema>;

export async function smartSalesTrendAnalysis(input: SmartSalesTrendAnalysisInput): Promise<SmartSalesTrendAnalysisOutput> {
  return smartSalesTrendAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSalesTrendAnalysisPrompt',
  input: { schema: SmartSalesTrendAnalysisInputSchema },
  output: { schema: SmartSalesTrendAnalysisOutputSchema },
  prompt: `You are an AI-powered sales analyst for a tea and coffee business. Your task is to analyze historical sales data and provide actionable insights to optimize stock levels and purchasing decisions.\n\nAnalyze the following JSON array of sales data. Each object contains 'date' (YYYY-MM-DD), 'stockName', and 'kg' (kilograms sold).\n\nSales Data:\n{{{json salesData}}}\n\nBased on this data, provide the following:\n1.  **Popular Products:** Identify the top products by total kilograms sold. For each, provide the 'stockName', 'totalKgSold', and an 'insight' explaining its popularity or suggesting how to leverage its success.\n2.  **Sales Peaks:** Identify periods (e.g., months, quarters) where sales were significantly higher than average. For each, provide a 'dateRange', 'totalKgSold' for that period, and an 'insight' into potential reasons for the peak (e.g., seasonality, promotions) and future actions.\n3.  **Slow-Moving Items:** Identify products with the lowest total kilograms sold over the entire period. For each, provide the 'stockName', 'totalKgSold', and an 'insight' suggesting strategies to improve sales or manage inventory (e.g., promotions, discontinuing, bundling).\n4.  **Overall Insights:** Provide a general summary of the sales trends observed and actionable recommendations for stock optimization and purchasing strategies for the business.\n\nEnsure the output strictly adheres to the JSON schema provided, with accurate data and insightful, concise analysis.`,
});

const smartSalesTrendAnalysisFlow = ai.defineFlow(
  {
    name: 'smartSalesTrendAnalysisFlow',
    inputSchema: SmartSalesTrendAnalysisInputSchema,
    outputSchema: SmartSalesTrendAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
