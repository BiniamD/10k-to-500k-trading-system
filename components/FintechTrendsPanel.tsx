'use client';

import {
  AlertTriangle,
  BrainCircuit,
  Clock3,
  ShieldCheck
} from 'lucide-react';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { InsightsData } from '@/frontend/types/dashboard';

const iconMap = [BrainCircuit, Clock3, ShieldCheck, AlertTriangle];

export default function FintechTrendsPanel() {
  const { data, loading, error } = useApiData<InsightsData>('/api/insights', 15000);
  const insights = data?.items ?? [];

  return (
    <Panel
      title="Operational Insights"
      subtitle="Actionable cues to reduce cognitive load and improve response quality."
      className="lg:col-span-12"
      actions={<StatusBadge label={error ? 'Feed error' : loading && !data ? 'Loading feed' : 'Live intelligence feed'} tone={error ? 'critical' : 'info'} />}
    >
      {error ? (
        <p className="text-sm text-rose-300">Unable to load insights: {error}</p>
      ) : loading && insights.length === 0 ? (
        <p className="text-sm text-slate-300">Loading operational insights…</p>
      ) : insights.length === 0 ? (
        <p className="text-sm text-slate-300">No operational insights available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {insights.map((insight, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <article
                key={insight.title}
                className="rounded-xl border border-slate-500/30 bg-slate-500/10 p-4 transition-all hover:border-cyan-300/35 hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 rounded-xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-base">{insight.title}</h3>
                <p className="text-sm text-slate-300 mt-2">{insight.detail}</p>
              </article>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
