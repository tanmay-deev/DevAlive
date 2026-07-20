import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto py-12 text-center text-on-surface-variant text-sm">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
           <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
           <span className="font-headline font-bold tracking-widest uppercase">DevAlive</span>
        </div>
        <p>© {new Date().getFullYear()} DevAlive. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-white transition-colors">Terms</Link>
          <Link to="#" className="hover:text-white transition-colors">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
