import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-br from-white/[0.05] to-white/[0.01] border border-white/10 backdrop-blur-md rounded-2xl p-6 transition-all duration-300',
        hover && 'hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-primary/5',
        className
      )}
    >
      {children}
    </div>
  );
}
