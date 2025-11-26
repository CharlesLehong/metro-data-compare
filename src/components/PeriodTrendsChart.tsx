import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PeriodMetrics } from '@/utils/csvParser';

interface PeriodTrendsChartProps {
  data: PeriodMetrics[];
  title: string;
}

export const PeriodTrendsChart = ({ data, title }: PeriodTrendsChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-ZA', { year: '2-digit', month: 'short' });
  };

  const formatCount = (value: number) => {
    return value.toLocaleString();
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="period" 
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={formatCount}
                className="text-xs"
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tickFormatter={formatCurrency}
                className="text-xs"
              />
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'count') return [formatCount(value), 'Record Count'];
                  if (name === 'totalDebt') return [formatCurrency(value), 'Total Debt'];
                  if (name === 'totalRevenue') return [formatCurrency(value), 'Total Revenue'];
                  return [value, name];
                }}
                labelFormatter={formatDate}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px'
                }}
              />
              <Legend 
                formatter={(value) => {
                  if (value === 'count') return 'Record Count';
                  if (value === 'totalDebt') return 'Total Debt';
                  if (value === 'totalRevenue') return 'Total Revenue';
                  return value;
                }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalDebt" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="totalRevenue" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
