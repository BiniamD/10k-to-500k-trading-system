export default function StatusBadge({
  label,
  tone = 'info',
}: {
  label: string;
  tone?: 'positive' | 'warning' | 'critical' | 'info';
}) {
  const toneClasses = {
    positive: 'badge-positive',
    warning: 'badge-warning',
    critical: 'badge-critical',
    info: 'badge-info',
  } as const;

  return <span className={`status-badge ${toneClasses[tone]}`}>{label}</span>;
}
