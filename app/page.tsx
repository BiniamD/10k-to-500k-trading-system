'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import RegimeMonitor from '@/components/RegimeMonitor';
import PerformanceMetrics from '@/components/PerformanceMetrics';
import OrderFlowPanel from '@/components/OrderFlowPanel';
import LivePositions from '@/components/LivePositions';
import EquityCurve from '@/components/EquityCurve';

export default function Dashboard() {
  const [portfolioValue, setPortfolioValue] = useState(12487.34);

  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioValue(prev => prev + (Math.random() - 0.48) * 12);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header portfolioValue={portfolioValue} />
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8"><EquityCurve /></div>
          <div className="lg:col-span-4"><RegimeMonitor /></div>
          <div className="lg:col-span-12"><PerformanceMetrics /></div>
          <div className="lg:col-span-7"><OrderFlowPanel /></div>
          <div className="lg:col-span-5"><LivePositions /></div>
        </div>
      </div>
    </div>
  );
}