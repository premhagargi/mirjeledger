'use client';

import { useEffect, useState } from 'react';
import { getSalesAnalysis } from '@/lib/actions/analysis';
import type { SmartSalesTrendAnalysisOutput } from '@/ai/flows/smart-sales-trend-analysis';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle, TrendingUp, TrendingDown, Star, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function AnalysisSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-32 w-full" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}


export function SalesAnalysis() {
  const [analysis, setAnalysis] = useState<SmartSalesTrendAnalysisOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const result = await getSalesAnalysis();
        setAnalysis(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <AnalysisSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return <p>No analysis data available.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="text-primary" /> Overall Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{analysis.overallInsights}</p>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Star className="text-yellow-500"/> Popular Products</CardTitle>
            <CardDescription>Top items by sales volume.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.popularProducts.map((item) => (
                  <TableRow key={item.stockName}>
                    <TableCell>
                        <div className="font-medium">{item.stockName}</div>
                        <div className="text-xs text-muted-foreground">{item.insight}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.totalKgSold} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500" /> Sales Peaks</CardTitle>
             <CardDescription>Periods of high sales activity.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.salesPeaks.map((peak) => (
                  <TableRow key={peak.dateRange}>
                    <TableCell>
                        <div className="font-medium">{peak.dateRange}</div>
                        <div className="text-xs text-muted-foreground">{peak.insight}</div>
                    </TableCell>
                    <TableCell className="text-right">{peak.totalKgSold} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingDown className="text-red-500" /> Slow-Moving Items</CardTitle>
            <CardDescription>Products with lower sales.</CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sold</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analysis.slowMovingItems.map((item) => (
                  <TableRow key={item.stockName}>
                     <TableCell>
                        <div className="font-medium">{item.stockName}</div>
                        <div className="text-xs text-muted-foreground">{item.insight}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.totalKgSold} kg</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
