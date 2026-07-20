import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/marketing/Navbar.jsx';
import { Footer } from '../components/marketing/Footer.jsx';

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-background text-white flex flex-col font-sans selection:bg-accent/30 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
