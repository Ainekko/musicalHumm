<script lang="ts">
  /**
   * BordProd Landing Page - Playable Instagram Reels & Show Don't Tell Portfolio
   * =========================================================================
   * Embedded playable Instagram Reels in grid + interactive video modal player.
   */
  import { onMount } from 'svelte';
  import { gsap } from 'gsap';
  import { api } from '$lib/api/base';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import { locale, t } from '$lib/i18n';

  // Lead Form State
  let name = '';
  let email = '';
  let phone = '';
  let company = '';
  let budget = '';
  let projectDescription = '';

  let loading = false;
  let success = false;
  let errorMessage = '';

  let nameError = '';
  let emailError = '';
  let projectDescriptionError = '';

  // Active Playable Reel Modal
  let activeReelId: string | null = null;

  const INSTAGRAM_PROFILE = "https://www.instagram.com/bord_prodagency?igsh=amxueGN3aXhiYWt6";

  function validateEmail(emailStr: string) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    errorMessage = '';
    nameError = '';
    emailError = '';
    projectDescriptionError = '';

    let isValid = true;
    if (!name.trim()) {
      nameError = $t('validation_name');
      isValid = false;
    }
    if (!email.trim()) {
      emailError = $t('validation_email');
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError = $t('validation_email_invalid');
      isValid = false;
    }
    if (!projectDescription.trim()) {
      projectDescriptionError = $t('validation_desc');
      isValid = false;
    }

    if (!isValid) return;

    loading = true;
    try {
      await api.post('/leads', {
        name,
        email,
        phone: phone || undefined,
        company: company || undefined,
        budget: budget || undefined,
        project_description: projectDescription
      });
      success = true;
      name = '';
      email = '';
      phone = '';
      company = '';
      budget = '';
      projectDescription = '';

      setTimeout(() => {
        gsap.fromTo('.gsap-success-box', 
          { opacity: 0, y: 15 }, 
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', clearProps: 'all' }
        );
      }, 50);
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      errorMessage = err.message || $t('validation_error');
    } finally {
      loading = false;
    }
  }

  function scrollToForm() {
    const el = document.getElementById('contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function splitTextIntoWords(str: string) {
    return str.split(' ').map(w => w.trim()).filter(Boolean);
  }

  function openReel(id: string) {
    activeReelId = id;
  }

  function closeReel() {
    activeReelId = null;
  }

  // Real Instagram Posts Provided by User
  const instagramReels = [
    {
      id: 'DOWQAHcDMQt',
      url: 'https://www.instagram.com/p/DOWQAHcDMQt/',
      embedUrl: 'https://www.instagram.com/p/DOWQAHcDMQt/embed',
      title: 'Direction Artistique & Studio',
      category: 'Brand Pitch',
      bgGradient: 'from-amber-400 via-rose-500 to-purple-600'
    },
    {
      id: 'DOeIeUHjDcb',
      url: 'https://www.instagram.com/p/DOeIeUHjDcb/',
      embedUrl: 'https://www.instagram.com/p/DOeIeUHjDcb/embed',
      title: 'Hook Publicitaire Performance',
      category: 'Performance Ad',
      bgGradient: 'from-cyan-400 via-blue-500 to-indigo-600'
    },
    {
      id: 'DPzZIWNjJIw',
      url: 'https://www.instagram.com/p/DPzZIWNjJIw/',
      embedUrl: 'https://www.instagram.com/p/DPzZIWNjJIw/embed',
      title: 'Reel Cinéma & Sound Design',
      category: 'Cinema Reel',
      bgGradient: 'from-emerald-400 via-teal-500 to-cyan-600'
    },
    {
      id: 'DO6lfHEDHEk',
      url: 'https://www.instagram.com/p/DO6lfHEDHEk/',
      embedUrl: 'https://www.instagram.com/p/DO6lfHEDHEk/embed',
      title: 'Format Viral 9:16 High-CTR',
      category: 'Viral UGC',
      bgGradient: 'from-pink-500 via-rose-500 to-amber-500'
    }
  ];

  // Testimonials Details
  const testimonials = [
    {
      avatarInitials: "JR",
      bgAvatar: "bg-[#e0f7f8] text-[#008ba3]"
    },
    {
      avatarInitials: "TL",
      bgAvatar: "bg-[#fff8e1] text-[#b38f00]"
    },
    {
      avatarInitials: "HM",
      bgAvatar: "bg-[#e8f5e9] text-[#2e7d32]"
    },
    {
      avatarInitials: "SS",
      bgAvatar: "bg-[#e8eaf6] text-[#3f51b5]"
    }
  ];

  onMount(() => {
    // Hero Entrance
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

    // Scroll Reveals
    function setupScrollReveal(triggerSelector: string, targetSelector: string, stagger: number = 0) {
      const triggerEl = document.querySelector(triggerSelector);
      if (!triggerEl) return;

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(targetSelector, 
              { opacity: 0, y: 16 }, 
              {
                opacity: 1,
                y: 0,
                stagger: stagger,
                duration: 0.55,
                ease: 'power2.out',
                onComplete: () => {
                  gsap.set(targetSelector, { clearProps: 'all' });
                }
              }
            );
            obs.disconnect();
          }
        });
      }, { threshold: 0.01, rootMargin: '0px 0px -10px 0px' });

      obs.observe(triggerEl);
    }

    setupScrollReveal('#instagram-showcase', '.gsap-ig-card', 0.07);
    setupScrollReveal('#testimonials', '.gsap-testimonial-card', 0.07);
    setupScrollReveal('#who-we-are', '.gsap-about-card', 0);
    setupScrollReveal('#who-we-are', '.gsap-about-content', 0);
    setupScrollReveal('#contact-form', '.gsap-form-card', 0);
  });
