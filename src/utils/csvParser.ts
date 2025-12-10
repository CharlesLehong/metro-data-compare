// API Response Interface matching the Azure Functions endpoint
export interface ApiResponseData {
  month: string;
  classification: string; // "CASH BASIS" or "Recognise Revenue"
  current: number;
  due_16_30: number;
  due_31_60: number;
  due_61_90: number;
  due_91_plus: number;
  count: number;
  area_type: string; // "Metro" or "Non-Metro"
}

// Azure Functions API Configuration
// Use relative URL in development to leverage Vite proxy, full URL in production
const isDevelopment = import.meta.env.DEV;
const AZURE_FUNCTION_URL = isDevelopment
  ? "/api/FN_MUNIC_DASHBOARD_DATA_v1?code=amz8NLiXGUuCpxrQ3c5Sbd4SvGK4h1sgZtOsm-mwKVeJAzFuPz54OQ=="
  : "https://bootsure-functions-dev-py.azurewebsites.net/api/FN_MUNIC_DASHBOARD_DATA_v1?code=amz8NLiXGUuCpxrQ3c5Sbd4SvGK4h1sgZtOsm-mwKVeJAzFuPz54OQ==";

const API_HEADERS = {
  'Content-Type': 'application/json',
  'bootsure-organization-id': '78a3bcc6-f906-4dd6-9988-89c00b716cd0',
  'bootsure-api-id': 'b1ca01f6-fe18-4339-a2ed-732d6eee68fb',
  'bootsure-environment-id': 'UAT',
};

const API_PAYLOAD = {
  masterDataLookupEndpoint: "https://bootsure-api-test.azurewebsites.net/",
  effectiveDate: "2025-10-10",
  input: null
};

// Fetch data from Azure Functions API
export const fetchApiData = async (): Promise<ApiResponseData[]> => {
  const response = await fetch(AZURE_FUNCTION_URL, {
    method: 'POST',
    headers: API_HEADERS,
    body: JSON.stringify(API_PAYLOAD),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data: ApiResponseData[] = await response.json();
  return data;
};

// Get available periods (unique months) from API data
export const getAvailablePeriods = (data: ApiResponseData[]): string[] => {
  const periods = new Set<string>();
  data.forEach(row => {
    if (row.month) {
      periods.add(row.month);
    }
  });
  return Array.from(periods).sort().reverse();
};

// Filter data by specific period
export const filterByPeriod = (data: ApiResponseData[], period: string): ApiResponseData[] => {
  return data.filter(row => row.month === period);
};

// Get Metro vs Non-Metro counts
export const getMetroCount = (data: ApiResponseData[]): { metro: number; nonMetro: number } => {
  let metro = 0;
  let nonMetro = 0;

  data.forEach(row => {
    if (row.area_type === 'Metro') {
      metro += row.count;
    } else {
      nonMetro += row.count;
    }
  });

  return { metro, nonMetro };
};

// Calculate total debt for a period
export const getTotalDebt = (data: ApiResponseData[]): number => {
  return data.reduce((sum, row) => {
    return sum + row.current + row.due_16_30 + row.due_31_60 + row.due_61_90 + row.due_91_plus;
  }, 0);
};

// Get debt totals by Metro status
export const getDebtByMetro = (data: ApiResponseData[]): { metro: number; nonMetro: number } => {
  let metro = 0;
  let nonMetro = 0;

  data.forEach(row => {
    const totalDebt = row.current + row.due_16_30 + row.due_31_60 + row.due_61_90 + row.due_91_plus;

    if (row.area_type === 'Metro') {
      metro += totalDebt;
    } else {
      nonMetro += totalDebt;
    }
  });

  return { metro, nonMetro };
};

// Get record counts by Cash Basis classification
export const getCashBasisCount = (data: ApiResponseData[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  data.forEach(row => {
    const classification = row.classification || 'Unknown';
    counts[classification] = (counts[classification] || 0) + row.count;
  });

  return counts;
};

// Get debt totals by Cash Basis classification
export const getDebtByCashBasis = (data: ApiResponseData[]): Record<string, number> => {
  const debts: Record<string, number> = {};

  data.forEach(row => {
    const classification = row.classification || 'Unknown';
    const totalDebt = row.current + row.due_16_30 + row.due_31_60 + row.due_61_90 + row.due_91_plus;
    debts[classification] = (debts[classification] || 0) + totalDebt;
  });

  return debts;
};

// Age bucket data structure for charts
export interface AgeBucketData {
  cashBasis: string;
  '0-15': number;
  '16-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
}

// Get age bucket counts grouped by cash basis classification
export const getAgeBucketCounts = (data: ApiResponseData[]): AgeBucketData[] => {
  const grouped: Record<string, AgeBucketData> = {};

  data.forEach(row => {
    const cashBasis = row.classification || 'Unknown';

    if (!grouped[cashBasis]) {
      grouped[cashBasis] = {
        cashBasis,
        '0-15': 0,
        '16-30': 0,
        '31-60': 0,
        '61-90': 0,
        '90+': 0,
      };
    }

    // Count records in each bucket (the count field represents records)
    // We distribute the count across buckets where amounts are non-zero
    if (row.current > 0) grouped[cashBasis]['0-15'] += row.count;
    if (row.due_16_30 > 0) grouped[cashBasis]['16-30'] += row.count;
    if (row.due_31_60 > 0) grouped[cashBasis]['31-60'] += row.count;
    if (row.due_61_90 > 0) grouped[cashBasis]['61-90'] += row.count;
    if (row.due_91_plus > 0) grouped[cashBasis]['90+'] += row.count;
  });

  return Object.values(grouped);
};

// Get age bucket amounts grouped by cash basis classification
export const getAgeBucketAmounts = (data: ApiResponseData[]): AgeBucketData[] => {
  const grouped: Record<string, AgeBucketData> = {};

  data.forEach(row => {
    const cashBasis = row.classification || 'Unknown';

    if (!grouped[cashBasis]) {
      grouped[cashBasis] = {
        cashBasis,
        '0-15': 0,
        '16-30': 0,
        '31-60': 0,
        '61-90': 0,
        '90+': 0,
      };
    }

    // Sum amounts in each age bucket
    grouped[cashBasis]['0-15'] += row.current;
    grouped[cashBasis]['16-30'] += row.due_16_30;
    grouped[cashBasis]['31-60'] += row.due_31_60;
    grouped[cashBasis]['61-90'] += row.due_61_90;
    grouped[cashBasis]['90+'] += row.due_91_plus;
  });

  return Object.values(grouped);
};
