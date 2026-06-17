import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Card } from '../ui/Card';

interface AnalyticsChartProps {
  data: { date: string; views: number }[];
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  return (
    <Card className="bg-[#111827]/30 border-border/40 p-6 flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Page Views Overview</h3>
        <p className="text-[10px] text-gray-500 font-semibold">Total portfolio hits compiled over the selected timeframe</p>
      </div>

      <div className="h-64 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
            <XAxis dataKey="date" stroke="#4B5563" tickLine={false} />
            <YAxis stroke="#4B5563" tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111827', borderColor: '#1F2937', color: '#F9FAFB', borderRadius: '8px' }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Area type="monotone" dataKey="views" stroke="#7C3AED" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AnalyticsChart;
