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
              <span className="material-symbols-outlined text-white text-[20px]">monitor_heart</span>
            </div>
            <span className="text-xl font-headline font-bold tracking-tight text-white">DevAlive</span>
          </Link>
          <div className="flex items-center gap-4">
             <Link to="/login" className="text-sm font-medium text-on-surface hover:text-white transition-colors">Sign In</Link>
             <Link to="/register" className="bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg shadow-accent/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Left Side: Branding Panel */}
      <aside className="hidden lg:flex flex-col flex-1 bg-surface-container-lowest p-8 xl:p-16 relative overflow-hidden justify-center items-center">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]"></div>
        
        <div className="z-10 w-full max-w-xl">
          <h1 className="text-4xl xl:text-5xl leading-tight font-headline font-bold text-white mb-6 tracking-tight">
            Keep Your Projects Alive.
          </h1>
          <p className="text-lg text-on-surface-variant mb-12 leading-relaxed">
            Monitor your deployed applications with automated health checks, uptime monitoring, analytics, and instant alerts. Stop recruiters from seeing cold-starts.
          </p>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface border border-outline-variant/50 p-6 rounded-2xl shadow-lg hover:border-primary/50 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-primary text-[20px]">speed</span>
              </div>
              <h3 className="text-white font-semibold mb-2">1-Min Intervals</h3>
              <p className="text-sm text-on-surface-variant">Prevent cold starts effectively by keeping instances warm.</p>
            </div>
            <div className="bg-surface border border-outline-variant/50 p-6 rounded-2xl shadow-lg hover:border-accent/50 transition-colors">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-accent text-[20px]">notifications_active</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Instant Alerts</h3>
              <p className="text-sm text-on-surface-variant">Get notified on Discord or Email the second your site drops.</p>
            </div>
            <div className="bg-surface border border-outline-variant/50 p-6 rounded-2xl shadow-lg hover:border-emerald-500/50 transition-colors">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">monitoring</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Global Latency</h3>
              <p className="text-sm text-on-surface-variant">Track response times globally with precise TTFB charts.</p>
            </div>
            <div className="bg-surface border border-outline-variant/50 p-6 rounded-2xl shadow-lg hover:border-purple-500/50 transition-colors">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-purple-400 text-[20px]">public</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Public Status</h3>
              <p className="text-sm text-on-surface-variant">Show off your reliability to recruiters and clients.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Side: Authentication Card */}
      <main className="w-full lg:w-[480px] xl:w-[560px] shrink-0 flex flex-col items-center justify-center p-6 bg-background relative min-h-[calc(100vh-64px)] border-l border-outline-variant/30">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#6366F1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        <div className="w-full max-w-[440px] z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
              <span className="material-symbols-outlined text-white">monitor_heart</span>
            </div>
            <span className="text-2xl font-headline font-bold text-white">DevAlive</span>
          </div>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
}
