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
    <article className="metric-tile" aria-label={label}>
      <p className="metric-label">{label}</p>
      <p className="metric-value tabular-nums">{value}</p>
      <p className={toneClasses[tone]}>{delta}</p>
    </article>
  );
}
