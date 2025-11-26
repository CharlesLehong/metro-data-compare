import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CashBasisDonutChartProps {
  counts: Record<string, number>;
  title: string;
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

export const CashBasisDonutChart = ({ counts, title }: CashBasisDonutChartProps) => {
  const data = Object.entries(counts).map(([name, value]) => ({
    name,
    value,
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

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
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => value.toLocaleString()}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => {
                const item = data.find(d => d.name === value);
                return `${value} (${((item?.value || 0) / total * 100).toFixed(1)}%)`;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Total Records: {total.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
