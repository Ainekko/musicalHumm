<script lang="ts">
  import { onMount, onDestroy } from 'svelte';

  export let video: {
    id: string;
    url: string;
    clientName: string;
    title: string;
    category: string;
    badgeBg: string;
    igHandle?: string;
  };
  export let isActive = false;
  export let globalMuted = true;
  export let toggleMute: () => void;
  export let closeModal: () => void;
  export let scrollToForm: () => void;
  export let showScrollIndicator = true;

  let videoRef: HTMLVideoElement | null = null;
  let manuallyPaused = false;
  let isBuffering = false;

  // React to activation changes
  $: if (videoRef) {
    if (isActive) {
      videoRef.muted = globalMuted;
      if (!manuallyPaused) {
        videoRef.play().catch(() => {
          // Fallback if browser blocks autoplay
          globalMuted = true;
          if (videoRef) videoRef.muted = true;
        });
      }
    } else {
      videoRef.pause();
      videoRef.currentTime = 0;
      manuallyPaused = false;
    }
  }

  // React to global mute state changes
  $: if (videoRef && isActive) {
    videoRef.muted = globalMuted;
  }

  function handleVideoClick() {
    if (!videoRef) return;
    if (videoRef.paused) {
      videoRef.play().catch(() => {});
      manuallyPaused = false;
    } else {
      videoRef.pause();
      manuallyPaused = true;
    }
  }

  let isLandscape = false;

  function handleLoadedMetadata(event: Event) {
    const videoEl = event.currentTarget as HTMLVideoElement;
    if (videoEl) {
      isLandscape = videoEl.videoWidth > videoEl.videoHeight;
    }
  }

  function handleWaiting() {
    isBuffering = true;
  }

  function handlePlaying() {
    isBuffering = false;
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
  class="relative w-full h-full flex items-center justify-center bg-black overflow-hidden select-none"
  on:click={handleVideoClick}
>
  <!-- Video Tag -->
  <video
    bind:this={videoRef}
    src={video.url}
    loop
    playsinline
    preload="metadata"
    on:waiting={handleWaiting}
    on:playing={handlePlaying}
    on:loadedmetadata={handleLoadedMetadata}
    class="w-full h-full {isLandscape ? 'object-contain' : 'object-cover md:object-contain'} bg-zinc-950 transition-opacity duration-300"
    style="opacity: {isActive ? '1' : '0.4'};"
  ></video>

  <!-- Bottom Dark Vignette Overlay -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none z-10"></div>

  <!-- Top Dark Vignette Overlay (for close button readability) -->
  <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10"></div>

  <!-- Play Overlay Icon (Visible when paused manually) -->
  {#if manuallyPaused}
    <div class="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
      <div class="w-16 h-16 rounded-full bg-black/55 backdrop-blur-md border border-white/20 flex items-center justify-center text-white scale-110 transition-all shadow-2xl animate-fade-in-scale">
        <svg class="w-7 h-7 fill-white translate-x-0.5" viewBox="0 0 24 24">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </div>
    </div>
  {/if}

  <!-- Loading Spinner -->
  {#if isBuffering && isActive}
    <div class="absolute inset-0 flex items-center justify-center z-15 pointer-events-none">
      <div class="w-10 h-10 border-4 border-[#00abbd]/30 border-t-[#00abbd] rounded-full animate-spin"></div>
    </div>
  {/if}

  <!-- Header Bar -->
  <div class="absolute top-4 inset-x-4 z-20 flex justify-between items-center pointer-events-none">
    <div class="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 pointer-events-auto">
      <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
      <span class="text-[10px] font-black uppercase tracking-widest text-zinc-200">BordProd Live</span>
    </div>

    <button 
      on:click|stopPropagation={closeModal}
      class="w-10 h-10 rounded-full bg-black/40 hover:bg-black/75 border border-white/10 flex items-center justify-center text-white font-bold text-sm transition-all pointer-events-auto shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
    >
      ✕
    </button>
  </div>

  <!-- Bottom Left Profile / Details (TikTok Style) -->
  <div class="absolute left-4 bottom-6 z-20 max-w-[calc(100%-80px)] text-white text-left flex flex-col items-start gap-2.5 pointer-events-auto">
    <!-- Client badge -->
    <div class="flex flex-wrap items-center gap-2">
      <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-gradient-to-r {video.badgeBg} shadow-md border border-white/15">
        {video.clientName}
      </span>
      <span class="px-2.5 py-0.5 rounded-full text-[9px] font-bold text-zinc-300 bg-white/10 border border-white/5 backdrop-blur-md">
        {video.category}
      </span>
    </div>

    <!-- Title and Description -->
    <div class="flex flex-col gap-1">
      <h3 class="text-base md:text-lg font-black tracking-tight leading-snug drop-shadow-md text-white">
        {video.title || video.category}
      </h3>
    </div>

    <!-- Client Instagram Button -->
    {#if video.igHandle}
      <a 
        href="https://instagram.com/{video.igHandle}"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center gap-1.5 text-[10px] text-zinc-300 hover:text-white font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 transition-all duration-300 shadow-md"
      >
        <svg class="w-3.5 h-3.5 fill-current text-white/90" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        <span>@{video.igHandle}</span>
      </a>
    {/if}
  </div>

  <!-- Right Side Interactive Actions Bar (TikTok Style) -->
  <div class="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5 pointer-events-auto">
    <!-- Instagram circle badge -->
    {#if video.igHandle}
      <a 
        href="https://instagram.com/{video.igHandle}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="flex flex-col items-center group cursor-pointer"
      >
        <div class="w-11 h-11 rounded-full border border-pink-500/80 bg-zinc-900/90 flex items-center justify-center overflow-hidden hover:scale-105 active:scale-95 transition-all shadow-lg">
          <span class="text-[10px] font-black uppercase text-pink-400">
            {video.clientName.substring(0, 2)}
          </span>
        </div>
        <span class="text-[8px] font-black mt-1 bg-black/60 px-2 py-0.5 rounded-full border border-white/5 text-pink-200 backdrop-blur-sm">
          IG
        </span>
      </a>
    {/if}

    <!-- Sound Controller -->
    <button 
      on:click|stopPropagation={toggleMute}
      class="w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:bg-black/75 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer text-white"
    >
      {#if globalMuted}
        <svg class="w-4.5 h-4.5 fill-current text-zinc-300" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>
      {:else}
        <svg class="w-4.5 h-4.5 fill-current text-white animate-pulse" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>
      {/if}
    </button>

    <!-- Project Booking CTA -->
    <button 
      on:click|stopPropagation={() => { closeModal(); scrollToForm(); }}
      class="w-11 h-11 rounded-full bg-[#00abbd] hover:bg-[#0092a1] border border-[#00abbd]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer text-white"
    >
      <svg class="w-4.5 h-4.5 stroke-current fill-none stroke-[2.5]" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>
  </div>

  <!-- Scroll Down Indicator Chevron (Bouncing animation) -->
  {#if showScrollIndicator && isActive}
    <div class="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none text-white/70 animate-bounce">
      <span class="text-[8px] font-black uppercase tracking-widest bg-black/45 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm mb-1">
        Défiler
      </span>
      <svg class="w-3.5 h-3.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  {/if}
</div>

<style>
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.85);
    }
    to {
      opacity: 1;
      transform: scale(1.1);
    }
  }
  .animate-fade-in-scale {
    animation: fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
