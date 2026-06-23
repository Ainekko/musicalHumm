<script lang="ts">
  /**
   * Login Page
   * ==========
   * Centered login card with Robin branding. testing
   */

  import { goto } from '$app/navigation';
  import {
    authStore,
    isAuthenticated,
    isAuthInitialized,
    isAuthLoading,
    authError
  } from '$lib/stores';
  import Card from '$lib/components/ui/Card.svelte';
  import Input from '$lib/components/ui/Input.svelte';
  import Button from '$lib/components/ui/Button.svelte';

  let email = '';
  let password = '';

  // Redirect if already authenticated
  $: if ($isAuthInitialized && $isAuthenticated) {
    goto('/dashboard');
  }

  async function handleSubmit() {
    if (!email || !password) return;
    const success = await authStore.login(email, password);
    if (success) {
      goto('/dashboard');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<svelte:head>
  <title>Login | Chloe</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
  <div class="w-full max-w-sm">
    <!-- Logo -->
    <div class="flex items-center justify-center gap-3 mb-8">
      <div
        class="w-11 h-11 bg-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-600/20"
      >
        <svg
          class="w-6 h-6 text-white"
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
      <div>
        <h1 class="text-xl font-bold text-zinc-900 tracking-tight">Chloe</h1>
        <p class="text-xs text-zinc-500">AI Receptionist</p>
      </div>
    </div>

    <!-- Login Card -->
    <Card>
      <form on:submit|preventDefault={handleSubmit} class="space-y-5">
        <div>
          <h2 class="text-lg font-semibold text-zinc-900">Sign in</h2>
          <p class="text-sm text-zinc-500 mt-1">Enter your credentials to continue</p>
        </div>

        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          bind:value={email}
          on:keydown={handleKeydown}
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          bind:value={password}
          on:keydown={handleKeydown}
        />

        {#if $authError}
          <p class="text-sm text-red-500">{$authError}</p>
        {/if}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={$isAuthLoading}
          disabled={!email || !password}
        >
          Sign In
        </Button>
      </form>
    </Card>
  </div>
</div>
