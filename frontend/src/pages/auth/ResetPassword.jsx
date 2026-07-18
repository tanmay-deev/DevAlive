import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';

export function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ loading: false, error: null, success: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;
    
    if (password !== confirmPassword) {
      setStatus({ loading: false, error: "Passwords do not match", success: false });
      return;
    }

    if (password.length < 8) {
      setStatus({ loading: false, error: "Password must be at least 8 characters", success: false });
      return;
    }
    
    setStatus({ loading: true, error: null, success: false });
    
    try {
      await authService.resetPassword(token, password);
      setStatus({ loading: false, error: null, success: true });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setStatus({ 
        loading: false, 
        error: error.response?.data?.message || 'Invalid or expired reset token', 
        success: false 
      });
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3 tracking-tight">Set New Password</h2>
        <p className="text-on-surface-variant text-base">Enter your new password below.</p>
      </div>

      {status.error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
          {status.error}
        </div>
      )}

      {status.success ? (
        <div className="mb-6 p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-green-500 text-[24px]">check_circle</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Password Reset Successful</h3>
          <p className="text-on-surface-variant text-sm">
            You can now sign in with your new password. Redirecting to login...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <Input
              label="New Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              icon={
                <button 
                  type="button" 
                  className="hover:text-white transition-colors flex items-center justify-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              }
            />
          </div>

          <div className="space-y-1.5">
            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              icon={
                <span className="material-symbols-outlined text-[20px] pointer-events-none">lock</span>
              }
            />
          </div>

          <Button type="submit" variant="primary" className="w-full py-3.5 h-auto text-base mt-6" isLoading={status.loading}>
            <span>Reset Password</span>
            <span className="material-symbols-outlined text-[20px] ml-2">check</span>
          </Button>
        </form>
      )}
    </div>
  );
}
