import { ReactNode } from 'react';

export default function Panel({
  title,
  actions,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`} aria-label={title}>
      <header className="panel-header">
        <h2 className="panel-title">{title}</h2>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
