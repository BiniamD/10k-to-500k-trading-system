'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import EquityCurve from '@/components/EquityCurve';
import FintechTrendsPanel from '@/components/FintechTrendsPanel';

export default function Dashboard() {
  const [portfolioValue, setPortfolioValue] = useState(12487.34);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.48) * 12);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Header portfolioValue={portfolioValue} />
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