import React, { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService.js';
import useProjectStore from '../../store/projectStore.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/utils.js';

export function Analytics() {
  const { projects, fetchProjects } = useProjectStore();
  const [chartData, setChartData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');
  const [timeRange, setTimeRange] = useState(7);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const projectId = selectedProject === 'all' && projects.length > 0 ? projects[0]._id : selectedProject;
        
        if (!projectId || projectId === 'all') {
          setChartData([]);
          setIsLoading(false);
          return;
        }

        const data = await analyticsService.getUptimeChartData(projectId, timeRange);
        const insightsData = await analyticsService.getProjectAnalytics(projectId);
        
        // Backend returns: data.data.chartData = [{ timestamp, responseTime, status }, ...]
        
        const chartDataArray = data.data.chartData;
        if (!Array.isArray(chartDataArray) || chartDataArray.length === 0) {
          setChartData([]);
          setInsights(insightsData.data);
          setIsLoading(false);
          return;
        }

        const formattedData = chartDataArray.map(log => ({
          name: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          'Response Time': log.responseTime || 0,
        }));
        
        setChartData(formattedData);
        setInsights(insightsData.data);
      } catch (err) {
        console.error("Failed to load chart data", err);
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [selectedProject, timeRange, projects]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-high/80 backdrop-blur-md border border-outline-variant p-4 rounded-xl shadow-2xl">
          <p className="text-on-surface-variant font-label-sm mb-3 text-xs">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-6 justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span className="font-headline font-bold" style={{ color: entry.color }}>
                {entry.value}ms
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header & Controls */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-headline font-bold text-3xl text-white tracking-tight mb-1">Performance Analytics</h2>
          <p className="text-on-surface-variant text-sm">Visualize your project's historical uptime and latencies.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Project Selector */}
          <div className="relative flex-1 md:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">folder</span>
            <select 
              className="w-full bg-surface-container-low border border-outline-variant text-white text-sm font-medium rounded-lg pl-10 pr-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none appearance-none cursor-pointer hover:bg-surface-container-high shadow-sm"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="all" disabled>Select a Project...</option>
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.projectName}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
          </div>
        </div>
      </header>

      {/* Top Row: Summary Insights (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Uptime KPI */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            {!isLoading && insights && (
               <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">{timeRange === 1 ? '24h' : `${timeRange}d`} Avg</span>
            )}
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Average Uptime</h4>
            <div className="text-3xl font-headline font-bold text-white">
               {isLoading ? (
                  <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse mt-1"></div>
               ) : (
                  `${insights?.uptimePercentage || 0}%`
               )}
            </div>
          </div>
        </div>

        {/* Latency KPI */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
             {!isLoading && insights && (
               <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">Global</span>
            )}
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Average Latency</h4>
            <div className="text-3xl font-headline font-bold text-white">
              {isLoading ? (
                  <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse mt-1"></div>
               ) : (
                  `${Math.round(insights?.averageResponseTime) || 0}ms`
               )}
            </div>
          </div>
        </div>

        {/* Checks KPI */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-secondary/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-secondary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">fact_check</span>
            </div>
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Total Pings</h4>
            <div className="text-3xl font-headline font-bold text-white flex items-baseline gap-2">
               {isLoading ? (
                  <div className="h-8 w-24 bg-surface-container-high rounded animate-pulse mt-1"></div>
               ) : (
                  <>
                    {insights?.totalChecks || 0}
                    {insights?.failedChecks > 0 && (
                      <span className="text-sm font-medium text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        {insights.failedChecks} Failed
                      </span>
                    )}
                  </>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Section */}
      <section className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low gap-4">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-primary text-[20px]">timeline</span>
            Response Time
          </h3>
          <div className="flex items-center gap-3">
             <div className="relative">
               <select 
                 className="appearance-none bg-surface-container-high text-on-surface border border-outline-variant rounded-lg text-xs font-medium px-3 py-1.5 pr-8 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all cursor-pointer"
                 value={timeRange}
                 onChange={(e) => setTimeRange(Number(e.target.value))}
               >
                 <option value={1}>Last 24 Hours</option>
                 <option value={7}>Last 7 Days</option>
                 <option value={30}>Last 30 Days</option>
               </select>
               <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
             </div>
          </div>
        </div>

        <div className="p-8 h-[450px] w-full bg-surface relative">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
               <span className="material-symbols-outlined animate-spin text-[40px] text-primary mb-4">progress_activity</span>
               <p className="text-sm">Aggregating historical data...</p>
            </div>
          ) : chartData.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
               <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">analytics</span>
               <p className="text-sm">No data available. Select a project to view analytics.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="name" 
                  stroke="#908fa0" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="#908fa0" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}ms`} 
                  dx={-15}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#464554', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="Response Time" 
                  stroke="#818cf8" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLatency)"
                  activeDot={{ r: 6, fill: "#818cf8", stroke: '#131316', strokeWidth: 3 }}
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
