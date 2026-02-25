'use server';
/**
 * @fileOverview An AI agent that analyzes stock levels and sales trends to suggest optimal reorder quantities for tea and coffee.
 *
 * - purchaseOrderSuggestion - A function that handles the purchase order suggestion process.
 * - PurchaseOrderSuggestionInput - The input type for the purchaseOrderSuggestion function.
 * - PurchaseOrderSuggestionOutput - The return type for the purchaseOrderSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StockLevelSchema = z.object({
  id: z.string().describe('Unique identifier for the stock item.'),
  name: z.string().describe('Name of the stock item (e.g., "Assam Tea").'),
  type: z.enum(['tea', 'coffee']).describe('Type of the stock item.'),
  currentKg: z.number().min(0).describe('Current quantity of the stock item in kilograms.'),
});

const SaleRecordSchema = z.object({
  stockId: z.string().describe('ID of the stock item sold.'),
  kg: z.number().min(0).describe('Quantity sold in kilograms.'),
  date: z.string().datetime().describe('Date of the sale in ISO 8601 format.'),
});

const PurchaseOrderSuggestionInputSchema = z.object({
  currentStocks: z.array(StockLevelSchema).describe('Array of current stock levels for tea and coffee products.'),
  recentSales: z.array(SaleRecordSchema).describe('Array of recent sales records, including stock ID, quantity, and date.'),
});
export type PurchaseOrderSuggestionInput = z.infer<typeof PurchaseOrderSuggestionInputSchema>;

const ReorderSuggestionSchema = z.object({
  stockId: z.string().describe('ID of the stock item for which a reorder is suggested.'),
  stockName: z.string().describe('Name of the stock item.'),
  suggestedKg: z.number().min(0).describe('Suggested quantity in kilograms to reorder.'),
  reasoning: z.string().describe('Explanation for the reorder suggestion.'),
});

const PurchaseOrderSuggestionOutputSchema = z.object({
  suggestions: z.array(ReorderSuggestionSchema).describe('An array of reorder suggestions for various stock items.'),
});
export type PurchaseOrderSuggestionOutput = z.infer<typeof PurchaseOrderSuggestionOutputSchema>;

export async function purchaseOrderSuggestion(input: PurchaseOrderSuggestionInput): Promise<PurchaseOrderSuggestionOutput> {
  return purchaseOrderSuggestionFlow(input);
}

const purchaseOrderSuggestionPrompt = ai.definePrompt({
  name: 'purchaseOrderSuggestionPrompt',
  input: { schema: PurchaseOrderSuggestionInputSchema },
  output: { schema: PurchaseOrderSuggestionOutputSchema },
  prompt: `You are an expert inventory manager for a small tea and coffee business. Your task is to analyze the current stock levels and recent sales trends to suggest optimal quantities of tea and coffee to reorder. The goal is to maintain adequate stock without over-purchasing.

Here are the current stock levels:
{{#if currentStocks}}
  {{#each currentStocks}}
    - Stock ID: {{{this.id}}}, Name: {{{this.name}}}, Type: {{{this.type}}}, Current Quantity (kg): {{{this.currentKg}}}
  {{/each}}
{{else}}
  No current stock information provided.
{{/if}}

Here are the recent sales records (kg sold per stock on a given date):
{{#if recentSales}}
  {{#each recentSales}}
    - Stock ID: {{{this.stockId}}}, Date: {{{this.date}}}, Quantity Sold (kg): {{{this.kg}}}
  {{/each}}
{{else}}
  No recent sales information provided.
{{/if}}

Based on this data, provide reorder suggestions for each stock item that needs attention. Consider a buffer stock level for each item, typically aiming to have enough stock to cover sales for the next 2-4 weeks based on recent trends. For each suggestion, include the stock ID, stock name, the suggested quantity in kilograms to reorder, and a brief reasoning for your recommendation. If a stock does not need reordering, do not include it in the suggestions. Focus on popular products and those with low current stock relative to sales.
`,
});

const purchaseOrderSuggestionFlow = ai.defineFlow(
  {
    name: 'purchaseOrderSuggestionFlow',
    inputSchema: PurchaseOrderSuggestionInputSchema,
    outputSchema: PurchaseOrderSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await purchaseOrderSuggestionPrompt(input);
    return output!;
  }
);
