import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '../utils/utils.js';
import useAuthStore from '../store/authStore.js';
import notificationService from '../services/notificationService.js';

export function DashboardLayout() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { name: 'Projects', path: '/projects', icon: 'folder_open' },
    { name: 'Analytics', path: '/analytics', icon: 'insights' },
    { name: 'Monitoring Logs', path: '/logs', icon: 'terminal' },
    { name: 'Notifications', path: '/notifications', icon: 'notifications', badge: unreadCount > 0 ? unreadCount : null },
    { name: 'Settings', path: '/settings', icon: 'settings' },
  ];

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const data = await notificationService.getUnreadCount();
        setUnreadCount(data.data.unreadCount);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    fetchUnreadCount();
    // Ideally we would set up an interval or websocket here for real-time updates
  }, [location.pathname]);

  // Close profile menu if clicked outside (simple effect via overlay)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsProfileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background font-sans text-on-surface">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SideNavBar Component */}
      <aside className={cn(
        "h-screen w-[260px] fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 px-4 z-50 transition-transform duration-300 lg:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="flex items-center justify-between mb-12">
          <Link to="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
               <span className="material-symbols-outlined text-white text-[20px]">monitor_heart</span>
            </div>
            <div>
              <h1 className="font-headline font-bold text-xl text-primary tracking-tight leading-tight">DevAlive</h1>
              <p className="font-mono text-[10px] text-on-surface-variant opacity-70 uppercase tracking-wider">Developer Console</p>
            </div>
          </Link>
          <button className="lg:hidden text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out group",
                  isActive 
                    ? "bg-primary-container text-on-primary-container font-bold" 
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r-md"></div>
                )}
                <span className={cn("material-symbols-outlined text-[20px]", isActive ? "text-primary" : "")} style={{fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"}}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
                {item.badge && (
                  <span className={cn(
                    "ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold",
                    "bg-primary text-background"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer: Profile */}
        <div className="pt-6 border-t border-outline-variant mt-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low mb-3 border border-transparent hover:border-outline-variant transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-container-highest border border-outline-variant overflow-hidden flex-shrink-0 flex items-center justify-center text-primary font-bold text-lg">
              {user?.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-on-surface truncate">{user?.fullName || 'Developer'}</p>
              <p className="text-xs text-on-surface-variant truncate">{user?.email || 'admin@devalive.com'}</p>
            </div>
            <button 
              onClick={() => logout()}
              className="text-on-surface-variant hover:text-error transition-colors p-1 rounded hover:bg-surface-container-high"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
          <button className="flex items-center justify-between w-full px-4 py-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-all group">
            <span className="text-xs font-medium">Collapse Sidebar</span>
            <span className="material-symbols-outlined scale-90 group-hover:-translate-x-1 transition-transform">keyboard_double_arrow_left</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-[260px] h-screen overflow-y-auto bg-background flex flex-col min-w-0">
        
        {/* TopNavBar Component */}
        <header className="py-4 min-h-[72px] sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant flex items-center justify-between px-4 lg:px-6">
          {/* Left: Mobile Menu & Breadcrumb */}
          <div className="flex items-center gap-3 flex-1 justify-start min-w-0">
            <button className="lg:hidden text-on-surface-variant hover:text-white" onClick={() => setIsMobileMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <nav className="flex items-center text-on-surface-variant text-sm font-medium">
              <span className="text-on-surface capitalize font-semibold">{location.pathname.split('/')[1] || 'Overview'}</span>
            </nav>
          </div>

          {/* Center: Global Search */}
          <div className="hidden md:flex justify-center max-w-md w-full mx-4">
            <div className="relative w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-16 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-on-surface placeholder:text-on-surface-variant/50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-50">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-outline-variant rounded bg-surface-container-high">Ctrl</kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-outline-variant rounded bg-surface-container-high">K</kbd>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 flex-1 justify-end shrink-0">
            <Link to="/notifications" className="relative p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-white rounded-lg transition-colors scale-95 duration-150 block">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-surface animate-pulse"></span>
              )}
            </Link>
            <button className="hidden sm:block p-2 text-on-surface-variant hover:bg-surface-container-low hover:text-white rounded-lg transition-colors scale-95 duration-150">
              <span className="material-symbols-outlined text-[20px]">help_outline</span>
            </button>
            
            {/* Quick Profile Toggle */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-8 h-8 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 ring-primary/20 transition-all focus:outline-none ml-2"
              >
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </button>

              {isProfileMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                    <div className="px-4 py-3 border-b border-outline-variant/50">
                      <div className="text-sm font-medium text-white truncate">{user?.fullName || 'User'}</div>
                      <div className="text-xs text-on-surface-variant truncate">{user?.email || 'admin@example.com'}</div>
                    </div>
                    <Link to="/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface-container-high hover:text-white transition-colors" onClick={() => setIsProfileMenuOpen(false)}>
                      <span className="material-symbols-outlined text-[18px]">settings</span>
                      Account Settings
                    </Link>
                    <button 
                      onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-error hover:bg-error/10 text-left transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="p-4 lg:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
