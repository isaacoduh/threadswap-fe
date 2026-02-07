'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '../api/auth';
import { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (payload: RegisterRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // hydrate from localstorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem('user')
            if(stored) setUser(JSON.parse(stored))
        } catch {}
        setIsLoading(false)
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const login = useCallback(async (credentials: LoginRequest) => {
        setIsLoading(true)
        setError(null)

        try {
            const res = await authApi.login(credentials)
            localStorage.setItem('access_token', res.token)
            localStorage.setItem('user', JSON.stringify(res.user))

            setUser(res.user)
            router.push('/')
        } catch (err: any) {
            setError(err.message || 'Login failed')
            throw err
        } finally {
            setIsLoading(false);
        }
    }, [router])

    const register = useCallback(async (payload: RegisterRequest) => {
        setIsLoading(true)
        setError(null);
        try {
            const res = await authApi.register(payload);
            localStorage.setItem('access_token', res.token);
            localStorage.setItem('user', JSON.stringify(res.user));
            setUser(res.user);
            router.push('/');
        } catch (err: any) {
            setError(err.message || 'Registration failed');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [router])


    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user')
        setUser(null)
        router.push('/login');
    },[router])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            error,
            login,
            register,
            logout,
            clearError
        }}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context) throw new Error('useAuth must be used within AuthProvider')
    return context;
}