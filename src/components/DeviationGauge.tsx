import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DeviationGaugeProps {
  value1: number;
  value2: number;
  title: string;
  unit?: 'count' | 'currency';
}

export const DeviationGauge = ({ value1, value2, title, unit = 'count' }: DeviationGaugeProps) => {
  const deviation = value2 - value1;
  const percentageChange = value1 !== 0 ? ((deviation / value1) * 100) : 0;
  const isPositive = deviation > 0;
  const isNegative = deviation < 0;
  const isNeutral = deviation === 0;

  const formatValue = (value: number) => {
    if (unit === 'currency') {
      return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  const getColorClass = () => {
    if (isPositive) return 'text-destructive';
    if (isNegative) return 'text-success';
    return 'text-muted-foreground';
  };

  const getBackgroundClass = () => {
    if (isPositive) return 'bg-destructive/10';
    if (isNegative) return 'bg-success/10';
    return 'bg-muted';
  };

  const getIcon = () => {
    if (isPositive) return <TrendingUp className="h-8 w-8" />;
    if (isNegative) return <TrendingDown className="h-8 w-8" />;
    return <Minus className="h-8 w-8" />;
  };

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`rounded-lg p-6 ${getBackgroundClass()} transition-colors`}>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`${getColorClass()} transition-colors`}>
              {getIcon()}
            </div>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getColorClass()}`}>
                {isPositive && '+'}
                {formatValue(Math.abs(deviation))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                {Math.abs(percentageChange).toFixed(1)}% {isPositive ? 'increase' : isNegative ? 'decrease' : 'no change'}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4 text-center">
              <div>
                <div className="text-sm text-muted-foreground">Period 1</div>
                <div className="text-lg font-semibold">{formatValue(value1)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Period 2</div>
                <div className="text-lg font-semibold">{formatValue(value2)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
