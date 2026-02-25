'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Sale } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<Sale>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date')),
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => {
        const customerName = row.getValue('customerName') as string;
        const customerType = row.original.customerType;
        if (customerType === 'cash') {
            return <Badge variant="secondary">Cash Sale</Badge>
        }
        return customerName;
    }
  },
  {
    accessorKey: 'stockName',
    header: 'Stock',
  },
  {
    accessorKey: 'kg',
    header: 'KG',
    cell: ({ row }) => `${row.getValue('kg')} kg`,
  },
  {
    accessorKey: 'saleRate',
    header: 'Sale Rate',
    cell: ({ row }) => formatCurrency(row.getValue('saleRate')),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => formatCurrency(row.getValue('totalAmount')),
  },
];
