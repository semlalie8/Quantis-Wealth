import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

export function NavItem({ icon, label, active = false, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
        active
          ? 'bg-primary/10 text-primary'
          : 'text-secondary-foreground hover:text-foreground hover:bg-white/5'
      )}
    >
      <span className={cn(active ? 'text-primary' : 'group-hover:text-primary transition-colors')}>
        {icon}
      </span>
      <span className="font-medium text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto text-[10px] bg-danger/20 text-danger px-1.5 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}
