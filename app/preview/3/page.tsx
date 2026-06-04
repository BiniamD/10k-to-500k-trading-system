'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  BarChart2,
  Activity,
  Layers,
  ArrowRightLeft,
  Map,
  Zap,
} from 'lucide-react';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';

import type { LucideIcon } from 'lucide-react';

type NavId = 'overview' | 'performance' | 'regime' | 'orderflow' | 'positions' | 'trends';

const NAV_ITEMS: { id: NavId; label: string; Icon: LucideIcon }[] = [
  { id: 'overview',     label: 'Overview',     Icon: TrendingUp },
  { id: 'performance',  label: 'Performance',  Icon: BarChart2 },
  { id: 'regime',       label: 'Regime',        Icon: Activity },
  { id: 'positions',    label: 'Positions',     Icon: Layers },
  { id: 'orderflow',    label: 'Order Flow',    Icon: ArrowRightLeft },
  { id: 'trends',       label: 'Trends',        Icon: Map },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        margin: '0 0 1.25rem',
        fontSize: '1.05rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        color: 'var(--text)',
      }}
    >
      {children}
    </h2>
  );
}

export default function Layout3() {
  const [active, setActive] = useState<NavId>('overview');

  return (
    <div className="l3-root">
      {/* preview bar */}
      <div className="preview-bar">
        <Link href="/preview" className="preview-back">← Layouts</Link>
        <span className="preview-label">OPTION 03 — SIDEBAR NAVIGATOR</span>
      </div>

      <div className="l3-body">
        {/* ── sidebar ── */}
        <aside className="l3-sidebar">
          <div className="l3-sidebar-brand">
            <Zap size={14} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <span className="l3-sidebar-brand-text">10K → 500K</span>
          </div>
          <nav className="l3-nav">
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`l3-nav-btn${active === id ? ' active' : ''}`}
                onClick={() => setActive(id)}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── main content ── */}
        <main className="l3-main">
          {active === 'overview' && (
            <>
              <SectionTitle>Overview</SectionTitle>
              <EquityCurve />
            </>
          )}
          {active === 'performance' && (
            <>
              <SectionTitle>Performance Metrics</SectionTitle>
              <PerformanceMetrics />
            </>
          )}
          {active === 'regime' && (
            <>
              <SectionTitle>Regime Monitor</SectionTitle>
              <RegimeMonitor />
            </>
          )}
          {active === 'positions' && (
            <>
              <SectionTitle>Live Positions</SectionTitle>
              <LivePositions />
            </>
          )}
          {active === 'orderflow' && (
            <>
              <SectionTitle>Order Flow</SectionTitle>
              <OrderFlowPanel />
            </>
          )}
          {active === 'trends' && (
            <>
              <SectionTitle>Fintech Trends</SectionTitle>
              <FintechTrendsPanel />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
