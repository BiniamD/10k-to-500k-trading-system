'use client';
import Panel from '@/components/ui/Panel';
import MetricTile from '@/components/ui/MetricTile';

const metrics = [
  { label: 'Win Rate', value: '68.4%', change: '+4.2% vs 30D', tone: 'positive' as const },
  { label: 'Sharpe Ratio', value: '2.41', change: '+0.18 stability', tone: 'positive' as const },
  { label: 'Max Drawdown', value: '6.8%', change: '-1.1% risk compression', tone: 'positive' as const },
  { label: 'Profit Factor', value: '2.87', change: '+0.31 edge quality', tone: 'positive' as const },
  { label: 'Avg Trade', value: '$184', change: '+$27 expectancy', tone: 'positive' as const },
  { label: 'Total Trades', value: '142', change: 'Balanced frequency', tone: 'neutral' as const },
];

export default function PerformanceMetrics() {
  return (
    <Panel
      title="Performance Metrics"
      subtitle="At-a-glance health indicators optimized for fast decision scanning."
      className="lg:col-span-12"
    >
      <div className="metric-grid lg:grid-cols-6">
        {metrics.map((metric) => (
          <MetricTile key={metric.label} label={metric.label} value={metric.value} delta={metric.change} tone={metric.tone} />
        ))}
      </div>
    </Panel>
  );
}