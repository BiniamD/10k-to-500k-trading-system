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
      subtitle="Execution pressure and imbalance thresholds for tactical entries."
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
              value={data?.actionCue ?? 'Balanced'}
              delta="based on pressure threshold"
              tone="neutral"
            />
          </div>
        </div>
      )}
    </Panel>
  );
}
