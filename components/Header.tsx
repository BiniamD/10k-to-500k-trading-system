'use client';
import { TrendingUp, Activity } from 'lucide-react';

export default function Header({ portfolioValue }: { portfolioValue: number }) {
  return (
    <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">10k → 500k</h1>
            <p className="text-xs text-zinc-500">AI-Powered Pairs Trading System</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className="text-3xl font-mono font-semibold">${portfolioValue.toLocaleString()}</div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm">
              <TrendingUp className="w-4 h-4" /> +$286.12 (2.34%)
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-2xl text-sm font-medium">
            <Activity className="w-4 h-4" /> LIVE
          </div>
        </div>
      </div>
    </header>
  );
}