'use client';

import { AlertTriangle, BrainCircuit, Clock3, ShieldCheck } from 'lucide-react';
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
      subtitle="Ground-up signal feed focused on short, decision-ready takeaways."
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
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((insight, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <article
                key={insight.title}
                className="rounded-xl border border-slate-500/30 bg-slate-500/10 p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35"
              >
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{insight.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{insight.detail}</p>
              </article>
            );
          })}
        </div>
      )}
    </Panel>
  );
}
