/**
 * Base API Client
 * ================
 * Reusable HTTP client for making API requests.
 * Same pattern as MHR front project.
 */

import { config } from '../config';

// =============================================================================
// Types
// =============================================================================

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
    params?: Record<string, string | number | boolean>;
}

export interface ApiErrorResponse {
    success: boolean;
    error: string;
    error_code?: string;
    detail?: string;
}

// =============================================================================
// API Client Class
// =============================================================================

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
        const url = `${this.baseUrl}${endpoint}`;

        if (!params || Object.keys(params).length === 0) {
            return url;
        }

        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            searchParams.append(key, String(value));
        }

        return `${url}?${searchParams.toString()}`;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit & { params?: Record<string, string | number | boolean> } = {}
    ): Promise<T> {
        const { params, ...fetchOptions } = options;
        const url = this.buildUrl(endpoint, params);

        // Get auth token from localStorage
        const token = typeof window !== 'undefined'
            ? localStorage.getItem('chloe_auth_token')
            : null;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...fetchOptions.headers,
        };

        console.log(`[ApiClient] ${fetchOptions.method || 'GET'} ${url}`);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                headers
            });

            let data: any;
            try {
                data = await response.json();
            } catch {
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.statusText}`);
                }
                return {} as T;
            }

            if (!response.ok) {
                const errorMessage =
                    data.detail?.error ||
                    data.detail ||
                    data.error ||
                    data.message ||
                    `Request failed with status ${response.status}`;

                console.error(`[ApiClient] Error response:`, data);
                const error = new Error(errorMessage) as any;
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data as T;
        } catch (error) {
            if (error instanceof TypeError) {
                console.error('[ApiClient] Network error:', error);
                throw new Error('Unable to connect to the server. Please check your connection.');
            }
            throw error;
        }
    }

    get<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, options: ApiRequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any, options: ApiRequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    patch<T>(endpoint: string, body: any, options: ApiRequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }
}

// =============================================================================
// Exported Instance
// =============================================================================

export const api = new ApiClient(config.apiUrl);
