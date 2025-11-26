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
