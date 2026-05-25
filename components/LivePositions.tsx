'use client';

const positions = [
  { symbol: "KO", side: "LONG", qty: 420, entry: 62.45, current: 63.87, pnl: 598.40, percent: 2.28 },
  { symbol: "PEP", side: "SHORT", qty: 310, entry: 167.82, current: 166.34, pnl: 458.60, percent: 1.48 },
];

export default function LivePositions() {
  return (
    <div className="glass rounded-3xl p-8 h-full">
      <h2 className="text-xl font-semibold mb-6">Live Positions</h2>
      <div className="space-y-6">
        {positions.map((pos, i) => (
          <div key={i} className="flex justify-between items-center bg-white/5 rounded-2xl p-6">
            <div>
              <div className="font-mono text-xl">{pos.symbol}</div>
              <div className={`text-sm ${pos.side === 'LONG' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pos.side} • {pos.qty} shares
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono">${pos.current}</div>
              <div className="text-emerald-400 text-sm">
                +${pos.pnl.toFixed(2)} ({pos.percent}%)
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}