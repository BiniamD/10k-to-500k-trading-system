'use client';

import Header from '@/components/Header';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import EquityCurve from '@/components/EquityCurve';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';

export default function Dashboard() {
  return (
    <div className="dashboard-root">
      <Header />
      <main className="dashboard-shell" aria-label="Trading dashboard">
        <section className="dashboard-grid" aria-label="Trading dashboard modules">
          <EquityCurve />
          <RegimeMonitor />
          <PerformanceMetrics />
          <OrderFlowPanel />
          <LivePositions />
          <FintechTrendsPanel />
        </section>
      </main>
    </div>
  );
}
