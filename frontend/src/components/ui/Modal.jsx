import React from 'react';
import { cn } from '../../utils/utils.js';

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={cn("relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col", className)}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-container-low">
          <h2 className="text-lg font-headline font-bold text-white">{title}</h2>
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
