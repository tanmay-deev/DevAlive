import React from 'react';
import { cn } from '../../utils/utils.js';

const Card = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("bg-card border border-border rounded-xl", className)}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

export { Card };
