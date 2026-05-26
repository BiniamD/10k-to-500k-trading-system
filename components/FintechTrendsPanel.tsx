'use client';

import {
  Bot,
  ShieldCheck,
  Sparkles,
  BarChart3,
  SlidersHorizontal,
  Gauge,
  Gem,
  BellRing
} from 'lucide-react';

const trends = [
  { title: 'AI-Native Workflows', detail: 'Adaptive execution and risk nudges in real time.', icon: Bot },
  { title: 'Trust-First Security Cues', detail: 'Visible data protection and consent transparency.', icon: ShieldCheck },
  { title: 'Refined Glass Interfaces', detail: 'Layered depth with sharper contrast for readability.', icon: Sparkles },
  { title: 'Story-Driven Data Visuals', detail: 'Signals and context merged into one decision surface.', icon: BarChart3 },
  { title: 'Composable Personalization', detail: 'Role-based widgets and workflow-specific modules.', icon: SlidersHorizontal },
  { title: 'Instant Performance Feedback', detail: 'Latency-aware controls with immediate status insight.', icon: Gauge },
  { title: 'Premium Neo-Minimalism', detail: 'High-trust visual language with less cognitive noise.', icon: Gem },
  { title: 'Proactive Micro-Interactions', detail: 'Subtle alerts that guide without overwhelming.', icon: BellRing }
];

export default function FintechTrendsPanel() {
  return (
    <section className="glass rounded-3xl p-8">
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Top 8 Fintech Design Trends · 2026</h2>
          <p className="text-sm text-slate-300 mt-1">Applied to the trading dashboard experience</p>
        </div>
        <span className="px-4 py-2 rounded-2xl panel-muted text-xs font-medium text-cyan-200">Trend Pack Enabled</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {trends.map((trend) => {
          const Icon = trend.icon;
          return (
            <div key={trend.title} className="panel-muted rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:border-cyan-300/35">
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 text-cyan-300 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-base">{trend.title}</h3>
              <p className="text-sm text-slate-300 mt-2">{trend.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