</script>

<svelte:head>
  <title>BordProd | Production Vidéo & Reels Instagram</title>
</svelte:head>

<main 
  dir={$locale === 'ar' ? 'rtl' : 'ltr'} 
  class="min-h-screen flex flex-col items-center justify-between bg-[#f5f4f0] text-[#1a1a1a] relative overflow-hidden font-sans"
>
  
  <!-- Subtle SVG Noise Grain Overlay -->
  <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.035]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E');"></div>

  <!-- Background Orbs -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#ffaa00]/12 via-[#ff3366]/12 to-[#7928ca]/12 blur-[140px]"></div>
    <div class="absolute bottom-[15%] right-[-15%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-[#00c6ff]/12 via-[#0072ff]/12 to-[#7928ca]/12 blur-[140px]"></div>
  </div>

  <!-- Header -->
  <header class="w-full max-w-6xl flex justify-between items-center z-10 py-5 px-6 border-b border-zinc-200/60 bg-[#f5f4f0]/85 backdrop-blur-md sticky top-0">
    <div class="flex items-center gap-2">
      <img src="/logo/logo.png" alt="BordProd Logo" class="h-9 md:h-11 object-contain" />
    </div>
    <nav class="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-600">
      <a href="#instagram-showcase" class="hover:text-[#00abbd] transition-colors">{$t('nav_portfolio')}</a>
      <a href="#testimonials" class="hover:text-[#00abbd] transition-colors">{$t('nav_testimonials')}</a>
      <a href="#who-we-are" class="hover:text-[#00abbd] transition-colors">{$t('nav_about')}</a>
    </nav>
    <div class="flex items-center gap-4">
      <!-- Language Selector -->
      <div class="flex items-center bg-zinc-200/70 rounded-full p-1 border border-zinc-300/60">
        <button 
          on:click={() => locale.set('fr')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'fr' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}"
        >
          FR
        </button>
        <button 
          on:click={() => locale.set('en')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'en' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}"
        >
          EN
        </button>
        <button 
          on:click={() => locale.set('ar')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'ar' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-950'}"
        >
          العربية
        </button>
      </div>

      <a 
        href={INSTAGRAM_PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:inline-flex items-center gap-1.5 text-xs font-black px-4 py-2 rounded-full bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3] text-white shadow-sm hover:opacity-90 transition-opacity"
      >
        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        Instagram
      </a>

      <button 
        on:click={scrollToForm}
        class="text-xs font-black px-5 py-2.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-md cursor-pointer"
      >
        {$t('nav_cta')}
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="w-full max-w-5xl px-6 pt-16 pb-14 text-center z-10 flex flex-col items-center">
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
    
    <div class="flex flex-col sm:flex-row gap-4 mb-16">
      <button 
        on:click={scrollToForm}
        class="gsap-hero-btn px-7 py-4 text-sm font-black rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-xl transition-all cursor-pointer"
      >
        {$t('hero_cta')}
      </button>
      <a 
        href={INSTAGRAM_PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        class="gsap-hero-btn px-7 py-4 text-sm font-black rounded-full bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-sm flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4 text-[#e6005c] fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        {$t('hero_secondary')}
      </a>
    </div>

    <!-- Main Showreel Frame -->
    <div class="gsap-hero-video w-full max-w-4xl rounded-3xl border border-zinc-300/80 bg-white p-3.5 shadow-2xl relative group transition-shadow duration-300">
      <div class="w-full aspect-video rounded-2xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-[#004e57]/40 via-zinc-950 to-[#5c4a16]/30 opacity-85 z-0"></div>
        
        <button 
          on:click={() => openReel('DOWQAHcDMQt')}
          class="z-10 flex flex-col items-center gap-4 cursor-pointer group-hover:scale-105 transition-transform"
        >
          <div class="w-20 h-20 rounded-full bg-white/15 border border-white/30 hover:border-white/50 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-2xl">
            <svg class="w-7 h-7 text-white fill-white {$locale === 'ar' ? '-translate-x-0.5 rotate-180' : 'translate-x-0.5'}" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">{$t('hero_player_cta')}</span>
        </button>

        <div class="absolute bottom-4 {$locale === 'ar' ? 'right-4' : 'left-4'} z-10 flex gap-2">
          <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-[#00abbd] border border-[#00abbd]/20">{$t('hero_player_badge')}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- SHOW DON'T TELL: Playable Instagram Videos Grid Section -->
  <section id="instagram-showcase" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
    
    <!-- Profile Header Card -->
    <div class="w-full rounded-3xl bg-white border border-zinc-200/80 p-6 md:p-8 shadow-xl mb-12 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-4 text-center md:text-left">
        <div class="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-[#ffaa00] via-[#ff3366] to-[#7928ca] shrink-0 shadow-md">
          <div class="w-full h-full rounded-full bg-white p-1 flex items-center justify-center">
            <img src="/logo/logo-icon.png" alt="BordProd Avatar" class="w-full h-full object-contain rounded-full" />
          </div>
        </div>
        <div>
          <div class="flex items-center justify-center md:justify-start gap-2">
            <h3 class="text-xl font-black text-zinc-900">@bord_prodagency</h3>
            <svg class="w-5 h-5 text-[#00abbd]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <p class="text-xs text-zinc-500 font-semibold mt-1">
            {$t('ig_subtitle')}
          </p>
        </div>
      </div>

      <a 
        href={INSTAGRAM_PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        class="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3] text-white font-black text-xs shadow-md hover:opacity-90 active:scale-95 transition-all shrink-0 flex items-center gap-2"
      >
        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        {$t('ig_follow_btn')}
      </a>
    </div>

    <!-- Section Header -->
    <div class="text-center mb-12">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('portfolio_badge')}</span>
      
      <h2 class="text-3xl md:text-4xl font-black text-zinc-900 mt-4 mb-2">
        {$t('portfolio_title').split($t('portfolio_highlight'))[0]}
        <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3]">{$t('portfolio_highlight')}</span>
        {$t('portfolio_title').split($t('portfolio_highlight'))[1] || ''}
      </h2>

      <p class="text-xs text-zinc-500 font-semibold max-w-md mx-auto">
        {$t('portfolio_subtitle')}
      </p>
    </div>

    <!-- Playable Instagram Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each instagramReels as reel}
        <div class="gsap-ig-card group rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-300">
          
          <!-- Embedded Playable Instagram Frame Container -->
          <div class="w-full aspect-[9/14] bg-zinc-950 relative overflow-hidden">
            <iframe 
              src="{reel.embedUrl}" 
              title={reel.title}
              class="w-full h-full border-0" 
              frameborder="0" 
              scrolling="no" 
              allowtransparency={true}
              allow="encrypted-media"
            ></iframe>

            <!-- Quick Expand Button Overlay -->
            <button 
              on:click={() => openReel(reel.id)}
              class="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-black text-white hover:bg-black transition-colors shadow-lg flex items-center gap-1.5"
            >
              <span>▶</span> Grand Écran
            </button>
          </div>

          <!-- Bottom Card Content & Actions -->
          <div class="p-4 bg-white flex flex-col justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-[#00abbd]">{reel.category}</span>
              <h3 class="text-sm font-black text-zinc-900 leading-snug">{reel.title}</h3>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-zinc-100">
              <button 
                on:click={() => openReel(reel.id)}
                class="text-xs font-bold text-zinc-900 hover:text-[#00abbd] transition-colors flex items-center gap-1"
              >
                <span>⚡ Jouer ici</span>
              </button>
              <a 
                href={reel.url} 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-[11px] font-bold text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                Instagram ↗
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- CTA Button to Form -->
    <div class="text-center mt-12">
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

  <!-- Interactive Fullscreen Playable Reel Modal -->
  {#if activeReelId}
    <div 
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      on:click={closeReel}
    >
      <div 
        class="relative w-full max-w-lg bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 p-2 flex flex-col items-center"
        on:click|stopPropagation
      >
        <!-- Modal Top Bar -->
        <div class="w-full flex justify-between items-center p-3 text-white border-b border-zinc-800 mb-2">
          <span class="text-xs font-black text-zinc-300">@bord_prodagency Reel Player</span>
          <button 
            on:click={closeReel}
            class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <!-- Embedded Instagram Reel Video Frame -->
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

        <!-- Direct Instagram Action Link -->
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

  <!-- Testimonials Section -->
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

    <!-- Testimonial Grid -->
    <div class="gsap-testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each testimonials as tItem, i}
        <div class="gsap-testimonial-card bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-md flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 {tItem.bgAvatar}">
                {tItem.avatarInitials}
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-zinc-900 leading-tight">{$t(`t${i+1}_author`)}</span>
                <span class="text-[10px] text-zinc-400 font-semibold">{$t(`t${i+1}_role`)}</span>
              </div>
            </div>

            <p class="text-xs text-zinc-600 font-semibold leading-relaxed italic">
              "{$t(`t${i+1}_quote`)}"
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-zinc-100 self-start">
            <span class="text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 shadow-sm">
              {$t(`t${i+1}_metric`)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Who We Are Section -->
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
            <p class="text-5xl font-black mb-1">3+</p>
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
          <p>
            {$t('about_p3')}
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Lead Capture Form Section -->
  <section id="contact-form" class="w-full max-w-3xl px-6 py-20 z-10 border-t border-zinc-200/60">
    <div class="text-center mb-10">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('contact_badge')}</span>
      <h3 class="text-3xl font-extrabold text-zinc-900 mt-4 mb-3">{$t('contact_title')}</h3>
      <p class="text-xs text-zinc-500 font-semibold max-w-sm mx-auto">{$t('contact_subtitle')}</p>
    </div>

    <div class="gsap-form-card rounded-3xl border border-zinc-200/80 bg-white p-6 md:p-10 shadow-xl">
      {#if success}
        <div class="gsap-success-box text-center py-12 space-y-4">
          <div class="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/20 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-zinc-900">{$t('form_success_title')}</h4>
          <p class="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed font-semibold">
            {$t('form_success_desc')}
          </p>
          <button 
            on:click={() => success = false}
            class="px-4 py-2 text-xs font-bold bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
          >
            {$t('form_success_btn')}
          </button>
        </div>
      {:else}
        <form on:submit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label for="name" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_name')}</label>
              <input 
                id="name"
                type="text"
                placeholder={$t('form_name_placeholder')}
                bind:value={name}
                class="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all {nameError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
              />
              {#if nameError}
                <p class="text-xs text-red-500 font-semibold">{nameError}</p>
              {/if}
            </div>

            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_email')}</label>
              <input 
                id="email"
                type="email"
                placeholder={$t('form_email_placeholder')}
                bind:value={email}
                class="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all {emailError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
              />
              {#if emailError}
                <p class="text-xs text-red-500 font-semibold">{emailError}</p>
              {/if}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="space-y-1.5">
              <label for="phone" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_phone')}</label>
              <input 
                id="phone"
                type="text"
                placeholder={$t('form_phone_placeholder')}
                bind:value={phone}
                class="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
              />
            </div>

            <div class="space-y-1.5">
              <label for="company" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_company')}</label>
              <input 
                id="company"
                type="text"
                placeholder={$t('form_company_placeholder')}
                bind:value={company}
                class="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all"
              />
            </div>
          </div>

          <div class="space-y-2">
            <span class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_budget')}</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {#each ['< 2 000 €', '2 000 - 5 000 €', '5 000 - 10 000 €', '10 000 €+'] as bRange}
                <button
                  type="button"
                  on:click={() => budget = bRange}
                  class="px-3 py-3 text-xs font-bold rounded-2xl border text-center transition-all cursor-pointer {budget === bRange ? 'bg-zinc-900 text-white border-zinc-900 shadow-md' : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'}"
                >
                  {bRange}
                </button>
              {/each}
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="desc" class="block text-xs font-bold text-zinc-500 uppercase tracking-wider">{$t('form_desc')}</label>
            <textarea 
              id="desc"
              rows="4"
              placeholder={$t('form_desc_placeholder')}
              bind:value={projectDescription}
              class="w-full bg-zinc-50 border border-zinc-200/80 rounded-2xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all resize-none {projectDescriptionError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
            ></textarea>
            {#if projectDescriptionError}
              <p class="text-xs text-red-500 font-semibold">{projectDescriptionError}</p>
            {/if}
          </div>

          {#if errorMessage}
            <div class="p-4 rounded-2xl bg-red-50 border border-red-150 text-red-500 text-xs font-bold text-center">
              {errorMessage}
            </div>
          {/if}

          <button 
            type="submit"
            disabled={loading}
            class="w-full py-4 rounded-2xl bg-zinc-900 text-white font-bold text-sm tracking-wider uppercase hover:bg-zinc-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            {#if loading}
              <Spinner size="sm" />
              {$t('form_loading')}
            {:else}
              {$t('form_submit')}
            {/if}
          </button>
        </form>
      {/if}
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center py-8 px-6 border-t border-zinc-200/60 z-10 text-xs text-zinc-500 gap-4 bg-transparent">
    <div class="flex items-center gap-2">
      <img src="/logo/logo-icon.png" alt="BordProd Icon" class="h-6 object-contain" />
      <span>&copy; 2026 BordProd. {$t('footer_copy')}</span>
    </div>
    <div class="flex items-center gap-4">
      <a href={INSTAGRAM_PROFILE} target="_blank" rel="noopener noreferrer" class="hover:text-zinc-900">Instagram @bord_prodagency</a>
      <span>&middot;</span>
      <a href="#showcase" class="hover:text-zinc-900">{$t('footer_legal')}</a>
      <span>&middot;</span>
      <a href="#showcase" class="hover:text-zinc-900">{$t('footer_privacy')}</a>
      <span>&middot;</span>
      <a href="/dashboard/85e8d89e-4b47-49d7-84bc-79f9435b0b2e" class="text-[#00abbd] font-bold hover:underline">{$t('footer_crm')}</a>
    </div>
  </footer>
</main>
