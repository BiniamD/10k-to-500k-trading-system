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
  const deltaClass =
    tone === 'positive' ? 'metric-delta-positive' : tone === 'negative' ? 'metric-delta-negative' : 'metric-delta-neutral';

  return (
    <article className="metric-tile" aria-label={label}>
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
      <p className={deltaClass}>{delta}</p>
    </article>
  );
}
