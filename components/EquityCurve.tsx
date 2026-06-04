'use client';

import { useState } from 'react';
import {
  AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { EquityData, EquityPoint } from '@/frontend/types/dashboard';

type TF = '1H' | '4H' | '1D';

const EMPTY: EquityData = {
  timeframes: { '1H': [], '4H': [], '1D': [] },
  sessionChangePercent: 0,
  currentDrawdownPercent: 0,
  currentEquity: 0,
};

export default function EquityCurve() {
  const [timeframe, setTimeframe] = useState<TF>('1H');
  const { data, loading, error } = useApiData<EquityData>('/api/equity', 5000);

  const eq: EquityData = data ?? EMPTY;
  const series: EquityPoint[] = eq.timeframes[timeframe] ?? [];

  const changePct  = eq.sessionChangePercent;
  const drawdownPct = eq.currentDrawdownPercent;

  return (
    <Panel
      title="Equity Curve"
      className="lg:col-span-8"
      actions={
        <div className="flex items-center gap-2">
          <div className="flex gap-1" role="tablist" aria-label="Timeframe">
            {(['1H', '4H', '1D'] as TF[]).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={timeframe === v}
                onClick={() => setTimeframe(v)}
                style={{
                  background: timeframe === v ? 'var(--bg-raised)' : 'transparent',
                  border: `1px solid ${timeframe === v ? 'var(--border)' : 'transparent'}`,
                  color: timeframe === v ? 'var(--text)' : 'var(--text-dim)',
                  borderRadius: '3px',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <StatusBadge
            label={error ? 'Error' : loading && !data ? '…' : `${changePct >= 0 ? '+' : ''}${changePct.toFixed(2)}%`}
            tone={error ? 'critical' : changePct >= 0 ? 'positive' : 'critical'}
          />
        </div>
      }
    >
      {error ? (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>
      ) : loading && series.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Loading…</p>
      ) : series.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No data</p>
      ) : (
        <>
          {/* stat bar */}
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            padding: '0.5rem 0.75rem',
            background: 'var(--bg-inset)',
            border: '1px solid var(--border-muted)',
            borderRadius: '3px',
          }}>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Equity</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem' }}>
                ${eq.currentEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Session</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', color: changePct >= 0 ? 'var(--green)' : 'var(--red)' }}>
                {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Drawdown</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem', color: drawdownPct > 5 ? 'var(--red)' : 'var(--text-dim)' }}>
                {drawdownPct.toFixed(2)}%
              </div>
            </div>
          </div>

          {/* chart */}
          <div style={{ height: 300 }} aria-label="Equity chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -12, right: 4, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#00b8ff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#00b8ff" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  stroke="#3d5070"
                  tick={{ fontSize: 10, fill: '#4a5a7a', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#3d5070"
                  tick={{ fontSize: 10, fill: '#4a5a7a', fontFamily: 'var(--font-mono)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0d1117',
                    border: '1px solid #1f2d45',
                    borderRadius: '3px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#dce8ff',
                  }}
                  itemStyle={{ color: '#dce8ff' }}
                  formatter={(value: number, name: string) => [
                    name === 'drawdown' ? `${value.toFixed(2)}%` : `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name === 'equity' ? 'Equity' : name === 'benchmark' ? 'Benchmark' : 'Drawdown',
                  ]}
                />
                <ReferenceLine y={series[0]?.equity} stroke="#3d5070" strokeDasharray="3 3" />
                <Area type="monotone" dataKey="equity" stroke="#00b8ff" strokeWidth={1.5} fill="url(#eqGrad)" dot={false} />
                <Line type="monotone" dataKey="benchmark" stroke="#3d5070" strokeDasharray="4 3" strokeWidth={1} dot={false} />
                <Line type="monotone" dataKey="drawdown" stroke="#ff3355" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* legend */}
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.68rem', color: 'var(--text-dim)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: 12, height: 2, background: '#00b8ff' }} />
              Equity
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: 12, height: 2, background: '#3d5070', borderTop: '1px dashed #3d5070' }} />
              Benchmark
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ display: 'inline-block', width: 12, height: 2, background: '#ff3355' }} />
              Drawdown
            </span>
          </div>
        </>
      )}
    </Panel>
  );
}
