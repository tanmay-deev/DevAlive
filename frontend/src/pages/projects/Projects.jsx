import React, { useEffect, useState, useMemo, useRef } from 'react';
import useProjectStore from '../../store/projectStore.js';
import analyticsService from '../../services/analyticsService.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ProjectForm } from '../../components/forms/ProjectForm.jsx';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/utils.js';

// Extracted Dropdown Component for Project Actions
const ProjectDropdownMenu = ({ project, handleEditClick, handleDelete, toggleMonitoring }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(!isOpen); }}
        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-white"
      >
        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#18181b] border border-outline-variant rounded-xl shadow-2xl shadow-black/50 py-1 z-50 overflow-hidden">
          <Link 
            to={`/analytics?project=${project._id}`}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">analytics</span>
            View Analytics
          </Link>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); handleEditClick(project); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Project
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); toggleMonitoring(project._id); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">{project.monitoringEnabled ? 'pause_circle' : 'play_circle'}</span>
            {project.monitoringEnabled ? 'Pause Monitoring' : 'Resume Monitoring'}
          </button>
          <div className="h-px w-full bg-outline-variant/50 my-1"></div>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsOpen(false); handleDelete(project._id); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors text-left"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export function Projects() {
  const { projects, fetchProjects, isLoading, deleteProject, toggleMonitoring } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [summary, setSummary] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  const handleEditClick = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingProject(null), 300); // clear after animation
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const lowerQuery = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.projectName.toLowerCase().includes(lowerQuery) || 
      p.endpointUrl.toLowerCase().includes(lowerQuery)
    );
  }, [projects, searchQuery]);

  const formatInterval = (mins) => {
    if (mins < 60) return `${mins}m`;
    if (mins === 60) return '1 hr';
    if (mins < 1440) return `${mins / 60} hrs`;
    if (mins === 1440) return '1 day';
    return `${mins / 1440} days`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-[1440px] mx-auto w-full">
      {/* Left Sidebar (Usage & Alerts) */}
      <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-8">
        
        {/* Usage Stats Widget */}
        <div>
          <h3 className="text-sm font-semibold text-on-surface-variant tracking-wider mb-3 px-1">Usage</h3>
          <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden shadow-sm">
            <div className="p-4 border-b border-outline-variant flex justify-between items-center">
              <span className="text-xs font-medium text-white">Project Limits</span>
              <span className="px-2 py-0.5 bg-background border border-outline-variant rounded text-[10px] text-white">Free</span>
            </div>
            
            <div className="p-4 space-y-5">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-primary">dns</span>
                    Active Monitors
                  </span>
                  <span className="text-on-surface-variant font-mono">
                    {isLoadingSummary ? '...' : `${summary?.onlineProjects || 0} / ${summary?.totalProjects || 0}`}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                  {!isLoadingSummary && summary?.totalProjects > 0 && (
                    <div className="h-full bg-primary" style={{ width: `${(summary?.onlineProjects / summary?.totalProjects) * 100}%` }}></div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-emerald-400">speed</span>
                    Average Uptime
                  </span>
                  <span className="text-on-surface-variant font-mono">
                    {isLoadingSummary ? '...' : `${summary?.averageUptime || 0}%`}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden flex">
                  {!isLoadingSummary && (
                    <div className="h-full bg-emerald-400" style={{ width: `${summary?.averageUptime || 0}%` }}></div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-on-surface flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px] text-secondary">swap_horiz</span>
                    Health Checks
                  </span>
                  <span className="text-on-surface-variant font-mono">Unmetered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Widget */}
        <div>
          <h3 className="text-sm font-semibold text-on-surface-variant tracking-wider mb-3 px-1">Alerts</h3>
          <div className="bg-surface-container rounded-xl border border-outline-variant p-5 shadow-sm text-center">
            <span className="material-symbols-outlined text-[32px] text-primary mb-3">notifications_active</span>
            <h4 className="text-sm font-semibold text-white mb-1.5">Get alerted for anomalies</h4>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
              Automatically monitor your projects for downtime and get notified on Discord or Email instantly.
            </p>
            <Link to="/settings" className="px-4 py-2 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-white text-xs font-medium rounded-lg transition-colors inline-block">
              Upgrade to Pro
            </Link>
          </div>
        </div>

      </aside>

      {/* Main Grid Area */}
      <main className="flex-1 min-w-0 flex flex-col gap-6">
        
        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
            <input 
              type="text" 
              placeholder="Search Projects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant text-white text-sm font-medium rounded-lg pl-9 pr-4 py-2 focus:ring-1 focus:ring-outline transition-all outline-none placeholder:text-on-surface-variant/70 shadow-sm"
            />
          </div>
          <button 
            onClick={handleAddClick}
            className="w-full sm:w-auto px-4 py-2 bg-white text-background font-semibold text-sm rounded-lg hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
          >
            Add New...
            <span className="material-symbols-outlined text-[16px]">expand_more</span>
          </button>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading && projects.length === 0 ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-[32px] text-primary mb-3">progress_activity</span>
              <p className="text-sm">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">folder_off</span>
              <p className="text-sm text-on-surface-variant mb-4 max-w-sm">
                {searchQuery ? "No projects match your search." : "No projects configured yet."}
              </p>
              {!searchQuery && (
                <button 
                  onClick={handleAddClick}
                  className="px-4 py-2 bg-surface-container-low border border-outline-variant text-white text-sm font-medium rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  Create Your First Project
                </button>
              )}
            </div>
          ) : (
            filteredProjects.map(project => (
              <div 
                key={project._id} 
                className="group flex flex-col justify-between bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-outline-variant/80 hover:shadow-md transition-all h-[160px]"
              >
                {/* Card Top Row */}
                <div className="flex justify-between items-start gap-3">
                  {/* Left: Icon & Titles */}
                  <div className="flex gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 shrink-0 bg-surface-container-high border border-outline-variant rounded-full flex items-center justify-center text-white shadow-inner">
                       {project.projectType === 'API Endpoint' ? (
                          <span className="material-symbols-outlined text-[20px]">api</span>
                       ) : (
                          <span className="material-symbols-outlined text-[20px]">web</span>
                       )}
                    </div>
                    <div className="flex flex-col min-w-0 mt-0.5">
                      <Link to={`/analytics?project=${project._id}`} className="text-sm font-semibold text-white truncate hover:underline">
                        {project.projectName}
                      </Link>
                      <a href={project.endpointUrl} target="_blank" rel="noreferrer" className="text-xs text-on-surface-variant truncate hover:text-white transition-colors mt-0.5">
                        {project.endpointUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                  
                  {/* Right: Status & Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={cn(
                      "w-7 h-7 rounded-full border flex items-center justify-center shadow-sm",
                      project.currentStatus === 'online' ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : 
                      project.currentStatus === 'offline' ? "border-red-500/30 bg-red-500/10 text-red-400" : 
                      "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                    )} title={`Status: ${project.currentStatus}`}>
                      <span className="material-symbols-outlined text-[14px]">
                        {project.currentStatus === 'online' ? 'check' : 
                         project.currentStatus === 'offline' ? 'close' : 'sync'}
                      </span>
                    </div>
                    
                    <ProjectDropdownMenu 
                      project={project}
                      handleEditClick={handleEditClick}
                      handleDelete={handleDelete}
                      toggleMonitoring={toggleMonitoring}
                    />
                  </div>
                </div>
                
                {/* Card Bottom Row */}
                <div className="flex flex-col gap-1.5 mt-auto">
                   <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium bg-surface-container w-fit px-2 py-1 rounded border border-outline-variant/50">
                     <span className="material-symbols-outlined text-[14px]">public</span>
                     {formatInterval(project.monitoringInterval)} Interval
                   </div>
                   <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/70 mt-0.5">
                     <span className="material-symbols-outlined text-[14px]">
                       {project.monitoringEnabled ? 'monitoring' : 'pause_circle'}
                     </span>
                     {project.monitoringEnabled ? 'Active monitoring on main' : 'Monitoring paused'}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleModalClose} 
        title={editingProject ? "Edit Project Details" : "Add New Project"}
      >
        <ProjectForm 
          onSuccess={handleModalClose} 
          onCancel={handleModalClose} 
          initialData={editingProject} 
        />
      </Modal>
    </div>
  );
}
