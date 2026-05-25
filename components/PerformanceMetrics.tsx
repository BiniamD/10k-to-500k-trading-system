'use client';

const metrics = [
  { label: "Win Rate", value: "68.4%", change: "+4.2%" },
  { label: "Sharpe Ratio", value: "2.41", change: "+0.18" },
  { label: "Max Drawdown", value: "6.8%", change: "-1.1%" },
  { label: "Profit Factor", value: "2.87", change: "+0.31" },
  { label: "Avg Trade", value: "$184", change: "+$27" },
  { label: "Total Trades", value: "142", change: "+19" },
];

export default function PerformanceMetrics() {
  return (
    <div className="glass rounded-3xl p-8">
      <h2 className="text-xl font-semibold mb-8">Performance Metrics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white/5 rounded-2xl p-6 hover:bg-white/10 transition-all">
            <div className="text-zinc-400 text-sm mb-2">{metric.label}</div>
            <div className="text-3xl font-mono font-semibold mb-1">{metric.value}</div>
            <div className="text-emerald-400 text-sm">{metric.change} this month</div>
          </div>
        ))}
      </div>
    </div>
  );
}