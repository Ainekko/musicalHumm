/**
 * Authentication Types
 * ====================
 * Matches the backend API schemas.
 */

export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    is_active: boolean;
    created_at: string;
}

export interface LoginRequest {
    username: string;  // email (OAuth2 uses 'username' field)
    password: string;
}

export interface CreateUserRequest {
    email: string;
    password: string;
    role?: UserRole;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isInitialized: boolean;
    error: string | null;
}
