import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService.js';
import useAuthStore from '../../store/authStore.js';

export function Settings() {
  const { user } = useAuthStore();
  const [settings, setSettings] = useState({
    emailAlertsEnabled: true,
    notificationEmail: user?.email || '',
    dailyReportEnabled: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data.data.settings) {
          setSettings(data.data.settings);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      await settingsService.updateSettings(settings);
      setMessage('Settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  // Custom Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        enabled ? 'bg-primary' : 'bg-surface-container-highest'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <header>
        <h2 className="font-headline font-bold text-2xl text-on-surface tracking-tight mb-1">Account Settings</h2>
        <p className="text-on-surface-variant text-sm">Manage your notification preferences and account details.</p>
      </header>

      <div className="bg-surface-container border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-24 text-center text-on-surface-variant flex flex-col items-center">
             <span className="material-symbols-outlined animate-spin text-[40px] text-primary mb-4">progress_activity</span>
             <p className="text-sm">Loading preferences...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Section: Notifications */}
            <div className="p-6 sm:p-8 border-b border-outline-variant">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[24px]">notifications_active</span>
                <h3 className="font-headline text-lg font-semibold text-white">Alert Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:border-outline-variant transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Downtime Email Alerts</h4>
                    <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">Receive an immediate email notification the moment one of your monitored services goes offline or fails a health check.</p>
                  </div>
                  <div className="mt-1">
                    <ToggleSwitch 
                      enabled={settings.emailAlertsEnabled} 
                      onChange={(val) => setSettings({...settings, emailAlertsEnabled: val})} 
                    />
                  </div>
                </div>
                
                <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant/50 hover:border-outline-variant transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">Daily Uptime Summary</h4>
                    <p className="text-xs text-on-surface-variant max-w-md leading-relaxed">Receive a daily digest email containing aggregated uptime statistics and average latency for all your active projects.</p>
                  </div>
                  <div className="mt-1">
                    <ToggleSwitch 
                      enabled={settings.dailyReportEnabled} 
                      onChange={(val) => setSettings({...settings, dailyReportEnabled: val})} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Contact Info */}
            <div className="p-6 sm:p-8 border-b border-outline-variant bg-surface-container-low">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary text-[24px]">contact_mail</span>
                <h3 className="font-headline text-lg font-semibold text-white">Contact Routing</h3>
              </div>
              
              <div className="max-w-md">
                <label className="block text-sm font-medium text-on-surface mb-2">Alert Delivery Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px] pointer-events-none">mail</span>
                  <input 
                    type="email" 
                    className="w-full bg-surface-container-highest border border-outline-variant rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-white"
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({...settings, notificationEmail: e.target.value})}
                    placeholder="alerts@company.com"
                  />
                </div>
                <p className="text-xs text-on-surface-variant mt-2">This email will be used exclusively for system alerts and reports, overriding your account login email if specified.</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 sm:px-8 sm:py-6 bg-surface-container flex items-center justify-between">
              <div>
                {message && (
                  <span className={`text-sm font-medium flex items-center gap-2 ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
                    <span className="material-symbols-outlined text-[18px]">
                      {message.includes('success') ? 'check_circle' : 'error'}
                    </span>
                    {message}
                  </span>
                )}
              </div>
              <button 
                type="submit" 
                disabled={isSaving}
                className="px-6 py-2.5 bg-primary text-background font-semibold text-sm rounded-lg hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    Saving...
                  </>
                ) : (
                  'Save Preferences'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
