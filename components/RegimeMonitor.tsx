'use client';
import { motion } from 'framer-motion';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { RegimeData } from '@/frontend/types/dashboard';

const defaultRegime: RegimeData = {
  state: 'CALM',
  confidence: 0,
  vpin: 0,
  imbalance: 0,
  message: 'Awaiting regime data.',
};

export default function RegimeMonitor() {
  const { data, loading, error } = useApiData<RegimeData>('/api/regime', 5000);
  const regime = data ?? defaultRegime;

  const styleMap = {
    CALM: {
      badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-400/40',
      bar: 'bg-emerald-400',
    },
    BUSY: {
      badge: 'bg-amber-500/10 text-amber-300 border-amber-400/40',
      bar: 'bg-amber-400',
    },
    VOLATILE: {
      badge: 'bg-rose-500/10 text-rose-300 border-rose-400/40',
      bar: 'bg-rose-400',
    }
  } as const;
  const trendStyle = styleMap[regime.state as keyof typeof styleMap] ?? styleMap.CALM;

  const tone = regime.state === 'VOLATILE' ? 'critical' : regime.state === 'BUSY' ? 'warning' : 'positive';

  return (
    <Panel
      title="Market Regime"
      subtitle="Execution environment with toxicity and imbalance signals."
      className="lg:col-span-4 h-full"
      actions={<StatusBadge label={loading && !data ? 'Loading' : regime.state} tone={error ? 'critical' : tone} />}
    >
      <motion.div
        className={`inline-flex items-center px-5 py-2 rounded-xl text-xl font-semibold mb-6 border ${trendStyle.badge}`}
        initial={{ opacity: 0.65, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {loading && !data ? 'Loading…' : regime.state}
      </motion.div>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-2 text-slate-300">
            <span>Confidence</span>
            <span className="tabular-nums">{regime.confidence}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${trendStyle.bar}`} style={{ width: `${regime.confidence}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-[0.16em]">VPIN Toxicity</div>
            <div className="text-xl font-medium mt-1 tabular-nums">{regime.vpin.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-[0.16em]">Volume Imbalance</div>
            <div className={`text-xl font-medium mt-1 tabular-nums ${regime.imbalance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {regime.imbalance > 0 ? '+' : ''}{regime.imbalance}%
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 px-3 py-2 text-sm text-slate-200" role="status" aria-live="polite">
          {error ? `Failed to refresh regime: ${error}` : regime.message}
        </div>
      </div>
    </Panel>
  );
}
