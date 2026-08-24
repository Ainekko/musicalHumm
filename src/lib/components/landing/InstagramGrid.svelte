<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';

  export let instagramProfile: string;

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

<section id="instagram-showcase" class="w-full max-w-4xl px-6 py-24 md:py-28 z-10 border-t border-zinc-200/60 mx-auto text-center">
  <div 
    class="space-y-8 max-w-2xl mx-auto"
    class:animate-fade-in-up={isVisible}
    style="opacity: {isVisible ? '1' : '0'};"
  >
    <div class="flex flex-col items-center gap-3">
      <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">
        {$t('ig_section_badge')}
      </span>
      <h3 class="text-3xl md:text-4xl font-black text-zinc-900">
        {$t('ig_section_title').split('Instagram')[0]}
        <span class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff007f] via-[#7928ca] to-[#0070f3]">Instagram</span>
        {$t('ig_section_title').split('Instagram')[1] || ''}
      </h3>
      <p class="text-xs md:text-sm text-zinc-500 font-semibold max-w-md">
        {$t('ig_section_sub')}
      </p>
    </div>

    <!-- Instagram Follow Button -->
    <div class="flex justify-center pt-4">
      <a 
        href={instagramProfile}
        target="_blank"
        rel="noopener noreferrer"
        class="group inline-flex items-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-[#ffaa00] via-[#ff3366] to-[#7928ca] text-white font-black text-sm shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 relative overflow-hidden"
      >
        <span class="absolute inset-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
        <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
        <span>{$t('ig_follow_btn')}</span>
      </a>
    </div>
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
