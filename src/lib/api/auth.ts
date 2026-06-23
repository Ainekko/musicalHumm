/**
 * Authentication API Module
 * =========================
 * OAuth2 form-urlencoded login, same pattern as MHR.
 */

import { api } from './base';
import { config } from '../config';
import type { TokenResponse, User, CreateUserRequest } from '../types/auth.types';

// =============================================================================
// Token Storage
// =============================================================================

const TOKEN_KEY = 'chloe_auth_token';

export function getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * Login with email and password.
 * Uses form-urlencoded format for OAuth2 compatibility.
 */
export async function login(email: string, password: string): Promise<TokenResponse> {
    const url = `${config.apiUrl}/auth/login`;

    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    console.log('[AuthAPI] Logging in:', email);

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.detail || data.error || 'Login failed');
    }

    console.log('[AuthAPI] Login successful');
    return data as TokenResponse;
}

/**
 * Get the current authenticated user.
 */
export async function getMe(): Promise<User> {
    return api.get<User>('/auth/me');
}

/**
 * Create a new user (admin only).
 */
export async function createUser(request: CreateUserRequest): Promise<User> {
    return api.post<User>('/auth/register', request);
}

export const authApi = {
    login,
    getMe,
    createUser,
    getStoredToken,
    setStoredToken,
    clearStoredToken,
};
