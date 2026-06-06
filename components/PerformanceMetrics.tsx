'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { PerformanceData } from '@/frontend/types/dashboard';

export default function PerformanceMetrics() {
  const { data, loading, error } = useApiData<PerformanceData>('/api/performance', 30000);
  const metrics = data?.metrics ?? [];

  return (
    <Panel
      title="Performance"
      className="col-span-12"
      actions={
        <StatusBadge
          label={error ? 'Error' : loading && !data ? '…' : 'Live'}
          tone={error ? 'critical' : 'info'}
        />
      }
    >
      {error ? (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>
      ) : loading && metrics.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Loading…</p>
      ) : metrics.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No data</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(metrics.length, 6)}, minmax(0,1fr))`,
          gap: '0.5rem',
        }}>
          {metrics.map((m) => {
            const positive = m.tone === 'positive';
            const negative = m.tone === 'negative';
            return (
              <div
                key={m.label}
                style={{
                  background: 'var(--bg-inset)',
                  border: '1px solid var(--border-muted)',
                  borderRadius: '3px',
                  padding: '0.625rem 0.75rem',
                }}
                aria-label={m.label}
              >
                <div style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.05rem', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.2 }}>
                  {m.value}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  marginTop: '0.15rem',
                  color: positive ? 'var(--green)' : negative ? 'var(--red)' : 'var(--text-dim)',
                }}>
                  {m.change}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
