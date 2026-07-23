<script lang="ts">
  /**
   * BordProd Landing Page - Subtle Tastful Animations & Designjoy Aesthetic
   * =====================================================================
   * Clean off-white canvas (#f5f4f0), vibrant mesh gradient accent cards,
   * subtle text staggers (no 3D tilts/gimmicks), and internationalization.
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

  function getCardTitle(keyPrefix: string) {
    return $t(`${keyPrefix}_title` as any);
  }

  function getCardDesc(keyPrefix: string) {
    return $t(`${keyPrefix}_desc` as any);
  }

  // Designjoy Feature Cards Gradient Specifications
  const featureCards = [
    {
      keyPrefix: 'f1',
      bgGradient: 'from-[#ffaa00] via-[#ff5500] to-[#e6005c]',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },
    {
      keyPrefix: 'f2',
      bgGradient: 'from-[#0066ff] via-[#7a00ff] to-[#ff00cc]',
      icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z'
    },
    {
      keyPrefix: 'f3',
      bgGradient: 'from-[#ff3300] via-[#ff6600] to-[#ffcc00]',
      icon: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z'
    },
    {
      keyPrefix: 'f4',
      bgGradient: 'from-[#ff007f] via-[#7928ca] to-[#0070f3]',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    {
      keyPrefix: 'f5',
      bgGradient: 'from-[#00c6ff] via-[#0072ff] to-[#7928ca]',
      icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
    }
  ];

  // Vertical Reels Showcase
  const verticalVideos = [
    {
      client: '@Julie_Fintech',
      views: '1.2M',
      bgGradient: 'from-cyan-400 to-blue-500'
    },
    {
      client: '@Hugo_B2B',
      views: '450K',
      bgGradient: 'from-teal-400 to-emerald-500'
    },
    {
      client: '@Elena_Lifestyle',
      views: '2.8M',
      bgGradient: 'from-amber-300 to-orange-500'
    },
    {
      client: '@Docteur_Malik',
      views: '890K',
      bgGradient: 'from-indigo-400 to-purple-550'
    },
    {
      client: '@Alice_Agency',
      views: '1.5M',
      bgGradient: 'from-rose-450 to-pink-500'
    }
  ];

  // Testimonials Meta Details
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
    // 1. Tasteful Hero Entrance Animation (Subtle Y-slide & Fade)
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

    // Helper for subtle scroll reveals with guaranteed clean layout
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

    // 2. Section Scroll Reveals
    setupScrollReveal('#features', '.gsap-feature-card', 0.06);
    setupScrollReveal('#who-we-are', '.gsap-about-card', 0);
    setupScrollReveal('#who-we-are', '.gsap-about-content', 0);
    setupScrollReveal('#testimonials', '.gsap-testimonial-card', 0.07);
    setupScrollReveal('#portfolio', '.gsap-reel-card', 0.06);
    setupScrollReveal('#contact-form', '.gsap-form-card', 0);
  });
</script>

<svelte:head>
  <title>BordProd | {$t('hero_badge')}</title>
</svelte:head>

<main 
  dir={$locale === 'ar' ? 'rtl' : 'ltr'} 
  class="min-h-screen flex flex-col items-center justify-between bg-[#f5f4f0] text-[#1a1a1a] relative overflow-hidden font-sans"
>
  
  <!-- Subtle SVG Noise Grain Overlay -->
  <div class="fixed inset-0 pointer-events-none z-0 opacity-[0.035]" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E');"></div>

  <!-- Floating background colorful gradient blur orbs -->
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
      <a href="#who-we-are" class="hover:text-[#00abbd] transition-colors">{$t('nav_about')}</a>
      <a href="#features" class="hover:text-[#00abbd] transition-colors">{$t('nav_features')}</a>
      <a href="#testimonials" class="hover:text-[#00abbd] transition-colors">{$t('nav_testimonials')}</a>
      <a href="#portfolio" class="hover:text-[#00abbd] transition-colors">{$t('nav_portfolio')}</a>
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
    
    <!-- Tasteful Word-by-Word Staggered Title -->
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
        href="#portfolio"
        class="gsap-hero-btn px-7 py-4 text-sm font-black rounded-full bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-sm"
      >
        {$t('hero_secondary')}
      </a>
    </div>

    <!-- Showreel Video Frame -->
    <div class="gsap-hero-video w-full max-w-4xl rounded-3xl border border-zinc-300/80 bg-white p-3.5 shadow-2xl relative group transition-shadow duration-300">
      <div class="w-full aspect-video rounded-2xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-[#004e57]/40 via-zinc-950 to-[#5c4a16]/30 opacity-85 z-0"></div>
        
        <div class="z-10 flex flex-col items-center gap-4 cursor-pointer">
          <div class="w-20 h-20 rounded-full bg-white/15 border border-white/30 hover:border-white/50 hover:bg-white/30 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-2xl group-hover:scale-105">
            <svg class="w-7 h-7 text-white fill-white {$locale === 'ar' ? '-translate-x-0.5 rotate-180' : 'translate-x-0.5'}" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">{$t('hero_player_cta')}</span>
        </div>

        <div class="absolute bottom-4 {$locale === 'ar' ? 'right-4' : 'left-4'} z-10 flex gap-2">
          <span class="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-black text-[#00abbd] border border-[#00abbd]/20">{$t('hero_player_badge')}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Designjoy-Style Mesh Gradient Features Section -->
  <section id="features" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
    <div class="text-center mb-16">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('features_badge')}</span>
      
      <h2 class="text-4xl md:text-5xl font-black text-zinc-900 mt-4 mb-3">
        {$t('features_title').split($t('features_highlight'))[0]}
        <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3]">{$t('features_highlight')}</span>
      </h2>
      <p class="text-sm text-zinc-500 font-semibold max-w-lg mx-auto">
        {$t('features_subtitle')}
      </p>
    </div>

    <!-- 5 Designjoy Mesh Gradient Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
      {#each featureCards as card}
        <div class="gsap-feature-card bg-white rounded-3xl p-5 border border-zinc-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <!-- Top Gradient Box with Icon -->
          <div class="w-full aspect-square rounded-2xl bg-gradient-to-br {card.bgGradient} p-6 flex items-center justify-center relative overflow-hidden shadow-lg mb-4 group-hover:scale-[1.02] transition-transform">
            <div class="absolute inset-0 bg-black/5"></div>
            
            <svg class="w-10 h-10 text-white drop-shadow-md z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d={card.icon} />
            </svg>
          </div>

          <!-- Bottom Text Content -->
          <div class="space-y-1.5 text-center sm:text-left">
            <h3 class="text-base font-black text-zinc-900">{getCardTitle(card.keyPrefix)}</h3>
            <p class="text-xs text-zinc-500 font-medium leading-relaxed">{getCardDesc(card.keyPrefix)}</p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Featured Designjoy Booking Card Section -->
  <section class="w-full max-w-5xl px-6 py-12 z-10">
    <div class="gsap-booking-card w-full rounded-3xl bg-gradient-to-br from-[#ffaa00] via-[#ff3366] to-[#7928ca] p-8 md:p-12 shadow-2xl text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
      <div class="absolute inset-0 bg-black/10"></div>

      <div class="z-10 space-y-3 max-w-xl text-center md:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black border border-white/20">
          <span>⚡</span> {$t('booking_card_note')}
        </div>
        <h3 class="text-3xl md:text-4xl font-black leading-tight drop-shadow-sm">
          {$t('booking_card_title')}
        </h3>
        <p class="text-sm font-medium text-white/90 leading-relaxed">
          {$t('booking_card_sub')}
        </p>
      </div>

      <div class="z-10 shrink-0">
        <button 
          on:click={scrollToForm}
          class="px-8 py-4 rounded-2xl bg-white text-zinc-900 hover:bg-zinc-100 font-black text-sm shadow-xl active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          {$t('booking_card_btn')}
        </button>
      </div>
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
            <!-- Author Header -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 {tItem.bgAvatar}">
                {tItem.avatarInitials}
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-zinc-900 leading-tight">{$t(`t${i+1}_author`)}</span>
                <span class="text-[10px] text-zinc-400 font-semibold">{$t(`t${i+1}_role`)}</span>
              </div>
            </div>

            <!-- Quote text -->
            <p class="text-xs text-zinc-600 font-semibold leading-relaxed italic">
              "{$t(`t${i+1}_quote`)}"
            </p>
          </div>

          <!-- Bottom key metric pill -->
          <div class="mt-6 pt-4 border-t border-zinc-100 self-start">
            <span class="text-[10px] font-bold px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-800 shadow-sm">
              {$t(`t${i+1}_metric`)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Video Portfolio Section -->
  <section id="portfolio" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
    <div class="text-center mb-12">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('portfolio_badge')}</span>
      
      {#if $locale === 'ar'}
        <h2 class="text-3xl font-black text-zinc-900 mt-4 mb-2">
          لقد <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-[#ff3366]">غيروا</span> حضورهم الرقمي
        </h2>
      {:else}
        <h2 class="text-3xl font-black text-zinc-900 mt-4 mb-2">
          {$t('portfolio_title').split($t('portfolio_highlight'))[0]}
          <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ffaa00] to-[#ff3366]">{$t('portfolio_highlight')}</span>
          {$t('portfolio_title').split($t('portfolio_highlight'))[1] || ''}
        </h2>
      {/if}

      <p class="text-xs text-zinc-500 font-semibold max-w-md mx-auto">
        {$t('portfolio_subtitle')}
      </p>
    </div>

    <!-- Portrait 9:16 Grid of Reels -->
    <div class="gsap-reels-grid grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each verticalVideos as video, i}
        <div class="gsap-reel-card aspect-[9/16] rounded-3xl bg-zinc-950 border border-zinc-200 shadow-lg relative group overflow-hidden flex flex-col justify-between p-4 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 cursor-pointer">
          <div class="absolute inset-0 bg-gradient-to-tr {video.bgGradient} opacity-85 z-0"></div>
          <div class="absolute inset-0 bg-black/10 z-0"></div>
          
          <!-- Top Row: Handle and Views -->
          <div class="z-10 flex justify-between items-center text-[10px] font-bold text-white">
            <span class="bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm">{video.client}</span>
            <span class="bg-white/25 px-2 py-0.5 rounded-full backdrop-blur-sm">{video.views}</span>
          </div>

          <!-- Center Play Icon -->
          <div class="z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center self-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all">
            <svg class="w-4 h-4 text-white fill-white {$locale === 'ar' ? '-translate-x-0.5 rotate-180' : 'translate-x-0.5'}" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>

          <!-- Bottom: Title and Metric Badge -->
          <div class="z-10 space-y-2">
            <p class="text-xs font-black text-white leading-tight drop-shadow-sm">{$t(`p${i+1}_title`)}</p>
            <div class="inline-block bg-white text-zinc-900 text-[9px] font-black px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
              {$t(`p${i+1}_metric`)}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Call to action linked to form -->
    <div class="text-center mt-12">
      <button 
        on:click={scrollToForm}
        class="inline-flex items-center gap-2 text-xs font-black px-7 py-4 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-xl cursor-pointer"
      >
        {$t('portfolio_cta')}
        <svg class="w-4 h-4 {$locale === 'ar' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
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
            <!-- Name -->
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

            <!-- Email -->
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
            <!-- Phone -->
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

            <!-- Company -->
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

          <!-- Budget Range -->
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

          <!-- Project Description -->
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

          <!-- Submit Button -->
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
      <a href="#showcase" class="hover:text-zinc-900">{$t('footer_legal')}</a>
      <span>&middot;</span>
      <a href="#showcase" class="hover:text-zinc-900">{$t('footer_privacy')}</a>
      <span>&middot;</span>
      <a href="/dashboard/85e8d89e-4b47-49d7-84bc-79f9435b0b2e" class="text-[#00abbd] font-bold hover:underline">{$t('footer_crm')}</a>
    </div>
  </footer>
</main>
