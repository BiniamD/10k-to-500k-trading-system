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

type SectionId = 'performance' | 'regime' | 'orderflow' | 'positions' | 'trends';

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: 'performance', label: 'Performance Metrics' },
  { id: 'regime', label: 'Regime Monitor' },
  { id: 'orderflow', label: 'Order Flow' },
  { id: 'positions', label: 'Live Positions' },
  { id: 'trends', label: 'Fintech Trends' },
];

export default function Layout2() {
  const [open, setOpen] = useState<Set<SectionId>>(new Set<SectionId>(['performance']));

  const toggle = (id: SectionId) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="l2-root">
      {/* preview bar */}
      <div className="preview-bar">
        <Link href="/preview" className="preview-back">← Layouts</Link>
        <span className="preview-label">OPTION 02 — HERO FOCUS</span>
      </div>

      <Header />

      {/* hero: equity curve */}
      <section className="l2-hero">
        <div className="l2-hero-inner">
          <EquityCurve />
        </div>
      </section>

      {/* accordion sections */}
      <div className="l2-accordion">
        {SECTIONS.map(({ id, label }) => {
          const isOpen = open.has(id);
          return (
            <div className="l2-accordion-item" key={id}>
              <button
                className="l2-accordion-trigger"
                onClick={() => toggle(id)}
                aria-expanded={isOpen}
              >
                {label}
                <span className="l2-accordion-chevron">{isOpen ? '▲' : '▼'}</span>
              </button>
              {isOpen && (
                <div className="l2-accordion-content">
                  {id === 'performance' && <PerformanceMetrics />}
                  {id === 'regime'      && <RegimeMonitor />}
                  {id === 'orderflow'   && <OrderFlowPanel />}
                  {id === 'positions'   && <LivePositions />}
                  {id === 'trends'      && <FintechTrendsPanel />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
