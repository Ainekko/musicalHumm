<script lang="ts">
  export let activeS3ModalVideo: { title: string; clientName: string; category: string; url: string; badgeBg: string; igHandle?: string } | null;
  export let closeS3VideoModal: () => void;
  export let scrollToForm: () => void;
</script>

{#if activeS3ModalVideo}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
    on:click={closeS3VideoModal}
  >
    <div 
      class="relative w-full max-w-3xl bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 p-4 flex flex-col items-center"
      on:click|stopPropagation
    >
      <!-- Modal Header Bar -->
      <div class="w-full flex justify-between items-center p-3 text-white border-b border-zinc-800/80 mb-3">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-gradient-to-r {activeS3ModalVideo.badgeBg}">
            {activeS3ModalVideo.clientName}
          </span>
          <span class="text-xs font-black text-zinc-300">{activeS3ModalVideo.title}</span>
        </div>

        <button 
          on:click={closeS3VideoModal}
          class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      <!-- High Definition Video Player -->
      <div class="w-full max-h-[70vh] aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center">
        <video 
          src={activeS3ModalVideo.url} 
          controls 
          autoplay 
          playsinline
          class="w-full h-full object-contain rounded-2xl"
        ></video>
      </div>

      <!-- Modal Footer Actions -->
      <div class="w-full p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div class="text-left flex flex-col items-start gap-1">
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">{activeS3ModalVideo.category}</span>
          <h4 class="text-sm font-black text-white">{activeS3ModalVideo.title}</h4>
          {#if activeS3ModalVideo.igHandle}
            <a 
              href="https://instagram.com/{activeS3ModalVideo.igHandle}"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white font-bold bg-white/5 hover:bg-white/10 px-2.5 py-0.5 rounded-full border border-white/5 transition-all duration-300 mt-1 shadow-sm"
            >
              <svg class="w-2.5 h-2.5 fill-current text-white/90" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
              <span>@{activeS3ModalVideo.igHandle}</span>
            </a>
          {/if}
        </div>

        <button 
          on:click={() => { closeS3VideoModal(); scrollToForm(); }}
          class="px-6 py-3 rounded-xl bg-[#00abbd] hover:bg-[#0092a1] text-white text-xs font-black shadow-lg transition-all cursor-pointer shrink-0"
        >
          Demander un projet similaire ➔
        </button>
      </div>
    </div>
  </div>
{/if}
