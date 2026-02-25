'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Purchase } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => formatDate(row.getValue('date')),
  },
  {
    accessorKey: 'stockName',
    header: 'Stock',
  },
  {
    accessorKey: 'agentName',
    header: 'Agent',
  },
  {
    accessorKey: 'kg',
    header: 'KG',
    cell: ({ row }) => `${row.getValue('kg')} kg`,
  },
  {
    accessorKey: 'rate',
    header: 'Rate (per kg)',
    cell: ({ row }) => formatCurrency(row.getValue('rate')),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: ({ row }) => formatCurrency(row.getValue('totalAmount')),
  },
];
