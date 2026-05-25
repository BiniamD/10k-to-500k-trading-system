"use client";

import { useEffect, useMemo, useState } from "react";

export type RegimeState = "CALM" | "BUSY" | "VOLATILE";

export type EquityPoint = {
  time: string;
  value: number;
};

export type MetricCard = {
  label: string;
  value: string;
  delta: number;
  positiveIsGood?: boolean;
};

export type LivePosition = {
  symbol: string;
  side: "Long" | "Short";
  entryPrice: number;
  currentPrice: number;
  quantity: number;
  pnl: number;
  exposure: number;
};

export type TradingDashboardState = {
  updatedAt: string;
  portfolioValue: number;
  sessionChange: number;
  sessionChangePct: number;
  regime: {
    state: RegimeState;
    confidence: number;
    vpin: number;
    imbalance: number;
  };
  orderFlow: {
    buyVolume: number;
    sellVolume: number;
    imbalance: number;
  };
  metrics: MetricCard[];
  positions: LivePosition[];
  totalExposure: number;
  equityCurve: EquityPoint[];
};

const INITIAL_EQUITY_SEED: Array<[string, number]> = [
  ["09:30", 10000],
  ["09:33", 10048],
  ["09:36", 10092],
  ["09:39", 10138],
  ["09:42", 10165],
  ["09:45", 10202],
  ["09:48", 10274],
  ["09:51", 10318],
  ["09:54", 10372],
  ["09:57", 10406],
  ["10:00", 10442],
  ["10:03", 10488],
  ["10:06", 10541],
  ["10:09", 10596],
  ["10:12", 10634],
  ["10:15", 10702],
  ["10:18", 10758],
  ["10:21", 10816],
  ["10:24", 10888],
  ["10:27", 10936],
  ["10:30", 11008],
  ["10:33", 11062],
  ["10:36", 11128],
  ["10:39", 11196],
];

const INITIAL_EQUITY: EquityPoint[] = INITIAL_EQUITY_SEED.map(([time, value]) => ({ time, value }));

const INITIAL_POSITIONS = [
  { symbol: "KO", side: "Long" as const, entryPrice: 61.42, currentPrice: 61.88, quantity: 820 },
  { symbol: "PEP", side: "Short" as const, entryPrice: 177.95, currentPrice: 176.91, quantity: 285 },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);

const toMetrics = (
  portfolioValue: number,
  regime: TradingDashboardState["regime"],
  positions: LivePosition[],
): MetricCard[] => {
  const grossPnl = positions.reduce((total, position) => total + position.pnl, 0);
  return [
    { label: "Win Rate", value: `${clamp(71.8 + grossPnl / 260, 64, 78).toFixed(1)}%`, delta: 2.4 },
    { label: "Avg Trade", value: `$${clamp(182 + grossPnl / 7, 120, 265).toFixed(0)}`, delta: 4.1 },
    { label: "Max Drawdown", value: `${clamp(3.8 + regime.vpin * 1.9, 2.9, 7.2).toFixed(1)}%`, delta: -0.6, positiveIsGood: false },
    { label: "Sharpe Ratio", value: `${clamp(2.1 + (portfolioValue - 10000) / 2800, 1.8, 3.7).toFixed(2)}`, delta: 0.3 },
    { label: "Profit Factor", value: `${clamp(1.92 + grossPnl / 900, 1.7, 2.9).toFixed(2)}`, delta: 0.18 },
    { label: "Total Trades", value: `${Math.round(clamp(126 + (portfolioValue - 10000) / 22, 126, 640))}`, delta: 9.7 },
  ];
};

const recalcPositions = (positions: typeof INITIAL_POSITIONS): LivePosition[] =>
  positions.map((position) => {
    const direction = position.side === "Long" ? 1 : -1;
    const pnl = (position.currentPrice - position.entryPrice) * position.quantity * direction;
    const exposure = position.currentPrice * position.quantity;

    return {
      ...position,
      pnl,
      exposure,
    };
  });

const buildInitialState = (): TradingDashboardState => {
  const positions = recalcPositions(INITIAL_POSITIONS);
  const portfolioValue = INITIAL_EQUITY[INITIAL_EQUITY.length - 1]?.value ?? 10000;
  const regime = {
    state: "BUSY" as RegimeState,
    confidence: 83,
    vpin: 0.34,
    imbalance: 9.8,
  };

  return {
    updatedAt: "10:39:00",
    portfolioValue,
    sessionChange: portfolioValue - 10000,
    sessionChangePct: ((portfolioValue - 10000) / 10000) * 100,
    regime,
    orderFlow: {
      buyVolume: 1_842_000,
      sellVolume: 1_566_000,
      imbalance: 8.1,
    },
    metrics: toMetrics(portfolioValue, regime, positions),
    positions,
    totalExposure: positions.reduce((total, position) => total + position.exposure, 0),
    equityCurve: INITIAL_EQUITY,
  };
};

