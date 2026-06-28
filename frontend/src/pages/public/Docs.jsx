import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils.js';

export function Docs() {
  const [activeSection, setActiveSection] = useState('introduction');

  // Intersection Observer for scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -80% 0px' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  // Smooth scroll helper
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Sections definition
  const sidebarSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      items: [
        { id: 'introduction', label: 'Introduction' },
        { id: 'quick-start', label: 'Quick Start' },
      ]
    },
    {
      id: 'core-features',
      title: 'Core Features',
      items: [
        { id: 'projects', label: 'Projects & Endpoints' },
        { id: 'monitoring', label: 'Monitoring Intervals' },
        { id: 'alerts', label: 'Alerts & Notifications' },
        { id: 'analytics', label: 'Analytics & Logs' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex max-w-[1280px] mx-auto">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 hidden md:block border-r border-outline-variant/50 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto py-8 pr-6">
        <nav className="space-y-8">
          {sidebarSections.map(section => (
            <div key={section.id}>
              <h4 className="font-semibold text-white mb-3 px-3 text-xs uppercase tracking-wider">{section.title}</h4>
              <ul className="space-y-1">
                {section.items.map(item => (
                  <li key={item.id}>
                    <button
                      onClick={() => scrollTo(item.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                        activeSection === item.id 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-on-surface-variant hover:text-white hover:bg-surface-container-high"
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-6 md:px-12 lg:px-16 max-w-4xl pb-32">
        <div className="space-y-24">
          
          {/* Introduction */}
          <section id="introduction" className="scroll-mt-24">
            <h1 className="text-4xl font-headline font-bold text-white mb-6">Introduction to DevAlive</h1>
            <p className="text-lg text-on-surface-variant leading-relaxed mb-6">
              DevAlive is a powerful, developer-focused monitoring tool designed to solve a very specific problem: <strong>keeping your free-tier deployments awake</strong>.
            </p>
            <div className="bg-surface-container-low border border-primary/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row gap-4 shadow-lg shadow-primary/5">
              <span className="material-symbols-outlined text-primary shrink-0 text-3xl">lightbulb</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-white block mb-1 text-base">The Problem</strong>
                When you deploy portfolio projects on platforms like Render, Heroku, or Supabase free tiers, they spin down (go to sleep) after a period of inactivity. When a recruiter or user finally clicks your link, it takes 30-60 seconds for the server to wake up, leading to a terrible first impression.
              </p>
            </div>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              By continuously pinging your endpoints, DevAlive ensures your database connections remain active, your server instances stay warm, and your portfolio looks incredibly fast to anyone who visits it.
            </p>
          </section>

          {/* Quick Start */}
          <section id="quick-start" className="scroll-mt-24">
            <h2 className="text-3xl font-headline font-bold text-white mb-6 border-b border-outline-variant pb-4">Quick Start</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Getting started with DevAlive takes less than two minutes. Follow these simple steps:
            </p>
            <ol className="space-y-8">
              {[
                { title: 'Create an Account', desc: 'Sign up for a free account. No credit card is required.' },
                { title: 'Add a Project', desc: 'Navigate to your Dashboard and click "New Project". Enter the URL of the website or API you want to keep awake.' },
                { title: 'Configure the Interval', desc: 'Select how often DevAlive should ping your project. We recommend 1 Minute for cold-start prevention.' },
                { title: 'Start Monitoring', desc: 'Click Save! DevAlive instantly begins monitoring your endpoint.' }
              ].map((step, i) => (
                <li key={i} className="flex gap-5">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-white shrink-0 shadow-sm shadow-black/50">
                    {i + 1}
                  </div>
                  <div className="pt-1">
                    <h4 className="font-semibold text-white mb-1">{step.title}</h4>
                    <p className="text-sm text-on-surface-variant leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-background font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                Create Free Account
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="scroll-mt-24">
            <h2 className="text-3xl font-headline font-bold text-white mb-6 border-b border-outline-variant pb-4">Projects & Endpoints</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              A <strong>Project</strong> in DevAlive represents a single endpoint or website you want to monitor. You can configure multiple projects within your single developer account.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-surface border border-outline-variant rounded-xl p-6 hover:border-primary/50 transition-colors">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-primary">public</span>
                  </div>
                  Frontend Websites
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Simply provide the root URL (e.g., <code className="bg-surface-container-high px-1 py-0.5 rounded text-primary">https://my-portfolio.com</code>). DevAlive will perform a GET request to ensure it returns a successful 200 OK HTML response.</p>
              </div>
              <div className="bg-surface border border-outline-variant rounded-xl p-6 hover:border-accent/50 transition-colors">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px] text-accent">api</span>
                  </div>
                  Backend APIs
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Provide a specific health check endpoint (e.g., <code className="bg-surface-container-high px-1 py-0.5 rounded text-accent">/health</code>). DevAlive verifies that your server is running and database is connected.</p>
              </div>
            </div>
          </section>

          {/* Monitoring */}
          <section id="monitoring" className="scroll-mt-24">
            <h2 className="text-3xl font-headline font-bold text-white mb-6 border-b border-outline-variant pb-4">Monitoring Intervals</h2>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              You can configure how frequently DevAlive pings your project. This is crucial depending on the platform you are deploying on.
            </p>
            
            <div className="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant mb-6 shadow-sm">
              <table className="w-full text-sm text-left text-on-surface-variant">
                <thead className="bg-surface-container-high text-white border-b border-outline-variant">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Interval</th>
                    <th className="px-6 py-4 font-semibold">Best Used For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/50">
                  <tr className="bg-surface hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-white">1 Minute</td>
                    <td className="px-6 py-4 leading-relaxed">Preventing extreme cold starts (Render, Heroku, Supabase Free Tier).</td>
                  </tr>
                  <tr className="bg-surface hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-white">5-30 Minutes</td>
                    <td className="px-6 py-4 leading-relaxed">Standard uptime monitoring and SLA tracking.</td>
                  </tr>
                  <tr className="bg-surface hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-white">1-24 Hours</td>
                    <td className="px-6 py-4 leading-relaxed">Daily health checks for static sites or low-priority services.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-error/10 border border-error/20 rounded-xl p-6 flex gap-4 mt-8">
              <span className="material-symbols-outlined text-error shrink-0">warning</span>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                <strong className="text-white block mb-1">Warning on Bandwidth</strong>
                Very aggressive ping intervals (like 1 Minute) might consume your free-tier bandwidth or compute hours on certain cloud providers. Make sure to monitor your cloud provider usage accordingly.
              </p>
            </div>
          </section>

          {/* Alerts */}
          <section id="alerts" className="scroll-mt-24">
            <h2 className="text-3xl font-headline font-bold text-white mb-6 border-b border-outline-variant pb-4">Alerts & Notifications</h2>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              DevAlive instantly detects when your project goes down. A failure is registered if your project returns a <code className="text-error bg-error/10 px-1 py-0.5 rounded">500</code> status code, or times out after 10 seconds.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              You will receive an in-app notification in your dashboard, and you can also configure external alerts to ping you where you work.
            </p>
            
            <h4 className="font-semibold text-white mb-4">Available Channels</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="bg-surface border border-outline-variant rounded-xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default shadow-sm">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">mail</span>
                </div>
                <div>
                  <h5 className="font-medium text-white text-sm mb-1">Email Alerts</h5>
                  <p className="text-xs text-on-surface-variant">Instant emails on failure.</p>
                </div>
              </li>
              <li className="bg-surface border border-outline-variant rounded-xl p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-default shadow-sm">
                <div className="w-10 h-10 rounded-full bg-[#5865F2]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#5865F2]">forum</span>
                </div>
                <div>
                  <h5 className="font-medium text-white text-sm mb-1">Discord Webhooks</h5>
                  <p className="text-xs text-on-surface-variant">Post to a specific channel.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Analytics */}
          <section id="analytics" className="scroll-mt-24">
            <h2 className="text-3xl font-headline font-bold text-white mb-6 border-b border-outline-variant pb-4">Analytics & Logs</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">
              Transparency is key. The Analytics and Logs pages give you total insight into your infrastructure performance.
            </p>
            
            <div className="space-y-6">
              <div className="border border-outline-variant/50 rounded-xl p-6 bg-surface-container-lowest">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">query_stats</span>
                  Uptime Analytics
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  We track your uptime percentage over 1-day and 7-day rolling windows. This is calculated dynamically based on successful vs failed HTTP checks.
                </p>
              </div>
              <div className="border border-outline-variant/50 rounded-xl p-6 bg-surface-container-lowest">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-accent text-[18px]">speed</span>
                  Latency Tracking
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Every ping measures the Time-to-First-Byte (TTFB) in milliseconds. Watch your latency charts to identify performance degradations before your users do.
                </p>
              </div>
              <div className="border border-outline-variant/50 rounded-xl p-6 bg-surface-container-lowest">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-white text-[18px]">receipt_long</span>
                  Raw Logs
                </h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  The Logs page provides an unfiltered chronological view of every single HTTP request DevAlive makes to your servers, including the exact timestamp, status code, and latency.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
