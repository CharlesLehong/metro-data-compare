import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetroDonutChart } from '@/components/MetroDonutChart';
import { DebtByMetroChart } from '@/components/DebtByMetroChart';
import { DeviationGauge } from '@/components/DeviationGauge';
import { 
  parseCSV, 
  getAvailablePeriods, 
  filterByPeriod, 
  getMetroCount, 
  getTotalDebt,
  getDebtByMetro,
  getRevenueByMetro,
  getMetricsByPeriod,
  getRevenueBreakdown,
  type MunicipalityData 
} from '@/utils/csvParser';
import { Database, TrendingUp, Building2, ArrowRight, DollarSign, LineChart } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RevenueByMetroChart } from '@/components/RevenueByMetroChart';
import { PeriodTrendsChart } from '@/components/PeriodTrendsChart';
import { RevenueComparisonChart } from '@/components/RevenueComparisonChart';
import { DeviationGaugeEnhanced } from '@/components/DeviationGaugeEnhanced';

const Index = () => {
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
        
        toast.success('Data loaded successfully', {
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

  const debt1 = getDebtByMetro(period1Data);
  const debt2 = getDebtByMetro(period2Data);
  
  const totalDebt1 = debt1.metro + debt1.nonMetro;
  const totalDebt2 = debt2.metro + debt2.nonMetro;

  const revenue1 = getRevenueByMetro(period1Data);
  const revenue2 = getRevenueByMetro(period2Data);
  
  const totalRevenue1 = revenue1.metro + revenue1.nonMetro;
  const totalRevenue2 = revenue2.metro + revenue2.nonMetro;

  const periodMetrics = getMetricsByPeriod(data);

  const revenueBreakdown1 = getRevenueBreakdown(period1Data);
  const revenueBreakdown2 = getRevenueBreakdown(period2Data);

  const formatPeriodLabel = (period: string) => {
    const date = new Date(period);
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Database className="h-16 w-16 text-primary mx-auto animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading municipality data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Database className="h-10 w-10 text-primary" />
              <h1 className="text-4xl font-bold text-foreground">Debt Analytics Dashboard</h1>
            </div>
            <Link to="/revenue">
              <Button variant="default">
                Revenue Analysis
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
          <p className="text-muted-foreground">
            Compare Eskom municipality debt data across different time periods
          </p>
        </header>

        {/* Period Trends */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <LineChart className="h-6 w-6 text-primary" />
            Historical Trends - Count, Debt & Revenue by Period
          </h2>
          <PeriodTrendsChart data={periodMetrics} title="All Periods Overview" />
        </section>

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

        {/* Total Debt Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Total Debt by Metro Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DebtByMetroChart 
              metro={debt1.metro}
              nonMetro={debt1.nonMetro}
              title={formatPeriodLabel(period1)}
            />
            <DebtByMetroChart 
              metro={debt2.metro}
              nonMetro={debt2.nonMetro}
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={totalDebt1}
              value2={totalDebt2}
              title="Total Debt Deviation"
              unit="currency"
            />
          </div>
        </section>

        {/* Revenue Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-primary" />
            Cash Basis Revenue Recognition by Metro Status
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

        {/* Recognised Revenue vs Cash Basis: Count */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Recognised Revenue vs Cash Basis: Count
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevenueComparisonChart 
              cashBasis={revenueBreakdown1.cashBasisCount}
              recognisedRevenue={revenueBreakdown1.recognisedRevenueCount}
              title={formatPeriodLabel(period1)}
              type="count"
            />
            <RevenueComparisonChart 
              cashBasis={revenueBreakdown2.cashBasisCount}
              recognisedRevenue={revenueBreakdown2.recognisedRevenueCount}
              title={formatPeriodLabel(period2)}
              type="count"
            />
            <DeviationGaugeEnhanced 
              value1={revenueBreakdown1.cashBasisCount + revenueBreakdown1.recognisedRevenueCount}
              value2={revenueBreakdown2.cashBasisCount + revenueBreakdown2.recognisedRevenueCount}
              title="Deviation Total 0.36"
            />
          </div>
        </section>

        {/* Recognised Revenue vs Cash Basis: ZAR Amount */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-primary">
            Recognised Revenue vs Cash Basis: ZAR Amount
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RevenueComparisonChart 
              cashBasis={revenueBreakdown1.cashBasisAmount}
              recognisedRevenue={revenueBreakdown1.recognisedRevenueAmount}
              title={formatPeriodLabel(period1)}
              type="amount"
            />
            <RevenueComparisonChart 
              cashBasis={revenueBreakdown2.cashBasisAmount}
              recognisedRevenue={revenueBreakdown2.recognisedRevenueAmount}
              title={formatPeriodLabel(period2)}
              type="amount"
            />
            <DeviationGaugeEnhanced 
              value1={revenueBreakdown1.cashBasisAmount + revenueBreakdown1.recognisedRevenueAmount}
              value2={revenueBreakdown2.cashBasisAmount + revenueBreakdown2.recognisedRevenueAmount}
              title="Deviation Total 17.67"
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
