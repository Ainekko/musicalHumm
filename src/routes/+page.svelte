<script lang="ts">
  /**
   * BordProd Landing Page - High Performance Video Production Showcase
   * =========================================================================
   * Separated S3 Client Showcase + Dedicated BTS Backstage Section + Instagram Grid
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

  // Active S3 Modal Video Player
  interface S3VideoItem {
    id: string;
    clientKey: 'atlas' | 'fitness' | 'iron' | 'immoby' | 'mondial' | 'rein';
    clientName: string;
    category: string;
    title: string;
    url: string;
    badgeBg: string;
  }

  interface BTSVideoItem {
    id: string;
    title: string;
    url: string;
    tag: string;
  }

  let activeS3ModalVideo: { title: string; clientName: string; category: string; url: string; badgeBg: string } | null = null;
  let activeReelId: string | null = null;

  // S3 Portfolio Filter State
  let selectedFilter: string = 'all';

  // Hero Video Player Controls
  let heroVideoRef: HTMLVideoElement | null = null;
  let heroIsMuted = true;
  let heroIsPlaying = true;

  const INSTAGRAM_PROFILE = "https://www.instagram.com/bord_prodagency?igsh=amxueGN3aXhiYWt6";
  const HERO_VIDEO_URL = "https://xander-files.s3.us-east-1.amazonaws.com/brodpod/hero+video.mp4";

  // Client S3 Media (Excluding BTS)
  const clientPortfolioVideos: S3VideoItem[] = [
    // Client 1: Rein Abayas
    {
      id: 'rein-1',
      clientKey: 'rein',
      clientName: 'Rein Abayas',
      category: 'Mode & Couture',
      title: 'Rein Abayas Collection #01',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/rein+abayas/rein+1.mp4',
      badgeBg: 'from-pink-600 to-rose-400'
    },
    {
      id: 'rein-2',
      clientKey: 'rein',
      clientName: 'Rein Abayas',
      category: 'Mode & Couture',
      title: 'Rein Abayas Collection #02',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/rein+abayas/rein+2.mp4',
      badgeBg: 'from-fuchsia-500 to-pink-500'
    },
    // Client 2: Atlas Dental
    {
      id: 'atlas-1',
      clientKey: 'atlas',
      clientName: 'Atlas Dental',
      category: 'Cabinet Dentaire',
      title: 'Atlas Dental Commercial Spot',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/atlas+dental/AQPYdvtgPDs7Dm66xEvCUQFGuJM9RL6UQEtdOFx18DckwU86OThG_5BeUvZwc_KRVJQMp7cmf_X_D8dox0tPQtpmbVn3kKSW.mp4',
      badgeBg: 'from-cyan-500 to-blue-600'
    },
    // Client 3: Fitness Gols
    {
      id: 'fitness-1',
      clientKey: 'fitness',
      clientName: 'Fitness Gols',
      category: 'Coaching & Transformation',
      title: 'Weight Loss Challenge #3',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/fitness+gols/Weight+Loss+Challenge+3.mp4',
      badgeBg: 'from-amber-500 to-orange-500'
    },
    {
      id: 'fitness-2',
      clientKey: 'fitness',
      clientName: 'Fitness Gols',
      category: 'Coaching & Performance',
      title: 'XTREM 4 Challenge',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/fitness+gols/XTREM+4+CHALLENG+modife+1.mp4',
      badgeBg: 'from-orange-500 to-red-500'
    },
    // Client 4: Iron Gym
    {
      id: 'iron-1',
      clientKey: 'iron',
      clientName: 'Iron Gym',
      category: 'Musculation & Fitness',
      title: 'Iron Gym Exercise #01',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/iron+gym/igon+gym+Exercise+1.mp4',
      badgeBg: 'from-red-600 to-rose-500'
    },
    {
      id: 'iron-2',
      clientKey: 'iron',
      clientName: 'Iron Gym',
      category: 'Musculation & Fitness',
      title: 'Iron Gym Exercise #04',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/iron+gym/igon+gym+Exercise+4.mp4',
      badgeBg: 'from-rose-600 to-pink-500'
    },
    // Client 5: M Immoby
    {
      id: 'immoby-1',
      clientKey: 'immoby',
      clientName: 'M Immoby',
      category: 'Immobilier de Luxe',
      title: 'M Immoby Brand Spotlight',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/AQOBKxV1B6WureFzOBhCOeS05uHuHwrsNSJPZ6ZO22tddEoCb9pCkI_EBl2qsRFhGaskbKLVnl0Nyp8VlYWehFlI8_G4z_yy.mp4',
      badgeBg: 'from-emerald-500 to-teal-400'
    },
    {
      id: 'immoby-2',
      clientKey: 'immoby',
      clientName: 'M Immoby',
      category: 'Immobilier de Luxe',
      title: 'Reel Eva Park Villa #01',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/reel+eva+park+01.mp4',
      badgeBg: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'immoby-3',
      clientKey: 'immoby',
      clientName: 'M Immoby',
      category: 'Immobilier de Luxe',
      title: 'Reel Eva Park Villa #02',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/m+immoby/reel+eva+park+02.mp4',
      badgeBg: 'from-cyan-600 to-blue-500'
    },
    // Client 6: Mondial Media
    {
      id: 'mondial-1',
      clientKey: 'mondial',
      clientName: 'Mondial Media',
      category: 'Agence & Production Média',
      title: 'Mondial Media Spot #01',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/mondial+media/01.mp4',
      badgeBg: 'from-purple-600 to-indigo-500'
    },
    {
      id: 'mondial-2',
      clientKey: 'mondial',
      clientName: 'Mondial Media',
      category: 'Agence & Production Média',
      title: 'Mondial Media Campaign #05',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/mondial+media/Mondial+Media+5+modife.mp4',
      badgeBg: 'from-indigo-600 to-violet-500'
    }
  ];

  // Separated Dedicated BTS / Les Coulisses Section Videos
  const btsVideos: BTSVideoItem[] = [
    {
      id: 'bts-1',
      title: 'Backstage Tournage Studio #01',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/1.MP4',
      tag: 'Coulisses Plateaux'
    },
    {
      id: 'bts-2',
      title: 'Coulisses Production Cinema #02',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/2.mp4',
      tag: 'Direction Technique'
    },
    {
      id: 'bts-3',
      title: 'Iron Gym Shoot - Backstage Live',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/iron+gym.mp4',
      tag: 'On-Set Action'
    },
    {
      id: 'bts-4',
      title: 'Session Suhail Hadad - Directing BTS',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/les+coulisses+BTS/suhail+hadad.mp4',
      tag: 'Making Of'
    }
  ];

  // Real Instagram Posts Grid
  const instagramReels = [
    {
      id: 'DOWQAHcDMQt',
      url: 'https://www.instagram.com/p/DOWQAHcDMQt/',
      embedUrl: 'https://www.instagram.com/p/DOWQAHcDMQt/embed',
      title: 'Direction Artistique & Studio',
      category: 'Brand Pitch'
    },
    {
      id: 'DOeIeUHjDcb',
      url: 'https://www.instagram.com/p/DOeIeUHjDcb/',
      embedUrl: 'https://www.instagram.com/p/DOeIeUHjDcb/embed',
      title: 'Hook Publicitaire Performance',
      category: 'Performance Ad'
    },
    {
      id: 'DPzZIWNjJIw',
      url: 'https://www.instagram.com/p/DPzZIWNjJIw/',
      embedUrl: 'https://www.instagram.com/p/DPzZIWNjJIw/embed',
      title: 'Reel Cinéma & Sound Design',
      category: 'Cinema Reel'
    },
    {
      id: 'DO6lfHEDHEk',
      url: 'https://www.instagram.com/p/DO6lfHEDHEk/',
      embedUrl: 'https://www.instagram.com/p/DO6lfHEDHEk/embed',
      title: 'Format Viral 9:16 High-CTR',
      category: 'Viral UGC'
    }
  ];

  // Testimonials Details
  // Real Video Client Feedback / Testimonials S3 Media
  const feedbackVideos: S3VideoItem[] = [
    {
      id: 'feedback-1',
      clientKey: 'feedback',
      clientName: 'Ingénieur Fitness',
      category: 'Avis Client 🌟',
      title: 'Témoignage Ingénieur Fitness',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/ingenieur+fitness+feed+back.mp4',
      badgeBg: 'from-amber-500 to-orange-500'
    },
    {
      id: 'feedback-2',
      clientKey: 'feedback',
      clientName: 'Kawtar Samih',
      category: 'Avis Client 🌟',
      title: 'Témoignage Kawtar Samih',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/kawtar+samih+feed+back.mp4',
      badgeBg: 'from-pink-600 to-rose-400'
    },
    {
      id: 'feedback-3',
      clientKey: 'feedback',
      clientName: 'Mustapha',
      category: 'Avis Client 🌟',
      title: 'Témoignage Mustapha',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/mustapha+feed+back.mp4',
      badgeBg: 'from-blue-600 to-indigo-500'
    },
    {
      id: 'feedback-4',
      clientKey: 'feedback',
      clientName: 'Souhaile Haddad',
      category: 'Avis Client 🌟',
      title: 'Témoignage Souhaile Haddad',
      url: 'https://xander-files.s3.us-east-1.amazonaws.com/brodpod/feedback/souhaile+haddad+feed+back.mp4',
      badgeBg: 'from-emerald-500 to-teal-600'
    }
  ];

  $: filteredClientVideos = selectedFilter === 'all' 
    ? clientPortfolioVideos 
    : clientPortfolioVideos.filter(v => v.clientKey === selectedFilter);

  // Stats Counting Animation State
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

  // Portfolio Horizontal Slider Navigation
  let portfolioCarouselRef: HTMLDivElement | null = null;

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

  function openS3VideoModal(video: { title: string; clientName: string; category: string; url: string; badgeBg: string }) {
    activeS3ModalVideo = video;
  }

  function closeS3VideoModal() {
    activeS3ModalVideo = null;
  }

  function openReel(id: string) {
    activeReelId = id;
  }

  function closeReel() {
    activeReelId = null;
  }

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

    setupScrollReveal('#portfolio-showcase', '.gsap-portfolio-card', 0.05);
    setupScrollReveal('#bts-showcase', '.gsap-bts-card', 0.07);
    setupScrollReveal('#instagram-showcase', '.gsap-ig-card', 0.07);
    setupScrollReveal('#testimonials', '.gsap-testimonial-card', 0.07);
    setupScrollReveal('#who-we-are', '.gsap-about-card', 0);
    setupScrollReveal('#who-we-are', '.gsap-about-content', 0);
    setupScrollReveal('#contact-form', '.gsap-form-card', 0);

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

<svelte:head>
  <title>BordProd | Production Vidéo High-End & Performance</title>
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

  <!-- Header Navigation -->
  <header class="w-full max-w-6xl flex justify-between items-center z-20 py-5 px-6 border-b border-zinc-200/60 bg-[#f5f4f0]/85 backdrop-blur-md sticky top-0">
    <div class="flex items-center gap-2">
      <img src="/logo/logo.png" alt="BordProd Logo" class="h-9 md:h-11 object-contain" />
    </div>
    <nav class="hidden lg:flex items-center gap-8 text-xs font-black uppercase tracking-wider text-zinc-600">
      <a href="#portfolio-showcase" class="hover:text-[#00abbd] transition-colors">{$t('nav_portfolio')}</a>
      <a href="#bts-showcase" class="hover:text-[#00abbd] transition-colors">BTS</a>
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
          src={HERO_VIDEO_URL}
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

  <!-- SHOW DON'T TELL: Full-Width S3 Client Video Portfolio Carousel Section -->
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

  <!-- SEPARATED DEDICATED SECTION: LES COULISSES / BTS (BEHIND THE SCENES) -->
  <section id="bts-showcase" class="w-full bg-[#111113] text-white py-20 z-10 border-t border-zinc-800 relative overflow-hidden">
    <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_rgba(0,171,189,0.15),transparent_60%)]"></div>
    
    <div class="w-full max-w-6xl mx-auto px-6">
      
      <!-- Section Header -->
      <div class="text-center mb-14">
        <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#00abbd]/10 border border-[#00abbd]/30 shadow-sm">
          {$t('bts_section_badge')}
        </span>
        
        <h2 class="text-3xl md:text-5xl font-black text-white mt-4 mb-3">
          {$t('bts_section_title').split($t('bts_section_highlight'))[0]}
          <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#00abbd] via-teal-300 to-emerald-400">{$t('bts_section_highlight')}</span>
          {$t('bts_section_title').split($t('bts_section_highlight'))[1] || ''}
        </h2>

        <p class="text-xs md:text-sm text-zinc-400 font-semibold max-w-lg mx-auto">
          {$t('bts_section_sub')}
        </p>
      </div>

      <!-- BTS Video Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each btsVideos as bts}
          <div class="gsap-bts-card group rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-[#00abbd]/50 transition-all duration-300">
            
            <div 
              class="w-full aspect-[9/14] bg-black relative overflow-hidden group cursor-pointer"
              on:click={() => openS3VideoModal({ title: bts.title, clientName: "Les Coulisses BTS", category: bts.tag, url: bts.url, badgeBg: "from-zinc-700 to-zinc-900" })}
            >
              <video 
                use:lazyVideo={bts.url}
                muted
                loop
                playsinline
                preload="none"
                on:mouseenter={handleVideoHover}
                on:mouseleave={handleVideoLeave}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
              ></video>

              <!-- BTS Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 p-4 flex flex-col justify-between">
                
                <div class="flex justify-between items-center">
                  <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-zinc-800/80 border border-zinc-700 backdrop-blur-md">
                    🎬 {bts.tag}
                  </span>
                  
                  <span class="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-black/60 px-2 py-0.5 rounded-full border border-red-500/20">
                    <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> REC
                  </span>
                </div>

                <div class="flex flex-col items-center justify-center gap-2 my-auto opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                  <div class="w-14 h-14 rounded-full bg-[#00abbd]/20 backdrop-blur-md border border-[#00abbd]/50 flex items-center justify-center text-white shadow-2xl">
                    <svg class="w-6 h-6 fill-[#00abbd] translate-x-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <span class="text-[10px] font-black tracking-widest text-zinc-200 uppercase bg-black/70 px-3 py-1 rounded-full border border-zinc-800">
                    Voir les coulisses ⚡
                  </span>
                </div>

                <div>
                  <h4 class="text-xs font-black text-white line-clamp-2 drop-shadow-md">{bts.title}</h4>
                </div>
              </div>
            </div>

            <div class="p-4 bg-zinc-900 flex items-center justify-between gap-2 border-t border-zinc-800/80">
              <span class="text-[11px] font-bold text-zinc-400 truncate">{bts.title}</span>
              <button 
                on:click={() => openS3VideoModal({ title: bts.title, clientName: "Les Coulisses BTS", category: bts.tag, url: bts.url, badgeBg: "from-zinc-700 to-zinc-900" })}
                class="px-3 py-1.5 rounded-xl bg-[#00abbd] hover:bg-[#0092a1] text-white text-[11px] font-black transition-colors shrink-0 shadow-sm cursor-pointer"
              >
                Jouer
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- INSTAGRAM REELS SECTION: Ultra-Clean High-End Showcase -->
  <section id="instagram-showcase" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-200/60">
    
    <!-- Section Header Bar -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
      <div class="text-center md:text-left space-y-2">
        <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
          {$t('ig_section_badge')}
        </span>
        <h3 class="text-3xl md:text-4xl font-black text-zinc-900">
          Suivez notre fil <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3]">Instagram</span>
        </h3>
        <p class="text-xs text-zinc-500 font-semibold">
          @bord_prodagency &middot; Nouveaux reels, coulisses et direct response ads au quotidien.
        </p>
      </div>

      <!-- Instagram Follow Action Card -->
      <a 
        href={INSTAGRAM_PROFILE}
        target="_blank"
        rel="noopener noreferrer"
        class="group px-6 py-3.5 rounded-full bg-white border border-zinc-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-3 shrink-0"
      >
        <div class="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-[#ffaa00] via-[#ff3366] to-[#7928ca] group-hover:scale-110 transition-transform">
          <div class="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center">
            <img src="/logo/logo-icon.png" alt="BordProd" class="w-full h-full object-contain rounded-full" />
          </div>
        </div>

        <div class="text-left">
          <div class="flex items-center gap-1">
            <span class="text-xs font-black text-zinc-900">@bord_prodagency</span>
            <svg class="w-3.5 h-3.5 text-[#00abbd]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <span class="text-[10px] text-zinc-400 font-bold">Rejoindre sur Instagram ↗</span>
        </div>
      </a>
    </div>

    <!-- Native Instagram 9:16 Reel Embed Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each instagramReels as reel}
        <div class="gsap-ig-card group rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
          
          <!-- Native Instagram Embed Container -->
          <div class="w-full aspect-[9/16] bg-zinc-950 relative overflow-hidden flex flex-col justify-between">
            <iframe 
              src={reel.embedUrl} 
              title={reel.title}
              class="w-full h-full border-0" 
              frameborder="0" 
              scrolling="no" 
              allowtransparency={true}
              allow="encrypted-media"
            ></iframe>
          </div>

          <!-- Card Footer Action -->
          <a 
            href={reel.url}
            target="_blank"
            rel="noopener noreferrer"
            class="p-4 bg-white flex items-center justify-between border-t border-zinc-100 hover:bg-zinc-50 transition-colors"
          >
            <div>
              <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">{reel.category}</span>
              <h5 class="text-xs font-black text-zinc-900 truncate max-w-[190px]">{reel.title}</h5>
            </div>
            <span class="text-xs text-[#00abbd] font-black group-hover:translate-x-1 transition-transform">↗</span>
          </a>
        </div>
      {/each}
    </div>
  </section>

  <!-- Fullscreen HD Modal Player for S3 Videos -->
  {#if activeS3ModalVideo}
    <div 
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4"
      on:click={closeS3VideoModal}
    >
      <div 
        class="relative w-full max-w-3xl bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 p-4 flex flex-col items-center"
        on:click|stopPropagation
      >
        <!-- Modal Header Bar -->
        <div class="w-full flex justify-between items-center p-3 text-white border-b border-zinc-800/80 mb-3">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase text-white bg-gradient-to-r {activeS3ModalVideo.badgeBg}">
              {activeS3ModalVideo.clientName}
            </span>
            <span class="text-xs font-black text-zinc-300">{activeS3ModalVideo.title}</span>
          </div>

          <button 
            on:click={closeS3VideoModal}
            class="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- High Definition Video Player -->
        <div class="w-full max-h-[70vh] aspect-video bg-black rounded-2xl overflow-hidden relative flex items-center justify-center">
          <video 
            src={activeS3ModalVideo.url} 
            controls 
            autoplay 
            playsinline
            class="w-full h-full object-contain rounded-2xl"
          ></video>
        </div>

        <!-- Modal Footer Actions -->
        <div class="w-full p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span class="text-xs font-bold text-zinc-400 uppercase tracking-wider">{activeS3ModalVideo.category}</span>
            <h4 class="text-sm font-black text-white">{activeS3ModalVideo.title}</h4>
          </div>

          <button 
            on:click={() => { closeS3VideoModal(); scrollToForm(); }}
            class="px-6 py-3 rounded-xl bg-[#00abbd] hover:bg-[#0092a1] text-white text-xs font-black shadow-lg transition-all cursor-pointer shrink-0"
          >
            Demander un projet similaire ➔
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Interactive Instagram Reel Modal Player -->
  {#if activeReelId}
    <div 
      class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      on:click={closeReel}
    >
      <div 
        class="relative w-full max-w-lg bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 p-2 flex flex-col items-center"
        on:click|stopPropagation
      >
        <div class="w-full flex justify-between items-center p-3 text-white border-b border-zinc-800 mb-2">
          <span class="text-xs font-black text-zinc-300">@bord_prodagency Reel Player</span>
          <button 
            on:click={closeReel}
            class="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-white font-bold text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

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

    <!-- Video Feedback Client Testimonials Grid -->
    <div class="gsap-testimonials-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each feedbackVideos as video (video.id)}
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
            class="px-4 py-2 text-xs font-bold bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors cursor-pointer"
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
              {#each ['< 2 000 MAD', '2 000 - 5 000 MAD', '5 000 - 10 000 MAD', '10 000 MAD+'] as bRange}
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
      <a href="#portfolio-showcase" class="hover:text-zinc-900">{$t('footer_legal')}</a>
      <span>&middot;</span>
      <a href="#portfolio-showcase" class="hover:text-zinc-900">{$t('footer_privacy')}</a>
    </div>
  </footer>
</main>
