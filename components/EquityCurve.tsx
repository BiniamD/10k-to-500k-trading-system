'use client';
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface EquityPoint {
  time: string;
  equity: number;
}

export default function EquityCurve() {
  const [data, setData] = useState<EquityPoint[]>([]);

  useEffect(() => {
    const generateData = () => {
      const newData = Array.from({ length: 60 }, (_, i) => ({
        time: new Date(Date.now() - (60 - i) * 3000).toLocaleTimeString(),
        equity: 10200 + Math.sin(i / 8) * 800 + Math.random() * 300,
      }));
      setData(newData);
    };
    generateData();
    const interval = setInterval(generateData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass rounded-3xl p-8 h-[480px]">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Portfolio Equity</h2>
          <p className="text-emerald-400 text-sm">+2.34% today</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-mono">$12,487.34</div>
          <div className="text-emerald-400">+$286.12</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="time" stroke="#52525b" />
          <YAxis stroke="#52525b" />
          <Tooltip />
          <Area type="natural" dataKey="equity" stroke="#10b981" fill="url(#colorEquity)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}