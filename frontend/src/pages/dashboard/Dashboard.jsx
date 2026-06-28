import React, { useEffect, useState } from 'react';
import useProjectStore from '../../store/projectStore.js';
import analyticsService from '../../services/analyticsService.js';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { projects, fetchProjects, isLoading: isProjectsLoading } = useProjectStore();
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

  useEffect(() => {
    fetchProjects();
    analyticsService.getDashboardSummary().then(data => {
      setSummary(data.data.summary);
      setIsLoadingSummary(false);
    }).catch(err => {
      console.error("Failed to load summary", err);
      setIsLoadingSummary(false);
    });
  }, [fetchProjects]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-1">Dashboard Overview</h2>
          <p className="text-on-surface-variant text-sm">Monitoring all system instances across your infrastructure.</p>
        </div>
        <Link to="/projects/new" className="px-4 py-2.5 bg-primary text-background font-semibold text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Deployment
        </Link>
      </header>

      {/* Bento Grid / Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1: Active Monitors */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-lg text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">dns</span>
            </div>
            <span className="text-secondary text-xs font-medium flex items-center gap-1 bg-secondary/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              +12.5%
            </span>
          </div>
          <div className="text-sm text-on-surface-variant font-medium mb-1">Active Monitors</div>
          <div className="text-3xl font-headline font-bold text-white">
            {isLoadingSummary ? (
               <div className="h-8 w-24 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
               `${summary?.activeProjects || 0} / ${summary?.totalProjects || 0}`
            )}
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
             {isLoadingSummary ? (
                <div className="h-full bg-surface-container-highest w-full animate-pulse"></div>
             ) : (
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(summary?.activeProjects / summary?.totalProjects) * 100 || 0}%`}}></div>
             )}
          </div>
        </div>

        {/* Stat Card 2: Average Uptime */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-lg text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
            <span className="text-on-surface-variant text-xs font-medium">Last 7 Days</span>
          </div>
          <div className="text-sm text-on-surface-variant font-medium mb-1">Average Uptime</div>
          <div className="text-3xl font-headline font-bold text-emerald-400">
             {isLoadingSummary ? (
               <div className="h-8 w-24 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
               `${summary?.averageUptime || 0}%`
            )}
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
             {isLoadingSummary ? (
                 <div className="h-full bg-surface-container-highest w-full animate-pulse"></div>
             ) : (
                <div className="h-full bg-secondary rounded-full transition-all duration-1000" style={{ width: `${summary?.averageUptime || 0}%`}}></div>
             )}
          </div>
        </div>

        {/* Stat Card 3: Total Alerts */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-lg text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <span className="text-error text-xs font-medium flex items-center gap-1 bg-error/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-[14px]">error</span>
              0 Alerts
            </span>
          </div>
          <div className="text-sm text-on-surface-variant font-medium mb-1">Total Alerts (24h)</div>
          <div className="text-3xl font-headline font-bold text-white">
             {isLoadingSummary ? (
               <div className="h-8 w-16 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
               '0'
            )}
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
             {isLoadingSummary ? (
                 <div className="h-full bg-surface-container-highest w-full animate-pulse"></div>
             ) : (
                <div className="h-full bg-surface-container-highest rounded-full w-full"></div>
             )}
          </div>
        </div>
      </div>

      {/* Main Visualization Card (Mocked Chart from HTML) */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low gap-4">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            Request Throughput (ms)
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-highest p-0.5 rounded-lg border border-outline-variant">
              <button className="px-3 py-1 bg-surface-container-low text-on-surface rounded-md text-xs font-medium shadow-sm">1h</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors">24h</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors">7d</button>
            </div>
          </div>
        </div>
        <div className="p-8 h-[300px] flex items-end gap-1.5">
          {/* Skeleton Bars simulating live data */}
          {[45, 60, 85, 70, 50, 30, 55, 90, 65, 40, 55, 75, 45, 80, 60, 95].map((height, i) => (
             <div 
               key={i} 
               className={`flex-1 rounded-t-sm transition-all duration-[3000ms] ${i === 15 ? 'bg-primary shadow-[0_0_15px_rgba(192,193,255,0.4)]' : 'bg-surface-container-highest hover:bg-surface-container-high'}`} 
               style={{ height: `${height}%` }}
             ></div>
          ))}
        </div>
      </section>

      {/* Recent Logs Table */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden mb-12 shadow-sm">
        <div className="p-6 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">list_alt</span>
            Recent Projects Monitored
          </h3>
          <Link to="/projects" className="text-sm font-medium text-primary hover:underline">View All</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Project Name</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Endpoint URL</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
               {isProjectsLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-[28px]">progress_activity</span>
                    <div className="mt-2 text-sm">Loading projects...</div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">folder_off</span>
                      <p className="text-sm">No projects found. <Link to="/projects/new" className="text-primary hover:underline font-medium">Add your first project</Link> to start monitoring.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.slice(0, 5).map(project => (
                  <tr key={project._id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{project.projectName}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant truncate max-w-[200px]">{project.endpointUrl}</td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">
                      {project.averageResponseTime ? `${project.averageResponseTime}ms` : '---'}
                    </td>
                    <td className="px-6 py-4">
                      {project.currentStatus === 'online' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">Operational</span>
                      ) : project.currentStatus === 'offline' ? (
                         <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20">Offline</span>
                      ) : (
                         <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20">{project.currentStatus}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
