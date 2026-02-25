'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SaleSchema } from '@/lib/schemas';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addSale, getLatestPurchaseRate } from '@/lib/actions/sale';
import { useRouter } from 'next/navigation';
import { SearchableCombobox } from '@/components/searchable-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Option = { label: string; value: string };

type SaleFormProps = {
  stockOptions: Option[];
};

export function SaleForm({ stockOptions }: SaleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [purchaseRate, setPurchaseRate] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof SaleSchema>>({
    resolver: zodResolver(SaleSchema),
    defaultValues: {
      customerType: 'customer',
      bags: 0,
    },
  });

  const stockId = useWatch({ control: form.control, name: 'stockId' });
  const kg = useWatch({ control: form.control, name: 'kg' });
  const saleRate = useWatch({ control: form.control, name: 'saleRate' });
  const customerType = useWatch({ control: form.control, name: 'customerType' });
  
  const totalAmount = (kg || 0) * (saleRate || 0);

  useEffect(() => {
    async function fetchRate() {
      if (stockId) {
        const rate = await getLatestPurchaseRate(stockId);
        setPurchaseRate(rate);
      } else {
        setPurchaseRate(0);
      }
    }
    fetchRate();
  }, [stockId]);

  async function onSubmit(values: z.infer<typeof SaleSchema>) {
    setIsSubmitting(true);
    try {
      await addSale(values);
      toast({ title: 'Success', description: 'Sale recorded successfully.' });
      router.push('/sales');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date()} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customerType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Customer Type</FormLabel>
                <FormControl>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="customer" />
                      </FormControl>
                      <FormLabel className="font-normal">Customer</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="cash" />
                      </FormControl>
                      <FormLabel className="font-normal">Cash</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {customerType === 'customer' && (
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Jane Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <div className={cn(customerType === 'cash' && "md:col-start-2")}>
            <FormField
              control={form.control}
              name="stockId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Stock Item</FormLabel>
                  <SearchableCombobox options={stockOptions} value={field.value} onChange={field.onChange} placeholder="Select stock..." searchPlaceholder="Search stock..." />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField control={form.control} name="kg" render={({ field }) => (<FormItem><FormLabel>KG</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="bags" render={({ field }) => (<FormItem><FormLabel>No. of Bags</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />

          <FormItem>
            <FormLabel>Purchase Rate (Read-only)</FormLabel>
            <Input readOnly value={formatCurrency(purchaseRate)} className="bg-muted" />
          </FormItem>

          <FormField control={form.control} name="saleRate" render={({ field }) => (<FormItem><FormLabel>Sale Rate (per kg)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl><FormMessage /></FormItem>)} />

        </div>
        <div className="rounded-lg bg-muted p-4 text-right">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Sale'}</Button>
        </div>
      </form>
    </Form>
  );
}
