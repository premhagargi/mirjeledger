'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { StockSchema } from '@/lib/schemas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { addStock, updateStock } from '@/lib/actions/stock';
import type { Stock } from '@/lib/types';

type StockFormProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  stock?: Stock | null;
};

export function StockForm({ isOpen, setIsOpen, stock }: StockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const isEditMode = !!stock;

  const form = useForm<z.infer<typeof StockSchema>>({
    resolver: zodResolver(StockSchema),
    defaultValues: {
      name: stock?.name || '',
      type: stock?.type || undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof StockSchema>) {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateStock(stock.id, values);
        toast({ title: 'Success', description: 'Stock item updated successfully.' });
      } else {
        await addStock(values);
        toast({ title: 'Success', description: 'Stock item added successfully.' });
      }
      setIsOpen(false);
      form.reset();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Stock' : 'Add New Stock'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Assam Tea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tea">Tea</SelectItem>
                      <SelectItem value="coffee">Coffee</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
