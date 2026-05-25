"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  CandlestickChart,
  ChevronRight,
  Gauge,
  Layers3,
  Radar,
  ShieldCheck,
  TrendingUp,
  Wallet,
  Waves,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, type ReactNode } from "react";
import {
  useTradingDashboard,
  type LivePosition,
  type MetricCard,
  type RegimeState,
} from "@/components/dashboard/use-trading-dashboard";

const sidebarItems = [
  { label: "Overview", icon: Layers3 },
  { label: "Equity", icon: TrendingUp },
  { label: "Regime", icon: Radar },
  { label: "Order Flow", icon: Waves },
  { label: "Positions", icon: Wallet },
  { label: "Risk", icon: ShieldCheck },
];

const regimeTone: Record<RegimeState, string> = {
  CALM: "text-bullish border-bullish/30 bg-bullish/10",
  BUSY: "text-neutral border-neutral/30 bg-neutral/10",
  VOLATILE: "text-bearish border-bearish/30 bg-bearish/10",
};

const metricTone = (delta: number, positiveIsGood = true) => {
  const positive = positiveIsGood ? delta >= 0 : delta < 0;
  return positive ? "text-bullish" : "text-bearish";
};

const currency = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);

const number = (value: number) => new Intl.NumberFormat("en-US").format(Math.round(value));

const percent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-bullish/20 bg-bullish/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-bullish">
      <span className="h-2.5 w-2.5 rounded-full bg-bullish animate-pulseGlow" />
      Live
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`glass-panel ${className}`}>{children}</section>;
}

function MetricCardView({ metric }: { metric: MetricCard }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="glass-panel p-5"
    >
      <p className="panel-heading">{metric.label}</p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-white">{metric.value}</p>
        <p className={`text-sm font-medium ${metricTone(metric.delta, metric.positiveIsGood)}`}>
          {metric.delta >= 0 ? "+" : ""}
          {metric.delta.toFixed(1)}% MoM
        </p>
      </div>
    </motion.div>
  );
}

