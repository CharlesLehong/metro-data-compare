import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RevenueByMetroChartProps {
  metro: number;
  nonMetro: number;
  title: string;
}

const COLORS = {
  metro: '#10b981',
  nonMetro: '#3b82f6',
};

export const RevenueByMetroChart = ({ metro, nonMetro, title }: RevenueByMetroChartProps) => {
  const data = [
    { name: 'Metro', value: metro },
    { name: 'Non-Metro', value: nonMetro },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const total = metro + nonMetro;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === 'Metro' ? COLORS.metro : COLORS.nonMetro} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => value}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-[120px]">
              <div className="text-xl font-bold text-foreground break-words">
                {formatCurrency(total)}
              </div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
