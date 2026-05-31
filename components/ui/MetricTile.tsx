export default function MetricTile({
  label,
  value,
  delta,
  tone = 'positive',
}: {
  label: string;
  value: string;
  delta: string;
  tone?: 'positive' | 'negative' | 'neutral';
}) {
  const toneClasses = {
    positive: 'metric-delta-positive',
    negative: 'metric-delta-negative',
    neutral: 'metric-delta-neutral',
  } as const;

  return (
    <article className="metric-tile">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className={toneClasses[tone]}>{delta}</p>
    </article>
  );
}
