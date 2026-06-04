'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import MetricTile from '@/components/ui/MetricTile';
import { useApiData } from '@/frontend/hooks/useApiData';
import { OrderFlowData } from '@/frontend/types/dashboard';

export default function OrderFlowPanel() {
  const { data, loading, error } = useApiData<OrderFlowData>('/api/order_flow', 5000);

  const buyVol = data?.buyVolume ?? 0;
  const sellVol = data?.sellVolume ?? 0;
  const total = buyVol + sellVol;
  const buyPercent = data?.buyPercent ?? 0;
  const pressureTone = buyPercent >= 58 ? 'positive' : buyPercent <= 45 ? 'critical' : 'warning';

  return (
    <Panel
      title="Order Flow"
      subtitle="Rebuilt pressure breakdown for cleaner tactical reads and faster reaction windows."
      className="lg:col-span-7"
      actions={<StatusBadge label={loading && !data ? 'Loading' : `${buyPercent}% Buy Pressure`} tone={error ? 'critical' : pressureTone} />}
    >
      {error ? (
        <p className="text-sm text-rose-300">Unable to load order-flow data: {error}</p>
      ) : loading && !data ? (
        <p className="text-sm text-slate-300">Loading order flow…</p>
      ) : total === 0 ? (
        <p className="text-sm text-slate-300">No order-flow data available.</p>
      ) : (
        <div className="space-y-5">
          <div className="space-y-4 rounded-xl border border-slate-500/30 bg-slate-500/10 p-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-emerald-300">Buy Volume</span>
                <span className="tabular-nums text-sm">{buyVol.toLocaleString()}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-emerald-500/20">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${buyPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-rose-300">Sell Volume</span>
                <span className="tabular-nums text-sm">{sellVol.toLocaleString()}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-rose-500/20">
                <div className="h-full rounded-full bg-rose-400" style={{ width: `${100 - buyPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricTile label="Total Flow" value={total.toLocaleString()} delta="shares in current window" tone="neutral" />
            <MetricTile
              label="Imbalance"
              value={`${buyPercent > 50 ? '+' : ''}${buyPercent - 50}%`}
              delta="vs neutral flow"
              tone={buyPercent >= 50 ? 'positive' : 'negative'}
            />
            <MetricTile label="Action Cue" value={data?.actionCue ?? 'Balanced'} delta="based on pressure threshold" tone="neutral" />
          </div>
        </div>
      )}
    </Panel>
  );
}
