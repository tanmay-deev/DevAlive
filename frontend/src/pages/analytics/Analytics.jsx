import React, { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService.js';
import useProjectStore from '../../store/projectStore.js';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
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

  const globalUptimeData = projects.map(p => ({
    name: p.projectName,
    'Uptime': p.uptimePercentage || 0,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-highest/80 backdrop-blur-xl border border-outline-variant p-4 rounded-xl shadow-2xl">
          <p className="text-on-surface-variant font-mono mb-3 text-xs">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-6 justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span className="font-headline font-bold text-white">
                {entry.value}{entry.name === 'Uptime' ? '%' : 'ms'}
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
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline font-bold text-3xl text-white tracking-tight">Performance Analytics</h2>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Systems Active</span>
            </div>
          </div>
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
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-emerald-500/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            {!isLoading && insights && (
               <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 backdrop-blur-sm">{timeRange === 1 ? '24h' : `${timeRange}d`} Avg</span>
            )}
          </div>
          <div className="relative z-10">
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Average Uptime</h4>
            <div className="text-3xl font-headline font-bold text-white">
               {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
               ) : (
                  `${insights?.uptimePercentage || 0}%`
               )}
            </div>
          </div>
        </div>

        {/* Latency KPI */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-primary/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
             {!isLoading && insights && (
               <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20 backdrop-blur-sm">Global</span>
            )}
          </div>
          <div className="relative z-10">
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Average Latency</h4>
            <div className="text-3xl font-headline font-bold text-white">
              {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
               ) : (
                  `${Math.round(insights?.averageResponseTime) || 0}ms`
               )}
            </div>
          </div>
        </div>

        {/* Checks KPI */}
        <div className="bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-secondary/30 transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-secondary/10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-secondary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center border border-secondary/20 shadow-inner">
               <span className="material-symbols-outlined text-[20px]">fact_check</span>
            </div>
          </div>
          <div className="relative z-10">
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Total Pings</h4>
            <div className="text-3xl font-headline font-bold text-white flex items-baseline gap-2">
               {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
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
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="flex items-end gap-2 h-full w-full opacity-20 max-w-4xl mx-auto">
                {Array.from({ length: 20 }).map((_, i) => (
                  <Skeleton key={i} className="w-full rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }} />
                ))}
              </div>
            </div>
          ) : chartData.length === 0 ? (
             <div className="flex items-center justify-center h-full">
               <EmptyState 
                  icon="analytics" 
                  title="No Data Available" 
                  description="There is no historical data for this project in the selected time range." 
               />
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(192 193 255)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="rgb(192 193 255)" stopOpacity={0}/>
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(70 69 84)" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgb(144 143 160)" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono"
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                  minTickGap={30}
                />
                <YAxis 
                  stroke="rgb(144 143 160)" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono"
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}ms`} 
                  dx={-15}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgb(70 69 84)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                <Area 
                  type="monotone" 
                  dataKey="Response Time" 
                  stroke="rgb(192 193 255)" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorLatency)"
                  activeDot={{ r: 6, fill: "rgb(192 193 255)", stroke: 'rgb(19 19 22)', strokeWidth: 3 }}
                  animationDuration={1000}
                  style={{ filter: 'url(#glow)' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Secondary Chart Section (Global Uptime) */}
      <section className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-sm mt-8">
        <div className="p-5 border-b border-outline-variant flex items-center bg-surface-container-low gap-2">
          <span className="material-symbols-outlined text-emerald-400 text-[20px]">bar_chart</span>
          <h3 className="font-headline text-lg font-semibold text-white">
            Global Project Uptime
          </h3>
        </div>

        <div className="p-8 h-[350px] w-full bg-surface relative">
          {projects.length === 0 ? (
             <div className="flex items-center justify-center h-full">
               <EmptyState 
                  icon="monitoring" 
                  title="No Projects Configured" 
                  description="You need to add projects to view their uptime comparisons." 
               />
             </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={globalUptimeData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(70 69 84)" vertical={false} opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgb(144 143 160)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={15}
                />
                <YAxis 
                  stroke="rgb(144 143 160)" 
                  fontSize={11} 
                  fontFamily="JetBrains Mono"
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}%`} 
                  dx={-15}
                  domain={[0, 100]}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(70, 69, 84, 0.1)' }} />
                
                <Bar 
                  dataKey="Uptime" 
                  fill="rgb(52 211 153)" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  );
}
