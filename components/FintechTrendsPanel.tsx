'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { InsightsData } from '@/frontend/types/dashboard';

const SEVERITY_COLOR = {
  info:     'var(--cyan)',
  warning:  'var(--amber)',
  critical: 'var(--red)',
} as const;

const SEVERITY_TONE = {
  info:     'info',
  warning:  'warning',
  critical: 'critical',
} as const;

export default function FintechTrendsPanel() {
  const { data, loading, error } = useApiData<InsightsData>('/api/insights', 15000);
  const insights = data?.items ?? [];

  return (
    <Panel
      title="Signals"
      className="lg:col-span-12"
      actions={
        <StatusBadge
          label={error ? 'Error' : loading && !data ? '…' : `${insights.length} active`}
          tone={error ? 'critical' : 'info'}
        />
      }
    >
      {error ? (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>
      ) : loading && insights.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Loading…</p>
      ) : insights.length === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No signals</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '0.5rem',
        }}>
          {insights.map((s) => {
            const color = SEVERITY_COLOR[s.severity as keyof typeof SEVERITY_COLOR] ?? 'var(--cyan)';
            const tone  = SEVERITY_TONE[s.severity as keyof typeof SEVERITY_TONE] ?? 'info';
            return (
              <article
                key={s.title}
                style={{
                  background: 'var(--bg-inset)',
                  border: `1px solid var(--border-muted)`,
                  borderLeft: `3px solid ${color}`,
                  borderRadius: '3px',
                  padding: '0.625rem 0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>{s.title}</span>
                  <StatusBadge label={s.severity.toUpperCase()} tone={tone} />
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{s.detail}</p>
              </article>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
