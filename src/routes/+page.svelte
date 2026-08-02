<script lang="ts">
  /**
   * BordProd Landing Page - High Performance Video Production Showcase
   * =========================================================================
   * Orchestrates the segmented subcomponents for a clean, modular structure.
   */
  import { locale } from '$lib/i18n';

  // Import subcomponents
  import Header from '$lib/components/landing/Header.svelte';
  import Hero from '$lib/components/landing/Hero.svelte';
  import PortfolioCarousel from '$lib/components/landing/PortfolioCarousel.svelte';
  import BTSShowcase from '$lib/components/landing/BTSShowcase.svelte';
  import InstagramGrid from '$lib/components/landing/InstagramGrid.svelte';
  import Testimonials from '$lib/components/landing/Testimonials.svelte';
  import AboutUs from '$lib/components/landing/AboutUs.svelte';
  import ContactForm from '$lib/components/landing/ContactForm.svelte';
  import Footer from '$lib/components/landing/Footer.svelte';
  import S3VideoModal from '$lib/components/landing/S3VideoModal.svelte';
  import ReelModal from '$lib/components/landing/ReelModal.svelte';

  // Interface Declarations
  interface S3VideoItem {
    id: string;
    clientKey: 'atlas' | 'fitness' | 'iron' | 'immoby' | 'mondial' | 'rein' | 'feedback';
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

  // Active Modal States
  let activeS3ModalVideo: S3VideoItem | null = null;
  let activeReelId: string | null = null;

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

  function openS3VideoModal(video: S3VideoItem) {
    activeS3ModalVideo = video;
  }

  function closeS3VideoModal() {
    activeS3ModalVideo = null;
  }

  function closeReel() {
    activeReelId = null;
  }

  function scrollToForm() {
    const el = document.getElementById('contact-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
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
  <Header {scrollToForm} instagramProfile={INSTAGRAM_PROFILE} />

  <!-- Hero Section -->
  <Hero {scrollToForm} heroVideoUrl={HERO_VIDEO_URL} />

  <!-- Portfolio Section -->
  <PortfolioCarousel 
    {clientPortfolioVideos} 
    {openS3VideoModal} 
    {scrollToForm} 
  />

  <!-- BTS Showcase Section -->
  <BTSShowcase 
    {btsVideos} 
    {openS3VideoModal} 
  />

  <!-- Instagram Grid Section -->
  <InstagramGrid 
    instagramProfile={INSTAGRAM_PROFILE} 
    {instagramReels} 
  />

  <!-- Testimonials Section -->
  <Testimonials 
    {feedbackVideos} 
    {openS3VideoModal} 
  />

  <!-- About Us Section -->
  <AboutUs />

  <!-- Lead Capture Form Section -->
  <ContactForm />

  <!-- Footer -->
  <Footer instagramProfile={INSTAGRAM_PROFILE} />

  <!-- Fullscreen HD Modal Player for S3 Videos -->
  <S3VideoModal 
    {activeS3ModalVideo} 
    {closeS3VideoModal} 
    {scrollToForm} 
  />

  <!-- Interactive Instagram Reel Modal Player -->
  <ReelModal 
    {activeReelId} 
    {closeReel} 
  />
</main>
