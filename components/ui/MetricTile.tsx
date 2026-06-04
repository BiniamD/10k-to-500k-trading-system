export default function MetricTile({
  label,
  value,
  delta,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: 'positive' | 'negative' | 'neutral';
}) {
  const deltaClass = {
    positive: 'metric-delta-positive',
    negative: 'metric-delta-negative',
    neutral:  'metric-delta-neutral',
  } as const;

  return (
    <article className="metric-tile" aria-label={label}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      {delta ? <p className={deltaClass[tone]}>{delta}</p> : null}
    </article>
  );
}
