'use client';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';

const positions = [
  { symbol: 'KO', side: 'LONG', qty: 420, entry: 62.45, current: 63.87, pnl: 598.4, percent: 2.28, risk: 'Low' },
  { symbol: 'PEP', side: 'SHORT', qty: 310, entry: 167.82, current: 166.34, pnl: 458.6, percent: 1.48, risk: 'Medium' },
];

export default function LivePositions() {
  return (
    <Panel
      title="Live Positions"
      subtitle="Position detail with risk visibility and aligned trade language."
      className="lg:col-span-5 h-full"
      actions={<StatusBadge label={`${positions.length} active`} tone="info" />}
    >
      <div className="table-row table-head mb-2">
        <span>Pair</span>
        <span>Qty</span>
        <span>Entry</span>
        <span>Current</span>
        <span>PnL</span>
      </div>
      <div className="space-y-2">
        {positions.map((pos) => (
          <article key={pos.symbol} className="table-row">
            <div>
              <p className="font-medium tracking-wide">{pos.symbol}</p>
              <p className={`text-xs ${pos.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pos.side} • {pos.risk} risk
              </p>
            </div>
            <p className="tabular-nums">{pos.qty}</p>
            <p className="tabular-nums">${pos.entry.toFixed(2)}</p>
            <p className="tabular-nums">${pos.current.toFixed(2)}</p>
            <div>
              <p className={`tabular-nums ${pos.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pos.pnl >= 0 ? '+' : '-'}${Math.abs(pos.pnl).toFixed(2)}
              </p>
              <p className={`text-xs ${pos.percent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pos.percent >= 0 ? '+' : ''}{pos.percent.toFixed(2)}%
              </p>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  );
}
