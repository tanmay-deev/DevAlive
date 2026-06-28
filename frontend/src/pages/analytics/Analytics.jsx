import React, { useEffect, useState } from 'react';
import analyticsService from '../../services/analyticsService.js';
import useProjectStore from '../../store/projectStore.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../../utils/utils.js';

export function Analytics() {
  const { projects, fetchProjects } = useProjectStore();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('all');

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

        const data = await analyticsService.getUptimeChartData(projectId, 7);
        const { labels, datasets } = data.data.chartData;
        
        const formattedData = labels.map((label, index) => {
          const dataPoint = { name: label };
          datasets.forEach(dataset => {
            dataPoint[dataset.label] = dataset.data[index];
          });
          return dataPoint;
        });
        
        setChartData(formattedData);
      } catch (err) {
        console.error("Failed to load chart data", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalytics();
  }, [selectedProject, projects]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-container-high border border-outline-variant p-4 rounded-xl shadow-2xl">
          <p className="text-on-surface-variant font-label-sm mb-3 text-xs">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </span>
              <span className="font-headline font-bold" style={{ color: entry.color }}>
                {entry.value}%
              </span>
            </div>
          ))}
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
          <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-1">Performance Analytics</h2>
          <p className="text-on-surface-variant text-sm">Visualize your project's historical uptime and latencies.</p>
        </div>
        
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">folder</span>
          <select 
            className="w-full sm:w-64 bg-surface-container-low border border-outline-variant text-white text-sm font-medium rounded-lg pl-10 pr-10 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none cursor-pointer hover:bg-surface-container-high"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">Select a Project...</option>
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.projectName}</option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">expand_more</span>
        </div>
      </header>

      {/* Main Chart Section */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-6 border-b border-outline-variant flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low gap-4">
          <h3 className="font-headline text-lg font-semibold flex items-center gap-2 text-white">
            <span className="material-symbols-outlined text-primary text-[20px]">ssid_chart</span>
            Uptime (Last 7 Days)
          </h3>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-highest p-0.5 rounded-lg border border-outline-variant">
              <button className="px-3 py-1 bg-surface-container-low text-on-surface rounded-md text-xs font-medium shadow-sm">7d</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors cursor-not-allowed opacity-50">30d</button>
              <button className="px-3 py-1 text-on-surface-variant text-xs font-medium hover:text-on-surface transition-colors cursor-not-allowed opacity-50">90d</button>
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
                  <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4edea3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4edea3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAlt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c0c1ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c0c1ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke="#2a2a2d" vertical={false} />
                <XAxis 
                  dataKey="name" 
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
                  tickFormatter={(value) => `${value}%`} 
                  dx={-10}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#464554', strokeWidth: 1, strokeDasharray: '4 4' }} />
                
                {Object.keys(chartData[0] || {}).filter(key => key !== 'name').map((key, i) => (
                  <Area 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={i === 0 ? "#4edea3" : "#c0c1ff"} 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill={`url(#${i === 0 ? 'colorUptime' : 'colorAlt'})`}
                    activeDot={{ r: 6, fill: i === 0 ? "#4edea3" : "#c0c1ff", stroke: '#131316', strokeWidth: 2 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Summary Insights */}
      {!isLoading && chartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-[20px]">thumb_up</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Excellent Reliability</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">This project has maintained consistent uptime over the last 7 days. No significant outages detected during peak hours.</p>
            </div>
          </div>
          <div className="bg-surface-container-low border border-outline-variant p-6 rounded-xl flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
               <span className="material-symbols-outlined text-[20px]">lightbulb</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Optimization Tip</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Consider enabling detailed regional tracing in Settings to get deeper insights into latency spikes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
