import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueComparisonChartProps {
  cashBasis: number;
  recognisedRevenue: number;
  title: string;
  type: 'count' | 'amount';
}

const COLORS = {
  cashBasis: '#3b82f6',
  recognisedRevenue: '#1e3a8a',
};

export const RevenueComparisonChart = ({ 
  cashBasis, 
  recognisedRevenue, 
  title,
  type 
}: RevenueComparisonChartProps) => {
  const data = [
    { name: 'Cash Basis', value: cashBasis },
    { name: 'Recognise Revenue', value: recognisedRevenue },
  ];

  const total = cashBasis + recognisedRevenue;
  const percentage = total > 0 ? ((cashBasis / total) * 100).toFixed(2) : '0.00';

  const formatValue = (value: number) => {
    if (type === 'amount') {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString();
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] relative mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={85}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Cash Basis' ? COLORS.cashBasis : COLORS.recognisedRevenue} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatValue(Number(value))} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '-10px' }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {percentage}
              </div>
            </div>
          </div>
        </div>
        
        {/* Data Table */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Revenue Group</span>
            <span className="text-muted-foreground">{type === 'count' ? 'Count' : 'Amount'}</span>
          </div>
          <div className="flex justify-between py-1 border-t border-border">
            <span className="text-foreground">Cash Basis</span>
            <span className="text-foreground font-medium">{formatNumber(cashBasis)}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-foreground">Recognise Revenue</span>
            <span className="text-foreground font-medium">{formatNumber(recognisedRevenue)}</span>
          </div>
          <div className="flex justify-between py-2 border-t border-border font-bold">
            <span className="text-primary">Total</span>
            <span className="text-primary">{formatNumber(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
