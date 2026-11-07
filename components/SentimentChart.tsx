'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentDistribution {
  positif: number;
  netral: number;
  negatif: number;
}

interface SentimentChartProps {
  distribution: SentimentDistribution;
}

const COLORS = {
  positif: '#10b981', // Emerald 500
  netral: '#64748b',  // Slate 500
  negatif: '#ef4444', // Red 500
};

export function SentimentChart({ distribution }: SentimentChartProps) {
  const data = [
    { name: 'Positif', value: distribution.positif || 0, color: COLORS.positif },
    { name: 'Netral', value: distribution.netral || 0, color: COLORS.netral },
    { name: 'Negatif', value: distribution.negatif || 0, color: COLORS.negatif },
  ];

  return (
    <div className="p-6 rounded-2xl border bg-card/60 border-border/80 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Distribusi Sentimen Publik
        </h3>
        <span className="text-xs text-muted-foreground font-mono">100% Total</span>
      </div>

      <div className="h-44 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0];
                  return (
                    <div className="bg-popover border border-border px-3 py-1.5 rounded-lg shadow-md text-xs">
                      <span className="font-semibold text-popover-foreground">
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/60">
        <div className="flex flex-col items-center p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center">
          <div className="flex items-center gap-1 text-emerald-500 mb-1">
            <Smile className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Positif</span>
          </div>
          <span className="text-lg font-bold text-emerald-500">{distribution.positif}%</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-lg bg-slate-500/5 border border-slate-500/20 text-center">
          <div className="flex items-center gap-1 text-slate-400 mb-1">
            <Meh className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Netral</span>
          </div>
          <span className="text-lg font-bold text-slate-300">{distribution.netral}%</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
          <div className="flex items-center gap-1 text-red-500 mb-1">
            <Frown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Negatif</span>
          </div>
          <span className="text-lg font-bold text-red-500">{distribution.negatif}%</span>
        </div>
      </div>
    </div>
  );
}
