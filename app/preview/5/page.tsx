'use client';

import { useState } from 'react';
import Link from 'next/link';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';
import Header from '@/components/Header';

type TabId = 'performance' | 'positions' | 'trends';

const TABS: { id: TabId; label: string }[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'positions',   label: 'Positions'   },
  { id: 'trends',      label: 'Trends'      },
];

export default function Layout5() {
  const [tab, setTab] = useState<TabId>('performance');

  return (
    <div className="l5-root">
      {/* preview bar */}
      <div className="preview-bar">
        <Link href="/preview" className="preview-back">← Layouts</Link>
        <span className="preview-label">OPTION 05 — WORKSTATION</span>
      </div>

      <Header />

      <div className="l5-body">
        {/* ── left 30% ── */}
        <aside className="l5-left">
          <RegimeMonitor />
          <OrderFlowPanel />
        </aside>

        {/* ── right 70% ── */}
        <div className="l5-right">
          {/* equity curve fills the top */}
          <div className="l5-equity">
            <EquityCurve />
          </div>

          {/* tab bar */}
          <div className="l5-tabbar">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                className={`l5-tab-btn${tab === id ? ' active' : ''}`}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* active tab content */}
          <div className="l5-panel">
            {tab === 'performance' && <PerformanceMetrics />}
            {tab === 'positions'   && <LivePositions />}
            {tab === 'trends'      && <FintechTrendsPanel />}
          </div>
        </div>
      </div>
    </div>
  );
}
