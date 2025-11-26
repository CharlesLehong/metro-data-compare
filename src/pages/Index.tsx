import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetroDonutChart } from '@/components/MetroDonutChart';
import { MetroDebtDonutChart } from '@/components/MetroDebtDonutChart';
import { DeviationGauge } from '@/components/DeviationGauge';
import { CashBasisDonutChart } from '@/components/CashBasisDonutChart';
import { CashBasisDebtDonutChart } from '@/components/CashBasisDebtDonutChart';
import { AgeBucketBarChart } from '@/components/AgeBucketBarChart';
import { 
  parseCSV, 
  getAvailablePeriods, 
  filterByPeriod, 
  getMetroCount, 
  getTotalDebt,
  getDebtByMetro,
  getCashBasisCount,
  getDebtByCashBasis,
  getAgeBucketCounts,
  getAgeBucketAmounts,
  type MunicipalityData 
} from '@/utils/csvParser';
import { Database, TrendingUp, Building2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

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

  const debt1 = getTotalDebt(period1Data);
  const debt2 = getTotalDebt(period2Data);

  const metroDebt1 = getDebtByMetro(period1Data);
  const metroDebt2 = getDebtByMetro(period2Data);

  const cashBasis1 = getCashBasisCount(period1Data);
  const cashBasis2 = getCashBasisCount(period2Data);

  const cashBasisDebt1 = getDebtByCashBasis(period1Data);
  const cashBasisDebt2 = getDebtByCashBasis(period2Data);

  const ageBucketCounts1 = getAgeBucketCounts(period1Data);
  const ageBucketCounts2 = getAgeBucketCounts(period2Data);

  const ageBucketAmounts1 = getAgeBucketAmounts(period1Data);
  const ageBucketAmounts2 = getAgeBucketAmounts(period2Data);

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
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Municipality Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Compare Eskom municipality data across different time periods
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

        {/* Total Debt Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Total Debt Analysis by Metro Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetroDebtDonutChart 
              metro={metroDebt1.metro}
              nonMetro={metroDebt1.nonMetro}
              title={formatPeriodLabel(period1)}
            />
            <MetroDebtDonutChart 
              metro={metroDebt2.metro}
              nonMetro={metroDebt2.nonMetro}
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={debt1}
              value2={debt2}
              title="Total Debt Deviation"
              unit="currency"
            />
          </div>
        </section>

        {/* Cash Basis Revenue Recognition Analysis */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            Cash Basis Revenue Recognition - Record Count
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CashBasisDonutChart 
              counts={cashBasis1} 
              title={formatPeriodLabel(period1)}
            />
            <CashBasisDonutChart 
              counts={cashBasis2} 
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={period1Data.length}
              value2={period2Data.length}
              title="Record Count Deviation"
              unit="count"
            />
          </div>
        </section>

        {/* Total Debt by Cash Basis Revenue Recognition */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Total Debt by Cash Basis Revenue Recognition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CashBasisDebtDonutChart 
              debts={cashBasisDebt1} 
              title={formatPeriodLabel(period1)}
            />
            <CashBasisDebtDonutChart 
              debts={cashBasisDebt2} 
              title={formatPeriodLabel(period2)}
            />
            <DeviationGauge 
              value1={debt1}
              value2={debt2}
              title="Total Debt Deviation"
              unit="currency"
            />
          </div>
        </section>

        {/* Age Bucket Analysis by Cash Basis */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Cash Basis Revenue Recognition by Age Bucket
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AgeBucketBarChart 
              data={ageBucketCounts1}
              title={`Record Count - ${formatPeriodLabel(period1)}`}
              isAmount={false}
            />
            <AgeBucketBarChart 
              data={ageBucketCounts2}
              title={`Record Count - ${formatPeriodLabel(period2)}`}
              isAmount={false}
            />
          </div>

          <div className="mb-6">
            <DeviationGauge 
              value1={ageBucketCounts1.reduce((sum, item) => sum + item['0-15'] + item['16-30'] + item['31-60'] + item['61-90'] + item['90+'], 0)}
              value2={ageBucketCounts2.reduce((sum, item) => sum + item['0-15'] + item['16-30'] + item['31-60'] + item['61-90'] + item['90+'], 0)}
              title="Age Bucket Record Count Deviation"
              unit="count"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <AgeBucketBarChart 
              data={ageBucketAmounts1}
              title={`Amount (ZAR) - ${formatPeriodLabel(period1)}`}
              isAmount={true}
            />
            <AgeBucketBarChart 
              data={ageBucketAmounts2}
              title={`Amount (ZAR) - ${formatPeriodLabel(period2)}`}
              isAmount={true}
            />
          </div>

          <DeviationGauge 
            value1={ageBucketAmounts1.reduce((sum, item) => sum + item['0-15'] + item['16-30'] + item['31-60'] + item['61-90'] + item['90+'], 0)}
            value2={ageBucketAmounts2.reduce((sum, item) => sum + item['0-15'] + item['16-30'] + item['31-60'] + item['61-90'] + item['90+'], 0)}
            title="Age Bucket Total Amount Deviation"
            unit="currency"
          />
        </section>
      </div>
    </div>
  );
};

export default Index;
