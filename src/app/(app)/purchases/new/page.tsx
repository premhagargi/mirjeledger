import { getAgents } from '@/lib/actions/agent';
import { getStocks } from '@/lib/actions/stock';
import { PurchaseForm } from './purchase-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function NewPurchasePage() {
  const agents = await getAgents();
  const stocks = await getStocks();

  const agentOptions = agents.map((agent) => ({
    label: agent.name,
    value: agent.id,
  }));

  const stockOptions = stocks.map((stock) => ({
    label: stock.name,
    value: stock.id,
  }));

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Purchase Entry (Stock In)</CardTitle>
      </CardHeader>
      <CardContent>
        <PurchaseForm agentOptions={agentOptions} stockOptions={stockOptions} />
      </CardContent>
    </Card>
  );
}
