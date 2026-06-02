'use client';

import { useState } from 'react';
import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { HeaderData } from '@/frontend/types/dashboard';

export default function Header() {
  const personas = ['Founder', 'Operator', 'Investor'];
  const [activePersona, setActivePersona] = useState('Operator');
  const { data, loading, error } = useApiData<HeaderData>('/api/portfolio', 5000);

  const portfolioValue = data?.portfolioValue ?? 0;
  const pnlValue = data?.pnlValue ?? 0;
  const pnlPercent = data?.pnlPercent ?? 0;
  const riskBudgetPercent = data?.riskBudgetPercent ?? 0;
  const riskTone = riskBudgetPercent >= 85 ? 'critical' : riskBudgetPercent >= 65 ? 'warning' : 'positive';

  return (
    <header className="header-shell">
      <div className="header-inner">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-400/15 shadow-lg shadow-cyan-500/10">
            <TrendingUp className="h-5 w-5 text-cyan-100" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl">10k → 500k Command Center</h1>
            <p className="mt-1 text-xs text-slate-300">Ground-up trading cockpit for focused, high-trust decision flow.</p>
            <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Persona workflow lens">
              {personas.map((persona) => (
                <button
                  key={persona}
                  type="button"
                  role="radio"
                  aria-checked={activePersona === persona}
                  onClick={() => setActivePersona(persona)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    activePersona === persona
                      ? 'border-cyan-300/50 bg-cyan-500/20 text-cyan-100'
                      : 'border-slate-500/35 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20'
                  }`}
                >
                  {persona}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-wrap items-start justify-between gap-4 md:w-auto md:max-w-[560px] md:justify-end">
          <div className="rounded-2xl border border-slate-400/25 bg-slate-500/10 px-4 py-3 text-left md:text-right">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Portfolio Equity</p>
            <p className="text-2xl font-semibold tabular-nums md:text-3xl">
              {loading && !data
                ? 'Loading…'
                : `$${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <p className={`mt-1 inline-flex items-center gap-1 text-sm ${pnlValue >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <Activity className="h-4 w-4" />
              {pnlValue >= 0 ? '+' : ''}${Math.abs(pnlValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              {' '}
              ({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)
            </p>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={`Session ${data?.sessionStatus ?? 'Loading'}`} tone={error ? 'critical' : 'positive'} />
              <StatusBadge label={`Risk Budget ${riskBudgetPercent}%`} tone={riskTone} />
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="h-4 w-4 text-cyan-300" />
              <span>{error ? `Data error: ${error}` : `Pre-trade checks ${data?.preTradeChecks ?? 'pending'}`}</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-300">
              <Activity className="h-4 w-4" /> LIVE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
