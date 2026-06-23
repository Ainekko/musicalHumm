<script lang="ts">
  /**
   * Dashboard Page
   * ==============
   * Main dashboard with agent health, test call, and recent calls.
   * Displays AI-parsed caller data, email tracking, and appointment info.
   * Integrates Retell Web SDK for live browser voice calls.
   */
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, isAuthenticated, isAuthInitialized, currentUser } from '$lib/stores';
  import { chloeApi } from '$lib/api/chloe';
  import type { ChloeCall, AgentHealth } from '$lib/api/chloe';
  import Card from '$lib/components/ui/Card.svelte';
  import Button from '$lib/components/ui/Button.svelte';
  import Badge from '$lib/components/ui/Badge.svelte';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import { RetellWebClient } from 'retell-client-js-sdk';

  // Auth guard
  $: if ($isAuthInitialized && !$isAuthenticated) {
    goto('/login');
  }

  // ─── Retell Web SDK ─────────────────────────────────────────────────────────
  const retellClient = new RetellWebClient();

  // State
  let agentHealth: AgentHealth | null = null;
  let recentCalls: ChloeCall[] = [];
  let loadingCalls = true;
  let loadingHealth = true;
  let callStatus: 'idle' | 'connecting' | 'active' | 'ended' | 'error' = 'idle';
  let callError = '';
  let expandedCallId: string | null = null;

  // Live call state
  let isMuted = false;
  let isAgentSpeaking = false;
  let liveTranscript = '';
  let activeCallId = '';

  onMount(async () => {
    // ── Register Retell SDK event listeners ──────────────────────────────────
    retellClient.on('call_started', () => {
      console.log('[Dashboard] Retell call_started');
      callStatus = 'active';
    });

    retellClient.on('call_ended', () => {
      console.log('[Dashboard] Retell call_ended');
      callStatus = 'ended';
      isAgentSpeaking = false;
      isMuted = false;
      liveTranscript = '';
      activeCallId = '';
    });

    retellClient.on('call_ready', () => {
      console.log('[Dashboard] Retell call_ready — agent audio track ready');
    });

    retellClient.on('agent_start_talking', () => {
      isAgentSpeaking = true;
    });

    retellClient.on('agent_stop_talking', () => {
      isAgentSpeaking = false;
    });

    retellClient.on('update', (event: any) => {
      // event.transcript is an array of { role, content } objects
      if (event?.transcript) {
        try {
          const entries = event.transcript as Array<{ role: string; content: string }>;
          if (entries.length > 0) {
            const last = entries[entries.length - 1];
            const speaker = last.role === 'agent' ? 'Chloe' : 'You';
            liveTranscript = `${speaker}: ${last.content}`;
          }
        } catch {
          // ignore parse errors
        }
      }
    });

    retellClient.on('error', (err: any) => {
      console.error('[Dashboard] Retell error:', err);
      callStatus = 'error';
      callError = typeof err === 'string' ? err : 'Call error occurred';
      retellClient.stopCall();
    });

    // ── Load dashboard data ──────────────────────────────────────────────────
    try {
      agentHealth = await chloeApi.getAgentHealth();
    } catch (e) {
      agentHealth = { status: 'unknown', agent_name: 'Chloe', agent_id: '', last_call_at: null };
    }
    loadingHealth = false;

    try {
      recentCalls = await chloeApi.listCalls(10, 0);
    } catch (e) {
      recentCalls = [];
    }
    loadingCalls = false;
  });

  // Cleanup on component destroy
  onDestroy(() => {
    if (callStatus === 'active' || callStatus === 'connecting') {
      retellClient.stopCall();
    }
  });

  async function startTestCall() {
    callStatus = 'connecting';
    callError = '';
    isMuted = false;
    isAgentSpeaking = false;
    liveTranscript = '';

    try {
      // 1. Get access token from backend
      const response = await chloeApi.createWebCall();
      activeCallId = response.call_id;
      console.log('[Dashboard] Web call created:', response.call_id);

      // 2. Connect browser audio via Retell SDK
      await retellClient.startCall({
        accessToken: response.access_token
      });
      // callStatus will be set to 'active' by the call_started event
    } catch (e) {
      callStatus = 'error';
      callError = e instanceof Error ? e.message : 'Failed to start call';
    }
  }

  function endTestCall() {
    retellClient.stopCall();
    // callStatus will be set to 'ended' by the call_ended event
  }

  function toggleMute() {
    if (isMuted) {
      retellClient.unmute();
    } else {
      retellClient.mute();
    }
    isMuted = !isMuted;
  }

  function handleLogout() {
    authStore.logout();
    goto('/login');
  }

  function toggleCallDetail(callId: string) {
    expandedCallId = expandedCallId === callId ? null : callId;
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  function formatDuration(ms: number | null): string {
    if (!ms) return '--';
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  function formatFullDate(dateStr: string | null | undefined): string {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  function getSentimentVariant(
    sentiment: string | null
  ): 'success' | 'warning' | 'error' | 'neutral' {
    if (!sentiment) return 'neutral';
    const s = sentiment.toLowerCase();
    if (s === 'positive') return 'success';
    if (s === 'negative') return 'error';
    return 'neutral';
  }

  /** Display name: from_number > fallback */
  function getCallerDisplay(call: ChloeCall): { name: string; sub: string | null } {
    return { name: call.from_number || 'Unknown', sub: null };
  }

  const callStatusLabels: Record<string, { text: string; class: string }> = {
    idle: { text: 'Ready', class: 'text-zinc-500' },
    connecting: { text: 'Connecting...', class: 'text-amber-600' },
    active: { text: 'Call Active', class: 'text-emerald-600' },
    ended: { text: 'Call Ended', class: 'text-zinc-500' },
    error: { text: 'Error', class: 'text-red-500' }
  };
</script>

<svelte:head>
  <title>Dashboard | Chloe</title>
</svelte:head>

{#if !$isAuthInitialized}
  <div class="min-h-screen flex items-center justify-center">
    <Spinner size="lg" />
  </div>
{:else}
  <!-- Top Bar -->
  <header class="sticky top-0 z-50 bg-white border-b border-zinc-200">
    <div class="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <svg
            class="w-4.5 h-4.5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        </div>
        <span class="text-base font-semibold text-zinc-900">Chloe</span>
      </div>
      <div class="flex items-center gap-4">
        {#if $currentUser}
          <span class="text-sm text-zinc-500">{$currentUser.email}</span>
        {/if}
        <Button variant="ghost" size="sm" on:click={handleLogout}>Logout</Button>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-6xl mx-auto px-6 py-6">
    <!-- Top Cards Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Agent Health -->
      <Card>
        <div class="flex items-start justify-between mb-4">
          <div>
            <h3 class="text-sm font-medium text-zinc-500 mb-1">Agent Health</h3>
            {#if loadingHealth}
              <Spinner size="sm" />
            {/if}
          </div>
          {#if false && agentHealth}
            <Badge
              variant={agentHealth.status === 'online'
                ? 'success'
                : agentHealth.status === 'offline'
                  ? 'error'
                  : 'neutral'}
              dot={true}
            >
              {agentHealth.status === 'online'
                ? 'Online'
                : agentHealth.status === 'offline'
                  ? 'Offline'
                  : 'Unknown'}
            </Badge>
          {/if}
        </div>
        {#if agentHealth}
          <div class="pt-4 border-t border-zinc-100">
            <div>
              <p class="text-xs text-zinc-400 mb-0.5">Agent ID</p>
              <p class="text-sm text-zinc-600 font-mono truncate">{agentHealth.agent_id || '--'}</p>
            </div>
          </div>
        {/if}
      </Card>

      <!-- Test Call -->
      <Card>
        <h3 class="text-sm font-medium text-zinc-500 mb-1">Test Call</h3>
        <p class="text-sm text-zinc-600 mb-5">Start a test call to hear Chloe in action.</p>

        <!-- Call controls row -->
        <div class="flex items-center gap-4">
          {#if callStatus === 'active'}
            <Button variant="danger" on:click={endTestCall}>
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              End Call
            </Button>

            <!-- Mute / Unmute -->
            <button
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                {isMuted
                ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                : 'bg-zinc-100 text-zinc-600 border border-zinc-200 hover:bg-zinc-200'}"
              on:click={toggleMute}
            >
              {#if isMuted}
                <!-- Mic off icon -->
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <line x1="1" y1="1" x2="23" y2="23" />
                  <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" />
                  <path d="M17 16.95A7 7 0 015 12" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                Muted
              {:else}
                <!-- Mic on icon -->
                <svg
                  class="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
                Mic On
              {/if}
            </button>
          {:else}
            <Button
              variant="primary"
              loading={callStatus === 'connecting'}
              disabled={callStatus === 'connecting'}
              on:click={startTestCall}
            >
              <svg
                class="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Start Test Call
            </Button>
          {/if}

          <!-- Status with pulse dot -->
          <div class="flex items-center gap-2">
            {#if callStatus === 'active'}
              <span class="relative flex h-2.5 w-2.5">
                <span
                  class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                ></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            {/if}
            <span class="text-sm font-medium {callStatusLabels[callStatus].class}">
              {callStatusLabels[callStatus].text}
            </span>
          </div>
        </div>

        <!-- Active call info panel -->
        {#if callStatus === 'active'}
          <div class="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/60 p-4 space-y-3">
            <!-- Agent speaking indicator -->
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1.5">
                {#if isAgentSpeaking}
                  <span class="flex gap-0.5 items-end h-4">
                    <span
                      class="w-1 bg-brand-500 rounded-full animate-pulse"
                      style="height: 8px; animation-delay: 0ms;"
                    ></span>
                    <span
                      class="w-1 bg-brand-500 rounded-full animate-pulse"
                      style="height: 14px; animation-delay: 150ms;"
                    ></span>
                    <span
                      class="w-1 bg-brand-500 rounded-full animate-pulse"
                      style="height: 10px; animation-delay: 300ms;"
                    ></span>
                    <span
                      class="w-1 bg-brand-400 rounded-full animate-pulse"
                      style="height: 16px; animation-delay: 100ms;"
                    ></span>
                    <span
                      class="w-1 bg-brand-400 rounded-full animate-pulse"
                      style="height: 6px; animation-delay: 250ms;"
                    ></span>
                  </span>
                  <span class="text-sm font-medium text-brand-600">Chloe is speaking</span>
                {:else}
                  <span class="flex gap-0.5 items-end h-4">
                    <span class="w-1 bg-zinc-300 rounded-full" style="height: 4px;"></span>
                    <span class="w-1 bg-zinc-300 rounded-full" style="height: 4px;"></span>
                    <span class="w-1 bg-zinc-300 rounded-full" style="height: 4px;"></span>
                    <span class="w-1 bg-zinc-300 rounded-full" style="height: 4px;"></span>
                    <span class="w-1 bg-zinc-300 rounded-full" style="height: 4px;"></span>
                  </span>
                  <span class="text-sm text-zinc-400">Chloe is listening</span>
                {/if}
              </div>
            </div>

            <!-- Live transcript -->
            {#if liveTranscript}
              <div class="border-t border-zinc-200 pt-3">
                <p class="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  Live Transcript
                </p>
                <p class="text-sm text-zinc-600 italic truncate">{liveTranscript}</p>
              </div>
            {/if}
          </div>
        {/if}

        {#if callError}
          <p class="mt-3 text-sm text-red-500">{callError}</p>
        {/if}
      </Card>
    </div>

    <!-- ═══════════════════════ Records Table ═══════════════════════ -->
    <Card padding="p-0">
      <div class="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
        <h3 class="text-sm font-medium text-zinc-500">Records</h3>
        <span class="text-xs text-zinc-400">{recentCalls.length} records</span>
      </div>

      {#if loadingCalls}
        <div class="flex items-center justify-center py-12">
          <Spinner />
        </div>
      {:else if recentCalls.length === 0}
        <div class="text-center py-12 text-sm text-zinc-400">
          <svg
            class="w-10 h-10 mx-auto mb-3 text-zinc-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          No calls yet. Start a test call above!
        </div>
      {:else}
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                <th class="px-6 py-3 w-5"></th>
                <th class="px-6 py-3">Caller</th>
                <th class="px-6 py-3">Summary</th>
                <th class="px-6 py-3">Duration</th>
                <th class="px-6 py-3">Sentiment</th>
                <th class="px-6 py-3">Source</th>
                <th class="px-6 py-3">Status</th>
                <th class="px-6 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {#each recentCalls as call (call.call_id)}
                {@const caller = getCallerDisplay(call)}
                {@const isExpanded = expandedCallId === call.call_id}

                <!-- Main row -->
                <tr
                  class="border-t border-zinc-100 hover:bg-zinc-50/80 transition-colors cursor-pointer group"
                  on:click={() => toggleCallDetail(call.call_id)}
                >
                  <!-- Expand chevron -->
                  <td class="pl-5 pr-0 py-3.5">
                    <svg
                      class="w-4 h-4 text-zinc-400 transition-transform duration-200 {isExpanded
                        ? 'rotate-90'
                        : ''}"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </td>

                  <!-- Caller -->
                  <td class="px-6 py-3.5">
                    <span class="text-sm font-medium text-zinc-900">{caller.name}</span>
                  </td>

                  <!-- Summary -->
                  <td class="px-6 py-3.5 max-w-xs">
                    <p class="text-sm text-zinc-600 truncate" title={call.call_summary || ''}>
                      {call.call_summary || '--'}
                    </p>
                  </td>

                  <!-- Duration -->
                  <td class="px-6 py-3.5 text-sm text-zinc-600 font-mono">
                    {formatDuration(call.duration_ms)}
                  </td>

                  <!-- Sentiment -->
                  <td class="px-6 py-3.5">
                    <Badge variant={getSentimentVariant(call.user_sentiment)}>
                      {call.user_sentiment || '--'}
                    </Badge>
                  </td>

                  <!-- Source: Voice or Chat -->
                  <td class="px-6 py-3.5">
                    {#if call.source_type === 'voice'}
                      <Badge variant="info">
                        <svg
                          class="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 10v2a7 7 0 01-14 0v-2"
                          />
                        </svg>
                        Voice
                      </Badge>
                    {:else if call.source_type === 'chat'}
                      <Badge variant="warning">
                        <svg
                          class="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
                          />
                        </svg>
                        Chat
                      </Badge>
                    {:else}
                      <Badge variant="neutral">--</Badge>
                    {/if}
                  </td>

                  <!-- Status: lead outcome + AI processing state -->
                  <td class="px-6 py-3.5">
                    <div class="flex flex-col gap-1.5">
                      <Badge variant={call.call_successful ? 'success' : 'neutral'}>
                        {call.call_successful ? 'Lead' : call.call_status || '--'}
                      </Badge>
                      {#if call.ai_processing}
                        <Badge variant="warning" dot={true}>Processing</Badge>
                      {:else}
                        <Badge variant="success" dot={true}>Processed</Badge>
                      {/if}
                    </div>
                  </td>

                  <!-- Time -->
                  <td class="px-6 py-3.5 text-sm text-zinc-400 whitespace-nowrap">
                    {formatTime(call.created_at)}
                  </td>
                </tr>

                <!-- ── Expandable Detail Row ────────────────────────────── -->
                <tr>
                  <td colspan="8" class="p-0">
                    <div class="detail-panel {isExpanded ? 'open' : ''}">
                      <div>
                        <div class="px-6 py-5 bg-zinc-50/60 border-b border-zinc-100">
                          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <!-- Card 1: Caller Details -->
                            <div
                              class="bg-white rounded-lg border border-zinc-200/60 p-4 shadow-sm"
                            >
                              <h4
                                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3"
                              >
                                Caller Details
                              </h4>
                              <div class="space-y-2.5">
                                <div class="flex items-center gap-2">
                                  <!-- Phone icon -->
                                  <svg
                                    class="w-4 h-4 text-zinc-400 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                  >
                                    <path
                                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                                    />
                                  </svg>
                                  <span class="text-sm text-zinc-700 font-mono"
                                    >{call.from_number || '--'}</span
                                  >
                                </div>
                              </div>
                            </div>

                            <!-- Card 2: Call Info -->
                            <div
                              class="bg-white rounded-lg border border-zinc-200/60 p-4 shadow-sm"
                            >
                              <h4
                                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3"
                              >
                                Call Info
                              </h4>
                              <div class="space-y-2.5 text-sm">
                                <div class="flex justify-between">
                                  <span class="text-zinc-400">Direction</span>
                                  <span class="text-zinc-700 capitalize"
                                    >{call.direction || '--'}</span
                                  >
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-400">Type</span>
                                  <span class="text-zinc-700">{call.call_type || '--'}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-400">Disconnection</span>
                                  <span class="text-zinc-700"
                                    >{call.disconnection_reason || '--'}</span
                                  >
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-zinc-400">Call ID</span>
                                  <span
                                    class="text-zinc-500 font-mono text-xs truncate max-w-[140px]"
                                    title={call.call_id}>{call.call_id}</span
                                  >
                                </div>
                                {#if call.recording_url}
                                  <div class="pt-1">
                                    <a
                                      href={call.recording_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors"
                                    >
                                      <svg
                                        class="w-3.5 h-3.5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                      >
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                      </svg>
                                      Play Recording
                                    </a>
                                  </div>
                                {/if}
                              </div>
                            </div>

                            <!-- Card 3: Status & Tracking -->
                            <div
                              class="bg-white rounded-lg border border-zinc-200/60 p-4 shadow-sm"
                            >
                              <h4
                                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3"
                              >
                                Status & Tracking
                              </h4>
                              <div class="space-y-3 text-sm">
                                <!-- Created -->
                                <div class="flex items-start gap-2.5">
                                  <div
                                    class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-zinc-100"
                                  >
                                    <svg
                                      class="w-3.5 h-3.5 text-zinc-400"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      stroke-width="2"
                                    >
                                      <circle cx="12" cy="12" r="10" />
                                      <polyline points="12 6 12 12 16 14" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p class="font-medium text-zinc-700">Created</p>
                                    <p class="text-xs text-zinc-500 mt-0.5">
                                      {formatFullDate(call.created_at)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- AI Summary -->
                          {#if call.call_summary}
                            <div
                              class="mt-4 bg-white rounded-lg border border-zinc-200/60 p-4 shadow-sm"
                            >
                              <h4
                                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2"
                              >
                                AI Summary
                              </h4>
                              <p class="text-sm text-zinc-700 leading-relaxed">
                                {call.call_summary}
                              </p>
                            </div>
                          {/if}

                          <!-- Transcript -->
                          {#if call.transcript}
                            <div
                              class="mt-4 bg-white rounded-lg border border-zinc-200/60 p-4 shadow-sm"
                            >
                              <h4
                                class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2"
                              >
                                Transcript
                              </h4>
                              <div class="max-h-48 overflow-y-auto pr-2">
                                <p
                                  class="text-sm text-zinc-600 leading-relaxed whitespace-pre-line"
                                >
                                  {call.transcript}
                                </p>
                              </div>
                            </div>
                          {/if}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </Card>
  </main>
{/if}
