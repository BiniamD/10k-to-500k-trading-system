'use client';

import Header from '@/components/Header';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      <Header />
      <main className="dashboard-shell" aria-label="Trading dashboard">
        <div className="dashboard-grid">
          <EquityCurve />
          <RegimeMonitor />
          <PerformanceMetrics />
          <OrderFlowPanel />
          <LivePositions />
          <FintechTrendsPanel />
        </div>
      </main>
    </div>
  );
}
