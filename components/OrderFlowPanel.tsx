'use client';
import { useState, useEffect } from 'react';

export default function OrderFlowPanel() {
  const [buyVol, setBuyVol] = useState(12400);
  const [sellVol, setSellVol] = useState(9800);

  useEffect(() => {
    const interval = setInterval(() => {
      setBuyVol(Math.floor(11800 + Math.random() * 1800));
      setSellVol(Math.floor(9200 + Math.random() * 1400));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const total = buyVol + sellVol;
  const buyPercent = Math.round((buyVol / total) * 100);

  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-xl font-semibold mb-6">Order Flow</h2>
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-emerald-400">Buy Volume</span>
            <span className="font-mono">{buyVol.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-emerald-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${buyPercent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-3">
            <span className="text-rose-400">Sell Volume</span>
            <span className="font-mono">{sellVol.toLocaleString()}</span>
          </div>
          <div className="h-3 bg-rose-500/20 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${100 - buyPercent}%` }} />
          </div>
        </div>
        <div className="pt-4 border-t border-white/10">
          <div className="text-center">
            <span className="text-4xl font-mono font-bold text-emerald-400">{buyPercent}%</span>
            <p className="text-sm text-zinc-400 mt-1">Buy Pressure</p>
          </div>
        </div>
      </div>
    </div>
  );
}