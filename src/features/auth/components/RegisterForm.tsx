'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';

export function RegisterForm() {
  const { register, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const validate = (): boolean => {
    if (password.length < 8) {
      setFieldError('Password must be at least 8 characters');
      return false;
    }
    if (password !== passwordConfirm) {
      setFieldError('Passwords do not match');
      return false;
    }
    setFieldError(null);
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register({ email, password });
    } catch {}
  };

  const inputClass =
    'block w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => { setEmail(e.target.value); clearError(); }}
          className={inputClass}
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setFieldError(null); clearError(); }}
            className={`${inputClass} pr-10`}
            placeholder="Min. 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1.5">
          Confirm password
        </label>
        <input
          id="passwordConfirm"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={passwordConfirm}
          onChange={(e) => { setPasswordConfirm(e.target.value); setFieldError(null); clearError(); }}
          className={inputClass}
          placeholder="Re-enter your password"
        />
        {fieldError && (
          <p className="mt-1 text-xs text-red-600">{fieldError}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !email || !password || !passwordConfirm}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
      >
        {isLoading ? 'Creating account...' : 'Create account'}
      </button>

      <p className="text-center text-xs text-gray-400">
        By creating an account, you agree to our{' '}
        <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
        {' '}and{' '}
        <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
      </p>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-gray-900 hover:underline">Sign in</Link>
      </p>
    </form>
  );
}