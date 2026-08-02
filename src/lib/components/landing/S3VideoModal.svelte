<script lang="ts">
  export let activeS3ModalVideo: { title: string; clientName: string; category: string; url: string; badgeBg: string } | null;
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
        <div class="text-left">
          <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">{activeS3ModalVideo.category}</span>
          <h4 class="text-sm font-black text-white">{activeS3ModalVideo.title}</h4>
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
