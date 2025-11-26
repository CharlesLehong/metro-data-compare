import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeviationGaugeEnhancedProps {
  value1: number;
  value2: number;
  title: string;
}

export const DeviationGaugeEnhanced = ({ value1, value2, title }: DeviationGaugeEnhancedProps) => {
  const deviation = value1 !== 0 ? ((value2 - value1) / value1) * 100 : 0;
  const absoluteDeviation = Math.abs(deviation);
  
  // Determine color based on deviation percentage
  const getColor = () => {
    if (absoluteDeviation < 10) return '#10b981'; // green
    if (absoluteDeviation < 30) return '#f59e0b'; // orange/yellow
    return '#ef4444'; // red
  };

  const getColorLabel = () => {
    if (absoluteDeviation < 10) return '<10%';
    if (absoluteDeviation < 30) return '10-30%';
    return '>30%';
  };

  // Calculate rotation angle for the gauge needle (-90 to 90 degrees)
  // Map 0-100% to -90 to 90 degrees
  const maxDeviation = 45; // Show up to 45% on the gauge
  const clampedDeviation = Math.max(-maxDeviation, Math.min(maxDeviation, deviation));
  const rotation = (clampedDeviation / maxDeviation) * 90;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] flex items-center justify-center relative">
          {/* SVG Gauge */}
          <svg width="200" height="160" viewBox="0 0 200 160">
            {/* Gauge background arcs */}
            <path
              d="M 30 140 A 80 80 0 0 1 100 60"
              fill="none"
              stroke="#10b981"
              strokeWidth="20"
            />
            <path
              d="M 100 60 A 80 80 0 0 1 140 90"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="20"
            />
            <path
              d="M 140 90 A 80 80 0 0 1 170 140"
              fill="none"
              stroke="#ef4444"
              strokeWidth="20"
            />
            
            {/* Center circle */}
            <circle cx="100" cy="140" r="8" fill="hsl(var(--foreground))" />
            
            {/* Needle */}
            <line
              x1="100"
              y1="140"
              x2="100"
              y2="70"
              stroke="hsl(var(--foreground))"
              strokeWidth="3"
              transform={`rotate(${rotation} 100 140)`}
              style={{ transition: 'transform 0.5s ease' }}
            />
            
            {/* Labels */}
            <text x="20" y="155" fontSize="12" fill="hsl(var(--muted-foreground))">0.00</text>
            <text x="85" y="50" fontSize="12" fill="hsl(var(--muted-foreground))">45.00</text>
            <text x="165" y="155" fontSize="12" fill="hsl(var(--muted-foreground))">45.00</text>
            
            {/* Center value */}
            <text 
              x="100" 
              y="140" 
              fontSize="16" 
              fontWeight="bold"
              fill="hsl(var(--foreground))"
              textAnchor="middle"
              dy="35"
            >
              {absoluteDeviation.toFixed(2)}
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }} />
            <span className="text-muted-foreground">&lt;10%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }} />
            <span className="text-muted-foreground">10-30%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }} />
            <span className="text-muted-foreground">&gt;30%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
