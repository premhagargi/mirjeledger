import { getDashboardSummary } from '@/lib/actions/dashboard';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Boxes, DollarSign, ShoppingCart } from 'lucide-react';

export default async function DashboardPage() {
  const summary = await getDashboardSummary();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalSalesAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total revenue from all sales
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalPurchaseAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total cost of all stock purchases
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stock Items</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{summary.totalStockCount}</div>
          <p className="text-xs text-muted-foreground">
            Total unique tea & coffee products
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
