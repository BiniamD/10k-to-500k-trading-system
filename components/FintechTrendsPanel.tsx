'use client';

import {
  AlertTriangle,
  BrainCircuit,
  Clock3,
  ShieldCheck
} from 'lucide-react';
import Panel from '@/components/ui/Panel';
import StatusBadge from '@/components/ui/StatusBadge';

const insights = [
  { title: 'Signal Confidence Drift', detail: 'Pair alpha confidence dropped 4% in 30m. Queue model recalibration.', icon: BrainCircuit },
  { title: 'Latency Watch', detail: 'Execution latency is 142ms, below alert threshold but rising.', icon: Clock3 },
  { title: 'Compliance Coverage', detail: 'All order intents passed pre-trade checks with signed audit trail.', icon: ShieldCheck },
  { title: 'Risk Trigger', detail: 'Sector concentration exceeded soft limit by 1.8%. Apply hedge candidate.', icon: AlertTriangle },
];

export default function FintechTrendsPanel() {
  return (
    <Panel
      title="Operational Insights"
      subtitle="Actionable cues to reduce cognitive load and improve response quality."
      className="lg:col-span-12"
      actions={<StatusBadge label="Live intelligence feed" tone="info" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {insights.map((insight) => {
          const Icon = insight.icon;
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
    </Panel>
  );
}
