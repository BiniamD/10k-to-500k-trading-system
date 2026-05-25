'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function RegimeMonitor() {
  const [regime, setRegime] = useState({ state: 'CALM', confidence: 87, vpin: 0.42, imbalance: 12 });

  useEffect(() => {
    const interval = setInterval(() => {
      const states = ['CALM', 'BUSY', 'VOLATILE'];
      const newState = states[Math.floor(Math.random() * states.length)];
      setRegime({
        state: newState,
        confidence: Math.floor(Math.random() * 25) + 75,
        vpin: Math.random() * 0.6 + 0.3,
        imbalance: Math.floor(Math.random() * 45) - 15,
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const color = regime.state === 'CALM' ? 'emerald' : regime.state === 'BUSY' ? 'amber' : 'rose';

  return (
    <div className="glass rounded-3xl p-8 h-full">
      <h2 className="text-xl font-semibold mb-6">Market Regime</h2>
      <motion.div className={`inline-flex items-center px-6 py-3 rounded-2xl text-2xl font-bold mb-8 bg-${color}-500/10 text-${color}-400 border border-${color}-500/30`}>
        {regime.state}
      </motion.div>
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Confidence</span>
            <span>{regime.confidence}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full bg-${color}-400 rounded-full`} style={{ width: `${regime.confidence}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-zinc-400">VPIN Toxicity</div>
            <div className="text-2xl font-mono mt-1">{regime.vpin.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-sm text-zinc-400">Volume Imbalance</div>
            <div className={`text-2xl font-mono mt-1 ${regime.imbalance > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {regime.imbalance > 0 ? '+' : ''}{regime.imbalance}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}