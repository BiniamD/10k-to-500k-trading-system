'use client';
import { useState, useEffect } from 'react';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricTile from '@/components/ui/MetricTile';

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
          <MetricTile label="Total Flow" value={total.toLocaleString()} delta="shares in current window" tone="neutral" />
          <MetricTile
            label="Imbalance"
            value={`${buyPercent > 50 ? '+' : ''}${buyPercent - 50}%`}
            delta="vs neutral flow"
            tone={buyPercent >= 50 ? 'positive' : 'negative'}
          />
          <MetricTile
            label="Action Cue"
            value={buyPercent >= 58 ? 'Lean Long' : buyPercent <= 45 ? 'Defensive' : 'Balanced'}
            delta="based on pressure threshold"
            tone="neutral"
          />
        </div>
      </div>
    </Panel>
  );
}