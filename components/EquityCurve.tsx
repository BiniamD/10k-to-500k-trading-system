'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';

interface EquityPoint {
  time: string;
  equity: number;
  benchmark: number;
  drawdown: number;
}

export default function EquityCurve() {
  const [data, setData] = useState<EquityPoint[]>([]);
  const [timeframe, setTimeframe] = useState<'1H' | '4H' | '1D'>('1H');

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 60 }, (_, i) => ({
        time: new Date(Date.now() - (60 - i) * 3000).toLocaleTimeString(),
        equity: 10200 + Math.sin(i / 8) * 800 + Math.random() * 300,
        benchmark: 10150 + Math.sin(i / 9) * 550 + Math.random() * 180,
        drawdown: Math.max(0, 7 - Math.sin(i / 10) * 3 + Math.random() * 1.3),
      }));
      setData(newData);
    };
    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel
      title="Portfolio Equity"
      subtitle="Relative performance versus benchmark with drawdown context."
      actions={
        <div className="flex gap-2" role="tablist" aria-label="Equity timeframe">
          {(['1H', '4H', '1D'] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={timeframe === value}
              onClick={() => setTimeframe(value)}
              className={`px-3 py-1 rounded-lg text-xs border ${
                timeframe === value
                  ? 'bg-cyan-500/20 border-cyan-300/40 text-cyan-100'
                  : 'bg-slate-500/10 border-slate-400/25 text-slate-300'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      }
      className="lg:col-span-8 h-[480px]"
    >
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <div className="flex gap-2 items-center">
          <StatusBadge label="+2.34% Session" tone="positive" />
          <StatusBadge label="Drawdown 6.8%" tone="warning" />
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">Current Equity</p>
          <p className="text-2xl font-semibold tabular-nums">$12,487.34</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.7} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#6e82a7" tick={{ fontSize: 10 }} />
          <YAxis stroke="#6e82a7" tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#091224', border: '1px solid #36517a', borderRadius: '10px', color: '#d8e7ff' }}
            formatter={(value: number, name: string) => [
              name === 'drawdown' ? `${value.toFixed(2)}%` : `$${Number(value).toFixed(2)}`,
              name === 'equity' ? 'Portfolio' : name === 'benchmark' ? 'Benchmark' : 'Drawdown',
            ]}
          />
          <Area type="monotone" dataKey="equity" stroke="#38bdf8" strokeWidth={2} fill="url(#equityGradient)" />
          <Line type="monotone" dataKey="benchmark" stroke="#94a3b8" strokeDasharray="4 4" dot={false} />
          <Line type="monotone" dataKey="drawdown" stroke="#fb7185" strokeWidth={1.4} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}