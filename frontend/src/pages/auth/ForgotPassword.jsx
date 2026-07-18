import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus({ loading: true, error: null, success: false });
    
    try {
      await authService.forgotPassword(email);
      setStatus({ loading: false, error: null, success: true });
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Something went wrong', 
        success: false 
      });
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-10 text-center lg:text-left">
        <Link to="/login" className="inline-flex items-center text-sm text-on-surface-variant hover:text-white transition-colors mb-6 group">
          <span className="material-symbols-outlined text-[18px] mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Login
        </Link>
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3 tracking-tight">Reset Password</h2>
        <p className="text-on-surface-variant text-base">Enter your email and we'll send you a reset link.</p>
      </div>

      {status.error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
          {status.error}
        </div>
      )}

      {status.success ? (
        <div className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-500 text-[24px]">mark_email_read</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Check your email</h3>
          <p className="text-on-surface-variant text-sm">
            We've sent a password reset link to <span className="text-white">{email}</span>. The link will expire in 10 minutes.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<span className="material-symbols-outlined text-[20px] pointer-events-none">mail</span>}
            required
          />

          <Button type="submit" variant="primary" className="w-full py-3.5 h-auto text-base mt-6" isLoading={status.loading}>
            <span>Send Reset Link</span>
            <span className="material-symbols-outlined text-[20px] ml-2">send</span>
          </Button>
        </form>
      )}
    </div>
  );
}
