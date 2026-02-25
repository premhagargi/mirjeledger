import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getPurchases } from '@/lib/actions/purchase';
import { DataTable } from '@/components/data-table';
import { columns } from './columns';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function PurchasesTable() {
  const purchases = await getPurchases();
  return (
    <DataTable
      columns={columns}
      data={purchases}
      filterColumnId="stockName"
      filterPlaceholder="Filter by stock..."
    />
  );
}

export default function PurchasesPage() {
  return (
    <>
      <PageHeader title="Purchase History">
        <Button asChild>
          <Link href="/purchases/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Purchase
          </Link>
        </Button>
      </PageHeader>
      <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
        <PurchasesTable />
      </Suspense>
    </>
  );
}
