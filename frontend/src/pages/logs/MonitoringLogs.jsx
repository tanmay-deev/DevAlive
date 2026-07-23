import React, { useState, useEffect } from 'react';
import useProjectStore from '../../store/projectStore.js';
import logsService from '../../services/logsService.js';
import { format } from 'date-fns';
import { EmptyState } from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Skeleton.jsx';
import { cn } from '../../utils/utils.js';

export function MonitoringLogs() {
  const { projects, fetchProjects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState('all');
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, hasNextPage: false, hasPreviousPage: false });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const fetchLogs = async () => {
      const projectId = selectedProject === 'all' && projects.length > 0 ? projects[0]._id : selectedProject;
      if (!projectId || projectId === 'all') return;
      
      setIsLoading(true);
      try {
        const data = await logsService.getMonitoringLogs(projectId, currentPage, 15);
        setLogs(data.data.logs);
        if (data.data.pagination) {
          setPagination(data.data.pagination);
        }
      } catch (error) {
        console.error("Failed to load logs", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [selectedProject, currentPage, projects]);

  // Reset page when project changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProject]);

  const handleManualCheck = async () => {
    const projectId = selectedProject === 'all' && projects.length > 0 ? projects[0]._id : selectedProject;
    if (!projectId || projectId === 'all') return;

    try {
      await logsService.triggerManualCheck(projectId);
      const data = await logsService.getMonitoringLogs(projectId, 1, 15);
      setLogs(data.data.logs);
      if (data.data.pagination) {
        setPagination(data.data.pagination);
      }
      setCurrentPage(1);
      setToast({ message: "Manual ping executed successfully.", type: "success" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Manual ping failed. Please try again later.";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  // Calculate summary stats for the current page
  const visibleSuccessCount = logs.filter(log => log.status === 'success').length;
  const visibleSuccessRate = logs.length > 0 ? Math.round((visibleSuccessCount / logs.length) * 100) : 0;
  
  const validLatencies = logs.filter(log => log.responseTime > 0).map(log => log.responseTime);
  const avgLatency = validLatencies.length > 0 
    ? Math.round(validLatencies.reduce((a, b) => a + b, 0) / validLatencies.length) 
    : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-headline font-bold text-3xl text-white tracking-tight">Monitoring Logs</h2>
            {selectedProject !== 'all' && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Live Stream</span>
              </div>
            )}
          </div>
          <p className="text-on-surface-variant text-sm">View raw historical ping data and response times.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">folder</span>
            <select 
              className="w-full bg-surface-container-low border border-outline-variant text-white text-sm font-medium rounded-lg pl-10 pr-10 py-2.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none appearance-none cursor-pointer hover:bg-surface-container-high shadow-sm"
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
          
          <button 
            onClick={handleManualCheck} 
            disabled={selectedProject === 'all' && projects.length === 0}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-background font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(192,193,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
          >
            <span className="material-symbols-outlined text-[18px]">bolt</span>
            Run Ping
          </button>
        </div>
      </header>

      {/* Logs Table Section */}
      <section className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <div className="p-5 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">terminal</span>
            <h3 className="font-headline text-lg font-semibold text-white">System Events</h3>
          </div>
        </div>

        {/* Summary Strip */}
        {!isLoading && logs.length > 0 && (
          <div className="px-6 py-3 border-b border-outline-variant bg-surface-container-low/50 flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">Page Success Rate:</span>
              <span className={cn("font-mono font-bold", visibleSuccessRate >= 90 ? "text-emerald-400" : visibleSuccessRate >= 50 ? "text-yellow-400" : "text-red-400")}>
                {visibleSuccessRate}%
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-outline-variant"></div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">Page Avg Latency:</span>
              <span className={cn("font-mono font-bold", avgLatency < 1000 ? "text-emerald-400" : "text-yellow-400")}>
                {avgLatency}ms
              </span>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Latency</th>
                <th className="px-6 py-4 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Event Details</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 15 }).map((_, idx) => (
                  <tr key={idx} className="border-b border-outline-variant/50">
                    <td className="px-6 py-5"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-5"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="px-6 py-5"><Skeleton className="h-4 w-16" /></td>
                    <td className="px-6 py-5"><Skeleton className="h-4 w-48" /></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12">
                    <EmptyState 
                      icon="history" 
                      title="No Logs Available" 
                      description="No recent logs available for this project. Try running a manual ping." 
                    />
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log._id} className="border-b border-outline-variant/30 hover:bg-surface-container-high transition-all hover:shadow-lg group">
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant group-hover:text-white transition-colors">
                      {format(new Date(log.checkedAt), 'yyyy-MM-dd HH:mm:ss')}
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.1)] backdrop-blur-md flex inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          200 OK
                        </span>
                      ) : (
                         <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider border border-red-500/30 shadow-[0_0_10px_rgba(248,113,113,0.1)] backdrop-blur-md flex inline-flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          {log.statusCode || 'ERROR'}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-on-surface-variant group-hover:text-white transition-colors">
                       {log.responseTime ? (
                         <span className={log.responseTime > 1000 ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 'text-emerald-400'}>
                           {log.responseTime}ms
                         </span>
                       ) : '---'}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface truncate max-w-xs flex items-center gap-2">
                       {log.status === 'success' ? (
                         <>
                           <span className="material-symbols-outlined text-[16px] text-emerald-500 bg-emerald-500/10 rounded-full p-0.5">check</span>
                           <span className="group-hover:text-emerald-400 transition-colors">Health check passed successfully</span>
                         </>
                       ) : (
                         <>
                           <span className="material-symbols-outlined text-[16px] text-red-500 bg-red-500/10 rounded-full p-0.5">warning</span>
                           <span className="group-hover:text-red-400 transition-colors">{log.errorMessage || 'Connection timeout'}</span>
                         </>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {logs.length > 0 && !isLoading && (
          <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-medium text-on-surface-variant">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={!pagination.hasPreviousPage}
                className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm font-medium text-white hover:bg-surface-container-high hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                Previous
              </button>
              <button 
                onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={!pagination.hasNextPage}
                className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-sm font-medium text-white hover:bg-surface-container-high hover:border-primary/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 shadow-sm"
              >
                Next
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={cn(
            "px-5 py-3.5 rounded-xl border shadow-2xl flex items-center gap-3 backdrop-blur-xl",
            toast.type === 'error' ? "bg-red-500/20 border-red-500/30 text-red-400" : "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
          )}>
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-4 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
