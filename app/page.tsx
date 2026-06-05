'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';

type TabId = 'performance' | 'positions' | 'trends';

const TABS: { id: TabId; label: string }[] = [
  { id: 'performance', label: 'Performance' },
  { id: 'positions',   label: 'Positions'   },
  { id: 'trends',      label: 'Trends'      },
];

export default function Dashboard() {
  const [tab, setTab] = useState<TabId>('performance');

  return (
    <div className="l5-root">
      <Header />

      <div className="l5-body">
        {/* ── left 30%: regime + order flow ── */}
        <aside className="l5-left">
          <RegimeMonitor />
          <OrderFlowPanel />
        </aside>

        {/* ── right 70%: equity curve + tabbed panels ── */}
        <div className="l5-right">
          <div className="l5-equity">
            <EquityCurve />
          </div>

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