function PositionRow({ position }: { position: LivePosition }) {
  return (
    <motion.tr layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-white/6 text-sm text-slate-200">
      <td className="py-4 pr-4 font-medium text-white">{position.symbol}</td>
      <td className="py-4 pr-4">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${position.side === "Long" ? "bg-bullish/15 text-bullish" : "bg-bearish/15 text-bearish"}`}>
          {position.side}
        </span>
      </td>
      <td className="py-4 pr-4 font-mono text-slate-300">{currency(position.entryPrice, 2)}</td>
      <td className="py-4 pr-4 font-mono text-slate-300">{currency(position.currentPrice, 2)}</td>
      <td className={`py-4 pr-4 font-mono ${position.pnl >= 0 ? "text-bullish" : "text-bearish"}`}>{currency(position.pnl, 2)}</td>
      <td className="py-4 font-mono text-slate-300">{currency(position.exposure, 0)}</td>
    </motion.tr>
  );
}

export function DashboardShell() {
  const { state, orderFlowBars } = useTradingDashboard();

  const exposureMix = useMemo(() => {
    const gross = state.positions.reduce((total, position) => total + position.exposure, 0) || 1;
    return state.positions.map((position) => ({
      label: position.symbol,
      percent: (position.exposure / gross) * 100,
    }));
  }, [state.positions]);

  return (
    <main className="min-h-screen px-4 py-4 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4 lg:flex-row">
        <aside className="glass-panel w-full shrink-0 overflow-hidden p-5 lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-72">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/90 via-sky-400/80 to-blue-600/80 text-slate-950 shadow-lg shadow-cyan-500/30">
              <CandlestickChart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">10k → 500k</p>
              <h1 className="mt-1 text-xl font-semibold text-white">Trading Terminal</h1>
            </div>
          </div>

          <div className="mt-8 rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-cyan-500/10 via-slate-900/20 to-fuchsia-500/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-heading">Strategy</p>
                <p className="mt-2 text-lg font-semibold text-white">KO / PEP Statistical Arb</p>
              </div>
              <LiveBadge />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signal Engine</p>
                <p className="mt-2 font-semibold text-white">Grok AI + VPIN</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Capital Target</p>
                <p className="mt-2 font-semibold text-white">$500,000</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {sidebarItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${label === "Overview" ? "border-cyan-400/25 bg-cyan-400/10 text-white" : "border-white/5 bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.06]"}`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </button>
            ))}
          </nav>

          <div className="mt-8 grid gap-3 rounded-3xl border border-white/8 bg-slate-950/40 p-4 text-sm text-slate-300">
            <div className="flex items-center justify-between">
              <span>Execution latency</span>
              <span className="font-mono text-white">14 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Market data</span>
              <span className="font-mono text-bullish">Synced</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Risk envelope</span>
              <span className="font-mono text-white">1.9% / trade</span>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="glass-panel p-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="panel-heading">AI-powered pairs trading system</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
                  <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{currency(state.portfolioValue, 0)}</h2>
                    <p className="mt-2 text-sm text-slate-400">Current portfolio value · refreshed every 3 seconds</p>
                  </div>
                  <div className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${state.sessionChange >= 0 ? "border-bullish/20 bg-bullish/10 text-bullish" : "border-bearish/20 bg-bearish/10 text-bearish"}`}>
                    {state.sessionChange >= 0 ? "+" : ""}
                    {currency(state.sessionChange, 0)} · {percent(state.sessionChangePct)} session
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="panel-heading">Status</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white">
                    <Activity className="h-4 w-4 text-bullish" />
                    All systems nominal
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="panel-heading">Model Inference</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white">
                    <BrainCircuit className="h-4 w-4 text-cyan-300" />
                    Grok AI calibrated
                  </div>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3">
                  <p className="panel-heading">Last Tick</p>
                  <div className="mt-3 flex items-center gap-2 text-sm text-white">
                    <Gauge className="h-4 w-4 text-violet-300" />
                    {state.updatedAt}
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
            <Panel className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="panel-heading">Live equity curve</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Trajectory toward the 50x mandate</h3>
                </div>
                <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                  Intraday alpha engine engaged
                </div>
              </div>
              <div className="mt-6 h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={state.equityCurve} margin={{ left: 0, right: 0, top: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.38} />
                        <stop offset="55%" stopColor="#60a5fa" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} minTickGap={20} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(value) => `$${Number(value / 1000).toFixed(1)}k`} domain={["dataMin - 40", "dataMax + 40"]} />
                    <Tooltip
                      cursor={{ stroke: "rgba(56, 189, 248, 0.26)", strokeWidth: 1 }}
                      contentStyle={{
                        background: "rgba(8, 15, 35, 0.92)",
                        borderRadius: 18,
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        color: "#f8fafc",
                      }}
                      formatter={(value) => [currency(Number(value), 2), "Portfolio"]}
                      labelFormatter={(label) => `Updated ${label}`}
                    />
                    <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fill="url(#equityFill)" isAnimationActive animationDuration={900} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="panel-heading">Regime monitor</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{state.regime.state}</h3>
                </div>
                <div className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${regimeTone[state.regime.state]}`}>
                  {state.regime.state}
                </div>
              </div>

              <motion.div layout className="mt-6 space-y-4">
                <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                  <div className="flex items-center justify-between text-sm text-slate-400">
                    <span>Confidence</span>
                    <span className="font-mono text-white">{state.regime.confidence.toFixed(0)}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <motion.div
                      className={`h-2 rounded-full ${state.regime.state === "CALM" ? "bg-bullish" : state.regime.state === "BUSY" ? "bg-neutral" : "bg-bearish"}`}
                      animate={{ width: `${state.regime.confidence}%` }}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">VPIN Toxicity</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{state.regime.vpin.toFixed(2)}</p>
                    <p className="mt-2 text-sm text-slate-400">Volume-synchronized toxicity estimate</p>
                  </div>
                  <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Volume Imbalance</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{state.regime.imbalance.toFixed(1)}%</p>
                    <p className="mt-2 text-sm text-slate-400">Directional pressure in the tape</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-cyan-400/12 bg-cyan-400/5 p-4 text-sm text-slate-300">
                  <div className="flex items-center gap-2 text-cyan-100">
                    <Radar className="h-4 w-4" />
                    Adaptive execution profile synced with the current market regime.
                  </div>
                </div>
              </motion.div>
            </Panel>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {state.metrics.map((metric) => (
              <MetricCardView key={metric.label} metric={metric} />
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.45fr)]">
            <Panel className="p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="panel-heading">Order flow panel</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Real-time tape balance</h3>
                </div>
                <div className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${state.orderFlow.imbalance >= 0 ? "border-bullish/20 bg-bullish/10 text-bullish" : "border-bearish/20 bg-bearish/10 text-bearish"}`}>
                  {percent(state.orderFlow.imbalance)} imbalance
                </div>
              </div>

              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderFlowBars} layout="vertical" margin={{ top: 0, right: 15, left: 15, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(148,163,184,0.08)" horizontal={false} />
                    <XAxis type="number" tickFormatter={(value) => `${Number(value / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <YAxis type="category" dataKey="side" tickLine={false} axisLine={false} tick={{ fill: "#e2e8f0", fontSize: 13 }} width={90} />
                    <Tooltip
                      cursor={{ fill: "rgba(148, 163, 184, 0.06)" }}
                      contentStyle={{
                        background: "rgba(8, 15, 35, 0.92)",
                        borderRadius: 18,
                        border: "1px solid rgba(148, 163, 184, 0.18)",
                        color: "#f8fafc",
                      }}
                      formatter={(value) => [number(Number(value)), "Shares"]}
                    />
                    <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={28} isAnimationActive animationDuration={900}>
                      {orderFlowBars.map((entry) => (
                        <Cell key={entry.side} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Buy volume</p>
                  <p className="mt-2 text-xl font-semibold text-bullish">{number(state.orderFlow.buyVolume)}</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Sell volume</p>
                  <p className="mt-2 text-xl font-semibold text-bearish">{number(state.orderFlow.sellVolume)}</p>
                </div>
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="panel-heading">Live positions</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">Hedged KO-PEP book</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {exposureMix.map((mix) => (
                    <div key={mix.label} className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-2 text-sm text-slate-300">
                      <span className="font-medium text-white">{mix.label}</span>
                      <span className="ml-2 text-slate-400">{mix.percent.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-0">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.22em] text-slate-500">
                      <th className="pb-3 pr-4 font-medium">Ticker</th>
                      <th className="pb-3 pr-4 font-medium">Side</th>
                      <th className="pb-3 pr-4 font-medium">Entry</th>
                      <th className="pb-3 pr-4 font-medium">Current</th>
                      <th className="pb-3 pr-4 font-medium">Unrealized P&amp;L</th>
                      <th className="pb-3 font-medium">Exposure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.positions.map((position) => (
                      <PositionRow key={position.symbol} position={position} />
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Total exposure</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{currency(state.totalExposure, 0)}</p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Net unrealized</p>
                  <p className={`mt-2 text-2xl font-semibold ${state.positions.reduce((total, position) => total + position.pnl, 0) >= 0 ? "text-bullish" : "text-bearish"}`}>
                    {currency(state.positions.reduce((total, position) => total + position.pnl, 0), 2)}
                  </p>
                </div>
                <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pair beta</p>
                  <p className="mt-2 text-2xl font-semibold text-white">0.97</p>
                </div>
              </div>
            </Panel>
          </section>

          <footer className="glass-panel p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="panel-heading">Connectivity</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/15 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
                    <BarChart3 className="h-4 w-4" /> Polygon.io connected
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/15 bg-violet-400/10 px-4 py-2 text-sm text-violet-100">
                    <BrainCircuit className="h-4 w-4" /> Grok AI inference online
                  </div>
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Last synchronization <span className="font-medium text-white">{state.updatedAt}</span> · dashboard cadence <span className="font-medium text-white">3s</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
