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
  positif: '#059669', // Emerald 600
  netral: '#64748b',  // Slate 500
  negatif: '#dc2626', // Red 600
};

export function SentimentChart({ distribution }: SentimentChartProps) {
  const data = [
    { name: 'Positif', value: distribution.positif || 0, color: COLORS.positif },
    { name: 'Netral', value: distribution.netral || 0, color: COLORS.netral },
    { name: 'Negatif', value: distribution.negatif || 0, color: COLORS.negatif },
  ];

  return (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Distribusi Sentimen Publik
        </h3>
        <span className="text-xs text-slate-400 font-mono">100% Total</span>
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
                    <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-lg text-xs">
                      <span className="font-bold text-slate-900">
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

      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-col items-center p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
          <div className="flex items-center gap-1 text-emerald-700 mb-1">
            <Smile className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Positif</span>
          </div>
          <span className="text-lg font-extrabold text-emerald-700">{distribution.positif}%</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <div className="flex items-center gap-1 text-slate-600 mb-1">
            <Meh className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Netral</span>
          </div>
          <span className="text-lg font-extrabold text-slate-700">{distribution.netral}%</span>
        </div>

        <div className="flex flex-col items-center p-2 rounded-xl bg-red-50 border border-red-100 text-center">
          <div className="flex items-center gap-1 text-red-700 mb-1">
            <Frown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">Negatif</span>
          </div>
          <span className="text-lg font-extrabold text-red-700">{distribution.negatif}%</span>
        </div>
      </div>
    </div>
  );
}
