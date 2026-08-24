<script lang="ts">
  import { onMount } from 'svelte';
  import { t } from '$lib/i18n';
  import { heroVideoLoaded } from '$lib/stores';

  export let scrollToForm: () => void;
  export let heroVideoUrl: string;

  let heroVideoRef: HTMLVideoElement | null = null;
  let hasActivatedSound = false;
  let heroIsPlaying = true;

  function toggleHeroPlay() {
    if (heroVideoRef) {
      if (!hasActivatedSound) {
        // First click: play from beginning with sound
        heroVideoRef.muted = false;
        heroVideoRef.currentTime = 0;
        heroVideoRef.play();
        hasActivatedSound = true;
        heroIsPlaying = true;
      } else {
        // Subsequent clicks: standard play/pause toggle
        if (heroVideoRef.paused) {
          heroVideoRef.play();
          heroIsPlaying = true;
        } else {
          heroVideoRef.pause();
          heroIsPlaying = false;
        }
      }
    }
  }

  function splitTextIntoWords(str: string) {
    return str
      .split(' ')
      .map((w) => w.trim())
      .filter(Boolean);
  }

  function splitTitle(title: string) {
    if (title.includes('. ')) {
      const parts = title.split('. ');
      return [parts[0] + '.', parts[1] || ''];
    } else if (title.includes(', ')) {
      const parts = title.split(', ');
      return [parts[0] + ',', parts[1] || ''];
    } else if (title.includes(',')) {
      const parts = title.split(',');
      return [parts[0] + ',', parts[1] || ''];
    } else if (title.includes('، ')) {
      const parts = title.split('، ');
      return [parts[0] + '،', parts[1] || ''];
    } else if (title.includes('،')) {
      const parts = title.split('،');
      return [parts[0] + '،', parts[1] || ''];
    } else if (title.includes('.')) {
      const parts = title.split('.');
      return [parts[0] + '.', parts[1] || ''];
    }
    return [title, ''];
  }

  function markHeroLoaded() {
    heroVideoLoaded.set(true);
  }

  // Pre-calculate words with global indices for staggered animation
  $: animatedLines = splitTitle($t('hero_title')).map((line) => {
    return splitTextIntoWords(line);
  });

  $: flattenedWordsCount = animatedLines.reduce((acc, words) => acc + words.length, 0);

  function getGlobalWordIndex(lineIdx: number, wordIdx: number) {
    let index = 0;
    for (let i = 0; i < lineIdx; i++) {
      if (animatedLines[i]) {
        index += animatedLines[i].length;
      }
    }
    return index + wordIdx;
  }

  onMount(() => {
    if (heroVideoRef && heroVideoRef.readyState >= 2) {
      markHeroLoaded();
    }
  });
</script>

<section class="w-full max-w-5xl px-0 sm:px-6 pt-14 pb-12 text-center z-10 flex flex-col items-center">
  <!-- Padded Text Content Wrapper for Mobile -->
  <div class="w-full px-6 sm:px-0 flex flex-col items-center">
    <h1
      class="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-normal text-zinc-900 max-w-4xl mb-6 text-center flex flex-col gap-2 items-center"
    >
      {#each animatedLines as line, lineIdx}
        {#if line && line.length > 0}
          <div class="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {#each line as word, wordIdx}
              <span 
                class="inline-block animate-fade-in-up"
                style="animation-delay: {getGlobalWordIndex(lineIdx, wordIdx) * 0.04}s; opacity: 0;"
              >
                {#if $t('hero_highlight').includes(word.replace(/[^a-zA-Z0-9\u0600-\u06FF\u00C0-\u00FF]/g, '')) || $t('hero_highlight').includes(word)}
                  <span
                    class="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] via-[#e6005c] to-[#7928ca]"
                    >{word}</span
                  >
                {:else}
                  {word}
                {/if}
              </span>
            {/each}
          </div>
        {/if}
      {/each}
    </h1>

    <p
      class="text-base md:text-lg text-zinc-600 max-w-2xl font-medium leading-relaxed mb-10 animate-fade-in-up"
      style="animation-delay: {(flattenedWordsCount * 0.04) + 0.15}s; opacity: 0;"
    >
      {$t('hero_subtitle')}
    </p>

    <div class="flex flex-col sm:flex-row gap-4 mb-14 animate-fade-in-up" style="animation-delay: {(flattenedWordsCount * 0.04) + 0.3}s; opacity: 0;">
      <button
        on:click={scrollToForm}
        class="px-7 py-4 text-sm font-black rounded-full bg-zinc-900 text-white hover:bg-zinc-800 active:scale-95 shadow-xl transition-all cursor-pointer"
      >
        {$t('hero_cta')}
      </button>
      <a
        href="#portfolio-showcase"
        class="px-7 py-4 text-sm font-black rounded-full bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 active:scale-95 transition-all text-center shadow-sm flex items-center justify-center gap-2"
      >
        <span>🎬 Voir les réalisations</span>
      </a>
    </div>
  </div>

  <!-- Main Hero Showreel Video Player (Plays S3 hero video directly) -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="w-full max-w-4xl rounded-none sm:rounded-3xl border-0 sm:border border-zinc-300/80 bg-transparent sm:bg-white p-0 sm:p-3.5 shadow-none sm:shadow-2xl relative group transition-shadow duration-300 animate-fade-in-up"
    style="animation-delay: {(flattenedWordsCount * 0.04) + 0.45}s; opacity: 0;"
  >
    <div
      class="w-full aspect-video rounded-none sm:rounded-2xl bg-zinc-950 flex items-center justify-center relative overflow-hidden group cursor-pointer"
      on:click={toggleHeroPlay}
    >
      <video
        bind:this={heroVideoRef}
        src={heroVideoUrl}
        autoplay
        muted
        loop
        playsinline
        on:loadeddata={markHeroLoaded}
        on:play={markHeroLoaded}
        on:canplay={markHeroLoaded}
        class="w-full h-full object-cover rounded-none sm:rounded-2xl"
      ></video>

      <!-- Centered Overlay Play Button - Backdrop Blur Style -->
      <div
        class="absolute inset-0 flex items-center justify-center transition-opacity duration-300 {!hasActivatedSound || !heroIsPlaying ? 'opacity-100 bg-black/35' : 'opacity-0 bg-transparent pointer-events-none'}"
      >
        {#if !hasActivatedSound || !heroIsPlaying}
          <button
            on:click|stopPropagation={toggleHeroPlay}
            class="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Play"
          >
            <!-- Play Icon -->
            <svg class="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        {/if}
      </div>
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
  
  :global(.animate-fade-in-up) {
    animation: fadeInUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  video:fullscreen {
    object-fit: contain !important;
  }
  video:-webkit-full-screen {
    object-fit: contain !important;
  }
</style>
