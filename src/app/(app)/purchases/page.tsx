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
import type { Purchase } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function PurchasesPage() {
  const db = useFirestore();

  const purchasesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'purchases'), orderBy('date', 'desc'));
  }, [db]);

  const { data: purchases, isLoading, error } = useCollection<Purchase>(purchasesQuery);

  const pageHeader = (
    <PageHeader title="Purchase History">
      <Button asChild>
        <Link href="/purchases/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Purchase
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
          <AlertTitle>Error Loading Purchases</AlertTitle>
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
        data={purchases || []}
        filterColumnId="stockName"
        filterPlaceholder="Filter by stock..."
      />
    </>
  );
}
