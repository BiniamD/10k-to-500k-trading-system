'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { RegimeData } from '@/frontend/types/dashboard';

const DEFAULT: RegimeData = {
  state: 'CALM',
  confidence: 0,
  vpin: 0,
  imbalance: 0,
  message: '—',
};

const STATE_COLOR = {
  CALM:     'var(--green)',
  BUSY:     'var(--amber)',
  VOLATILE: 'var(--red)',
} as const;

export default function RegimeMonitor() {
  const { data, loading, error } = useApiData<RegimeData>('/api/regime', 5000);
  const r = data ?? DEFAULT;
  const color = STATE_COLOR[r.state as keyof typeof STATE_COLOR] ?? 'var(--text-dim)';
  const tone  = r.state === 'VOLATILE' ? 'critical' : r.state === 'BUSY' ? 'warning' : 'positive';

  return (
    <Panel
      title="Market Regime"
      className="col-span-12 lg:col-span-4"
      actions={
        <StatusBadge
          label={loading && !data ? '…' : r.state}
          tone={error ? 'critical' : tone}
          dot
        />
      }
    >
      {/* state label */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '1.6rem',
        fontWeight: 700,
        letterSpacing: '-0.02em',
        color,
        lineHeight: 1,
      }}>
        {loading && !data ? '—' : r.state}
      </div>

      {/* confidence bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.35rem' }}>
          <span>Confidence</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{r.confidence}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${r.confidence}%`, background: color }} />
        </div>
      </div>

      {/* metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.5rem',
      }}>
        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.5rem 0.625rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>VPIN</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 600, marginTop: '0.2rem' }}>{r.vpin.toFixed(2)}</div>
        </div>
        <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.5rem 0.625rem' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Imbalance</div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
            fontWeight: 600,
            marginTop: '0.2rem',
            color: r.imbalance > 0 ? 'var(--green)' : r.imbalance < 0 ? 'var(--red)' : 'var(--text)',
          }}>
            {r.imbalance > 0 ? '+' : ''}{r.imbalance}%
          </div>
        </div>
      </div>

      {/* message */}
      <div
        role="status"
        aria-live="polite"
        style={{
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-muted)',
          borderRadius: '3px',
          padding: '0.5rem 0.625rem',
          lineHeight: 1.5,
        }}
      >
        {error ? `Error: ${error}` : r.message}
      </div>
    </Panel>
  );
}
