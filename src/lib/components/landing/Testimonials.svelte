<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { locale, t } from '$lib/i18n';

  export let feedbackVideos: any[];
  export let openS3VideoModal: (video: any) => void;

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
      }, { rootMargin: '120px' });

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
    const triggerEl = document.querySelector('#testimonials');
    if (!triggerEl) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo('.gsap-testimonial-card', 
            { opacity: 0, y: 16 }, 
            {
              opacity: 1,
              y: 0,
              stagger: 0.07,
              duration: 0.55,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set('.gsap-testimonial-card', { clearProps: 'all' });
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

<section id="testimonials" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
  <div class="text-center mb-16">
    <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('testimonials_badge')}</span>
    
    {#if $locale === 'ar'}
      <h2 class="text-3xl md:text-4xl font-black text-zinc-900 mt-4 mb-2">
        ماذا يقول <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca]">شركاؤنا</span>
      </h2>
    {:else}
      <h2 class="text-3xl md:text-4xl font-black text-zinc-900 mt-4 mb-2">
        {$t('testimonials_title').split($t('testimonials_highlight'))[0]}
        <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca]">{$t('testimonials_highlight')}</span>
        {$t('testimonials_title').split($t('testimonials_highlight'))[1] || ''}
      </h2>
    {/if}

    <p class="text-sm text-zinc-500 font-semibold max-w-md mx-auto">
      {$t('testimonials_subtitle')}
    </p>
  </div>

  <!-- Video Feedback Client Testimonials Grid -->
  <div class="gsap-testimonials-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {#each feedbackVideos as video (video.id)}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div 
        class="gsap-testimonial-card group rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative cursor-pointer"
        on:click={() => openS3VideoModal(video)}
      >
        <!-- 9:14 Autoplay Feedback Video Container -->
        <div class="w-full aspect-[9/14] bg-zinc-950 relative overflow-hidden flex flex-col justify-between p-5">
          
          <!-- Live Feedback Video Preview -->
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

          <!-- Top Bar with Category & Icon Badge -->
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
              Écouter l'Avis ⚡
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
          <span class="text-xs font-bold text-zinc-800">Voir la Vidéo Feedback</span>
          <span class="text-xs text-[#00abbd] font-black group-hover:translate-x-1 transition-transform">➔</span>
        </div>
      </div>
    {/each}
  </div>
</section>
