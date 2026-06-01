'use client';
import Panel from '@/components/ui/Panel';
import MetricTile from '@/components/ui/MetricTile';
import StatusBadge from '@/components/ui/StatusBadge';
import { useApiData } from '@/frontend/hooks/useApiData';
import { PerformanceData } from '@/frontend/types/dashboard';

export default function PerformanceMetrics() {
  const { data, loading, error } = useApiData<PerformanceData>('/api/performance', 30000);
  const metrics = data?.metrics ?? [];

  return (
    <Panel
      title="Performance Metrics"
      subtitle="At-a-glance health indicators optimized for fast decision scanning."
      className="lg:col-span-12"
      actions={<StatusBadge label={error ? 'Data error' : loading && !data ? 'Loading' : 'Live'} tone={error ? 'critical' : 'info'} />}
    >
      {error ? (
        <p className="text-sm text-rose-300">Unable to load performance metrics: {error}</p>
      ) : loading && metrics.length === 0 ? (
        <p className="text-sm text-slate-300">Loading performance metrics…</p>
      ) : metrics.length === 0 ? (
        <p className="text-sm text-slate-300">No performance metrics available.</p>
      ) : (
        <div className="metric-grid lg:grid-cols-6">
          {metrics.map((metric) => (
            <MetricTile key={metric.label} label={metric.label} value={metric.value} delta={metric.change} tone={metric.tone} />
          ))}
        </div>
      )}
    </Panel>
  );
}
