export default function StatusBadge({
  label,
  tone = 'info',
  dot = false,
}: {
  label: string;
  tone?: 'positive' | 'warning' | 'critical' | 'info';
  dot?: boolean;
}) {
  const toneClasses = {
    positive: 'badge-positive',
    warning:  'badge-warning',
    critical: 'badge-critical',
    info:     'badge-info',
  } as const;

  return (
    <span className={`status-badge ${toneClasses[tone]}`}>
      {dot && (
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: 'currentColor' }}
          aria-hidden="true"
        />
      )}
      {label}
    </span>
  );
}
