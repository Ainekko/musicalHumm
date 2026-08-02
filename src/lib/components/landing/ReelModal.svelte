<script lang="ts">
  export let activeReelId: string | null;
  export let closeReel: () => void;
</script>

{#if activeReelId}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    on:click={closeReel}
  >
    <div 
      class="relative w-full max-w-lg bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 p-2 flex flex-col items-center"
      on:click|stopPropagation
    >
      <div class="w-full flex justify-between items-center p-3 text-white border-b border-zinc-800 mb-2">
        <span class="text-xs font-black text-zinc-300">@bord_prodagency Reel Player</span>
        <button 
          on:click={closeReel}
          class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div class="w-full aspect-[9/16] bg-black rounded-2xl overflow-hidden relative">
        <iframe 
          src="https://www.instagram.com/p/{activeReelId}/embed" 
          title="Instagram Reel Player"
          class="w-full h-full border-0" 
          frameborder="0" 
          scrolling="no" 
          allowtransparency={true}
          allow="encrypted-media"
        ></iframe>
      </div>

      <div class="w-full p-3 flex justify-between items-center gap-3">
        <a 
          href="https://www.instagram.com/p/{activeReelId}/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#ff007f] to-[#7928ca] text-white text-xs font-black shadow-md hover:opacity-90 transition-opacity"
        >
          Ouvrir sur Instagram ↗
        </a>
      </div>
    </div>
  </div>
{/if}
