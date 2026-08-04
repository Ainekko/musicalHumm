<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';

  export let instagramProfile: string;
  export let instagramReels: any[];

  let isVisible = false;

  onMount(() => {
    const triggerEl = document.querySelector('#instagram-showcase');
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
      href={instagramProfile}
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
    {#each instagramReels as reel, idx}
      <div 
        class="group rounded-3xl bg-white border border-zinc-200/80 shadow-xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative"
        class:animate-fade-in-up={isVisible}
        style="animation-delay: {idx * 0.07}s; opacity: {isVisible ? '1' : '0'};"
      >
        
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
