import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface MetroDebtDonutChartProps {
  metro: number;
  nonMetro: number;
  title: string;
}

const COLORS = {
  metro: 'hsl(var(--chart-1))',
  nonMetro: 'hsl(var(--chart-2))',
};

export const MetroDebtDonutChart = ({ metro, nonMetro, title }: MetroDebtDonutChartProps) => {
  const data = [
    { name: 'Metro', value: metro },
    { name: 'Non-Metro', value: nonMetro },
  ];

  const total = metro + nonMetro;

  const formatCurrency = (value: number) => {
    return `R ${(value / 1_000_000).toFixed(2)}M`;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-center text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell 
                  key={entry.name} 
                  fill={entry.name === 'Metro' ? COLORS.metro : COLORS.nonMetro} 
                />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value, entry: any) => `${value} (${((entry.payload.value / total) * 100).toFixed(1)}%)`}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4">
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(total)}
          </div>
          <div className="text-sm text-muted-foreground">Total Debt</div>
        </div>
      </CardContent>
    </Card>
  );
};
