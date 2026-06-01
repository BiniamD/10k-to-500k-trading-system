'use client';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { PositionsData } from '@/frontend/types/dashboard';

const pnlFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function LivePositions() {
  const { data, loading, error } = useApiData<PositionsData>('/api/positions', 10000);
  const positions = data?.active ?? [];

  return (
    <Panel
      title="Live Positions"
      subtitle="Position detail with risk visibility and aligned trade language."
      className="lg:col-span-5 h-full"
      actions={<StatusBadge label={loading && !data ? 'Loading' : `${positions.length} active`} tone={error ? 'critical' : 'info'} />}
    >
      {error ? (
        <p className="text-sm text-rose-300">Unable to load live positions: {error}</p>
      ) : loading && positions.length === 0 ? (
        <p className="text-sm text-slate-300">Loading positions…</p>
      ) : positions.length === 0 ? (
        <p className="text-sm text-slate-300">No active positions.</p>
      ) : (
        <div role="table" aria-label="Live positions table">
          <div role="rowgroup">
            <div className="table-row table-head mb-2" role="row">
              <span role="columnheader">Pair</span>
              <span role="columnheader">Qty</span>
              <span role="columnheader">Entry</span>
              <span role="columnheader">Current</span>
              <span role="columnheader">PnL</span>
            </div>
          </div>
          <div className="space-y-2" role="rowgroup">
            {positions.map((pos) => (
              <article key={pos.symbol} className="table-row" role="row">
              <div role="cell">
                <p className="font-medium tracking-wide">{pos.symbol}</p>
                <p className={`text-xs ${pos.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pos.side} • {pos.risk} risk
                </p>
              </div>
              <p className="tabular-nums" role="cell">{pos.qty}</p>
              <p className="tabular-nums" role="cell">${pos.entry.toFixed(2)}</p>
              <p className="tabular-nums" role="cell">${pos.current.toFixed(2)}</p>
              <div role="cell">
                <p className={`tabular-nums ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pnlFormatter.format(pos.pnl)}
                </p>
                <p className={`text-xs ${pos.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {pos.percent >= 0 ? '+' : ''}{pos.percent.toFixed(2)}%
                </p>
              </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
