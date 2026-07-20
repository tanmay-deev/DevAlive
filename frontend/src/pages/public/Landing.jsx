import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from '../../components/marketing/HeroSection.jsx';
import { FeatureGrid } from '../../components/marketing/FeatureGrid.jsx';

export function Landing() {
  // Add scroll observer effect for fade-in elements
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="flex flex-col items-center overflow-x-hidden font-sans pb-12">
      <HeroSection />

      {/* Trusted By Section */}
      <section className="w-full border-y border-outline-variant py-8 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-60 grayscale">
          <span className="text-sm font-mono tracking-widest uppercase">Trusted By:</span>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined">school</span><span className="text-sm font-medium">Student Developers</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined">work</span><span className="text-sm font-medium">Freelancers</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined">engineering</span><span className="text-sm font-medium">Software Engineers</span></div>
          <div className="flex items-center gap-2"><span className="material-symbols-outlined">person</span><span className="text-sm font-medium">Portfolio Builders</span></div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="w-full px-6 py-24 max-w-[1280px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-2">The Free-Tier Problem</h2>
          <p className="text-on-surface-variant text-lg">Infrastructure costs shouldn't kill your portfolio's first impression.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card border border-outline-variant p-8 rounded-2xl hover:border-primary/50 transition-colors group">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 block group-hover:scale-110 transition-transform">bedtime</span>
            <h3 className="text-xl font-headline font-semibold text-white mb-3">Render Sleeping</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Free instance types spin down after 15 minutes of inactivity, causing 30s+ wait times for visiting recruiters.</p>
          </div>
          <div className="bg-card border border-outline-variant p-8 rounded-2xl hover:border-primary/50 transition-colors group">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 block group-hover:scale-110 transition-transform">ac_unit</span>
            <h3 className="text-xl font-headline font-semibold text-white mb-3">Railway Cold Starts</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Trial credits and usage caps can unexpectedly pause your deployments when you're not looking.</p>
          </div>
          <div className="bg-card border border-outline-variant p-8 rounded-2xl hover:border-primary/50 transition-colors group">
            <span className="material-symbols-outlined text-4xl text-primary mb-4 block group-hover:scale-110 transition-transform">link_off</span>
            <h3 className="text-xl font-headline font-semibold text-white mb-3">Inactive APIs</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">Database connections on free tiers often drop, resulting in 500 errors when someone finally visits your site.</p>
          </div>
        </div>
      </section>

      {/* Solution Section: How It Works */}
      <section id="how-it-works" className="w-full px-6 py-24 bg-surface-container-low overflow-hidden">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-16 text-center">How DevAlive Works</h2>
          <div className="relative w-full max-w-4xl mx-auto">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 w-full h-[2px] bg-outline-variant hidden md:block"></div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 relative z-10">
              {/* Steps */}
              {[
                { n: 1, title: 'Add Project', desc: 'Simple URL input' },
                { n: 2, title: 'Auto Monitor', desc: 'Config-free setup' },
                { n: 3, title: 'Health Check', desc: '24/7 pings' },
                { n: 4, title: 'Detection', desc: 'Instant outage catch' },
                { n: 5, title: 'Alerts', desc: 'Discord / Email' },
                { n: 6, title: 'Analytics', desc: 'Reliability reports' }
              ].map(step => (
                <div key={step.n} className="flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl mb-4 transition-transform group-hover:scale-110 ${step.n === 1 ? 'bg-primary text-background' : 'bg-surface-container-high border-2 border-primary text-primary'}`}>
                    {step.n}
                  </div>
                  <h4 className="font-semibold text-white text-sm mb-1">{step.title}</h4>
                  <p className="text-xs text-on-surface-variant">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeatureGrid />

      {/* Dashboard Showcase */}
      <section className="w-full px-6 py-24 bg-surface-container-lowest">
        <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-[48px] font-headline font-bold text-white leading-tight">Enterprise Visibility for Individual Projects.</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Get the same monitoring fidelity used by big tech, tailored for your portfolio. Track cold starts, identify regional bottlenecks, and ensure your data is always ready when that high-value recruiter clicks your link.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400">check_circle</span><span className="text-white">Multi-region latency monitoring</span></li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400">check_circle</span><span className="text-white">Customizable ping intervals</span></li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-emerald-400">check_circle</span><span className="text-white">Advanced keyword detection in responses</span></li>
            </ul>
          </div>
          <div className="flex-1 relative w-full">
            <div className="bg-surface border border-outline-variant p-4 sm:p-6 rounded-2xl shadow-2xl relative z-10 w-full max-w-lg mx-auto">
              <div className="border-b border-outline-variant pb-4 mb-6 flex justify-between items-center">
                <span className="text-sm font-medium text-white">Detailed Analytics: project-alpha</span>
                <span className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>Live</span>
              </div>
              <div className="space-y-8">
                <div className="flex items-end gap-1 h-32">
                  <div className="w-full bg-primary/20 h-[80%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/40 h-[90%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/60 h-[100%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/40 h-[85%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/80 h-[95%] rounded-t-sm"></div>
                  <div className="w-full bg-primary h-[100%] rounded-t-sm shadow-[0_0_10px_rgba(192,193,255,0.5)]"></div>
                  <div className="w-full bg-red-500 h-[40%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/40 h-[90%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/60 h-[100%] rounded-t-sm"></div>
                  <div className="w-full bg-primary/80 h-[95%] rounded-t-sm"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant">
                    <span className="text-xs text-on-surface-variant block mb-1">P95 Latency</span>
                    <span className="text-2xl font-headline font-bold text-white">142ms</span>
                  </div>
                  <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant">
                    <span className="text-xs text-on-surface-variant block mb-1">Total Requests</span>
                    <span className="text-2xl font-headline font-bold text-white">24.5k</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Decorative blur */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* Why DevAlive */}
      <section className="w-full px-6 py-24 max-w-[1280px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-16">Built by Developers, for Developers.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">code</span>
            </div>
            <h3 className="text-xl font-headline font-semibold text-white">Developer Focused</h3>
            <p className="text-on-surface-variant text-sm px-4">Integrated with your workflow. Simple API access and zero-fluff metrics that actually matter.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </div>
            <h3 className="text-xl font-headline font-semibold text-white">Simple Setup</h3>
            <p className="text-on-surface-variant text-sm px-4">Connect your projects in under 30 seconds. No complicated agents or SDKs required.</p>
          </div>
          <div className="space-y-4">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="text-xl font-headline font-semibold text-white">Reliable Monitoring</h3>
            <p className="text-on-surface-variant text-sm px-4">Multi-layered verification avoids false positives and ensures you only get paged when it's real.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="w-full px-6 py-24 max-w-[1280px] mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-6">Simple, Transparent Pricing</h2>
        <p className="text-on-surface-variant max-w-xl mx-auto mb-16">Start monitoring your projects today with zero hidden costs. No credit card required.</p>
        
        <div className="max-w-md mx-auto">
          <div className="bg-surface-container-low border border-primary/30 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/60 transition-colors shadow-2xl shadow-primary/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 rounded-full transition-transform group-hover:scale-150"></div>
            
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-primary/20 text-primary font-bold text-xs uppercase tracking-wider rounded-full mb-6 border border-primary/20">
                Community Edition
              </span>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-headline font-bold text-white">$0</span>
                <span className="text-on-surface-variant font-medium self-end mb-1">/ forever</span>
              </div>
              <p className="text-sm text-on-surface-variant mb-8">Everything you need to keep your portfolio alive.</p>
              
              <ul className="space-y-4 mb-8 text-left max-w-[240px] mx-auto">
                {[
                  'Up to 5 Projects monitored',
                  '1 Minute check intervals',
                  'Global latency metrics',
                  'Email alerts',
                  '30-day data retention',
                  'Public status pages'
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white">
                    <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link to="/register" className="block w-full py-3.5 bg-primary text-background font-bold rounded-xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20">
                Start Monitoring Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 py-12 pb-24">
        <div className="max-w-[1280px] mx-auto bg-primary text-background rounded-3xl p-12 md:p-20 text-center relative overflow-hidden shadow-[0_0_100px_rgba(192,193,255,0.2)]">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-[48px] font-headline font-bold leading-tight">
              Protect Your Projects Before <br className="hidden sm:block" /> Recruiters Visit Them.
            </h2>
            <p className="text-lg max-w-xl mx-auto opacity-90 font-medium">
              Join 5,000+ developers ensuring their work is always accessible. Start for free, upgrade as you grow.
            </p>
            <Link to="/register" className="inline-block bg-background text-primary px-10 py-4 rounded-xl font-headline font-bold text-lg hover:scale-105 transition-transform shadow-xl">
              Start Monitoring Free
            </Link>
          </div>
          {/* Abstract visual decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 -mr-32 -mt-32 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/20 -ml-24 -mb-24 rounded-full blur-xl pointer-events-none"></div>
        </div>
      </section>
    </div>
  );
}
