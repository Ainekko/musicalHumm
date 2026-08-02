<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { t } from '$lib/i18n';

  export let scrollToForm: () => void;
  export let heroVideoUrl: string;

  let heroVideoRef: HTMLVideoElement | null = null;
  let heroIsMuted = true;
  let heroIsPlaying = true;

  function toggleHeroMute() {
    if (heroVideoRef) {
      heroVideoRef.muted = !heroVideoRef.muted;
      heroIsMuted = heroVideoRef.muted;
    }
  }

  function toggleHeroPlay() {
    if (heroVideoRef) {
      if (heroVideoRef.paused) {
        heroVideoRef.play();
        heroIsPlaying = true;
      } else {
        heroVideoRef.pause();
        heroIsPlaying = false;
      }
    }
  }

  function triggerHeroFullscreen() {
    if (heroVideoRef) {
      // Unmute and play for fullscreen impact
      heroVideoRef.muted = false;
      heroIsMuted = false;
      heroVideoRef.play();
      heroIsPlaying = true;

      // Handle standard and vendor prefixed fullscreen requests
      const videoEl = heroVideoRef as any;
      if (videoEl.requestFullscreen) {
        videoEl.requestFullscreen();
      } else if (videoEl.webkitRequestFullscreen) {
        videoEl.webkitRequestFullscreen();
      } else if (videoEl.webkitEnterFullscreen) {
        // Essential fallback for iOS devices
        videoEl.webkitEnterFullscreen();
      } else if (videoEl.msRequestFullscreen) {
        videoEl.msRequestFullscreen();
      }
    }
  }

  function splitTextIntoWords(str: string) {
    return str.split(' ').map(w => w.trim()).filter(Boolean);
  }

  onMount(() => {
    // Hero Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.gsap-hero-badge', 
      { opacity: 0, y: -10 }, 
      { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }
    )
    .fromTo('.gsap-word', 
      { opacity: 0, y: 14 }, 
      { opacity: 1, y: 0, stagger: 0.035, duration: 0.55, clearProps: 'all' },
      '-=0.3'
    )
    .fromTo('.gsap-hero-sub', 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.5, clearProps: 'all' }, 
      '-=0.4'
    )
    .fromTo('.gsap-hero-btn', 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.5, clearProps: 'all' }, 
      '-=0.3'
    )
    .fromTo('.gsap-hero-video', 
      { opacity: 0, y: 15 }, 
      { opacity: 1, y: 0, duration: 0.6, clearProps: 'all' }, 
      '-=0.4'
    );
  });
</script>

<section class="w-full max-w-5xl px-6 pt-14 pb-12 text-center z-10 flex flex-col items-center">
  <div class="gsap-hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-xs text-zinc-800 font-bold mb-6 shadow-sm">
    <span class="w-2.5 h-2.5 rounded-full bg-[#00abbd] animate-pulse"></span>
    {$t('hero_badge')}
  </div>
  
  <h1 class="gsap-hero-title text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none text-zinc-900 max-w-4xl mb-6 flex flex-wrap justify-center gap-x-3 gap-y-1">
    {#each splitTextIntoWords($t('hero_title')) as word}
      <span class="inline-block">
        <span class="gsap-word inline-block">
          {#if $t('hero_highlight').includes(word.replace(/[^a-zA-Z0-9\u0600-\u06FF]/g, '')) || $t('hero_highlight').includes(word)}
            <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] via-[#e6005c] to-[#7928ca]">{word}</span>
          {:else}
            {word}
          {/if}
        </span>
      </span>
    {/each}
  </h1>

  <p class="gsap-hero-sub text-base md:text-lg text-zinc-600 max-w-2xl font-medium leading-relaxed mb-10">
    {$t('hero_subtitle')}
  </p>
  
  <div class="flex flex-col sm:flex-row gap-4 mb-14">
    <button 
      on:click={scrollToForm}
      class="gsap-hero-btn px-7 py-4 text-sm font-black rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-xl transition-all cursor-pointer"
    >
      {$t('hero_cta')}
    </button>
    <a 
      href="#portfolio-showcase"
      class="gsap-hero-btn px-7 py-4 text-sm font-black rounded-full bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-sm flex items-center justify-center gap-2"
    >
      <span>🎬 Voir les réalisations</span>
    </a>
  </div>

  <!-- Main Hero Showreel Video Player (Plays S3 hero video directly) -->
  <div class="gsap-hero-video w-full max-w-4xl rounded-3xl border border-zinc-300/80 bg-white p-3.5 shadow-2xl relative group transition-shadow duration-300">
    <div class="w-full aspect-video rounded-2xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden group">
      
      <video 
        bind:this={heroVideoRef}
        src={heroVideoUrl}
        autoplay
        muted
        loop
        playsinline
        class="w-full h-full object-cover rounded-2xl"
      ></video>

      <!-- Video Overlay Controls -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20 opacity-80 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-6 pointer-events-none">
        <div class="flex justify-between items-center pointer-events-auto">
          <span class="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-[#00abbd] border border-[#00abbd]/30">
            {$t('hero_player_badge')} &middot; MASTER SHOWREEL
          </span>
          
          <button 
            on:click={toggleHeroMute}
            class="w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer"
            title={heroIsMuted ? "Activer le son" : "Désactiver le son"}
          >
            {#if heroIsMuted}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            {:else}
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            {/if}
          </button>
        </div>

        <div class="flex justify-between items-end pointer-events-auto">
          <div class="text-left">
            <h3 class="text-white text-base md:text-xl font-black drop-shadow-md">BordProd Agency Showreel</h3>
            <p class="text-xs text-zinc-300 font-semibold drop-shadow">Production Vidéo Haute Performance</p>
          </div>

          <div class="flex items-center gap-3">
            <button 
              on:click={toggleHeroPlay}
              class="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
            >
              <span>{heroIsPlaying ? '❚❚ PAUSE' : '▶ PLAY'}</span>
            </button>

            <button 
              on:click={triggerHeroFullscreen}
              class="px-4 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              title="Plein écran"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>PLAY</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
