import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { cn } from '../utils/utils';

export function MarketingLayout() {
  const { isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans selection:bg-accent/30 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-accent/20">
              <span className="material-symbols-outlined text-white text-[20px]">monitor_heart</span>
            </div>
            <span className="text-xl font-headline font-bold tracking-tight">DevAlive</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/#features" className="text-on-surface-variant hover:text-white transition-colors">Features</a>
            <a href="/#how-it-works" className="text-on-surface-variant hover:text-white transition-colors">How it Works</a>
            <a href="/#pricing" className="text-on-surface-variant hover:text-white transition-colors">Pricing</a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-5 py-2.5 text-sm font-semibold bg-surface-container-high hover:bg-surface border border-border rounded-lg transition-colors">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-on-surface-variant hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-semibold bg-accent hover:bg-accent/90 text-white rounded-lg transition-all shadow-lg shadow-accent/20 active:scale-95">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="material-symbols-outlined text-[28px]">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-6 py-4 flex flex-col gap-4 shadow-2xl absolute w-full">
            <a href="/#features" className="text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="/#how-it-works" className="text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
            <a href="/#pricing" className="text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <hr className="border-border my-2" />
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Go to Dashboard</Link>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to="/login" className="text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
                <Link to="/register" className="text-accent font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Sign up for free</Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
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
    </div>
  );
}
