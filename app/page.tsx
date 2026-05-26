'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, Sparkles, FileText, CircleCheck, Clock3, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isLogMode, setIsLogMode] = useState(false);
  const trustScore = 92;
  const policyCards = [
    { id: 'Auto Protect', status: 'Active', renewal: 'Renews in 18 days', coverage: '$150k liability' },
    { id: 'Home Shield', status: 'Review Needed', renewal: '2 open document requests', coverage: '$420k structure' },
    { id: 'Health Plus', status: 'Active', renewal: 'Next premium Jun 2', coverage: '$8k deductible' },
  ];
  const serviceStatuses = [
    { label: 'Claim #C-9301', state: 'In Review', tone: 'text-cyan-300', icon: Clock3 },
    { label: 'Roadside Response', state: 'Ready', tone: 'text-emerald-300', icon: CircleCheck },
    { label: 'Coverage Gap Alert', state: 'Action Needed', tone: 'text-fuchsia-300', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        <header className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Trust-first insurance</p>
            <h1 className="text-3xl md:text-4xl font-semibold mt-2">Coverage, claims, and clarity in one place</h1>
            <p className="text-slate-300/90 mt-3 max-w-2xl">
              Recovery-first principles adapted to fast, transparent insurance actions and guided decision support.
            </p>
          </div>
          <div className="self-start md:self-center">
            <div
              className="h-28 w-28 rounded-full p-[4px]"
              style={{ background: `conic-gradient(#22d3ee ${trustScore * 3.6}deg, rgba(56,189,248,0.22) 0deg)` }}
            >
              <div className="h-full w-full rounded-full bg-[#070d1f] flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold text-cyan-200">{trustScore}</span>
                <span className="text-[11px] text-slate-400">Trust Score</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <section className="xl:col-span-7 glass rounded-3xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Policy cards</h2>
              <span className="text-xs text-cyan-300 bg-cyan-400/10 border border-cyan-300/30 rounded-full px-3 py-1">
                3 synced
              </span>
            </div>
            <div className="space-y-4">
              {policyCards.map((policy) => (
                <motion.article
                  key={policy.id}
                  whileHover={{ y: -2 }}
                  className="panel-muted rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-lg font-medium">{policy.id}</p>
                    <p className="text-sm text-slate-400">{policy.coverage}</p>
                  </div>
                  <div className="text-sm text-slate-300">
                    <span
                      className={`inline-block rounded-full px-3 py-1 mr-2 border ${
                        policy.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-300/40'
                          : 'bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-300/40'
                      }`}
                    >
                      {policy.status}
                    </span>
                    {policy.renewal}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section className="xl:col-span-5 glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-5">Claim & coverage actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button className="panel-muted rounded-2xl p-4 text-left hover:bg-white/10 transition-all">
                <FileText className="w-5 h-5 text-cyan-300 mb-2" />
                <p className="font-medium">Submit claim</p>
                <p className="text-xs text-slate-400 mt-1">Under 3 minutes</p>
              </button>
              <button className="panel-muted rounded-2xl p-4 text-left hover:bg-white/10 transition-all">
                <ShieldCheck className="w-5 h-5 text-violet-300 mb-2" />
                <p className="font-medium">Coverage summary</p>
                <p className="text-xs text-slate-400 mt-1">View limits instantly</p>
              </button>
            </div>

            <div className="mt-6 panel-muted rounded-2xl p-4">
              <p className="text-sm text-slate-400 mb-3">Morphing quick-log interaction</p>
              <motion.button
                onClick={() => setIsLogMode((v) => !v)}
                animate={{
                  width: isLogMode ? 220 : 76,
                  borderRadius: isLogMode ? 18 : 999,
                  backgroundColor: isLogMode ? 'rgba(34,211,238,0.2)' : 'rgba(168,85,247,0.2)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="h-12 border border-cyan-300/40 text-cyan-100 font-medium"
              >
                {isLogMode ? 'Attach photos & details' : 'Log'}
              </motion.button>
            </div>
          </section>

          <section className="xl:col-span-7 glass rounded-3xl p-6">
            <h2 className="text-xl font-semibold mb-4">Status indicators</h2>
            <div className="space-y-3">
              {serviceStatuses.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="panel-muted rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${item.tone}`} />
                      <span>{item.label}</span>
                    </div>
                    <span className={`text-sm font-medium ${item.tone}`}>{item.state}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="xl:col-span-5 glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">AI Coach</h2>
              <button
                onClick={() => setIsCoachOpen((v) => !v)}
                className="text-xs px-3 py-1 rounded-full border border-cyan-300/40 bg-cyan-500/10 text-cyan-200"
              >
                {isCoachOpen ? 'Hide detail' : 'Show detail'}
              </button>
            </div>
            <div className="mt-4 panel-muted rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-fuchsia-300 mt-0.5" />
                <p className="text-slate-100">“Based on your open claim, I can prefill 80% of your submission now.”</p>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {isCoachOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 8, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <div className="panel-muted rounded-xl p-3 text-sm">1) Confirm incident date and location</div>
                    <div className="panel-muted rounded-xl p-3 text-sm">2) Upload one document to unlock faster review</div>
                    <div className="panel-muted rounded-xl p-3 text-sm">3) Review transparent payout estimate before submit</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}