<script lang="ts">
  import { onMount } from 'svelte';
  import { locale, t } from '$lib/i18n';
  import { heroVideoLoaded } from '$lib/stores';

  export let feedbackVideos: any[];
  export let openS3VideoModal: (video: any) => void;

  let carouselRef: HTMLDivElement | null = null;
  let isVisible = false;

  function scrollLeft() {
    carouselRef?.scrollBy({ left: -320, behavior: 'smooth' });
  }

  function scrollRight() {
    carouselRef?.scrollBy({ left: 320, behavior: 'smooth' });
  }

  // Svelte Action to lazy load videos when they enter the viewport
  function lazyVideo(node: HTMLVideoElement, src: string) {
    let observer: IntersectionObserver;
    let unsubscribe: () => void;

    const loadVideo = () => {
      if (!node.src || !node.src.includes(src)) {
        node.src = src;
        node.load();
      }
      cleanup();
    };

    const cleanup = () => {
      if (observer) {
        observer.disconnect();
      }
      if (unsubscribe) {
        unsubscribe();
      }
    };

    if (typeof window !== 'undefined') {
      unsubscribe = heroVideoLoaded.subscribe((loaded) => {
        if (loaded) {
          loadVideo();
        }
      });

      if (!node.src && 'IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              loadVideo();
            }
          });
        }, { rootMargin: '120px' });

        observer.observe(node);
      }
    } else {
      node.src = src;
    }

    return {
      update(newSrc: string) {
        src = newSrc;
        if (node.src) { node.src = src; node.load(); }
      },
      destroy() {
        cleanup();
      }
    };
  }

  onMount(() => {
    const triggerEl = document.querySelector('#testimonials');
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

<section id="testimonials" class="w-full max-w-none py-20 z-10 border-t border-zinc-200/60 overflow-hidden">

  <!-- Section Header -->
  <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
    <div class="text-center md:text-left">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('testimonials_badge')}</span>

      {#if $locale === 'ar'}
        <h2 class="text-3xl md:text-5xl font-black text-zinc-900 mt-3">
          ماذا يقول <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca]">شركاؤنا</span>
        </h2>
      {:else}
        <h2 class="text-3xl md:text-5xl font-black text-zinc-900 mt-3">
          {$t('testimonials_title').split($t('testimonials_highlight'))[0]}
          <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca]">{$t('testimonials_highlight')}</span>
          {$t('testimonials_title').split($t('testimonials_highlight'))[1] || ''}
        </h2>
      {/if}
    </div>

    <!-- Header arrows -->
    <div class="flex items-center gap-3 shrink-0">
      <button
        on:click={scrollLeft}
        aria-label="Previous"
        class="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-md hover:bg-zinc-900 hover:text-white active:scale-95 transition-all flex items-center justify-center text-lg text-zinc-900 cursor-pointer"
      >←</button>
      <button
        on:click={scrollRight}
        aria-label="Next"
        class="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-md hover:bg-zinc-900 hover:text-white active:scale-95 transition-all flex items-center justify-center text-lg text-zinc-900 cursor-pointer"
      >→</button>
    </div>
  </div>

  <!-- Full-width carousel -->
  <div class="relative w-full">

    <!-- Left floating arrow -->
    <button
      on:click={scrollLeft}
      aria-label="Scroll Left"
      class="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Right floating arrow -->
    <button
      on:click={scrollRight}
      aria-label="Scroll Right"
      class="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Carousel track -->
    <div
      bind:this={carouselRef}
      class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-6 md:px-16 no-scrollbar select-none"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      {#each feedbackVideos as video, idx (video.id)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="group w-[290px] sm:w-[340px] md:w-[360px] shrink-0 snap-start rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          class:animate-fade-in-up={isVisible}
          style="animation-delay: {idx * 0.07}s; opacity: {isVisible ? '1' : '0'};"
          on:click={() => openS3VideoModal(video)}
        >
          <!-- 9:14 Video Container -->
          <div class="w-full aspect-[9/14] bg-zinc-950 relative overflow-hidden flex flex-col justify-between p-5">

            <video
              use:lazyVideo={video.url}
              autoplay loop muted playsinline preload="none"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            ></video>

            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 group-hover:from-black/80 transition-colors"></div>

            <!-- Top badge -->
            <div class="flex justify-between items-center z-10">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-black/60 backdrop-blur-md border border-white/20">
                {video.clientName}
              </span>
              <div class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </div>

            <!-- Central play -->
            <div class="my-auto flex flex-col items-center justify-center gap-2 group-hover:scale-110 transition-transform z-10">
              <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl">
                <svg class="w-6 h-6 fill-white translate-x-0.5" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                Écouter l'Avis ⚡
              </span>
            </div>

            <!-- Bottom: name + role + IG -->
            <div class="z-10 text-white flex flex-col items-start gap-0.5">
              <p class="text-[10px] font-bold uppercase tracking-wider text-white/80">{video.clientName}</p>
              <h4 class="text-sm font-black drop-shadow-md leading-snug">{video.role ?? ''}</h4>
              {#if video.igHandle}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a
                  href="https://instagram.com/{video.igHandle}"
                  target="_blank" rel="noopener noreferrer"
                  on:click|stopPropagation
                  class="flex items-center gap-1 text-[10px] text-zinc-300 hover:text-white font-bold bg-white/10 hover:bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10 transition-all duration-300 mt-1.5 shadow-md"
                >
                  <svg class="w-2.5 h-2.5 fill-current text-white/90" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                  <span>@{video.igHandle}</span>
                </a>
              {/if}
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 bg-white flex items-center justify-between border-t border-zinc-100">
            <div>
              <p class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Client</p>
              <span class="text-xs font-black text-zinc-800">{video.role || video.clientName}</span>
            </div>
            <span class="text-xs text-[#00abbd] font-black group-hover:translate-x-1 transition-transform">➔</span>
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
</style>

