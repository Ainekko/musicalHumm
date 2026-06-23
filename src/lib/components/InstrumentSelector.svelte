<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let instruments: any[] = [];
  export let selectedInstrumentId = '';
  export let samplerLoading = false;

  const dispatch = createEventDispatcher();

  function selectInstrument(id: string) {
    dispatch('select', { id });
  }
</script>

<div class="space-y-8 animate-fade-in w-full">
  <div class="text-center space-y-3">
    <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
      Choose Your Instrument Pack
    </h1>
    <p class="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
      Select the target instrument pack. Humming will be transcribed to notes played by this instrument.
    </p>
  </div>

  <div class="grid grid-cols-1 gap-6 max-w-md mx-auto">
    {#each instruments as inst}
      <button
        on:click={() => selectInstrument(inst.id)}
        disabled={samplerLoading}
        class="group relative flex flex-col text-left p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-rose-500/40 transition-all duration-300 backdrop-blur-md overflow-hidden hover:scale-[1.01] {inst.glow} disabled:opacity-75 disabled:pointer-events-none"
      >
        <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl {inst.accent} opacity-5 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
        
        <div class="flex items-start gap-4">
          <div class="p-3 rounded-xl bg-zinc-800/80 group-hover:bg-zinc-800 transition-colors border border-zinc-700/30">
            {@html inst.icon}
          </div>
          <div>
            <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
              {inst.name}
            </h3>
            <p class="text-xs text-zinc-500 mt-0.5">
              {inst.author}
            </p>
          </div>
        </div>

        <p class="text-sm text-zinc-400 mt-4 leading-relaxed">
          {inst.desc}
        </p>

        <div class="mt-6 flex items-center justify-between w-full border-t border-zinc-800/60 pt-4 text-xs font-semibold">
          {#if samplerLoading && selectedInstrumentId === inst.id}
            <span class="flex items-center gap-2 text-rose-400 glow-text-rose">
              <svg class="animate-spin h-4.5 w-4.5 text-rose-500" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading High-Quality Samples...
            </span>
          {:else}
            <span class="text-zinc-500 group-hover:text-zinc-300 transition-colors">
              Click to load pack
            </span>
            <svg class="w-4 h-4 text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
