import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetroDonutChart } from '@/components/MetroDonutChart';
import { DeviationGauge } from '@/components/DeviationGauge';
import { 
  parseCSV, 
  getAvailablePeriods, 
  filterByPeriod, 
  getMetroCount, 
  getRevenueByMetro,
  type MunicipalityData 
} from '@/utils/csvParser';
import { DollarSign, TrendingUp, Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RevenueByMetroChart } from '@/components/RevenueByMetroChart';

const Revenue = () => {
  const [data, setData] = useState<MunicipalityData[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [period1, setPeriod1] = useState<string>('');
  const [period2, setPeriod2] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const parsedData = await parseCSV('/data/Eskom_MUN_Data.csv');
        setData(parsedData);
        
        const availablePeriods = getAvailablePeriods(parsedData);
        setPeriods(availablePeriods);
        
        if (availablePeriods.length >= 2) {
          setPeriod1(availablePeriods[1]); // Second most recent
          setPeriod2(availablePeriods[0]); // Most recent
        }
        
        toast.success('Revenue data loaded successfully', {
          description: `${parsedData.length.toLocaleString()} records loaded`,
        });
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data', {
          description: 'Please check the data file',
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const period1Data = filterByPeriod(data, period1);
  const period2Data = filterByPeriod(data, period2);

  const metro1 = getMetroCount(period1Data);
  const metro2 = getMetroCount(period2Data);

  const revenue1 = getRevenueByMetro(period1Data);
  const revenue2 = getRevenueByMetro(period2Data);
  
  const totalRevenue1 = revenue1.metro + revenue1.nonMetro;
  const totalRevenue2 = revenue2.metro + revenue2.nonMetro;

  const formatPeriodLabel = (period: string) => {
    const date = new Date(period);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <DollarSign className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading revenue data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Debt Analysis
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Revenue Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Compare cash basis revenue recognition across different time periods
          </p>
        </header>

        {/* Period Selectors */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Period Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Period 1</label>
                <Select value={period1} onValueChange={setPeriod1}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select period 1" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {formatPeriodLabel(period)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {period1Data.length.toLocaleString()} records
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Period 2</label>
                <Select value={period2} onValueChange={setPeriod2}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select period 2" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period} value={period}>
                        {formatPeriodLabel(period)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {period2Data.length.toLocaleString()} records
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metro Status Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            Metro Status Distribution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetroDonutChart 
              metro={metro1.metro} 
              nonMetro={metro1.nonMetro} 
              title={formatPeriodLabel(period1)}
            />
            <MetroDonutChart 
              metro={metro2.metro} 
              nonMetro={metro2.nonMetro} 
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={metro1.metro + metro1.nonMetro}
              value2={metro2.metro + metro2.nonMetro}
              title="Record Count Deviation"
              unit="count"
            />
          </div>
        </section>

        {/* Total Revenue Analysis */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Total Revenue by Metro Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevenueByMetroChart 
              metro={revenue1.metro}
              nonMetro={revenue1.nonMetro}
              title={formatPeriodLabel(period1)}
            />
            <RevenueByMetroChart 
              metro={revenue2.metro}
              nonMetro={revenue2.nonMetro}
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={totalRevenue1}
              value2={totalRevenue2}
              title="Total Revenue Deviation"
              unit="currency"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Revenue;
