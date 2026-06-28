import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { cn } from '../utils/utils';

export function AuthLayout() {
  return (
    <div className="flex-1 flex min-h-screen pt-16 font-sans">
      {/* Top Navigation Bar (Simplified) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-white text-[20px]">shield_spark</span>
            </div>
            <span className="text-xl font-headline font-bold tracking-tight text-white">DevAlive</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/login" className="text-sm font-medium text-on-surface hover:text-white transition-colors">Sign In</Link>
             <Link to="/register" className="bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-accent/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Left Side: Branding Panel (45%) */}
      <aside className="hidden lg:flex flex-col w-[45%] h-[calc(100vh-64px)] bg-background border-r border-border p-8 xl:p-12 relative overflow-hidden sticky top-16">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]"></div>
        
        <div className="z-10 mt-8">
          <h1 className="text-[42px] leading-tight font-headline font-bold text-white mb-4">
            Keep Your Projects Alive.
          </h1>
          <p className="text-lg text-on-surface-variant max-w-lg mb-8 leading-relaxed">
            Monitor your deployed applications with automated health checks, uptime monitoring, analytics, and instant alerts.
          </p>
          
          {/* Dashboard Preview Mockup */}
          <div className="relative group max-w-xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(99,102,241,0.1)] aspect-[1.5/1] flex shadow-2xl">
              {/* Sidebar */}
              <div className="w-14 border-r border-border flex flex-col items-center py-4 gap-6 bg-surface-container-low">
                <div className="w-8 h-8 rounded bg-accent/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-accent text-sm" style={{fontVariationSettings: "'FILL' 1"}}>dashboard</span>
                </div>
                <div className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-outline text-sm">analytics</span>
                </div>
                <div className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-outline text-sm">notifications</span>
                </div>
                <div className="w-8 h-8 rounded hover:bg-white/5 flex items-center justify-center transition-colors mt-auto">
                  <span className="material-symbols-outlined text-outline text-sm">settings</span>
                </div>
              </div>
              
              {/* Main Content Mock */}
              <div className="flex-1 p-6 flex flex-col gap-4 bg-surface">
                <div className="flex justify-between items-center">
                  <div className="h-4 w-32 bg-border rounded-full animate-pulse"></div>
                  <div className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20">SYSTEM NORMAL</div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-card border border-border rounded-lg">
                    <div className="h-1.5 w-10 bg-border rounded-full mb-2"></div>
                    <div className="h-5 w-12 bg-accent/20 rounded"></div>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-lg">
                    <div className="h-1.5 w-10 bg-border rounded-full mb-2"></div>
                    <div className="h-5 w-12 bg-emerald-400/20 rounded"></div>
                  </div>
                  <div className="p-3 bg-card border border-border rounded-lg">
                    <div className="h-1.5 w-10 bg-border rounded-full mb-2"></div>
                    <div className="h-5 w-12 bg-red-400/20 rounded"></div>
                  </div>
                </div>
                
                {/* Chart Mock */}
                <div className="flex-1 bg-card border border-border rounded-lg p-4 flex flex-col">
                  <div className="flex items-end justify-between h-full gap-2">
                    <div className="w-full bg-accent/10 h-[60%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/20 h-[45%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/30 h-[75%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/15 h-[30%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/40 h-[90%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/25 h-[65%] rounded-t-sm"></div>
                    <div className="w-full bg-accent/10 h-[50%] rounded-t-sm"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature Checklist */}
          <div className="grid grid-cols-2 gap-y-3 mt-8 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="text-sm font-medium text-on-surface">Automated Monitoring</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="text-sm font-medium text-on-surface">Instant Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="text-sm font-medium text-on-surface">Uptime Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-accent text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              <span className="text-sm font-medium text-on-surface">Built for Developers</span>
            </div>
          </div>
        </div>
        
        {/* Trusted By Section */}
        <div className="z-10 mt-auto pb-4">
          <div className="h-px w-full bg-border mb-6"></div>
          <p className="text-xs font-mono text-outline uppercase tracking-[0.1em] mb-4">Trusted by 5,000+ developers worldwide</p>
          <div className="flex items-center gap-6 opacity-40 grayscale brightness-200">
            <div className="h-5 w-20 bg-white/40 rounded"></div>
            <div className="h-5 w-24 bg-white/40 rounded"></div>
            <div className="h-5 w-16 bg-white/40 rounded"></div>
            <div className="h-5 w-20 bg-white/40 rounded"></div>
          </div>
        </div>
      </aside>

      {/* Right Side: Authentication Card */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-background relative min-h-[calc(100vh-64px)]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-full max-w-[440px] z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="material-symbols-outlined text-white">shield_spark</span>
            </div>
            <span className="text-2xl font-headline font-bold text-white">DevAlive</span>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}
