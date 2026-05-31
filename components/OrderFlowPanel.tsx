'use client';
import { useState, useEffect } from 'react';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';

export default function OrderFlowPanel() {
  const [buyVol, setBuyVol] = useState(12400);
  const [sellVol, setSellVol] = useState(9800);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuyVol(Math.floor(11800 + Math.random() * 1800));
      setSellVol(Math.floor(9200 + Math.random() * 1400));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const total = buyVol + sellVol;
  const buyPercent = Math.round((buyVol / total) * 100);
  const pressureTone = buyPercent >= 58 ? 'positive' : buyPercent <= 45 ? 'critical' : 'warning';

  return (
    <Panel
      title="Order Flow"
      subtitle="Execution pressure and imbalance thresholds for tactical entries."
      className="lg:col-span-7"
      actions={<StatusBadge label={`${buyPercent}% Buy Pressure`} tone={pressureTone} />}
    >
      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-emerald-400 text-sm">Buy Volume</span>
            <span className="tabular-nums">{buyVol.toLocaleString()}</span>
          </div>
          <div className="h-2.5 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${buyPercent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-rose-400 text-sm">Sell Volume</span>
            <span className="tabular-nums">{sellVol.toLocaleString()}</span>
          </div>
          <div className="h-2.5 bg-rose-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${100 - buyPercent}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="metric-tile">
            <p className="metric-label">Total Flow</p>
            <p className="metric-value tabular-nums">{total.toLocaleString()}</p>
            <p className="metric-delta-neutral">shares in current window</p>
          </div>
          <div className="metric-tile">
            <p className="metric-label">Imbalance</p>
            <p className={`metric-value tabular-nums ${buyPercent > 50 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {buyPercent > 50 ? '+' : ''}{buyPercent - 50}%
            </p>
            <p className="metric-delta-neutral">vs neutral flow</p>
          </div>
          <div className="metric-tile">
            <p className="metric-label">Action Cue</p>
            <p className="metric-value text-lg">
              {buyPercent >= 58 ? 'Lean Long' : buyPercent <= 45 ? 'Defensive' : 'Balanced'}
            </p>
            <p className="metric-delta-neutral">based on pressure threshold</p>
          </div>
        </div>
      </div>
    </Panel>
  );
}