import React from 'react';
import { cn } from '../../utils/utils.js';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', children, isLoading, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";
  
  const variants = {
    primary: "bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20",
    secondary: "bg-surface-container-high hover:bg-surface-container-lowest text-white border border-border",
    ghost: "hover:bg-white/5 text-on-surface-variant hover:text-white",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20",
  };

  const sizes = {
    default: "h-10 py-2 px-4 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <span className="material-symbols-outlined animate-spin mr-2 text-[18px]">progress_activity</span>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export { Button };
