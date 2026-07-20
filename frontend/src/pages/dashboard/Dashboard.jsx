import React, { useEffect, useState } from 'react';
import useProjectStore from '../../store/projectStore.js';
import analyticsService from '../../services/analyticsService.js';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { cn } from '../../utils/utils.js';

export function Dashboard() {
  const { projects, fetchProjects, isLoading: isProjectsLoading } = useProjectStore();
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  
  // Chart state
  const [chartData, setChartData] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  useEffect(() => {
    fetchProjects();
    analyticsService.getDashboardSummary().then(data => {
      setSummary(data.data);
      setIsLoadingSummary(false);
    }).catch(err => {
      console.error("Failed to load summary", err);
      setIsLoadingSummary(false);
    });
  }, [fetchProjects]);

  // When projects load, default to the first one for the chart
  useEffect(() => {
    if (projects.length > 0 && selectedProjectId === 'all') {
      setSelectedProjectId(projects[0]._id);
    }
  }, [projects]);

  // Fetch chart data when project selection changes
  useEffect(() => {
    const fetchChart = async () => {
      if (!selectedProjectId || selectedProjectId === 'all') {
        setChartData([]);
        setIsChartLoading(false);
        return;
      }
      setIsChartLoading(true);
      try {
        const response = await analyticsService.getUptimeChartData(selectedProjectId, 1); // Get 24h data for dashboard
        const dataArray = response.data.chartData;
        
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const formatted = dataArray.map(log => ({
            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            latency: log.responseTime || 0,
            status: log.status
          }));
          setChartData(formatted);
        } else {
          setChartData([]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard chart data", err);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    };
    fetchChart();
  }, [selectedProjectId]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-high/80 backdrop-blur-md border border-outline-variant p-4 rounded-xl shadow-2xl">
          <p className="text-on-surface-variant font-label-sm mb-3 text-xs">{label}</p>
          <div className="flex items-center gap-6 justify-between">
            <span className="flex items-center gap-2 text-sm font-medium text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
              Latency
            </span>
            <span className="font-headline font-bold text-primary">
              {payload[0].value}ms
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h2 className="font-headline font-bold text-3xl text-white tracking-tight mb-1">Dashboard Overview</h2>
          <p className="text-on-surface-variant text-sm">Monitoring all system instances across your infrastructure.</p>
        </div>
        <Link 
          to="/projects" 
          className="w-full sm:w-auto px-5 py-2.5 bg-white text-background font-semibold text-sm rounded-lg hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Deployment
        </Link>
      </header>

      {/* Bento Grid / Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Stat Card 1: Active Monitors */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-primary/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner">
              <span className="material-symbols-outlined text-[20px]">dns</span>
            </div>
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Active Monitors</h4>
            <div className="text-3xl font-headline font-bold text-white">
              {isLoadingSummary ? (
                 <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                 `${summary?.onlineProjects || 0} / ${summary?.totalProjects || 0}`
              )}
            </div>
            <div className="mt-4 flex gap-1 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
               {!isLoadingSummary && summary?.totalProjects > 0 && (
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(summary?.onlineProjects / summary?.totalProjects) * 100}%`}}></div>
               )}
            </div>
          </div>
        </div>

        {/* Stat Card 2: Average Uptime */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Average Uptime</h4>
            <div className="text-3xl font-headline font-bold text-white">
               {isLoadingSummary ? (
                 <Skeleton className="h-8 w-24 mt-1" />
              ) : (
                 `${summary?.averageUptime || 0}%`
              )}
            </div>
            <div className="mt-4 flex gap-1 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
               {!isLoadingSummary && (
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${summary?.averageUptime || 0}%`}}></div>
               )}
            </div>
          </div>
        </div>

        {/* Stat Card 3: Total Alerts */}
        <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl relative overflow-hidden group hover:border-red-500/30 transition-colors shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-red-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20 shadow-inner">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            {!isLoadingSummary && summary?.unreadAlerts > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20 shadow-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {summary.unreadAlerts} New
              </span>
            )}
          </div>
          <div>
            <h4 className="text-on-surface-variant font-medium text-sm mb-1">Unread Notifications</h4>
            <div className="text-3xl font-headline font-bold text-white">
               {isLoadingSummary ? (
                 <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                 summary?.unreadAlerts || '0'
              )}
            </div>
            <div className="mt-4 flex gap-1 h-1 w-full bg-surface-container-high rounded-full overflow-hidden">
               {!isLoadingSummary && (
                  <div className={`h-full rounded-full transition-all duration-1000 ${summary?.unreadAlerts > 0 ? 'bg-red-400 w-full' : 'bg-surface-container-high'}`}></div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualization Card */}
      <section className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low gap-4">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            Request Throughput (ms)
          </h3>
          <div className="flex items-center gap-3">
             <div className="relative w-full sm:w-56">
                <select 
                  className="w-full bg-surface-container-high border border-outline-variant text-white text-sm font-medium rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none appearance-none cursor-pointer hover:bg-surface-container-high"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  <option value="all" disabled>Select Project...</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.projectName}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
              </div>
          </div>
        </div>
        
        <div className="p-8 h-[350px] w-full bg-surface relative">
           {isChartLoading ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
               <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-3">progress_activity</span>
               <p className="text-sm">Loading throughput data...</p>
             </div>
           ) : chartData.length === 0 ? (
             <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
               <span className="material-symbols-outlined text-[40px] opacity-20 mb-3">bar_chart</span>
               <p className="text-sm">No latency data recorded yet for this project.</p>
             </div>
           ) : (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                 <defs>
                    <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c0c1ff" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#c0c1ff" stopOpacity={0.1}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2d" vertical={false} opacity={0.5} />
                 <XAxis 
                   dataKey="time" 
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
                   tickFormatter={(val) => `${val}ms`}
                   dx={-15}
                 />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.03 }} />
                 <Bar 
                   dataKey="latency" 
                   fill="url(#colorLatency)" 
                   radius={[4, 4, 0, 0]}
                   maxBarSize={40}
                   animationDuration={1500}
                 />
               </BarChart>
             </ResponsiveContainer>
           )}
        </div>
      </section>

      {/* Recent Logs List View */}
      <section className="bg-surface-container-low rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-on-surface-variant text-[20px]">list_alt</span>
            Recent Deployments
          </h3>
          <Link to="/projects" className="text-sm font-medium text-white hover:bg-surface-container-high px-3 py-1.5 rounded-lg border border-outline-variant/50 transition-colors flex items-center gap-1">
            View All
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
        
        <div className="flex flex-col">
           {isProjectsLoading ? (
             Array.from({ length: 3 }).map((_, i) => (
               <div key={i} className="flex items-center justify-between p-4 border-b border-outline-variant/50">
                 <div className="flex items-center gap-4 w-full max-w-sm">
                   <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                   <div className="flex flex-col gap-2 w-full">
                     <Skeleton className="w-full h-4" />
                     <Skeleton className="w-2/3 h-3" />
                   </div>
                 </div>
                 <div className="flex items-center gap-6 shrink-0">
                   <div className="hidden sm:flex flex-col items-end gap-2">
                     <Skeleton className="w-16 h-3" />
                     <Skeleton className="w-12 h-4" />
                   </div>
                   <Skeleton className="w-24 h-8 rounded-full" />
                 </div>
               </div>
             ))
          ) : projects.length === 0 ? (
             <EmptyState 
               icon="folder_off"
               title="No Projects Yet"
               description="You haven't added any projects to monitor."
               action={
                 <Link to="/projects" className="px-6 py-2.5 bg-surface-container-low border border-outline-variant text-white text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-colors">
                   Create Your First Project
                 </Link>
               }
             />
          ) : (
            projects.slice(0, 5).map((project, index) => (
              <div 
                key={project._id} 
                className={cn(
                  "flex items-center justify-between p-4 hover:bg-surface-container-high/50 transition-colors group",
                  index !== projects.slice(0, 5).length - 1 && "border-b border-outline-variant/50"
                )}
              >
                {/* Left Side: Icon + Name */}
                <div className="flex items-center gap-4 min-w-0">
                   <div className="w-10 h-10 shrink-0 bg-surface-container-highest border border-outline-variant rounded-full flex items-center justify-center text-white shadow-inner">
                     {project.projectType === 'API Endpoint' ? (
                        <span className="material-symbols-outlined text-[20px]">api</span>
                     ) : (
                        <span className="material-symbols-outlined text-[20px]">web</span>
                     )}
                   </div>
                   <div className="flex flex-col min-w-0">
                     <Link to={`/analytics?project=${project._id}`} className="text-sm font-semibold text-white truncate hover:underline">
                       {project.projectName}
                     </Link>
                     <a href={project.endpointUrl} target="_blank" rel="noreferrer" className="text-xs text-on-surface-variant truncate hover:text-white transition-colors mt-0.5">
                       {project.endpointUrl.replace(/^https?:\/\//, '')}
                     </a>
                   </div>
                </div>

                {/* Right Side: Status + Latency */}
                <div className="flex items-center gap-6 shrink-0">
                   <div className="hidden sm:flex flex-col items-end">
                     <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-0.5">Latency</span>
                     <span className="text-sm font-mono text-white">
                        {project.averageResponseTime ? `${Math.round(project.averageResponseTime)}ms` : '---'}
                     </span>
                   </div>

                   <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm",
                      project.currentStatus === 'online' ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : 
                      project.currentStatus === 'offline' ? "border-red-500/20 bg-red-500/10 text-red-400" : 
                      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                    )}>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        project.currentStatus === 'online' ? "bg-emerald-400" : 
                        project.currentStatus === 'offline' ? "bg-red-400" : "bg-yellow-400 animate-pulse"
                      )}></span>
                      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                        {project.currentStatus === 'online' ? 'Operational' : project.currentStatus}
                      </span>
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
