export type Tone = 'positive' | 'negative' | 'neutral' | 'warning' | 'critical' | 'info';

export interface ApiEnvelope<T> {
  schemaVersion: string;
  generatedAt: string;
  data: T;
}

export interface ApiErrorEnvelope {
  schemaVersion?: string;
  generatedAt?: string;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface HeaderData {
  portfolioValue: number;
  pnlValue: number;
  pnlPercent: number;
  riskBudgetPercent: number;
  sessionStatus: string;
  preTradeChecks: string;
}

export interface EquityPoint {
  time: string;
  equity: number;
  benchmark: number;
  drawdown: number;
}

export interface EquityData {
  timeframes: {
    '1H': EquityPoint[];
    '4H': EquityPoint[];
    '1D': EquityPoint[];
  };
  sessionChangePercent: number;
  currentDrawdownPercent: number;
  currentEquity: number;
}

export interface RegimeData {
  state: 'CALM' | 'BUSY' | 'VOLATILE';
  confidence: number;
  vpin: number;
  imbalance: number;
  message: string;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface PerformanceData {
  metrics: PerformanceMetric[];
  totalReturnPercent: number;
  benchmarkReturnPercent: number;
}

export interface OrderFlowData {
  buyVolume: number;
  sellVolume: number;
  buyPercent: number;
  actionCue: string;
}

export interface PositionItem {
  symbol: string;
  side: 'LONG' | 'SHORT';
  qty: number;
  entry: number;
  current: number;
  pnl: number;
  percent: number;
  risk: string;
}

export interface PositionsData {
  active: PositionItem[];
  activeCount: number;
}

export interface InsightItem {
  title: string;
  detail: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface InsightsData {
  items: InsightItem[];
}
