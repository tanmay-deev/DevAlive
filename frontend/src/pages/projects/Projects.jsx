import React, { useEffect, useState } from 'react';
import useProjectStore from '../../store/projectStore.js';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Modal } from '../../components/ui/Modal.jsx';
import { ProjectForm } from '../../components/forms/ProjectForm.jsx';
import { Link } from 'react-router-dom';

export function Projects() {
  const { projects, fetchProjects, isLoading, deleteProject } = useProjectStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 font-headline">Projects</h1>
          <p className="text-on-surface-variant">Manage your monitored applications and endpoints.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined text-[20px] mr-2">add</span>
          Add Project
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low border-b border-border text-on-surface-variant">
              <tr>
                <th className="px-6 py-4 font-medium">Project Name</th>
                <th className="px-6 py-4 font-medium">URL</th>
                <th className="px-6 py-4 font-medium">Interval</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin text-[32px]">progress_activity</span>
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center mx-auto mb-4">
                       <span className="material-symbols-outlined text-outline">folder_open</span>
                    </div>
                    <p className="text-on-surface-variant mb-4">No projects configured yet.</p>
                    <Button variant="secondary" onClick={() => setIsModalOpen(true)}>Add Your First Project</Button>
                  </td>
                </tr>
              ) : (
                projects.map(project => (
                  <tr key={project._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{project.projectName}</div>
                      <div className="text-xs text-on-surface-variant">{project.projectType}</div>
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant truncate max-w-[200px]" title={project.endpointUrl}>
                       {project.endpointUrl}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">{project.monitoringInterval} min</td>
                    <td className="px-6 py-4">
                      {project.currentStatus === 'online' ? (
                        <span className="px-2.5 py-1 rounded text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">ONLINE</span>
                      ) : project.currentStatus === 'offline' ? (
                         <span className="px-2.5 py-1 rounded text-xs font-mono bg-red-500/10 text-red-400 border border-red-500/20">OFFLINE</span>
                      ) : (
                         <span className="px-2.5 py-1 rounded text-xs font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 uppercase">{project.currentStatus}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Link to={`/projects/${project._id}`} className="p-2 text-outline hover:text-white transition-colors bg-surface-container-high hover:bg-surface rounded-lg border border-transparent hover:border-border">
                           <span className="material-symbols-outlined text-[18px]">analytics</span>
                         </Link>
                         <button onClick={() => handleDelete(project._id)} className="p-2 text-outline hover:text-red-400 transition-colors bg-surface-container-high hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Project"
      >
        <ProjectForm onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
