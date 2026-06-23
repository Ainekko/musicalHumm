<script lang="ts">
  /**
   * Input Component
   * ================
   * Styled text input with label and error support.
   */
  export let type: string = 'text';
  export let label: string = '';
  export let placeholder: string = '';
  export let value: string = '';
  export let error: string = '';
  export let id: string = '';
</script>

<div class="w-full">
  {#if label}
    <label for={id} class="block text-sm font-medium text-zinc-700 mb-1.5">{label}</label>
  {/if}
  {#if type === 'password'}
    <input
      {id}
      type="password"
      {placeholder}
      bind:value
      class="
        w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900
        placeholder:text-zinc-400
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
        {error ? 'border-red-400 ring-1 ring-red-500/20' : 'border-zinc-300'}
      "
      on:input
      on:keydown
    />
  {:else if type === 'email'}
    <input
      {id}
      type="email"
      {placeholder}
      bind:value
      class="
        w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900
        placeholder:text-zinc-400
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
        {error ? 'border-red-400 ring-1 ring-red-500/20' : 'border-zinc-300'}
      "
      on:input
      on:keydown
    />
  {:else}
    <input
      {id}
      type="text"
      {placeholder}
      bind:value
      class="
        w-full bg-white border rounded-lg px-3.5 py-2.5 text-sm text-zinc-900
        placeholder:text-zinc-400
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
        {error ? 'border-red-400 ring-1 ring-red-500/20' : 'border-zinc-300'}
      "
      on:input
      on:keydown
    />
  {/if}
  {#if error}
    <p class="mt-1.5 text-sm text-red-500">{error}</p>
  {/if}
</div>
