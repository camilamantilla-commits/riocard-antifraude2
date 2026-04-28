export type FinancialEntryType = 'receita' | 'custo';
export type FinancialFilterType = FinancialEntryType | 'all';
export type FinancialInsightTone = 'info' | 'warning' | 'danger' | 'success';

export interface FinancialEntry {
  id: string;
  date: string;
  month: string;
  monthLabel: string;
  type: FinancialEntryType;
  category: string;
  subcategory: string;
  value: number;
  raw: Record<string, unknown>;
}

export interface FinancialFilterState {
  startMonth: string;
  endMonth: string;
  category: string;
  type: FinancialFilterType;
}

export interface FinancialMonthlyPoint {
  month: string;
  monthLabel: string;
  revenue: number;
  cost: number;
  margin: number;
  marginPct: number;
  phase: 'historico' | 'previsao';
}

export interface FinancialChartSeries {
  key: string;
  label: string;
  color: string;
}

export interface FinancialRankingItem {
  category: string;
  value: number;
  share: number;
}

export interface FinancialInsight {
  id: string;
  tone: FinancialInsightTone;
  title: string;
  description: string;
}

export interface FinancialIndicatorInfo {
  title: string;
  type: FinancialEntryType;
  description: string;
  impact: string;
}

export interface FinancialKpis {
  revenueTotal: number;
  costTotal: number;
  marginTotal: number;
  marginPct: number;
  monthOverMonthGrowth: number;
  monthsCritical: number;
}

export interface FinancialFilterOptions {
  months: string[];
  monthLabels: Record<string, string>;
  categories: string[];
}

export interface FinancialDashboardData {
  filteredEntries: FinancialEntry[];
  history: FinancialMonthlyPoint[];
  forecast: FinancialMonthlyPoint[];
  combinedTimeline: FinancialMonthlyPoint[];
  costByCategoryChart: Array<Record<string, string | number>>;
  costSeries: FinancialChartSeries[];
  revenueCategoryBreakdown: FinancialRankingItem[];
  costCategoryBreakdown: FinancialRankingItem[];
  topCosts: FinancialRankingItem[];
  topRevenues: FinancialRankingItem[];
  insights: FinancialInsight[];
  indicatorInfo: FinancialIndicatorInfo[];
  kpis: FinancialKpis;
}
