'use client';

import { ColumnDef } from '@tanstack/react-table';
import type { Stock } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { stockApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this stock item?')) {
        try {
            await stockApi.delete(id);
            // toast is not available in server action, it needs to be called from client
        } catch (error) {
            console.error(error);
        }
    }
}


export const getColumns = (
  onEdit: (stock: Stock) => void,
  onDelete: (id: string) => void,
): ColumnDef<Stock>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return <Badge variant={type === 'tea' ? 'secondary' : 'default'} className="capitalize">{type}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const stock = row.original;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit(stock)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(stock.id)} className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
