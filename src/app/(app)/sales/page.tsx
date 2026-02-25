import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getSales } from '@/lib/actions/sale';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function SalesTable() {
  const sales = await getSales();
  return (
    <DataTable
      columns={columns}
      data={sales}
      filterColumnId="stockName"
      filterPlaceholder="Filter by stock..."
    />
  );
}

export default function SalesPage() {
  return (
    <>
      <PageHeader title="Sales History">
        <Button asChild>
          <Link href="/sales/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Sale
          </Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <SalesTable />
      </Suspense>
    </>
  );
}
