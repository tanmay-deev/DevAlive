import React, { useEffect, useState, useMemo } from 'react';
import useProjectStore from '../../store/projectStore.js';
import analyticsService from '../../services/analyticsService.js';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      setSummary(data.data); // data is directly the summary object from our backend fix
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
        <div className="bg-surface-container-high border border-outline-variant p-3 rounded-xl shadow-2xl">
          <p className="text-on-surface-variant font-label-sm mb-2 text-xs">{label}</p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
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
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-1">Dashboard Overview</h2>
          <p className="text-on-surface-variant text-sm">Monitoring all system instances across your infrastructure.</p>
        </div>
        <Link to="/projects" className="px-4 py-2.5 bg-primary text-background font-semibold text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/10">
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
          </div>
          <div className="text-sm text-on-surface-variant font-medium mb-1">Active Monitors</div>
          <div className="text-3xl font-headline font-bold text-white">
            {isLoadingSummary ? (
               <div className="h-8 w-24 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
               `${summary?.onlineProjects || 0} / ${summary?.totalProjects || 0}`
            )}
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
             {isLoadingSummary ? (
                <div className="h-full bg-surface-container-highest w-full animate-pulse"></div>
             ) : (
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(summary?.onlineProjects / Math.max(1, summary?.totalProjects)) * 100}%`}}></div>
             )}
          </div>
        </div>

        {/* Stat Card 2: Average Uptime */}
        <div className="bg-surface-container p-6 rounded-xl border border-outline-variant group hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-surface-container-high rounded-lg text-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
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
            {!isLoadingSummary && summary?.unreadAlerts > 0 && (
              <span className="text-error text-xs font-medium flex items-center gap-1 bg-error/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {summary.unreadAlerts} New Alerts
              </span>
            )}
          </div>
          <div className="text-sm text-on-surface-variant font-medium mb-1">Unread Notifications</div>
          <div className="text-3xl font-headline font-bold text-white">
             {isLoadingSummary ? (
               <div className="h-8 w-16 bg-surface-container-highest rounded animate-pulse"></div>
            ) : (
               summary?.unreadAlerts || '0'
            )}
          </div>
          <div className="mt-4 flex gap-1 h-1.5 w-full bg-surface-container-low rounded-full overflow-hidden">
             {isLoadingSummary ? (
                 <div className="h-full bg-surface-container-highest w-full animate-pulse"></div>
             ) : (
                <div className={`h-full rounded-full w-full ${summary?.unreadAlerts > 0 ? 'bg-tertiary' : 'bg-surface-container-highest'}`}></div>
             )}
          </div>
        </div>
      </div>

      {/* Main Visualization Card (Real Bar Chart) */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low gap-4">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-primary text-[20px]">analytics</span>
            Request Throughput (ms)
          </h3>
          <div className="flex items-center gap-3">
             <div className="relative">
                <select 
                  className="w-full sm:w-48 bg-surface-container-highest border border-outline-variant text-white text-xs font-medium rounded pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none appearance-none cursor-pointer hover:bg-surface-container-high"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  <option value="all" disabled>Select Project...</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.projectName}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
              </div>
          </div>
        </div>
        
        <div className="p-8 h-[300px] w-full bg-surface relative">
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
                      <stop offset="0%" stopColor="#c0c1ff" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#c0c1ff" stopOpacity={0.2}/>
                    </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="4 4" stroke="#2a2a2d" vertical={false} />
                 <XAxis 
                   dataKey="time" 
                   stroke="#908fa0" 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   dy={10}
                 />
                 <YAxis 
                   stroke="#908fa0" 
                   fontSize={11} 
                   tickLine={false} 
                   axisLine={false} 
                   tickFormatter={(val) => `${val}ms`}
                   dx={-10}
                 />
                 <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
                 <Bar 
                   dataKey="latency" 
                   fill="url(#colorLatency)" 
                   radius={[4, 4, 0, 0]}
                   maxBarSize={40}
                 />
               </BarChart>
             </ResponsiveContainer>
           )}
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
                    <span className="material-symbols-outlined animate-spin text-[28px] text-primary">progress_activity</span>
                    <div className="mt-2 text-sm">Loading projects...</div>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-on-surface-variant">
                    <div className="flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">folder_off</span>
                      <p className="text-sm">No projects found. <Link to="/projects" className="text-primary hover:underline font-medium">Add your first project</Link> to start monitoring.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.slice(0, 5).map(project => (
                  <tr key={project._id} className="border-b border-outline-variant/50 hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-white">{project.projectName}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant truncate max-w-[200px]">{project.endpointUrl}</td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant">
                      {project.averageResponseTime ? `${Math.round(project.averageResponseTime)}ms` : '---'}
                    </td>
                    <td className="px-6 py-4">
                      {project.currentStatus === 'online' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20 shadow-sm inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Operational
                        </span>
                      ) : project.currentStatus === 'offline' ? (
                         <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/20 shadow-sm inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Offline
                        </span>
                      ) : (
                         <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold uppercase tracking-wider border border-yellow-500/20 inline-flex items-center gap-1">
                           <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                           {project.currentStatus}
                         </span>
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
