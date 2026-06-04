import Link from 'next/link';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';
import Header from '@/components/Header';

export default function Layout1() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* preview bar */}
      <div className="preview-bar">
        <Link href="/preview" className="preview-back">← Layouts</Link>
        <span className="preview-label">OPTION 01 — COMMAND CENTER</span>
      </div>

      {/* exact same structure as main dashboard */}
      <Header />
      <main className="dashboard-shell">
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
