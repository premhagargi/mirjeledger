import { getStocks } from '@/lib/actions/stock';
import { SaleForm } from './sale-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function NewSalePage() {
  const stocks = await getStocks();

  const stockOptions = stocks.map((stock) => ({
    label: stock.name,
    value: stock.id,
  }));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Sale Entry (Stock Out)</CardTitle>
      </CardHeader>
      <CardContent>
        <SaleForm stockOptions={stockOptions} />
      </CardContent>
    </Card>
  );
}
