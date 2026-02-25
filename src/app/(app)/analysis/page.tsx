import { PageHeader } from '@/components/page-header';
import { SalesAnalysis } from '@/components/analysis/sales-analysis';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalysisPage() {
  return (
    <>
      <PageHeader title="Smart Sales Trend Analysis" />
      <Suspense fallback={<Skeleton className="w-full h-[600px]" />}>
        <SalesAnalysis />
      </Suspense>
    </>
  );
}
