/**
 * Chloe API Module
 * =================
 * API functions for Retell.ai call data and web calls.
 */

import { api } from './base';

// =============================================================================
// Types
// =============================================================================

export interface ChloeCall {
    id: string;
    call_id: string;
    agent_id: string | null;
    // Source: 'voice' | 'chat' — which agent handled this record
    source_type: string | null;
    // AI parsing state: true = still processing transcript, false = done
    ai_processing: boolean;
    call_type: string | null;
    call_status?: string | null;
    from_number?: string | null;
    to_number?: string | null;
    direction?: string | null;
    start_timestamp?: number | null;
    end_timestamp?: number | null;
    duration_ms: number | null;
    transcript: string | null;
    call_summary: string | null;
    user_sentiment: string | null;
    call_successful: boolean | null;
    disconnection_reason: string | null;
    recording_url?: string | null;

    // Timestamps
    created_at: string;
    updated_at?: string | null;
}

export interface WebCallResponse {
    access_token: string;
    call_id: string;
}

export interface AgentHealth {
    status: 'online' | 'offline' | 'unknown';
    agent_name: string;
    agent_id: string;
    last_call_at?: string | null;
}

// =============================================================================
// API Functions
// =============================================================================

/**
 * List all recorded calls, newest first.
 */
export async function listCalls(limit = 50, offset = 0): Promise<ChloeCall[]> {
    return api.get<ChloeCall[]>('/chloe/calls', {
        params: { limit, offset }
    });
}

/**
 * Get a specific call by Retell call_id.
 */
export async function getCall(callId: string): Promise<ChloeCall> {
    return api.get<ChloeCall>(`/chloe/calls/${callId}`);
}

/**
 * Create a web call for testing via Retell SDK.
 */
export async function createWebCall(): Promise<WebCallResponse> {
    return api.post<WebCallResponse>('/chloe/web-call', {});
}

/**
 * Get agent health status.
 */
export async function getAgentHealth(): Promise<AgentHealth> {
    return api.get<AgentHealth>('/chloe-v1/agent/health');
}

/**
 * Create a chat session via backend proxy.
 */
export async function createChatSession(): Promise<{ chat_id: string }> {
    return api.post<{ chat_id: string }>('/chloe/chat-bot/create', {});
}

/**
 * Send a message to the chat session via backend proxy.
 */
export async function sendChatMessage(chatId: string, content: string): Promise<{ content: string; messages?: any[] }> {
    return api.post<{ content: string; messages?: any[] }>('/chloe/chat-bot/message', { chat_id: chatId, content });
}

export const chloeApi = {
    listCalls,
    getCall,
    createWebCall,
    getAgentHealth,
    createChatSession,
    sendChatMessage,
};
