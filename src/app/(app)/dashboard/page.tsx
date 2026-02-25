'use client';

import { collection, getDocs, FirestoreError } from 'firebase/firestore';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, Boxes } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type { Purchase, Sale } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { motion } from 'framer-motion';

type DashboardSummary = {
  totalPurchaseAmount: number;
  totalSalesAmount: number;
  totalStockCount: number;
};

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="animate-pulse" style={{ animationDuration: '2s' }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium">
              <Skeleton className="h-4 w-24" />
            </CardTitle>
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-32 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
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
        <Alert variant="destructive" className="rounded-2xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || "Could not load dashboard summary data."}</AlertDescription>
        </Alert>
    );
  }

  const stats = [
    {
      title: 'Total Sales',
      value: formatCurrency(summary.totalSalesAmount),
      description: 'Total revenue from all sales',
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Purchases',
      value: formatCurrency(summary.totalPurchaseAmount),
      description: 'Total cost of all stock purchases',
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Stock Items',
      value: `+${summary.totalStockCount}`,
      description: 'Total unique tea & coffee products',
      icon: Boxes,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="relative overflow-hidden group hover:shadow-glow transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2.5 rounded-2xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {/* Profit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="md:col-span-2 lg:col-span-3"
      >
        <Card className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
                <p className="text-4xl font-bold tracking-tight mt-2">
                  {formatCurrency(summary.totalSalesAmount - summary.totalPurchaseAmount)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Revenue - Purchases</p>
              </div>
              <div className="p-4 rounded-full bg-primary/10">
                <TrendingUp className="h-10 w-10 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
