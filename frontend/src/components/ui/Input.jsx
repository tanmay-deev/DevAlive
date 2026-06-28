import React from 'react';
import { cn } from '../../utils/utils.js';

const Input = React.forwardRef(({ className, icon, label, error, ...props }, ref) => {
  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-label-sm font-mono uppercase tracking-wider text-on-surface-variant block">
          {label}
        </label>
      )}
      <div className="relative group">
        <input
          ref={ref}
          className={cn(
            "w-full bg-background border rounded-lg px-4 py-3 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 outline-none",
            error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-border",
            icon ? "pr-10" : "",
            className
          )}
          {...props}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-outline/40 flex items-center">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export { Input };
