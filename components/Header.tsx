'use client';
import { Activity, ShieldCheck, TrendingUp } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';

export default function Header({ portfolioValue }: { portfolioValue: number }) {
  const personas = ['Founder', 'Operator', 'Investor'];

  return (
    <header className="header-shell">
      <div className="header-inner">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-cyan-400/15 rounded-xl flex items-center justify-center border border-cyan-300/30">
            <TrendingUp className="w-5 h-5 text-cyan-200" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">10k → 500k Command Center</h1>
            <p className="text-xs text-slate-300">Decision-first trading cockpit · high-trust interface</p>
            <div className="mt-2 flex gap-2 flex-wrap" role="tablist" aria-label="Persona workflow lens">
              {personas.map((persona, index) => (
                <button
                  key={persona}
                  type="button"
                  role="tab"
                  aria-selected={index === 1}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    index === 1
                      ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-100'
                      : 'bg-slate-500/10 border-slate-400/30 text-slate-300 hover:bg-slate-500/20'
                  }`}
                >
                  {persona}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-4 md:gap-7 flex-wrap">
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Portfolio Equity</p>
            <p className="text-2xl md:text-3xl font-semibold tabular-nums">${portfolioValue.toLocaleString()}</p>
            <div className="flex items-center justify-end gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" /> +$286.12 (2.34%)
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <StatusBadge label="Session Live" tone="positive" />
              <StatusBadge label="Risk Budget 72%" tone="warning" />
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-300" />
              <span>Pre-trade checks healthy</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-400/25 w-fit">
              <Activity className="w-4 h-4" /> LIVE
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}