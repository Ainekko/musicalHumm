/**
 * Authentication Store
 * ====================
 * Svelte store for managing authentication state.
 * Same pattern as MHR authStore.
 */

import { writable, derived, get } from 'svelte/store';
import type { User, AuthState } from '../types/auth.types';
import {
    authApi,
    getStoredToken,
    setStoredToken,
    clearStoredToken
} from '../api/auth';

// =============================================================================
// Initial State
// =============================================================================

const initialState: AuthState = {
    user: null,
    token: null,
    isLoading: false,
    isInitialized: false,
    error: null,
};

// =============================================================================
// Store
// =============================================================================

function createAuthStore() {
    const { subscribe, set, update } = writable<AuthState>(initialState);

    return {
        subscribe,

        /**
         * Initialize from stored token on app startup.
         */
        async initialize(): Promise<void> {
            const token = getStoredToken();

            if (!token) {
                update(state => ({
                    ...state,
                    isInitialized: true,
                }));
                return;
            }

            update(state => ({
                ...state,
                token,
                isLoading: true,
            }));

            try {
                const user = await authApi.getMe();

                update(state => ({
                    ...state,
                    user,
                    isLoading: false,
                    isInitialized: true,
                    error: null,
                }));

                console.log('[AuthStore] Session restored for:', user.email);
            } catch (error) {
                clearStoredToken();

                update(state => ({
                    ...state,
                    user: null,
                    token: null,
                    isLoading: false,
                    isInitialized: true,
                    error: null,
                }));

                console.log('[AuthStore] Session expired, cleared token');
            }
        },

        /**
         * Login with email and password.
         */
        async login(email: string, password: string): Promise<boolean> {
            update(state => ({
                ...state,
                isLoading: true,
                error: null,
            }));

            try {
                const tokenResponse = await authApi.login(email, password);
                const token = tokenResponse.access_token;

                setStoredToken(token);

                const user = await authApi.getMe();

                update(state => ({
                    ...state,
                    user,
                    token,
                    isLoading: false,
                    isInitialized: true,
                    error: null,
                }));

                console.log('[AuthStore] Logged in as:', user.email);
                return true;
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Login failed';

                update(state => ({
                    ...state,
                    isLoading: false,
                    error: message,
                }));

                console.error('[AuthStore] Login failed:', message);
                return false;
            }
        },

        /**
         * Logout the current user.
         */
        logout(): void {
            clearStoredToken();

            set({
                ...initialState,
                isInitialized: true,
            });

            console.log('[AuthStore] Logged out');
        },

        /**
         * Clear any error message.
         */
        clearError(): void {
            update(state => ({
                ...state,
                error: null,
            }));
        },
    };
}

// =============================================================================
// Exports
// =============================================================================

export const authStore = createAuthStore();

export const isAuthenticated = derived(
    authStore,
    $auth => $auth.user !== null && $auth.token !== null
);

export const isAuthInitialized = derived(
    authStore,
    $auth => $auth.isInitialized
);

export const isAuthLoading = derived(
    authStore,
    $auth => $auth.isLoading
);

export const authError = derived(
    authStore,
    $auth => $auth.error
);

export const currentUser = derived(
    authStore,
    $auth => $auth.user
);

export function checkAuth(): boolean {
    const state = get(authStore);
    return state.user !== null && state.token !== null;
}
