import Link from 'next/link';
import { TrendingUp } from 'lucide-react';

const LAYOUTS = [
  {
    id: 1,
    name: 'Command Center',
    tag: 'Pro Trader',
    tagColor: 'var(--cyan)',
    description:
      'All 6 panels in a structured 12-col grid. Dense, information-rich terminal aesthetic with sticky header.',
    sketch: 'cmd',
  },
  {
    id: 2,
    name: 'Hero Focus',
    tag: 'Modern',
    tagColor: 'var(--green)',
    description:
      'Full-width equity curve hero at the top, then collapsible accordion for all secondary panels. Clean, mobile-first.',
    sketch: 'hero',
  },
  {
    id: 3,
    name: 'Sidebar Navigator',
    tag: 'SaaS App',
    tagColor: 'var(--purple)',
    description:
      'Fixed 220px sidebar with nav links. One focused panel at a time in a spacious main content area.',
    sketch: 'sidebar',
  },
  {
    id: 4,
    name: 'Card Deck Feed',
    tag: 'Feed Style',
    tagColor: 'var(--amber)',
    description:
      'Scrollable 2-column card grid. Each panel gets a color-coded left-border accent. Very mobile-friendly.',
    sketch: 'feed',
  },
  {
    id: 5,
    name: 'Workstation',
    tag: 'Bloomberg-style',
    tagColor: 'var(--red)',
    description:
      '30% left column for regime + order flow. 70% right with equity curve on top and tabbed panels below.',
    sketch: 'ws',
  },
];

type SketchType = 'cmd' | 'hero' | 'sidebar' | 'feed' | 'ws';

function LayoutSketch({ type }: { type: SketchType }) {
  const box = (w: string, h: number | string, opacity: number, extra?: React.CSSProperties): React.CSSProperties => ({
    width: w,
    height: typeof h === 'number' ? `${h}px` : h,
    background: `rgba(0,184,255,${opacity})`,
    borderRadius: 2,
    flexShrink: 0,
    ...extra,
  });

  if (type === 'cmd') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, height: 52 }}>
      <div style={{ display: 'flex', gap: 3, height: 16 }}>
        <div style={box('65%', '100%', 0.25)} />
        <div style={box('35%', '100%', 0.12)} />
      </div>
      <div style={box('100%', 10, 0.1)} />
      <div style={{ display: 'flex', gap: 3, height: 16 }}>
        <div style={box('58%', '100%', 0.18)} />
        <div style={box('42%', '100%', 0.12)} />
      </div>
    </div>
  );

  if (type === 'hero') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, height: 52 }}>
      <div style={box('100%', 22, 0.28)} />
      <div style={{ display: 'flex', gap: 3, height: 10 }}>
        {[0.18, 0.18, 0.18, 0.18].map((o, i) => (
          <div key={i} style={box('25%', '100%', o)} />
        ))}
      </div>
      <div style={box('100%', 10, 0.1)} />
      <div style={box('100%', 6, 0.06)} />
    </div>
  );

  if (type === 'sidebar') return (
    <div style={{ display: 'flex', gap: 4, height: 52 }}>
      <div style={{ width: 30, background: 'rgba(0,184,255,0.12)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 0' }}>
        {[0.35, 0.2, 0.2, 0.2, 0.2, 0.2].map((o, i) => (
          <div key={i} style={{ height: 5, margin: '0 4px', background: `rgba(0,184,255,${o})`, borderRadius: 1 }} />
        ))}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={box('100%', 20, 0.25)} />
        <div style={box('100%', 24, 0.1)} />
      </div>
    </div>
  );

  if (type === 'feed') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, height: 52 }}>
      <div style={{ display: 'flex', gap: 3, height: 14 }}>
        <div style={box('50%', '100%', 0.22, { borderLeft: '2px solid rgba(0,184,255,0.8)' })} />
        <div style={box('50%', '100%', 0.16, { borderLeft: '2px solid rgba(0,217,126,0.8)' })} />
      </div>
      <div style={{ display: 'flex', gap: 3, height: 14 }}>
        <div style={box('50%', '100%', 0.16, { borderLeft: '2px solid rgba(245,166,35,0.8)' })} />
        <div style={box('50%', '100%', 0.16, { borderLeft: '2px solid rgba(124,108,255,0.8)' })} />
      </div>
      <div style={{ display: 'flex', gap: 3, height: 14 }}>
        <div style={box('50%', '100%', 0.1, { borderLeft: '2px solid rgba(74,144,217,0.6)' })} />
        <div style={box('50%', '100%', 0.1, { borderLeft: '2px solid rgba(255,51,85,0.6)' })} />
      </div>
    </div>
  );

  /* workstation */
  return (
    <div style={{ display: 'flex', gap: 4, height: 52 }}>
      <div style={{ width: '28%', background: 'rgba(0,184,255,0.08)', borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 3, padding: 3 }}>
        <div style={box('100%', '48%', 0.3)} />
        <div style={box('100%', '48%', 0.18)} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={box('100%', 28, 0.25)} />
        <div style={{ display: 'flex', gap: 2, height: 10 }}>
          {[0.5, 0.3, 0.3].map((o, i) => (
            <div key={i} style={{ flex: 1, height: '100%', background: `rgba(0,184,255,${o})`, borderRadius: 1 }} />
          ))}
        </div>
        <div style={box('100%', 8, 0.1)} />
      </div>
    </div>
  );
}

export default function LayoutPicker() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        color: 'var(--text)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {/* header */}
      <header
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 1.5rem',
          height: '3.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <TrendingUp size={16} style={{ color: 'var(--cyan)' }} />
        <span style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.85rem' }}>10K → 500K</span>
        <span
          style={{
            width: 1,
            height: '1.5rem',
            background: 'var(--border)',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
          Choose Layout
        </span>
        <div style={{ marginLeft: 'auto' }}>
          <Link
            href="/"
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-dim)',
              textDecoration: 'none',
              letterSpacing: '0.03em',
            }}
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      {/* intro */}
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '2.5rem 1.5rem 1.25rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
          Dashboard Layouts
        </h1>
        <p
          style={{
            margin: '0.5rem 0 0',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            lineHeight: 1.65,
            maxWidth: 560,
          }}
        >
          Preview each of the 5 layouts and pick the one that fits your workflow. Tell me which you
          want and I&apos;ll set it as the default.
        </p>
      </div>

      {/* cards */}
      <div
        style={{
          maxWidth: 980,
          margin: '0 auto',
          padding: '0 1.5rem 5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '1rem',
        }}
      >
        {LAYOUTS.map((l) => (
          <div
            key={l.id}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderTop: `3px solid ${l.tagColor}`,
              borderRadius: 4,
              padding: '1.125rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.875rem',
            }}
          >
            {/* top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: l.tagColor,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {l.tag}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)',
                }}
              >
                0{l.id}
              </span>
            </div>

            {/* mini layout sketch */}
            <LayoutSketch type={l.sketch as SketchType} />

            {/* name + description */}
            <div>
              <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{l.name}</h2>
              <p
                style={{
                  margin: '0.35rem 0 0',
                  fontSize: '0.76rem',
                  color: 'var(--text-dim)',
                  lineHeight: 1.6,
                }}
              >
                {l.description}
              </p>
            </div>

            {/* action */}
            <Link
              href={`/preview/${l.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.5rem',
                background: 'var(--bg-raised)',
                border: '1px solid var(--border)',
                borderRadius: 3,
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text)',
                textDecoration: 'none',
                letterSpacing: '0.03em',
                marginTop: 'auto',
              }}
            >
              Preview →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
