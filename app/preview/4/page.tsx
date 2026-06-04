import Link from 'next/link';
import EquityCurve from '@/components/EquityCurve';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';
import Header from '@/components/Header';

const CARDS = [
  { component: <EquityCurve />,          accent: 'l4-accent-cyan',   label: 'Equity Curve'        },
  { component: <RegimeMonitor />,         accent: 'l4-accent-amber',  label: 'Regime Monitor'      },
  { component: <PerformanceMetrics />,    accent: 'l4-accent-green',  label: 'Performance Metrics' },
  { component: <OrderFlowPanel />,        accent: 'l4-accent-blue',   label: 'Order Flow'          },
  { component: <LivePositions />,         accent: 'l4-accent-purple', label: 'Live Positions'      },
  { component: <FintechTrendsPanel />,    accent: 'l4-accent-red',    label: 'Fintech Trends'      },
];

export default function Layout4() {
  return (
    <div className="l4-root">
      {/* preview bar */}
      <div className="preview-bar">
        <Link href="/preview" className="preview-back">← Layouts</Link>
        <span className="preview-label">OPTION 04 — CARD DECK FEED</span>
      </div>

      <Header />

      <div className="l4-feed">
        {CARDS.map(({ component, accent, label }) => (
          <div key={label} className={`l4-card ${accent}`}>
            {component}
          </div>
        ))}
      </div>
    </div>
  );
}
