'use client';

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { Skeleton } from '@/components/ui/skeleton';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Sale } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function SalesPage() {
  const db = useFirestore();

  const salesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'sales'), orderBy('date', 'desc'));
  }, [db]);

  const { data: sales, isLoading, error } = useCollection<Sale>(salesQuery);

  const pageHeader = (
    <PageHeader title="Sales History">
      <Button asChild>
        <Link href="/sales/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Sale
        </Link>
      </Button>
    </PageHeader>
  );

  if (isLoading) {
    return (
      <>
        {pageHeader}
        <Skeleton className="h-[400px] w-full" />
      </>
    );
  }

  if (error) {
    return (
      <>
        {pageHeader}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Sales</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </>
    );
  }

  return (
    <>
      {pageHeader}
      <DataTable
        columns={columns}
        data={sales || []}
        filterColumnId="stockName"
        filterPlaceholder="Filter by stock..."
      />
    </>
  );
}
