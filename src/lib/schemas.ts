import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export const StockSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Stock name is required.' }),
  type: z.enum(['tea', 'coffee'], { required_error: 'Please select a stock type.' }),
});

export const AgentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'Agent name is required.' }),
  phone: z.string().optional(),
});

const positiveNumber = z.coerce.number().min(0.01, { message: 'Must be greater than 0.' });

export const PurchaseSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: 'Please select a date.' }),
  agentId: z.string({ required_error: 'Please select an agent.' }),
  stockId: z.string({ required_error: 'Please select a stock item.' }),
  kg: positiveNumber,
  bags: z.coerce.number().int().min(0, { message: 'Cannot be negative.' }),
  rate: positiveNumber,
});

export const SaleSchema = z.object({
  id: z.string().optional(),
  date: z.date({ required_error: 'Please select a date.' }),
  customerType: z.enum(['customer', 'cash']),
  customerName: z.string().optional(),
  stockId: z.string({ required_error: 'Please select a stock item.' }),
  kg: positiveNumber,
  bags: z.coerce.number().int().min(0, { message: 'Cannot be negative.' }),
  saleRate: positiveNumber,
}).refine(data => data.customerType === 'customer' ? !!data.customerName : true, {
  message: 'Customer name is required.',
  path: ['customerName'],
});
