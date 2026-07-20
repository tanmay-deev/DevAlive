import React from 'react';
import { cn } from '../../utils/utils.js';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-6 shadow-inner border border-outline-variant/50">
        <span className="material-symbols-outlined text-[32px] text-primary/70">{icon}</span>
      </div>
      <h3 className="text-xl font-headline font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant mb-8 max-w-sm leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
}
