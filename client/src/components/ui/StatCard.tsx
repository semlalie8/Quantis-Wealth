import React from 'react';
import { cn } from '../../lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  up?: boolean;
  badge?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatCard({ label, value, change, up, badge, icon, className }: StatCardProps) {
  return (
    <div className={cn(
      'bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-xl',
      className
    )}>
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-secondary-foreground">{label}</p>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
        {badge && (
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {change && (
        <div className={cn(
          'flex items-center gap-1 text-xs font-semibold mt-3',
          up ? 'text-success' : 'text-danger'
        )}>
          {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
          <span className="text-secondary-foreground font-normal ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
}
