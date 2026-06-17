import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { AnalyticsChart } from '../../components/dashboard/AnalyticsChart';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { Card } from '../../components/ui/Card';
import { 
  BarChart3, 
  Users, 
  Eye, 
  Clock, 
  Globe2, 
  Laptop, 
  FolderGit2,
  Calendar
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [days, setDays] = useState(30);
  const { 
    overview, 
    isLoadingOverview, 
    views, 
    isLoadingViews, 
    countries, 
    isLoadingCountries, 
    devices, 
    isLoadingDevices, 
    topProjects, 
    isLoadingTopProjects 
  } = useAnalytics(days);

  // Formatting average time spent (e.g. from seconds to mm:ss)
  const formatTimeSpent = (seconds: number) => {
    if (!seconds) return '0s';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const totalViews = overview?.totalViews || 0;
  const uniqueVisitors = overview?.uniqueVisitors || 0;
  const averageTimeSpent = overview?.averageTimeSpent || 0;

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Page Title & Filter controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" />
            <span>Visitor Analytics & Insights</span>
          </h1>
          <p className="text-xs text-gray-500">
            Real-time tracking of portfolio visits, session durations, device splits, and project click logs.
          </p>
        </div>

        {/* Time range select filter */}
        <div className="flex items-center gap-2 bg-surface border border-border/60 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <Calendar size={13} className="text-gray-400" />
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value={7} className="bg-[#0A0A0A]">Past 7 Days</option>
            <option value={14} className="bg-[#0A0A0A]">Past 14 Days</option>
            <option value={30} className="bg-[#0A0A0A]">Past 30 Days</option>
            <option value={90} className="bg-[#0A0A0A]">Past 90 Days</option>
          </select>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Page Views" 
          value={isLoadingOverview ? '...' : totalViews} 
          icon={Eye} 
          iconColorClass="text-primary"
          description="Total visits across all active layouts"
        />
        <StatsCard 
          title="Unique Visitors" 
          value={isLoadingOverview ? '...' : uniqueVisitors} 
          icon={Users} 
          iconColorClass="text-secondary"
          description="Count of distinct IP addresses logged"
        />
        <StatsCard 
          title="Avg Session Duration" 
          value={isLoadingOverview ? '...' : formatTimeSpent(averageTimeSpent)} 
          icon={Clock} 
          iconColorClass="text-emerald-400"
          description="Average seconds spent per browser visit"
        />
      </div>

      {/* Primary time series chart */}
      <div className="w-full">
        {isLoadingViews ? (
          <div className="h-64 border border-border/40 rounded-xl bg-[#111827]/10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AnalyticsChart data={views} />
        )}
      </div>

      {/* Breakdowns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country Demographics */}
        <Card className="bg-[#111827]/20 border-border/40 p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-2">
            <Globe2 size={14} className="text-primary" />
            <span>Country Demographics</span>
          </h3>

          {isLoadingCountries ? (
            <div className="py-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : countries.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 font-semibold">
              No geographical data captured yet.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {countries.map((c: any, index: number) => {
                const maxVal = countries[0]?.count || 1;
                const percentage = Math.round((c.count / maxVal) * 100);
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white">{c.country || 'Unknown'}</span>
                      <span className="text-gray-400">{c.count} views</span>
                    </div>
                    {/* Visual Progress Bar representation */}
                    <div className="w-full bg-dark h-2 rounded overflow-hidden border border-border/20">
                      <div 
                        className="bg-primary h-full rounded transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Device Splits */}
        <Card className="bg-[#111827]/20 border-border/40 p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-2">
            <Laptop size={14} className="text-secondary" />
            <span>Device Categories</span>
          </h3>

          {isLoadingDevices ? (
            <div className="py-8 flex justify-center">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : devices.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 font-semibold">
              No device categories registered.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {devices.map((d: any, index: number) => {
                const maxVal = devices[0]?.count || 1;
                const percentage = Math.round((d.count / maxVal) * 100);
                return (
                  <div key={index} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-white capitalize">{d.device || 'Desktop'}</span>
                      <span className="text-gray-400">{d.count} sessions</span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-dark h-2 rounded overflow-hidden border border-border/20">
                      <div 
                        className="bg-secondary h-full rounded transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Top Clicked Projects logs */}
      <Card className="bg-[#111827]/20 border-border/40 p-6 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-border/20 pb-2">
          <FolderGit2 size={14} className="text-emerald-400" />
          <span>Interactive Project Click Counts</span>
        </h3>

        {isLoadingTopProjects ? (
          <div className="py-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : topProjects.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500 font-semibold">
            No clicks tracked on live demo or repository links yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/40 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Project Name</th>
                  <th className="py-2.5 px-3 text-right">Click Actions Tracked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-gray-300">
                {topProjects.map((proj: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface/10">
                    <td className="py-3 px-3 font-semibold text-white">{proj.name}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">{proj.clicks || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AnalyticsPage;
