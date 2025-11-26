import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DebtDonutChartProps {
  amount: number;
  title: string;
  color: string;
}

export const DebtDonutChart = ({ amount, title, color }: DebtDonutChartProps) => {
  const data = [
    { name: 'Total Debt', value: amount },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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
                <Cell fill={color} />
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center max-w-[120px]">
              <div className="text-xl font-bold text-foreground break-words">
                {formatCurrency(amount)}
              </div>
              <div className="text-xs text-muted-foreground">Total Debt</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
