<script lang="ts">
  /**
   * BordProd Landing Page - High-End Kinetic GSAP Animations & i18n
   * ================================================================
   * Clean white theme with Apple / Awwwards kinetic word typography,
   * 3D perspective tilt micro-interactions, and bulletproof scroll reveals.
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

  // Simple client-side errors
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
          { opacity: 0, scale: 0.85, y: 20 }, 
          { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: 'back.out(1.7)', clearProps: 'all' }
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
    // 1. Kinetic Hero Word Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.gsap-hero-badge', 
      { opacity: 0, y: -25, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.8, clearProps: 'all' }
    )
    .fromTo('.gsap-word', 
      { opacity: 0, y: 45, rotateX: -60 }, 
      { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.85, clearProps: 'all' },
      '-=0.4'
    )
    .fromTo('.gsap-hero-sub', 
      { opacity: 0, y: 25 }, 
      { opacity: 1, y: 0, duration: 0.8, clearProps: 'all' }, 
      '-=0.5'
    )
    .fromTo('.gsap-hero-btn', 
      { opacity: 0, y: 20, scale: 0.9 }, 
      { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7, ease: 'back.out(1.6)', clearProps: 'all' }, 
      '-=0.4'
    )
    .fromTo('.gsap-hero-video', 
      { opacity: 0, y: 50, scale: 0.95 }, 
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', clearProps: 'all' }, 
      '-=0.5'
    );

    // 2. Ambient Floating Motion for Background SVG Elements
    gsap.to('.gsap-float-slow', {
      y: -15,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    // Helper for robust scroll reveals with guaranteed visibility (clearProps)
    function setupScrollReveal(triggerSelector: string, targetSelector: string, fromVars: gsap.TweenVars, toVars: gsap.TweenVars) {
      const triggerEl = document.querySelector(triggerSelector);
      if (!triggerEl) return;

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gsap.fromTo(targetSelector, fromVars, {
              ...toVars,
              onComplete: () => {
                gsap.set(targetSelector, { clearProps: 'all' });
              }
            });
            obs.disconnect();
          }
        });
      }, { threshold: 0.02, rootMargin: '0px 0px -20px 0px' });

      obs.observe(triggerEl);
    }

    // 3. Section Scroll Reveals
    setupScrollReveal(
      '#who-we-are', 
      '.gsap-about-card', 
      { opacity: 0, x: -45, scale: 0.95 }, 
      { opacity: 1, x: 0, scale: 1, duration: 0.9, ease: 'power3.out' }
    );
    setupScrollReveal(
      '#who-we-are', 
      '.gsap-about-content', 
      { opacity: 0, x: 45 }, 
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out' }
    );

    setupScrollReveal(
      '#testimonials', 
      '.gsap-testimonial-card', 
      { opacity: 0, y: 45, scale: 0.93 }, 
      { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: 'back.out(1.4)' }
    );

    setupScrollReveal(
      '#portfolio', 
      '.gsap-reel-card', 
      { opacity: 0, y: 55, scale: 0.88 }, 
      { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.75, ease: 'power3.out' }
    );

    setupScrollReveal(
      '#contact-form', 
      '.gsap-form-card', 
      { opacity: 0, y: 45, scale: 0.96 }, 
      { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }
    );

    // 4. 3D Perspective Tilt Micro-Interactions on Showreel & Reel Cards
    init3DTilt('.gsap-hero-video');
    init3DTilt('.gsap-reel-card');
  });

  function init3DTilt(elementSelector: string) {
    setTimeout(() => {
      const elements = document.querySelectorAll(elementSelector);
      elements.forEach((el) => {
        const target = el as HTMLElement;
        target.addEventListener('mousemove', (e) => {
          const rect = target.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(target, {
            rotateY: x / 16,
            rotateX: -y / 16,
            transformPerspective: 1000,
            ease: 'power2.out',
            duration: 0.3
          });
        });

        target.addEventListener('mouseleave', () => {
          gsap.to(target, {
            rotateY: 0,
            rotateX: 0,
            ease: 'power2.out',
            duration: 0.5
          });
        });
      });
    }, 100);
  }
</script>

<svelte:head>
  <title>BordProd | {$t('hero_badge')}</title>
</svelte:head>

<main 
  dir={$locale === 'ar' ? 'rtl' : 'ltr'} 
  class="min-h-screen flex flex-col items-center justify-between bg-white text-[#2a3b50] relative overflow-hidden font-sans"
>
  
  <!-- Floating background decorations -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00abbd]/5 blur-[120px]"></div>
    <div class="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffbe1a]/5 blur-[120px]"></div>
    
    <svg class="absolute top-[25%] {$locale === 'ar' ? 'left-[5%]' : 'right-[5%]'} w-48 h-32 text-zinc-100 gsap-float-slow" fill="none" viewBox="0 0 100 50" stroke="currentColor" stroke-width="1">
      <path d="M0,25 L30,25 L35,15 L40,35 L45,20 L50,28 L55,25 L100,25" />
    </svg>
    <svg class="absolute top-[60%] {$locale === 'ar' ? 'right-[2%]' : 'left-[2%]'} w-48 h-32 text-zinc-100 gsap-float-slow" fill="none" viewBox="0 0 100 50" stroke="currentColor" stroke-width="1">
      <path d="M0,25 L30,25 L35,10 L42,40 L47,15 L52,30 L57,25 L100,25" />
    </svg>

    <div class="absolute top-[18%] {$locale === 'ar' ? 'right-[8%]' : 'left-[8%]'} text-[#00abbd]/15 gsap-float-slow">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
    <div class="absolute top-[45%] {$locale === 'ar' ? 'left-[10%]' : 'right-[10%]'} text-[#ffbe1a]/15 gsap-float-slow">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
      </svg>
    </div>
  </div>

  <!-- Header -->
  <header class="w-full max-w-6xl flex justify-between items-center z-10 py-4 px-6 border-b border-zinc-100 bg-white/90 backdrop-blur-md sticky top-0">
    <div class="flex items-center gap-2">
      <img src="/logo/logo.png" alt="BordProd Logo" class="h-9 md:h-11 object-contain" />
    </div>
    <nav class="hidden lg:flex items-center gap-8 text-sm font-bold text-zinc-500">
      <a href="#who-we-are" class="hover:text-[#00abbd] transition-colors">{$t('nav_about')}</a>
      <a href="#testimonials" class="hover:text-[#00abbd] transition-colors">{$t('nav_testimonials')}</a>
      <a href="#portfolio" class="hover:text-[#00abbd] transition-colors">{$t('nav_portfolio')}</a>
      <a href="#contact-form" class="hover:text-[#00abbd] transition-colors">{$t('nav_quote')}</a>
    </nav>
    <div class="flex items-center gap-4">
      <!-- Language Selector -->
      <div class="flex items-center bg-zinc-100 rounded-full p-1 border border-zinc-200">
        <button 
          on:click={() => locale.set('fr')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'fr' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-950'}"
        >
          FR
        </button>
        <button 
          on:click={() => locale.set('en')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'en' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-950'}"
        >
          EN
        </button>
        <button 
          on:click={() => locale.set('ar')} 
          class="text-[10px] font-black px-2.5 py-1 rounded-full transition-colors {$locale === 'ar' ? 'bg-[#00abbd] text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-950'}"
        >
          العربية
        </button>
      </div>

      <button 
        on:click={scrollToForm}
        class="text-xs font-bold px-5 py-2.5 rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 transition-all shadow-md shadow-[#00abbd]/15 cursor-pointer border border-[#00abbd]/10"
      >
        {$t('nav_cta')}
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="w-full max-w-5xl px-6 pt-16 pb-12 text-center z-10 flex flex-col items-center">
    <div class="gsap-hero-badge inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10 text-xs text-[#008ba3] font-bold mb-6">
      <span class="w-2 h-2 rounded-full bg-[#00abbd] animate-pulse"></span>
      {$t('hero_badge')}
    </div>
    
    <!-- Kinetic Word-by-Word Staggered Title -->
    <h1 class="gsap-hero-title text-4xl md:text-6xl font-black tracking-tight leading-tight text-[#0a2f4c] max-w-4xl mb-6 flex flex-wrap justify-center gap-x-2.5 gap-y-1">
      {#each splitTextIntoWords($t('hero_title')) as word}
        <span class="inline-block overflow-hidden py-1">
          <span class="gsap-word inline-block origin-bottom-left">
            {#if word === $t('hero_highlight')}
              <span class="font-serif italic text-[#00abbd] font-semibold">{word}</span>
            {:else}
              {word}
            {/if}
          </span>
        </span>
      {/each}
    </h1>

    <p class="gsap-hero-sub text-base md:text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed mb-10">
      {$t('hero_subtitle')}
    </p>
    <div class="flex flex-col sm:flex-row gap-4 mb-16">
      <button 
        on:click={scrollToForm}
        class="gsap-hero-btn px-6 py-3.5 text-sm font-bold rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 shadow-lg shadow-[#00abbd]/25 transition-all cursor-pointer hover:shadow-xl hover:shadow-[#00abbd]/30"
      >
        {$t('hero_cta')}
      </button>
      <a 
        href="#portfolio"
        class="gsap-hero-btn px-6 py-3.5 text-sm font-bold rounded-full bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50 active:scale-95 transition-all text-center hover:border-zinc-300"
      >
        {$t('hero_secondary')}
      </a>
    </div>

    <!-- 3D Perspective Interactive Showreel Video Frame -->
    <div class="gsap-hero-video w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl relative group transition-shadow duration-300 hover:shadow-2xl">
      <div class="w-full aspect-video rounded-xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-tr from-[#004e57]/40 via-zinc-950 to-[#5c4a16]/30 opacity-85 z-0"></div>
        
        <div class="z-10 flex flex-col items-center gap-4 cursor-pointer">
          <div class="w-20 h-20 rounded-full bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-2xl group-hover:scale-110">
            <svg class="w-7 h-7 text-white fill-white {$locale === 'ar' ? '-translate-x-0.5 rotate-180' : 'translate-x-0.5'}" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">{$t('hero_player_cta')}</span>
        </div>

        <div class="absolute bottom-4 {$locale === 'ar' ? 'right-4' : 'left-4'} z-10 flex gap-2">
          <span class="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#00abbd] border border-[#00abbd]/20">{$t('hero_player_badge')}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Who We Are Section -->
  <section id="who-we-are" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <!-- Left Experience Card -->
      <div class="gsap-about-card lg:col-span-5 relative flex justify-center">
        <div class="w-72 h-72 rounded-3xl bg-gradient-to-tr from-[#00abbd] to-[#ffbe1a] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden group hover:scale-[1.03] transition-transform duration-300">
          <div class="absolute inset-0 bg-black/5"></div>
          <div class="z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/25">
            <img src="/logo/logo-icon.png" alt="BordProd Mark" class="w-8 h-8 object-contain" />
          </div>
          <div class="z-10 text-white">
            <p class="text-5xl font-black mb-1">3+</p>
            <p class="text-xs font-black uppercase tracking-wider text-white/95">{$t('about_experience')}</p>
          </div>
        </div>
        <div class="absolute -inset-4 border border-dashed border-[#00abbd]/25 rounded-3xl -z-10 transform rotate-3"></div>
      </div>

      <!-- Right Content -->
      <div class="gsap-about-content lg:col-span-7 space-y-6 {$locale === 'ar' ? 'text-right' : 'text-left'}">
        <div>
          <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3 py-1 bg-[#e0f7f8] rounded-full">{$t('about_badge')}</span>
        </div>
        <h3 class="text-3xl md:text-4xl font-extrabold text-[#0a2f4c] leading-tight">
          {$t('about_title')}
        </h3>
        
        <div class="space-y-4 text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
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
  <section id="testimonials" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100 bg-zinc-50/30">
    <div class="text-center mb-16">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">{$t('testimonials_badge')}</span>
      
      {#if $locale === 'ar'}
        <h2 class="text-3xl md:text-4xl font-black text-[#0a2f4c] mt-4 mb-2">
          ماذا يقول <span class="font-serif italic text-[#00abbd] font-medium">شركاؤنا</span>
        </h2>
      {:else}
        <h2 class="text-3xl md:text-4xl font-black text-[#0a2f4c] mt-4 mb-2">
          {$t('testimonials_title').split($t('testimonials_highlight'))[0]}
          <span class="font-serif italic text-[#00abbd] font-medium">{$t('testimonials_highlight')}</span>
          {$t('testimonials_title').split($t('testimonials_highlight'))[1] || ''}
        </h2>
      {/if}

      <p class="text-sm text-zinc-400 font-semibold max-w-md mx-auto">
        {$t('testimonials_subtitle')}
      </p>
    </div>

    <!-- Testimonial Grid -->
    <div class="gsap-testimonials-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each testimonials as tItem, i}
        <div class="gsap-testimonial-card bg-white rounded-2xl border border-zinc-200/50 p-6 shadow-sm flex flex-col justify-between hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 relative">
          <div class="absolute top-4 {$locale === 'ar' ? 'left-4' : 'right-4'} text-[#00abbd]/5">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4z" />
            </svg>
          </div>

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
            <p class="text-xs text-zinc-500 font-semibold leading-relaxed italic">
              "{$t(`t${i+1}_quote`)}"
            </p>
          </div>

          <!-- Bottom key metric pill -->
          <div class="mt-6 pt-4 border-t border-zinc-100 self-start">
            <span class="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/20 text-[#008ba3] shadow-sm shadow-[#00abbd]/5">
              {$t(`t${i+1}_metric`)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Video Portfolio Section -->
  <section id="portfolio" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100">
    <div class="text-center mb-12">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">{$t('portfolio_badge')}</span>
      
      {#if $locale === 'ar'}
        <h2 class="text-3xl font-black text-[#0a2f4c] mt-4 mb-2">
          لقد <span class="font-serif italic text-[#00abbd] font-medium">غيروا</span> حضورهم الرقمي
        </h2>
      {:else}
        <h2 class="text-3xl font-black text-[#0a2f4c] mt-4 mb-2">
          {$t('portfolio_title').split($t('portfolio_highlight'))[0]}
          <span class="font-serif italic text-[#00abbd] font-medium">{$t('portfolio_highlight')}</span>
          {$t('portfolio_title').split($t('portfolio_highlight'))[1] || ''}
        </h2>
      {/if}

      <p class="text-xs text-zinc-400 font-semibold max-w-md mx-auto">
        {$t('portfolio_subtitle')}
      </p>
    </div>

    <!-- Portrait 9:16 Grid of Reels -->
    <div class="gsap-reels-grid grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each verticalVideos as video, i}
        <div class="gsap-reel-card aspect-[9/16] rounded-2xl bg-zinc-950 border border-zinc-200 shadow-lg relative group overflow-hidden flex flex-col justify-between p-4 hover:scale-[1.04] hover:shadow-2xl hover:border-[#00abbd]/60 transition-all duration-300 cursor-pointer">
          <div class="absolute inset-0 bg-gradient-to-tr {video.bgGradient} opacity-85 z-0"></div>
          <div class="absolute inset-0 bg-black/10 z-0"></div>
          
          <!-- Top Row: Handle and Views -->
          <div class="z-10 flex justify-between items-center text-[10px] font-bold text-white">
            <span class="bg-black/40 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-sm">{video.client}</span>
            <span class="bg-[#00abbd]/85 px-1.5 py-0.5 rounded backdrop-blur-sm">{video.views}</span>
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
            <div class="inline-block bg-white text-[#008ba3] text-[9px] font-black px-2 py-1 rounded-full border border-white/10">
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
        class="inline-flex items-center gap-2 text-xs font-black px-6 py-3.5 rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 transition-all shadow-lg shadow-[#00abbd]/15 cursor-pointer border border-[#00abbd]/10 hover:shadow-xl hover:shadow-[#00abbd]/25"
      >
        {$t('portfolio_cta')}
        <svg class="w-4 h-4 {$locale === 'ar' ? 'rotate-180' : ''}" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </section>

  <!-- Lead Capture Form Section -->
  <section id="contact-form" class="w-full max-w-3xl px-6 py-20 z-10 border-t border-zinc-150">
    <div class="text-center mb-10">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">{$t('contact_badge')}</span>
      <h3 class="text-3xl font-extrabold text-[#0a2f4c] mt-4 mb-3">{$t('contact_title')}</h3>
      <p class="text-xs text-zinc-400 font-semibold max-w-sm mx-auto">{$t('contact_subtitle')}</p>
    </div>

    <div class="gsap-form-card rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-xl">
      {#if success}
        <div class="gsap-success-box text-center py-12 space-y-4">
          <div class="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/20 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-[#0a2f4c]">{$t('form_success_title')}</h4>
          <p class="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed font-semibold">
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
              <label for="name" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_name')}</label>
              <input 
                id="name"
                type="text"
                placeholder={$t('form_name_placeholder')}
                bind:value={name}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all {nameError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
              />
              {#if nameError}
                <p class="text-xs text-red-500 font-semibold">{nameError}</p>
              {/if}
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_email')}</label>
              <input 
                id="email"
                type="email"
                placeholder={$t('form_email_placeholder')}
                bind:value={email}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all {emailError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
              />
              {#if emailError}
                <p class="text-xs text-red-500 font-semibold">{emailError}</p>
              {/if}
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Phone -->
            <div class="space-y-1.5">
              <label for="phone" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_phone')}</label>
              <input 
                id="phone"
                type="text"
                placeholder={$t('form_phone_placeholder')}
                bind:value={phone}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all"
              />
            </div>

            <!-- Company -->
            <div class="space-y-1.5">
              <label for="company" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_company')}</label>
              <input 
                id="company"
                type="text"
                placeholder={$t('form_company_placeholder')}
                bind:value={company}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all"
              />
            </div>
          </div>

          <!-- Budget Range -->
          <div class="space-y-2">
            <span class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_budget')}</span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {#each ['< 2 000 €', '2 000 - 5 000 €', '5 000 - 10 000 €', '10 000 €+'] as bRange}
                <button
                  type="button"
                  on:click={() => budget = bRange}
                  class="px-3 py-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer {budget === bRange ? 'bg-[#00abbd] text-white border-[#00abbd] shadow-md shadow-[#00abbd]/15' : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'}"
                >
                  {bRange}
                </button>
              {/each}
            </div>
          </div>

          <!-- Project Description -->
          <div class="space-y-1.5">
            <label for="desc" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">{$t('form_desc')}</label>
            <textarea 
              id="desc"
              rows="4"
              placeholder={$t('form_desc_placeholder')}
              bind:value={projectDescription}
              class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all resize-none {projectDescriptionError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
            ></textarea>
            {#if projectDescriptionError}
              <p class="text-xs text-red-500 font-semibold">{projectDescriptionError}</p>
            {/if}
          </div>

          {#if errorMessage}
            <div class="p-4 rounded-xl bg-red-50 border border-red-150 text-red-500 text-xs font-bold text-center">
              {errorMessage}
            </div>
          {/if}

          <!-- Submit Button -->
          <button 
            type="submit"
            disabled={loading}
            class="w-full py-4 rounded-xl bg-[#00abbd] text-white font-bold text-sm tracking-wider uppercase hover:bg-[#0091a1] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#00abbd]/15 disabled:opacity-50"
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
  <footer class="w-full max-w-6xl flex flex-col md:flex-row justify-between items-center py-8 px-6 border-t border-zinc-150 z-10 text-xs text-zinc-450 gap-4 bg-transparent">
    <div class="flex items-center gap-2">
      <img src="/logo/logo-icon.png" alt="BordProd Icon" class="h-6 object-contain" />
      <span>&copy; 2026 BordProd. {$t('footer_copy')}</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="#showcase" class="hover:text-zinc-650">{$t('footer_legal')}</a>
      <span>&middot;</span>
      <a href="#showcase" class="hover:text-zinc-650">{$t('footer_privacy')}</a>
      <span>&middot;</span>
      <a href="/dashboard/85e8d89e-4b47-49d7-84bc-79f9435b0b2e" class="text-[#00abbd] font-bold hover:underline">{$t('footer_crm')}</a>
    </div>
  </footer>
</main>
