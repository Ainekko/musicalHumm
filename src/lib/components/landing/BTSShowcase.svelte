<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';

  export let btsVideos: any[];
  export let openS3VideoModal: (video: any) => void;

  let isVisible = false;
  let btsCarouselRef: HTMLDivElement | null = null;

  function handleVideoHover(e: MouseEvent) {
    const video = e.currentTarget as HTMLVideoElement;
    if (video) {
      video.play().catch(() => {});
    }
  }

  function handleVideoLeave(e: MouseEvent) {
    const video = e.currentTarget as HTMLVideoElement;
    if (video) {
      video.pause();
    }
  }

  function scrollBTSLeft() {
    if (btsCarouselRef) {
      btsCarouselRef.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  function scrollBTSRight() {
    if (btsCarouselRef) {
      btsCarouselRef.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  // Svelte Action to lazy load videos when they enter the viewport
  function lazyVideo(node: HTMLVideoElement, src: string) {
    let observer: IntersectionObserver;

    const loadVideo = () => {
      if (!node.src || !node.src.includes(src)) {
        node.src = src;
        node.load();
      }
      if (observer) {
        observer.disconnect();
      }
    };

    if (typeof window !== 'undefined') {
      if (!node.src && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadVideo();
            }
          });
        }, { rootMargin: '200px' });

        observer.observe(node);
      } else {
        node.src = src;
      }
    } else {
      node.src = src;
    }

    return {
      update(newSrc: string) {
        src = newSrc;
        if (node.src) {
          node.src = src;
          node.load();
        }
      },
      destroy() {
        if (observer) {
          observer.disconnect();
        }
      }
    };
  }

  onMount(() => {
    const triggerEl = document.querySelector('#bts-showcase');
    if (!triggerEl) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
          obs.disconnect();
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

    obs.observe(triggerEl);
  });
</script>

<section id="bts-showcase" class="w-full bg-[#111113] text-white py-20 z-10 border-t border-zinc-800 relative overflow-hidden">
  <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(0,171,189,0.15),transparent_60%)]"></div>
  
  <div class="w-full max-w-6xl mx-auto px-6">
    
    <!-- Section Header with Arrows -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-14">
      <div class="text-center md:text-left">
        <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#00abbd]/10 border border-[#00abbd]/30 shadow-sm">
          {$t('bts_section_badge')}
        </span>
        
        <h2 class="text-3xl md:text-5xl font-black text-white mt-4 mb-3">
          {$t('bts_section_title').split($t('bts_section_highlight'))[0]}
          <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#00abbd] via-teal-300 to-emerald-400">{$t('bts_section_highlight')}</span>
          {$t('bts_section_title').split($t('bts_section_highlight'))[1] || ''}
        </h2>

        <p class="text-xs md:text-sm text-zinc-400 font-semibold max-w-lg">
          {$t('bts_section_sub')}
        </p>
      </div>

      <!-- Top Header Arrow Indicators -->
      <div class="flex items-center gap-3 shrink-0">
        <button
          on:click={scrollBTSLeft}
          aria-label="Previous Slide"
          class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 shadow-md hover:bg-white hover:text-zinc-900 active:scale-95 transition-all flex items-center justify-center text-lg text-white cursor-pointer"
        >
          ←
        </button>
        <button
          on:click={scrollBTSRight}
          aria-label="Next Slide"
          class="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 shadow-md hover:bg-white hover:text-zinc-900 active:scale-95 transition-all flex items-center justify-center text-lg text-white cursor-pointer"
        >
          →
        </button>
      </div>
    </div>
  </div>

  <!-- Full-Width Slider Container with Floating Side Arrow Indicators -->
  <div class="relative w-full">
    <!-- Floating Left Side Arrow Button -->
    <button
      on:click={scrollBTSLeft}
      aria-label="Scroll Left"
      class="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg
        class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:-translate-x-0.5 transition-transform"
        viewBox="0 0 24 24"
      >
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Floating Right Side Arrow Button -->
    <button
      on:click={scrollBTSRight}
      aria-label="Scroll Right"
      class="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg
        class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:translate-x-0.5 transition-transform"
        viewBox="0 0 24 24"
      >
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Full Bleed Edge-to-Edge Carousel Tracks -->
    <div
      bind:this={btsCarouselRef}
      class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-6 md:px-16 no-scrollbar select-none"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      {#each btsVideos as bts, idx}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="group w-[290px] sm:w-[340px] md:w-[360px] shrink-0 snap-start rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl overflow-hidden hover:border-[#00abbd]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          class:animate-fade-in-up={isVisible}
          style="animation-delay: {idx * 0.07}s; opacity: {isVisible ? '1' : '0'};"
          on:click={() => openS3VideoModal({ title: bts.title, clientName: 'Les Coulisses BTS', category: bts.tag, url: bts.url, badgeBg: 'from-zinc-700 to-zinc-900' })}
        >
          <div class="w-full aspect-[9/14] bg-black relative overflow-hidden">
            <video
              use:lazyVideo={bts.url}
              muted
              loop
              playsinline
              preload="none"
              on:mouseenter={handleVideoHover}
              on:mouseleave={handleVideoLeave}
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
            ></video>

            <!-- Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 group-hover:from-black/80 transition-colors p-5 flex flex-col justify-between pointer-events-none">

              <!-- Top bar -->
              <div class="flex justify-between items-center">
                <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-black/60 backdrop-blur-md border border-white/20">
                  🎬 {bts.tag}
                </span>
                <span class="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-black/60 px-2 py-0.5 rounded-full border border-red-500/20 backdrop-blur-md">
                  <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> REC
                </span>
              </div>

              <!-- Central play -->
              <div class="my-auto flex flex-col items-center justify-center gap-2 group-hover:scale-110 transition-transform">
                <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl">
                  <svg class="w-6 h-6 fill-white translate-x-0.5" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Voir les coulisses ⚡
                </span>
              </div>

              <!-- Bottom tag -->
              <div class="text-white">
                <h4 class="text-sm font-black drop-shadow-md leading-snug">{bts.title}</h4>
                <p class="text-[10px] font-bold uppercase tracking-wider text-white/40 mt-1">BordProd BTS</p>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
</style>
