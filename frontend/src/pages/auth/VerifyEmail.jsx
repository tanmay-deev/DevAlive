import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient.js';
import { Button } from '../../components/ui/Button.jsx';

export function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({ loading: true, error: null, success: false });

  useEffect(() => {
    const verify = async () => {
      try {
        await apiClient.get(`/auth/verify-email/${token}`);
        setStatus({ loading: false, error: null, success: true });
        setTimeout(() => navigate('/login'), 4000);
      } catch (error) {
        setStatus({ 
          loading: false, 
          error: error.response?.data?.message || 'Invalid or expired verification link.', 
          success: false 
        });
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3 tracking-tight">Email Verification</h2>
        <p className="text-on-surface-variant text-base">Please wait while we verify your email address.</p>
      </div>

      {status.loading && (
        <div className="flex flex-col items-center">
          <span className="material-symbols-outlined animate-spin text-[48px] text-primary mb-4">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Verifying...</p>
        </div>
      )}

      {status.error && (
        <div className="w-full">
          <div className="mb-6 p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-500 text-[24px]">error</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Verification Failed</h3>
            <p className="text-on-surface-variant text-sm mb-6">
              {status.error}
            </p>
            <Link to="/login">
               <Button variant="outline" className="w-full">Back to Login</Button>
            </Link>
          </div>
        </div>
      )}

      {status.success && (
        <div className="w-full">
          <div className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Email Verified!</h3>
            <p className="text-on-surface-variant text-sm">
              Your email has been successfully verified. Redirecting you to login...
            </p>
            <Link to="/login" className="inline-block mt-6">
              <Button variant="primary">Proceed to Login</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
