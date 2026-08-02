<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { locale, t } from '$lib/i18n';

  export let clientPortfolioVideos: any[];
  export let openS3VideoModal: (video: any) => void;
  export let scrollToForm: () => void;

  let selectedFilter = 'all';
  let portfolioCarouselRef: HTMLDivElement | null = null;

  $: filteredClientVideos = selectedFilter === 'all' 
    ? clientPortfolioVideos 
    : clientPortfolioVideos.filter(v => v.clientKey === selectedFilter);

  function scrollPortfolioLeft() {
    if (portfolioCarouselRef) {
      portfolioCarouselRef.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  function scrollPortfolioRight() {
    if (portfolioCarouselRef) {
      portfolioCarouselRef.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  // Svelte Action to lazy load videos when they enter the viewport
  function lazyVideo(node: HTMLVideoElement, src: string) {
    let observer: IntersectionObserver;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            node.src = src;
            node.load(); // Load the video file
            observer.unobserve(node);
          }
        });
      }, { rootMargin: '120px' }); // Load 120px before entering viewport

      observer.observe(node);
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
          observer.unobserve(node);
        }
      }
    };
  }

  onMount(() => {
    const triggerEl = document.querySelector('#portfolio-showcase');
    if (!triggerEl) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo('.gsap-portfolio-card', 
            { opacity: 0, y: 16 }, 
            {
              opacity: 1,
              y: 0,
              stagger: 0.05,
              duration: 0.55,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set('.gsap-portfolio-card', { clearProps: 'all' });
              }
            }
          );
          obs.disconnect();
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

    obs.observe(triggerEl);
  });
</script>

<section id="portfolio-showcase" class="w-full max-w-none py-20 z-10 border-t border-zinc-200/60 overflow-hidden">
  
  <!-- Client Portfolio Header & Controls -->
  <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
    <div class="text-center md:text-left">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
        {$t('portfolio_badge')}
      </span>
      <h2 class="text-3xl md:text-5xl font-black text-zinc-900 mt-3">
        {$t('portfolio_title').split($t('portfolio_highlight'))[0]}
        <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3]">{$t('portfolio_highlight')}</span>
        {$t('portfolio_title').split($t('portfolio_highlight'))[1] || ''}
      </h2>
    </div>

    <!-- Top Header Arrow Indicators -->
    <div class="flex items-center gap-3 shrink-0">
      <button 
        on:click={scrollPortfolioLeft}
        aria-label="Previous Slide"
        class="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-md hover:bg-zinc-900 hover:text-white active:scale-95 transition-all flex items-center justify-center text-lg text-zinc-900 cursor-pointer"
      >
        ←
      </button>
      <button 
        on:click={scrollPortfolioRight}
        aria-label="Next Slide"
        class="w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-md hover:bg-zinc-900 hover:text-white active:scale-95 transition-all flex items-center justify-center text-lg text-zinc-900 cursor-pointer"
      >
        →
      </button>
    </div>
  </div>

  <!-- Client Filter Tabs -->
  <div class="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-10">
    <button 
      on:click={() => selectedFilter = 'all'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'all' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_all')} ({clientPortfolioVideos.length})
    </button>
    <button 
      on:click={() => selectedFilter = 'rein'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'rein' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_rein')}
    </button>
    <button 
      on:click={() => selectedFilter = 'atlas'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'atlas' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_atlas')}
    </button>
    <button 
      on:click={() => selectedFilter = 'fitness'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'fitness' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_fitness')}
    </button>
    <button 
      on:click={() => selectedFilter = 'iron'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'iron' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_iron')}
    </button>
    <button 
      on:click={() => selectedFilter = 'immoby'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'immoby' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_immoby')}
    </button>
    <button 
      on:click={() => selectedFilter = 'mondial'}
      class="px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer shadow-sm border {selectedFilter === 'mondial' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
    >
      {$t('filter_mondial')}
    </button>
  </div>

  <!-- Full-Width Slider Container with Floating Side Arrow Indicators -->
  <div class="relative w-full">
    
    <!-- Stylish Left Side Arrow Button -->
    <button 
      on:click={scrollPortfolioLeft}
      aria-label="Scroll Left"
      class="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:-translate-x-0.5 transition-transform" viewBox="0 0 24 24">
        <path d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Stylish Right Side Arrow Button -->
    <button 
      on:click={scrollPortfolioRight}
      aria-label="Scroll Right"
      class="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full bg-zinc-950/80 hover:bg-black text-white backdrop-blur-md shadow-2xl border border-white/20 hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
    >
      <svg class="w-6 h-6 fill-none stroke-current stroke-[2.5] group-hover:translate-x-0.5 transition-transform" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- Full Bleed Edge-to-Edge Carousel Tracks -->
    <div 
      bind:this={portfolioCarouselRef}
      class="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-6 md:px-16 no-scrollbar select-none"
      style="scrollbar-width: none; -ms-overflow-style: none;"
    >
      {#each filteredClientVideos as video (video.id)}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div 
          class="gsap-portfolio-card group w-[290px] sm:w-[340px] md:w-[360px] shrink-0 snap-start rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
          on:click={() => openS3VideoModal(video)}
        >
          <!-- 9:14 Reel Container with Live Video Autoplay Preview & Overlay -->
          <div class="w-full aspect-[9/14] bg-zinc-950 relative overflow-hidden flex flex-col justify-between p-5">
            
            <!-- Live Video Preview -->
            <video 
              use:lazyVideo={video.url} 
              autoplay 
              loop 
              muted 
              playsinline
              preload="none"
              class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            ></video>

            <!-- Dark Gradient Vignette Overlay for Crisp Contrast -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50 group-hover:from-black/80 transition-colors"></div>

            <!-- Top Bar with Category Tag & Icon Badge -->
            <div class="flex justify-between items-center z-10">
              <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-black/60 backdrop-blur-md border border-white/20">
                {video.category}
              </span>
              
              <div class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>

            <!-- Central Play Button -->
            <div class="my-auto flex flex-col items-center justify-center gap-2 group-hover:scale-110 transition-transform z-10">
              <div class="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-2xl">
                <svg class="w-6 h-6 fill-white translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
              <span class="text-[10px] font-black uppercase tracking-widest text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                {$t('play_video')}
              </span>
            </div>

            <!-- Reel Bottom Details -->
            <div class="z-10 text-white">
              <p class="text-[10px] font-bold uppercase tracking-wider text-white/80">{video.clientName}</p>
              <h4 class="text-sm font-black drop-shadow-md leading-snug">{video.title}</h4>
            </div>
          </div>

          <!-- Card Footer Action -->
          <div class="p-4 bg-white flex items-center justify-between border-t border-zinc-100">
            <span class="text-xs font-bold text-zinc-800">Visionner le Projet</span>
            <span class="text-xs text-[#00abbd] font-black group-hover:translate-x-1 transition-transform">➔</span>
          </div>
        </div>
      {/each}
    </div>
  </div>

  <!-- CTA Button -->
  <div class="text-center mt-14">
    <button 
      on:click={scrollToForm}
      class="inline-flex items-center gap-2 text-xs font-black px-8 py-4 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-xl cursor-pointer"
    >
      {$t('portfolio_cta')}
      <svg class="w-4 h-4 {$locale === 'ar' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </button>
  </div>
</section>
