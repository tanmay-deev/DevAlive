import React from 'react';
import { cn } from '../../utils/utils.js';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-container-high', className)}
      {...props}
    />
  );
}