export function useTradingDashboard() {
  const [state, setState] = useState<TradingDashboardState>(buildInitialState);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setState((current) => {
        const now = new Date();
        const regimeScore = Math.random();
        const nextRegime: TradingDashboardState["regime"] = regimeScore > 0.76
          ? {
              state: "VOLATILE",
              confidence: clamp(86 + Math.random() * 10, 80, 98),
              vpin: clamp(0.59 + Math.random() * 0.18, 0.52, 0.91),
              imbalance: clamp(19 + Math.random() * 12, 16, 34),
            }
          : regimeScore > 0.42
            ? {
                state: "BUSY",
                confidence: clamp(74 + Math.random() * 12, 70, 89),
                vpin: clamp(0.32 + Math.random() * 0.15, 0.24, 0.55),
                imbalance: clamp(8 + Math.random() * 9, 6, 18),
              }
            : {
                state: "CALM",
                confidence: clamp(80 + Math.random() * 12, 76, 95),
                vpin: clamp(0.12 + Math.random() * 0.11, 0.08, 0.24),
                imbalance: clamp(2 + Math.random() * 5, 1, 7),
              };

        const drift = nextRegime.state === "VOLATILE" ? 42 : nextRegime.state === "BUSY" ? 58 : 34;
        const lastValue = current.equityCurve[current.equityCurve.length - 1]?.value ?? 10000;
        const nextValue = clamp(lastValue + (Math.random() - 0.34) * drift, 9800, 512000);
        const nextEquityCurve = [...current.equityCurve.slice(-23), { time: formatTime(now), value: Number(nextValue.toFixed(2)) }];

        const buyVolume = Math.round(clamp(1_400_000 + Math.random() * 950_000 + nextRegime.confidence * 4200, 1_200_000, 3_300_000));
        const sellVolume = Math.round(clamp(1_220_000 + Math.random() * 900_000 + nextRegime.vpin * 180_000, 1_000_000, 3_000_000));
        const imbalance = ((buyVolume - sellVolume) / (buyVolume + sellVolume)) * 100;

        const repricedPositions = current.positions.map((position) => {
          const velocity = position.symbol === "KO" ? 0.42 : 0.66;
          const move = (Math.random() - 0.48) * velocity * (nextRegime.state === "VOLATILE" ? 2.6 : 1.45);
          const currentPrice = clamp(position.currentPrice + move, position.entryPrice * 0.92, position.entryPrice * 1.08);
          const direction = position.side === "Long" ? 1 : -1;
          const pnl = (currentPrice - position.entryPrice) * position.quantity * direction;

          return {
            ...position,
            currentPrice: Number(currentPrice.toFixed(2)),
            pnl: Number(pnl.toFixed(2)),
            exposure: Number((currentPrice * position.quantity).toFixed(2)),
          };
        });

        const portfolioValue = Number((10_000 + nextEquityCurve[nextEquityCurve.length - 1]!.value - INITIAL_EQUITY[0]!.value).toFixed(2));
        const metrics = toMetrics(portfolioValue, nextRegime, repricedPositions);
        const totalExposure = repricedPositions.reduce((total, position) => total + position.exposure, 0);
        const sessionChange = portfolioValue - 10_000;

        return {
          updatedAt: formatTime(now),
          portfolioValue,
          sessionChange,
          sessionChangePct: (sessionChange / 10_000) * 100,
          regime: nextRegime,
          orderFlow: {
            buyVolume,
            sellVolume,
            imbalance,
          },
          metrics,
          positions: repricedPositions,
          totalExposure,
          equityCurve: nextEquityCurve,
        };
      });
    }, 3000);

    return () => window.clearInterval(interval);
  }, []);

  const orderFlowBars = useMemo(
    () => [
      { side: "Buy Volume", value: state.orderFlow.buyVolume, fill: "#22c55e" },
      { side: "Sell Volume", value: state.orderFlow.sellVolume, fill: "#ef4444" },
    ],
    [state.orderFlow.buyVolume, state.orderFlow.sellVolume],
  );

  return {
    state,
    orderFlowBars,
  };
}
