import React from 'react';
import { Card } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  iconColorClass?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, description, iconColorClass = 'text-primary' }) => {
  return (
    <Card className="bg-[#111827]/30 border-border/40 p-5 flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">{title}</span>
        <span className="text-3xl font-extrabold text-white mt-1">{value}</span>
        {description && <span className="text-[10px] text-gray-400 font-semibold">{description}</span>}
      </div>
      <div className={`h-12 w-12 rounded-lg bg-surface border border-border/60 flex items-center justify-center ${iconColorClass}`}>
        <Icon size={22} />
      </div>
    </Card>
  );
};

export default StatsCard;
