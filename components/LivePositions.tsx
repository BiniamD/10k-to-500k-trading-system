'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { PositionsData } from '@/frontend/types/dashboard';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  signDisplay: 'always',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const px = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function LivePositions() {
  const { data, loading, error } = useApiData<PositionsData>('/api/positions', 10000);
  const positions = data?.active ?? [];

  return (
    <Panel
      title="Positions"
      className="col-span-12 lg:col-span-5"
      actions={
        <StatusBadge
          label={loading && !data ? '…' : `${positions.length} open`}
          tone={error ? 'critical' : positions.length > 0 ? 'positive' : 'info'}
          dot={positions.length > 0}
        />
      }
    >
      {error ? (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>
      ) : loading && positions.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Loading…</p>
      ) : positions.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No open positions</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="pos-table" aria-label="Open positions">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Entry</th>
                <th>Mark</th>
                <th>P&amp;L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => {
                const pnlColor = p.pnl >= 0 ? 'var(--green)' : 'var(--red)';
                return (
                  <tr key={p.symbol}>
                    <td>
                      <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{p.symbol}</span>
                      <br />
                      <span style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        color: p.side === 'LONG' ? 'var(--green)' : 'var(--red)',
                        letterSpacing: '0.05em',
                      }}>
                        {p.side} · {p.risk}
                      </span>
                    </td>
                    <td>{p.qty}</td>
                    <td>${px(p.entry)}</td>
                    <td>${px(p.current)}</td>
                    <td>
                      <span style={{ color: pnlColor, display: 'block' }}>{usd.format(p.pnl)}</span>
                      <span style={{ fontSize: '0.68rem', color: pnlColor }}>
                        {p.percent >= 0 ? '+' : ''}{p.percent.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
