import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      {/* Hero Section */}
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
      <section className="w-full px-6 py-24 bg-surface-container-low overflow-hidden">
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

      {/* Features Grid */}
      <section className="w-full px-6 py-24 max-w-[1280px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-12 text-center md:text-left">Production-Grade Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: 'monitor_heart', title: 'Health Checks', desc: 'Deep inspection of HTTP status codes and response headers.' },
            { icon: 'timer', title: 'Uptime Tracking', desc: 'Precision tracking with historical data for up to 90 days.' },
            { icon: 'bar_chart', title: 'Analytics', desc: 'Visual reports on your project\'s reliability over time.' },
            { icon: 'notifications_active', title: 'Notifications', desc: 'Connect via Webhooks, Slack, Discord, or Email.' },
            { icon: 'article', title: 'Global Logs', desc: 'Detailed logs of every ping and response failure.' },
            { icon: 'dashboard', title: 'Dashboard', desc: 'Unified view for all your microservices and sites.' },
            { icon: 'bolt', title: 'Response Time', desc: 'Measure and optimize latencies across global regions.' },
            { icon: 'hub', title: 'Status Pages', desc: 'Public pages to show off your project\'s 100% uptime.' }
          ].map(feature => (
            <div key={feature.title} className="bg-card border border-outline-variant p-6 rounded-xl hover:bg-surface-container-high hover:border-outline transition-all group">
              <span className="material-symbols-outlined text-primary mb-4 text-3xl group-hover:scale-110 transition-transform">{feature.icon}</span>
              <h5 className="font-headline font-semibold text-white text-lg mb-2">{feature.title}</h5>
              <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

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
