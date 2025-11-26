import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AgeBucketData } from '@/utils/csvParser';

interface AgeBucketBarChartProps {
  data: AgeBucketData[];
  title: string;
  isAmount?: boolean;
}

const COLORS = {
  '0-15': 'hsl(var(--chart-1))',
  '16-30': 'hsl(var(--chart-2))',
  '31-60': 'hsl(var(--chart-3))',
  '61-90': 'hsl(var(--chart-4))',
  '90+': 'hsl(var(--chart-5))',
};

export const AgeBucketBarChart = ({ data, title, isAmount = false }: AgeBucketBarChartProps) => {
  const formatValue = (value: number) => {
    if (isAmount) {
      return `R ${(value / 1_000_000).toFixed(1)}M`;
    }
    return value.toLocaleString();
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-center text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="cashBasis" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fill: 'hsl(var(--foreground))' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--foreground))' }}
              tickFormatter={formatValue}
            />
            <Tooltip 
              formatter={formatValue}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
            />
            <Bar dataKey="0-15" fill={COLORS['0-15']} name="0-15 days" />
            <Bar dataKey="16-30" fill={COLORS['16-30']} name="16-30 days" />
            <Bar dataKey="31-60" fill={COLORS['31-60']} name="31-60 days" />
            <Bar dataKey="61-90" fill={COLORS['61-90']} name="61-90 days" />
            <Bar dataKey="90+" fill={COLORS['90+']} name="90+ days" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
