export interface MunicipalityData {
  MONTH: string;
  FINANCIAL_YEAR: string;
  PERIOD: string;
  METRO: string;
  TOT_DEBT: number;
  COMMON_ENTITY_NAME: string;
  [key: string]: string | number;
}

export const parseCSV = async (filePath: string): Promise<MunicipalityData[]> => {
  const response = await fetch(filePath);
  const text = await response.text();
  
  const lines = text.split('\n');
  const headers = lines[0].replace('﻿', '').split(',');
  
  const data: MunicipalityData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(',');
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      row[header] = value;
      
      // Convert numeric fields
      if (header === 'TOT_DEBT' || header === 'PERIOD' || header === 'FINANCIAL_YEAR') {
        row[header] = parseFloat(value) || 0;
      }
    });
    
    data.push(row);
  }
  
  return data;
};

export const getAvailablePeriods = (data: MunicipalityData[]): string[] => {
  const periods = new Set<string>();
  data.forEach(row => {
    if (row.MONTH) {
      periods.add(row.MONTH);
    }
  });
  return Array.from(periods).sort().reverse();
};

export const filterByPeriod = (data: MunicipalityData[], period: string): MunicipalityData[] => {
  return data.filter(row => row.MONTH === period);
};

export const getMetroCount = (data: MunicipalityData[]): { metro: number; nonMetro: number } => {
  let metro = 0;
  let nonMetro = 0;
  
  data.forEach(row => {
    if (row.METRO === 'Metro') {
      metro++;
    } else {
      nonMetro++;
    }
  });
  
  return { metro, nonMetro };
};

export const getTotalDebt = (data: MunicipalityData[]): number => {
  return data.reduce((sum, row) => sum + (row.TOT_DEBT || 0), 0);
};

export const getDebtByMetro = (data: MunicipalityData[]): { metro: number; nonMetro: number } => {
  let metro = 0;
  let nonMetro = 0;
  
  data.forEach(row => {
    if (row.METRO === 'Metro') {
      metro += row.TOT_DEBT || 0;
    } else {
      nonMetro += row.TOT_DEBT || 0;
    }
  });
  
  return { metro, nonMetro };
};

export const getCashBasisCount = (data: MunicipalityData[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  
  data.forEach(row => {
    const value = row.CASH_BASIS_RECOGNISE_REVENUE as string || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });
  
  return counts;
};

export const getDebtByCashBasis = (data: MunicipalityData[]): Record<string, number> => {
  const debts: Record<string, number> = {};
  
  data.forEach(row => {
    const value = row.CASH_BASIS_RECOGNISE_REVENUE as string || 'Unknown';
    debts[value] = (debts[value] || 0) + (row.TOT_DEBT || 0);
  });
  
  return debts;
};

export interface AgeBucketData {
  cashBasis: string;
  '0-15': number;
  '16-30': number;
  '31-60': number;
  '61-90': number;
  '90+': number;
}

export const getAgeBucketCounts = (data: MunicipalityData[]): AgeBucketData[] => {
  const grouped: Record<string, AgeBucketData> = {};
  
  data.forEach(row => {
    const cashBasis = row.CASH_BASIS_RECOGNISE_REVENUE as string || 'Unknown';
    
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
    
    // Count records in each age bucket based on non-zero values
    const current = typeof row.CURRENT === 'number' ? row.CURRENT : parseFloat(row.CURRENT as string) || 0;
    const due16_30 = typeof row.DUE_16_30 === 'number' ? row.DUE_16_30 : parseFloat(row.DUE_16_30 as string) || 0;
    const due31_60 = typeof row.DUE_31_60 === 'number' ? row.DUE_31_60 : parseFloat(row.DUE_31_60 as string) || 0;
    const due61_90 = typeof row.DUE_61_90 === 'number' ? row.DUE_61_90 : parseFloat(row.DUE_61_90 as string) || 0;
    const due91_plus = typeof row.DUE_91_PLUS === 'number' ? row.DUE_91_PLUS : parseFloat(row.DUE_91_PLUS as string) || 0;
    
    if (current > 0) grouped[cashBasis]['0-15']++;
    if (due16_30 > 0) grouped[cashBasis]['16-30']++;
    if (due31_60 > 0) grouped[cashBasis]['31-60']++;
    if (due61_90 > 0) grouped[cashBasis]['61-90']++;
    if (due91_plus > 0) grouped[cashBasis]['90+']++;
  });
  
  return Object.values(grouped);
};

export const getAgeBucketAmounts = (data: MunicipalityData[]): AgeBucketData[] => {
  const grouped: Record<string, AgeBucketData> = {};
  
  data.forEach(row => {
    const cashBasis = row.CASH_BASIS_RECOGNISE_REVENUE as string || 'Unknown';
    
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
    const current = typeof row.CURRENT === 'number' ? row.CURRENT : parseFloat(row.CURRENT as string) || 0;
    const due16_30 = typeof row.DUE_16_30 === 'number' ? row.DUE_16_30 : parseFloat(row.DUE_16_30 as string) || 0;
    const due31_60 = typeof row.DUE_31_60 === 'number' ? row.DUE_31_60 : parseFloat(row.DUE_31_60 as string) || 0;
    const due61_90 = typeof row.DUE_61_90 === 'number' ? row.DUE_61_90 : parseFloat(row.DUE_61_90 as string) || 0;
    const due91_plus = typeof row.DUE_91_PLUS === 'number' ? row.DUE_91_PLUS : parseFloat(row.DUE_91_PLUS as string) || 0;
    
    grouped[cashBasis]['0-15'] += current;
    grouped[cashBasis]['16-30'] += due16_30;
    grouped[cashBasis]['31-60'] += due31_60;
    grouped[cashBasis]['61-90'] += due61_90;
    grouped[cashBasis]['90+'] += due91_plus;
  });
  
  return Object.values(grouped);
};
