'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { DataTable } from '@/components/data-table';
import { getColumns } from './columns';
import { StockForm } from '@/components/stock/stock-form';
import { getStocks, deleteStock } from '@/lib/actions/stock';
import { useToast } from '@/hooks/use-toast';
import type { Stock } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

export default function StockPage() {
  const [data, setData] = useState<Stock[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const { toast } = useToast();

  const fetchStocks = async () => {
    const stocks = await getStocks();
    setData(stocks as Stock[]);
  };

  useEffect(() => {
    fetchStocks();
  }, [isFormOpen]);

  const handleAdd = () => {
    setSelectedStock(null);
    setIsFormOpen(true);
  };

  const handleEdit = (stock: Stock) => {
    setSelectedStock(stock);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this stock item?')) {
      try {
        await deleteStock(id);
        toast({ title: 'Success', description: 'Stock item deleted successfully.' });
        fetchStocks();
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to delete stock item.',
        });
      }
    }
  };

  const columns = useMemo(() => getColumns(handleEdit, handleDelete), []);

  return (
    <>
      <PageHeader title="Stock Master">
        <Button onClick={handleAdd}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Stock
        </Button>
      </PageHeader>
      <DataTable
        columns={columns}
        data={data}
        filterColumnId="name"
        filterPlaceholder="Filter by name..."
      />
      <StockForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        stock={selectedStock}
      />
    </>
  );
}
