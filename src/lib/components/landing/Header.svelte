<script lang="ts">
  import { locale, t } from '$lib/i18n';

  export let scrollToForm: () => void;
  export let instagramProfile: string;
</script>

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
      href={instagramProfile}
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
