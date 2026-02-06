'use client'

import { useState, FormEvent } from 'react';
import Link from 'next/link';

export function RegisterForm() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        password_confirm: '',
    })

    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({})


    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}));
        setError(null)
        if(clientErrors[field]) {
            setClientErrors((prev) => {
                const next = {...prev}
                delete next[field]
                return next;
            });
        }
    }

    const validate = (): boolean => {
        const errors: Record<string, string> = {};
        if (formData.username.length < 3) {
            errors.username = 'Username must be at least 3 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            errors.username = 'Letters, numbers, and underscores only';
        }

        if (formData.password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
        }

        if (formData.password !== formData.password_confirm) {
            errors.password_confirm = 'Passwords do not match';
        }

        setClientErrors(errors);
        return Object.keys(errors).length === 0
    };

    const handleSubmit = async(e: FormEvent) => {
        e.preventDefault();
        if(!validate()) return;

        setIsLoading(true);
        setError(null);

        try {
        // TODO: Wire up to auth context/API
        console.log('Register:', formData);
        } catch {
        setError('Registration failed. Please try again.');
        } finally {
        setIsLoading(false);
        }

    }

    const fieldError = (field: string) => clientErrors[field];

    const inputClass = (field: string) =>
    `block w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
      fieldError(field)
        ? 'border-red-300 focus:ring-red-500'
        : 'border-gray-300 focus:ring-gray-900'
    }`;

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
                </div>
            )}
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    First name
                </label>
                <input
                    id="first_name"
                    type="text"
                    required
                    autoComplete="given-name"
                    autoFocus
                    value={formData.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    className={inputClass('first_name')}
                    placeholder="Isaac"
                />
                {fieldError('first_name') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('first_name')}</p>
                )}
                </div>
                <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last name
                </label>
                <input
                    id="last_name"
                    type="text"
                    required
                    autoComplete="family-name"
                    value={formData.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                    className={inputClass('last_name')}
                    placeholder="Doe"
                />
                {fieldError('last_name') && (
                    <p className="mt-1 text-xs text-red-600">{fieldError('last_name')}</p>
                )}
                </div>
            </div>

            {/* Username */}
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
                </label>
                <input
                id="username"
                type="text"
                required
                autoComplete="username"
                value={formData.username}
                onChange={(e) => updateField('username', e.target.value.toLowerCase())}
                className={inputClass('username')}
                placeholder="coolthreads"
                />
                {fieldError('username') && (
                <p className="mt-1 text-xs text-red-600">{fieldError('username')}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
                </label>
                <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className={inputClass('email')}
                placeholder="you@example.com"
                />
                {fieldError('email') && (
                <p className="mt-1 text-xs text-red-600">{fieldError('email')}</p>
                )}
            </div>

            {/* Password */}
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
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            className={inputClass('password')}
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
        {fieldError('password') && (
          <p className="mt-1 text-xs text-red-600">{fieldError('password')}</p>
        )}
      </div>

        {/* Confirm Password */}
        <div>
            <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
            </label>
            <input
            id="password_confirm"
            type={showPassword ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={formData.password_confirm}
            onChange={(e) => updateField('password_confirm', e.target.value)}
            className={inputClass('password_confirm')}
            placeholder="Re-enter your password"
            />
            {fieldError('password_confirm') && (
            <p className="mt-1 text-xs text-red-600">{fieldError('password_confirm')}</p>
            )}
        </div>

            {/* Submit */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
            >
                {isLoading ? 'Creating account...' : 'Create account'}
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-400">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
            </p>

            {/* Login link */}
            <p className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-gray-900 hover:underline">
                Sign in
                </Link>
            </p>
        </form>
    )
}