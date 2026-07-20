import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import useAuthStore from '../../store/authStore.js';
import { useGoogleLogin } from '@react-oauth/google';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, googleLogin, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await googleLogin(tokenResponse.access_token);
    },
    onError: () => {
      console.error('Google Login Failed');
    }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    return () => clearError();
  }, [isAuthenticated, navigate, clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    await login(email, password);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
        <p className="text-on-surface-variant text-base">Sign in to continue monitoring your projects.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
          {error}
        </div>
      )}

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

        <div className="space-y-1.5">
          <Input
            label="Password"
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

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" className="w-4 h-4 text-accent border-border bg-background rounded focus:ring-offset-background" />
            <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-accent hover:text-primary transition-colors font-medium">Forgot Password?</Link>
        </div>

        <Button type="submit" variant="primary" className="w-full py-3.5 h-auto text-base mt-6" isLoading={isLoading}>
          <span>Sign In</span>
          <span className="material-symbols-outlined text-[20px] ml-2">arrow_forward</span>
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline-variant/50"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-4 text-outline font-mono uppercase tracking-widest">OR</span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <button 
          onClick={() => handleGoogleLogin()}
          type="button"
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-3 bg-surface-container-low border border-outline-variant py-3 rounded-xl hover:bg-surface-container hover:border-outline transition-all text-sm font-medium text-white shadow-sm shadow-black/20 disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
          </svg>
          Google
        </button>
      </div>

      <div className="text-center text-sm text-on-surface-variant">
        Don't have an account? <Link to="/register" className="text-accent hover:text-primary font-medium transition-colors">Create Account</Link>
      </div>
    </div>
  );
}
