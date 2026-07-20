import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MarketingLayout } from '../layouts/MarketingLayout.jsx';
import { AuthLayout } from '../layouts/AuthLayout.jsx';
import { DashboardLayout } from '../layouts/DashboardLayout.jsx';

// Pages
import { Landing } from '../pages/public/Landing.jsx';
import { Docs } from '../pages/public/Docs.jsx';
import { Terms } from '../pages/public/Terms.jsx';
import { Privacy } from '../pages/public/Privacy.jsx';
import { Login } from '../pages/auth/Login.jsx';
import { Register } from '../pages/auth/Register.jsx';
import { ForgotPassword } from '../pages/auth/ForgotPassword.jsx';
import { ResetPassword } from '../pages/auth/ResetPassword.jsx';
import { VerifyEmail } from '../pages/auth/VerifyEmail.jsx';
import { Dashboard } from '../pages/dashboard/Dashboard.jsx';
import { Projects } from '../pages/projects/Projects.jsx';
import { Analytics } from '../pages/analytics/Analytics.jsx';
import { MonitoringLogs } from '../pages/logs/MonitoringLogs.jsx';
import { Notifications } from '../pages/notifications/Notifications.jsx';
import { Settings } from '../pages/settings/Settings.jsx';

// Auth Guards
import { ProtectedRoute } from '../components/auth/ProtectedRoute.jsx';
import { PublicRoute } from '../components/auth/PublicRoute.jsx';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Marketing Routes */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/features" element={<Landing />} />
        <Route path="/how-it-works" element={<Landing />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/pricing" element={<Landing />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/logs" element={<MonitoringLogs />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
