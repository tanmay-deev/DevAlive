import React from 'react';

export function FeatureGrid() {
  return (
    <section id="features" className="w-full px-6 py-24 max-w-[1280px] mx-auto">
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
  );
}
