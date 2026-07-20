import React from 'react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="px-6 py-20 flex flex-col items-center text-center max-w-[1280px] mx-auto relative w-full">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/15 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="max-w-4xl space-y-6 mb-16">
        <h1 className="text-4xl md:text-[48px] lg:text-[56px] font-headline font-bold text-white leading-tight tracking-tight">
          Keep Your Projects Alive. <br />
          <span className="text-primary">Never Let Recruiters See a Dead Portfolio Again.</span>
        </h1>
        <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
          DevAlive continuously monitors your free-tier deployments, performs health checks, and sends instant alerts before recruiters even notice a cold start or sleep cycle.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center pt-4">
          <Link to="/register" className="bg-primary text-background px-8 py-3.5 rounded-lg font-headline font-semibold hover:scale-95 transition-transform shadow-lg shadow-primary/20">
            Start Monitoring Free
          </Link>
          <Link to="/docs" className="border border-outline-variant text-on-surface px-8 py-3.5 rounded-lg font-headline font-medium hover:bg-surface-container-high transition-all">
            View Documentation
          </Link>
        </div>
      </div>

      {/* Dashboard Preview Mockup */}
      <div className="w-full max-w-5xl bg-card p-2 rounded-2xl overflow-hidden border border-outline-variant shadow-[0_0_50px_rgba(192,193,255,0.05)] relative mx-auto text-left">
        <div className="flex h-[400px] md:h-[500px]">
          {/* Mockup Sidebar */}
          <div className="hidden md:flex w-48 border-r border-outline-variant p-4 flex-col gap-8">
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]">folder</span>
              </div>
              <span className="font-medium text-sm text-white">Workspace</span>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-full bg-surface-container-high rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-surface-container-high rounded animate-pulse opacity-50"></div>
              <div className="h-4 w-5/6 bg-surface-container-high rounded animate-pulse opacity-50"></div>
            </div>
          </div>
          {/* Mockup Content */}
          <div className="flex-1 bg-surface-container-lowest p-6 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-headline font-semibold text-white">Projects Dashboard</h3>
              <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-mono rounded border border-emerald-500/20">SYSTEM NORMAL</div>
            </div>
            {/* Stat Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <span className="text-xs font-mono text-on-surface-variant block mb-1">Active Monitors</span>
                <span className="text-2xl font-headline font-bold text-primary">12 / 12</span>
              </div>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <span className="text-xs font-mono text-on-surface-variant block mb-1">Average Uptime</span>
                <span className="text-2xl font-headline font-bold text-emerald-400">99.98%</span>
              </div>
              <div className="p-4 bg-surface-container-low border border-outline-variant rounded-xl">
                <span className="text-xs font-mono text-on-surface-variant block mb-1">Alerts (24h)</span>
                <span className="text-2xl font-headline font-bold text-red-400">0</span>
              </div>
            </div>
            {/* Project List Mock */}
            <div className="bg-background border border-outline-variant rounded-xl overflow-hidden flex-1">
              <div className="p-4 border-b border-outline-variant grid grid-cols-3 sm:grid-cols-4 text-xs font-mono text-on-surface-variant bg-surface-container-low">
                <span className="col-span-2 sm:col-span-1">Project Name</span>
                <span className="hidden sm:block">Region</span>
                <span>Status</span>
                <span>Latency</span>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 items-center border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <span className="font-medium text-sm text-white col-span-2 sm:col-span-1">E-commerce API</span>
                <span className="text-xs text-on-surface-variant hidden sm:block">us-east-1</span>
                <div><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">Online</span></div>
                <span className="text-xs font-mono text-emerald-400">42ms</span>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 items-center border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <span className="font-medium text-sm text-white col-span-2 sm:col-span-1">Portfolio-v3</span>
                <span className="text-xs text-on-surface-variant hidden sm:block">eu-west-2</span>
                <div><span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/20">Online</span></div>
                <span className="text-xs font-mono text-emerald-400">118ms</span>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 items-center hover:bg-surface-container-low transition-colors">
                <span className="font-medium text-sm text-white col-span-2 sm:col-span-1">Bot-Service-1</span>
                <span className="text-xs text-on-surface-variant hidden sm:block">us-west-1</span>
                <div><span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] rounded border border-red-500/20">Sleeping</span></div>
                <span className="text-xs font-mono text-outline">---</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
