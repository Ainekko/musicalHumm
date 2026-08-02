<script lang="ts">
  /**
   * BordProd Landing Page - High Performance Video Production Showcase
   * =========================================================================
   * Orchestrates the segmented subcomponents for a clean, modular structure.
   * All client/media data lives in $lib/data/clients.ts — edit there to add clients.
   */
  import { locale } from '$lib/i18n';
  import {
    BORDPROD_IG,
    HERO_VIDEO_URL,
    clientPortfolioVideos,
    btsVideos,
    instagramReels,
    feedbackVideos,
  } from '$lib/data/clients';

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

  // Active Modal States
  let activeS3ModalVideo: (typeof clientPortfolioVideos)[0] | null = null;
  let activeReelId: string | null = null;

  function openS3VideoModal(video: typeof activeS3ModalVideo) {
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
  <Header {scrollToForm} instagramProfile={BORDPROD_IG} />

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
    instagramProfile={BORDPROD_IG} 
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
  <Footer instagramProfile={BORDPROD_IG} />

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
