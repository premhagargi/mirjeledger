'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PurchaseSchema } from '@/lib/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addPurchase } from '@/lib/actions/purchase';
import { useRouter } from 'next/navigation';
import { SearchableCombobox } from '@/components/searchable-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn, formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

type Option = { label: string; value: string };

type PurchaseFormProps = {
  agentOptions: Option[];
  stockOptions: Option[];
};

export function PurchaseForm({ agentOptions, stockOptions }: PurchaseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      bags: 0,
    },
  });

  const kg = useWatch({ control: form.control, name: 'kg' });
  const rate = useWatch({ control: form.control, name: 'rate' });
  const totalAmount = (kg || 0) * (rate || 0);

  async function onSubmit(values: z.infer<typeof PurchaseSchema>) {
    setIsSubmitting(true);
    try {
      await addPurchase(values);
      toast({ title: 'Success', description: 'Purchase recorded successfully.' });
      router.push('/purchases');
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
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Agent</FormLabel>
                <SearchableCombobox
                  options={agentOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select agent..."
                  searchPlaceholder="Search agents..."
                  emptyPlaceholder="No agents found."
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stockId"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Stock Item</FormLabel>
                <SearchableCombobox
                  options={stockOptions}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select stock..."
                  searchPlaceholder="Search stock..."
                  emptyPlaceholder="No stock found."
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KG</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>No. of Bags</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (per kg)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="rounded-lg bg-muted p-4 text-right">
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Purchase'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
