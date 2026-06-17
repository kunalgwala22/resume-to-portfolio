import * as React from 'react';
import { cn } from '../../lib/cn';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabOption[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex border-b border-border/60 overflow-x-auto scrollbar-none", className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap -mb-[2px]",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-gray-400 hover:text-white hover:border-gray-700"
            )}
          >
            {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
