import React, { useState } from 'react';
import { Input } from '../ui/Input.jsx';
import { Button } from '../ui/Button.jsx';
import useProjectStore from '../../store/projectStore.js';

export function ProjectForm({ onSuccess, onCancel }) {
  const [projectName, setProjectName] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [monitoringInterval, setMonitoringInterval] = useState(15);
  const { addProject, isLoading, error } = useProjectStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addProject({ projectName, endpointUrl, monitoringInterval });
    if (success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
          {error}
        </div>
      )}

      <Input
        label="Project Name"
        id="projectName"
        type="text"
        placeholder="e.g. Production API"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        required
      />

      <Input
        label="Endpoint URL"
        id="endpointUrl"
        type="url"
        placeholder="https://api.example.com/health"
        value={endpointUrl}
        onChange={(e) => setEndpointUrl(e.target.value)}
        required
      />

      <div className="space-y-1.5 w-full">
        <label className="text-label-sm font-mono uppercase tracking-wider text-on-surface-variant block">
          Monitoring Interval (Minutes)
        </label>
        <select
          className="w-full bg-background border border-border rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 outline-none appearance-none"
          value={monitoringInterval}
          onChange={(e) => setMonitoringInterval(Number(e.target.value))}
        >
          <option value={1}>1 Minute (Pro)</option>
          <option value={5}>5 Minutes</option>
          <option value={15}>15 Minutes</option>
          <option value={30}>30 Minutes</option>
          <option value={60}>60 Minutes</option>
        </select>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-6">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>Add Project</Button>
      </div>
    </form>
  );
}
