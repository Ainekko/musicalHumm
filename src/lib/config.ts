/**
 * Application Configuration
 * =========================
 * Central configuration for API endpoints.
 *
 * Environment Variables:
 * - VITE_API_BASE_URL: Base URL for the REST API
 */

export const config = {
    /**
     * Base URL for the REST API (without version prefix)
     */
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',

    /**
     * API version prefix
     */
    apiVersion: '/api/v1',

    /**
     * Full API URL with version prefix
     */
    get apiUrl(): string {
        return `${this.apiBaseUrl}${this.apiVersion}`;
    },
};
