<script lang="ts">
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { locale, t } from '$lib/i18n';

  let countYears = 0;
  let countVideos = 0;
  let countClients = 0;
  let countSatisfaction = 0;
  let statsAnimated = false;
  let statsContainerRef: HTMLDivElement | null = null;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    const duration = 1800;
    const steps = 60;
    const intervalTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 2);

      countYears = Math.floor(easeProgress * 3);
      countVideos = Math.floor(easeProgress * 200);
      countClients = Math.floor(easeProgress * 50);
      countSatisfaction = Math.floor(easeProgress * 98);

      if (step >= steps) {
        countYears = 3;
        countVideos = 200;
        countClients = 50;
        countSatisfaction = 98;
        clearInterval(timer);
      }
    }, intervalTime);
  }

  onMount(() => {
    // Setup Scroll Reveals
    const triggerEl = document.querySelector('#who-we-are');
    if (!triggerEl) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo('.gsap-about-card', 
            { opacity: 0, y: 16 }, 
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set('.gsap-about-card', { clearProps: 'all' });
              }
            }
          );
          gsap.fromTo('.gsap-about-content', 
            { opacity: 0, y: 16 }, 
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: 'power2.out',
              onComplete: () => {
                gsap.set('.gsap-about-content', { clearProps: 'all' });
              }
            }
          );
          obs.disconnect();
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

    obs.observe(triggerEl);

    // Stats Intersection Observer
    if ('IntersectionObserver' in window && statsContainerRef) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      statsObserver.observe(statsContainerRef);
    } else {
      animateCounters();
    }
  });
</script>

<section id="who-we-are" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
    <!-- Left Experience Card -->
    <div class="gsap-about-card lg:col-span-5 relative flex justify-center">
      <div class="w-72 h-72 rounded-3xl bg-gradient-to-tr from-[#ffaa00] via-[#ff3366] to-[#7928ca] p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <div class="absolute inset-0 bg-black/10"></div>
        <div class="z-10 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
          <img src="/logo/logo-icon.png" alt="BordProd Mark" class="w-8 h-8 object-contain" />
        </div>
        <div class="z-10 text-white">
          <p class="text-5xl font-black mb-1">{countYears}+</p>
          <p class="text-xs font-black uppercase tracking-wider text-white/95">{$t('about_experience')}</p>
        </div>
      </div>
      <div class="absolute -inset-4 border border-dashed border-zinc-400/30 rounded-3xl -z-10 transform rotate-3"></div>
    </div>

    <!-- Right Content -->
    <div class="gsap-about-content lg:col-span-7 space-y-6 {$locale === 'ar' ? 'text-right' : 'text-left'}">
      <div>
        <span class="text-xs font-black text-zinc-600 uppercase tracking-widest px-3.5 py-1 bg-white rounded-full border border-zinc-200 shadow-sm">{$t('about_badge')}</span>
      </div>
      <h3 class="text-3xl md:text-4xl font-extrabold text-zinc-900 leading-tight">
        {$t('about_title')}
      </h3>
      
      <div class="space-y-4 text-zinc-600 text-sm md:text-base font-medium leading-relaxed">
        <p>
          {$t('about_p1').split('BordProd')[0]}
          <strong class="text-[#00abbd] font-bold">BordProd</strong>
          {$t('about_p1').split('BordProd')[1] || ''}
        </p>
        <p>
          {$t('about_p2')}
        </p>
      </div>

      <!-- Animated Key Statistics Grid -->
      <div bind:this={statsContainerRef} class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-zinc-200/80">
        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
          <span class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] to-[#7928ca]">{countYears}+</span>
          <p class="text-[11px] font-bold text-zinc-500 uppercase mt-1">Années d'Expérience</p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
          <span class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#7928ca] to-[#0070f3]">{countVideos}+</span>
          <p class="text-[11px] font-bold text-zinc-500 uppercase mt-1">Vidéos Produites</p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
          <span class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0070f3] to-[#00abbd]">{countClients}+</span>
          <p class="text-[11px] font-bold text-zinc-500 uppercase mt-1">Clients Satisfaits</p>
        </div>

        <div class="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-zinc-200/80 shadow-sm text-center">
          <span class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00abbd] to-emerald-500">{countSatisfaction}%</span>
          <p class="text-[11px] font-bold text-zinc-500 uppercase mt-1">Satisfaction Client</p>
        </div>
      </div>
    </div>
  </div>
</section>
