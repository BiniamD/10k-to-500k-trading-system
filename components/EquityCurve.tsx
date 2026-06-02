'use client';

import { useState } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { EquityData, EquityPoint } from '@/frontend/types/dashboard';

const emptyData: EquityData = {
  timeframes: {
    '1H': [],
    '4H': [],
    '1D': [],
  },
  sessionChangePercent: 0,
  currentDrawdownPercent: 0,
  currentEquity: 0,
};

export default function EquityCurve() {
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D'>('1H');
  const { data, loading, error } = useApiData<EquityData>('/api/equity', 5000);

  const equity = data ?? emptyData;
  const series: EquityPoint[] = equity.timeframes[timeframe] ?? [];

  return (
    <Panel
      title="Portfolio Equity"
      subtitle="Rebuilt trend workspace with benchmark context and drawdown visibility."
      actions={
        <div className="flex flex-nowrap gap-2" role="tablist" aria-label="Equity timeframe" aria-orientation="horizontal">
          {(['1H', '4H', '1D'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              id={`equity-tab-${value}`}
              aria-controls="equity-chart-panel"
              aria-selected={timeframe === value}
              onClick={() => setTimeframe(value)}
              className={`rounded-lg border px-3 py-1 text-xs ${
                timeframe === value
                  ? 'border-cyan-300/50 bg-cyan-500/20 text-cyan-100'
                  : 'border-slate-400/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      }
      className="lg:col-span-8"
    >
      {error ? (
        <p className="text-sm text-rose-300">Unable to load equity data: {error}</p>
      ) : loading && series.length === 0 ? (
        <p className="text-sm text-slate-300">Loading equity curve…</p>
      ) : series.length === 0 ? (
        <p className="text-sm text-slate-300">No equity data available.</p>
      ) : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-500/30 bg-slate-500/10 p-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                label={`${equity.sessionChangePercent >= 0 ? '+' : ''}${equity.sessionChangePercent.toFixed(2)}% Session`}
                tone={equity.sessionChangePercent >= 0 ? 'positive' : 'critical'}
              />
              <StatusBadge label={`Drawdown ${equity.currentDrawdownPercent.toFixed(2)}%`} tone="warning" />
            </div>
            <div className="text-right">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Current Equity</p>
              <p className="text-2xl font-semibold tabular-nums">
                ${equity.currentEquity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-300" aria-label="Equity chart legend">
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 bg-cyan-400" aria-hidden="true" />
              <span>Portfolio Equity</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 border-t border-dashed border-slate-300" aria-hidden="true" />
              <span>Benchmark</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-0.5 w-4 bg-rose-400" aria-hidden="true" />
              <span>Drawdown</span>
            </div>
          </div>

          <div
            role="tabpanel"
            id="equity-chart-panel"
            aria-live="polite"
            aria-labelledby={`equity-tab-${timeframe}`}
            aria-label="Portfolio equity, benchmark, and drawdown chart"
            className="h-[340px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -10, right: 8, top: 6, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2dd4ff" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#2dd4ff" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#88a1ca" tick={{ fontSize: 10 }} />
                <YAxis stroke="#88a1ca" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#071025',
                    border: '1px solid #36517a',
                    borderRadius: '10px',
                    color: '#d8e7ff',
                  }}
                  formatter={(value: number, name: string) => [
                    name === 'drawdown' ? `${value.toFixed(2)}%` : `$${Number(value).toFixed(2)}`,
                    name === 'equity' ? 'Portfolio' : name === 'benchmark' ? 'Benchmark' : 'Drawdown',
                  ]}
                />
                <Area type="monotone" dataKey="equity" stroke="#2dd4ff" strokeWidth={2} fill="url(#equityGradient)" />
                <Line type="monotone" dataKey="benchmark" stroke="#a5b4d4" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="drawdown" stroke="#fb7185" strokeWidth={1.4} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Panel>
  );
}
