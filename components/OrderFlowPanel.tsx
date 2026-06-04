'use client';

import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { OrderFlowData } from '@/frontend/types/dashboard';

export default function OrderFlowPanel() {
  const { data, loading, error } = useApiData<OrderFlowData>('/api/order_flow', 5000);

  const buyVol   = data?.buyVolume ?? 0;
  const sellVol  = data?.sellVolume ?? 0;
  const total    = buyVol + sellVol;
  const buyPct   = data?.buyPercent ?? 0;
  const sellPct  = Math.max(0, 100 - buyPct);
  const imbal    = buyPct - 50;
  const tone     = buyPct >= 58 ? 'positive' : buyPct <= 45 ? 'critical' : 'warning';
  const cue      = data?.actionCue ?? '—';

  return (
    <Panel
      title="Order Flow"
      className="lg:col-span-7"
      actions={
        <StatusBadge
          label={loading && !data ? '…' : `${buyPct}% Buy`}
          tone={error ? 'critical' : tone}
        />
      }
    >
      {error ? (
        <p style={{ color: 'var(--red)', fontSize: '0.8rem' }}>{error}</p>
      ) : loading && !data ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Loading…</p>
      ) : total === 0 ? (
        <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>No data</p>
      ) : (
        <>
          {/* pressure bars */}
          <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.75rem' }}>
            <div style={{ marginBottom: '0.625rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--green)', fontWeight: 600 }}>BUY</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{buyVol.toLocaleString()} ({buyPct}%)</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${buyPct}%`, background: 'var(--green)' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>SELL</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{sellVol.toLocaleString()} ({sellPct.toFixed(0)}%)</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${sellPct}%`, background: 'var(--red)' }} />
              </div>
            </div>
          </div>

          {/* stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: '0.5rem' }}>
            <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.5rem 0.625rem' }}>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total Flow</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>{total.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.5rem 0.625rem' }}>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Imbalance</div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: '0.95rem',
                marginTop: '0.2rem',
                color: imbal > 0 ? 'var(--green)' : imbal < 0 ? 'var(--red)' : 'var(--text)',
              }}>
                {imbal > 0 ? '+' : ''}{imbal.toFixed(1)}%
              </div>
            </div>
            <div style={{ background: 'var(--bg-inset)', border: '1px solid var(--border-muted)', borderRadius: '3px', padding: '0.5rem 0.625rem' }}>
              <div style={{ fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Action Cue</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.2rem' }}>{cue}</div>
            </div>
          </div>
        </>
      )}
    </Panel>
  );
}
