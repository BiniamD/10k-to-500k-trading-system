'use client';

import { TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { HeaderData } from '@/frontend/types/dashboard';

const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Header() {
  const { data, error } = useApiData<HeaderData>('/api/portfolio', 5000);

  const equity     = data?.portfolioValue ?? 0;
  const pnl        = data?.pnlValue ?? 0;
  const pnlPct     = data?.pnlPercent ?? 0;
  const riskBudget = data?.riskBudgetPercent ?? 0;
  const riskTone   = riskBudget >= 85 ? 'critical' : riskBudget >= 65 ? 'warning' : 'positive';
  const pnlSign    = pnl >= 0 ? '+' : '';

  return (
    <header className="header-shell">
      <div className="header-inner">
        {/* brand */}
        <div className="header-brand">
          <TrendingUp size={16} style={{ color: 'var(--cyan)' }} />
          <span className="header-brand-name">10K → 500K</span>
        </div>

        <div className="header-divider" />

        {/* equity */}
        <div className="header-stat">
          <span className="header-stat-label">Equity</span>
          <span className="header-stat-value">${fmt(equity)}</span>
        </div>

        <div className="header-divider" />

        {/* session pnl */}
        <div className="header-stat">
          <span className="header-stat-label">Session P&amp;L</span>
          <span
            className="header-stat-value"
            style={{ color: pnl >= 0 ? 'var(--green)' : 'var(--red)' }}
          >
            {pnlSign}${fmt(Math.abs(pnl))}
            <span style={{ fontSize: '0.72rem', marginLeft: '0.35rem' }}>
              ({pnlSign}{pnlPct.toFixed(2)}%)
            </span>
          </span>
        </div>

        <div className="header-divider" />

        {/* risk budget */}
        <div className="header-stat">
          <span className="header-stat-label">Risk Budget</span>
          <span
            className="header-stat-value"
            style={{ color: riskBudget >= 85 ? 'var(--red)' : riskBudget >= 65 ? 'var(--amber)' : 'var(--green)' }}
          >
            {riskBudget}%
          </span>
        </div>

        {/* right section */}
        <div className="header-right">
          {error ? (
            <StatusBadge label="Feed Error" tone="critical" dot />
          ) : (
            <>
              <StatusBadge label={`Risk ${riskTone === 'critical' ? 'HIGH' : riskTone === 'warning' ? 'MED' : 'OK'}`} tone={riskTone} />
              <StatusBadge label={data?.sessionStatus ?? 'Connecting'} tone="info" dot />
              <StatusBadge label="LIVE" tone="positive" dot />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
