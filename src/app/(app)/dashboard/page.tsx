'use client';

import { collection, getDocs, FirestoreError } from 'firebase/firestore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes, DollarSign, ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Purchase, Sale } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

type DashboardSummary = {
  totalPurchaseAmount: number;
  totalSalesAmount: number;
  totalStockCount: number;
};

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = useFirestore();

  useEffect(() => {
    if (!db) {
      return;
    }

    async function fetchAndProcess(colName: string) {
        const colRef = collection(db, colName);
        try {
            return await getDocs(colRef);
        } catch (err: any) {
            if (err instanceof FirestoreError && err.code === 'permission-denied') {
                const permissionError = new FirestorePermissionError({ path: colRef.path, operation: 'list' });
                errorEmitter.emit('permission-error', permissionError);
                throw permissionError; 
            }
            throw err;
        }
    }

    async function fetchSummary() {
      setLoading(true);
      setError(null);
      try {
        const purchasesSnap = await fetchAndProcess('purchases');
        const salesSnap = await fetchAndProcess('sales');
        const stockSnap = await fetchAndProcess('stocks');

        const totalPurchaseAmount = purchasesSnap.docs
          .map((doc) => doc.data() as Purchase)
          .reduce((sum, purchase) => sum + purchase.totalAmount, 0);

        const totalSalesAmount = salesSnap.docs
          .map((doc) => doc.data() as Sale)
          .reduce((sum, sale) => sum + sale.totalAmount, 0);

        const totalStockCount = stockSnap.size;

        setSummary({
          totalPurchaseAmount,
          totalSalesAmount,
          totalStockCount,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not fetch dashboard summary data.');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [db]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !summary) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Could not load dashboard summary data."}</AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalSalesAmount)}</div>
          <p className="text-xs text-muted-foreground">Total revenue from all sales</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(summary.totalPurchaseAmount)}</div>
          <p className="text-xs text-muted-foreground">Total cost of all stock purchases</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary.totalStockCount}</div>
          <p className="text-xs text-muted-foreground">Total unique tea & coffee products</p>
        </CardContent>
      </Card>
    </div>
  );
}
