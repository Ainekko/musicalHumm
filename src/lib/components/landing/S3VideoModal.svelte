<script lang="ts">
  import { clientPortfolioVideos, btsVideos, feedbackVideos } from '$lib/data/clients';
  import VideoSlide from './VideoSlide.svelte';

  export let activeS3ModalVideo: { title: string; clientName: string; category: string; url: string; badgeBg: string; igHandle?: string } | null;
  export let closeS3VideoModal: () => void;
  export let scrollToForm: () => void;

  // Map and unify all video assets into a single swipeable feed
  const mappedPortfolio = clientPortfolioVideos.map(v => ({
    id: v.id,
    url: v.url,
    clientName: v.clientName,
    title: v.title || v.category || '',
    category: v.category || '',
    badgeBg: v.badgeBg,
    igHandle: v.igHandle
  }));

  const mappedBts = btsVideos.map(v => ({
    id: v.id,
    url: v.url,
    clientName: 'Les Coulisses BTS',
    title: v.title || v.tag || '',
    category: 'Making Of',
    badgeBg: 'from-zinc-700 to-zinc-900',
    igHandle: undefined
  }));

  const mappedFeedback = feedbackVideos.map(v => ({
    id: v.id,
    url: v.url,
    clientName: v.clientName,
    title: v.title || `Témoignage ${v.clientName}`,
    category: v.role || 'Avis Client 🌟',
    badgeBg: v.badgeBg || 'from-violet-500 to-purple-600',
    igHandle: v.igHandle
  }));

  const allVideos = [...mappedPortfolio, ...mappedBts, ...mappedFeedback];

  let activeIndex = 0;
  let scrollContainer: HTMLDivElement;
  let initialScrollDone = false;
  let globalMuted = true;

  function toggleMute() {
    globalMuted = !globalMuted;
  }

  // Detect which slide is currently active based on scroll position
  function handleScroll() {
    if (scrollContainer) {
      const index = Math.round(scrollContainer.scrollTop / scrollContainer.clientHeight);
      if (index !== activeIndex && index >= 0 && index < allVideos.length) {
        activeIndex = index;
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!activeS3ModalVideo) return;
    if (event.key === 'Escape') {
      closeS3VideoModal();
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      scrollNext();
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollPrev();
    }
  }

  function scrollNext() {
    if (activeIndex < allVideos.length - 1) {
      const el = document.getElementById(`slide-${activeIndex + 1}`);
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }

  function scrollPrev() {
    if (activeIndex > 0) {
      const el = document.getElementById(`slide-${activeIndex - 1}`);
      if (el) el.scrollIntoView({ block: 'start' });
    }
  }

  $: if (activeS3ModalVideo && scrollContainer && !initialScrollDone) {
    const idx = allVideos.findIndex(v => v.url === activeS3ModalVideo.url);
    if (idx !== -1) {
      activeIndex = idx;
      initialScrollDone = true;
      setTimeout(() => {
        const el = document.getElementById(`slide-${idx}`);
        if (el) {
          el.scrollIntoView({ block: 'start' });
        }
      }, 100);
    }
  }

  $: if (!activeS3ModalVideo) {
    initialScrollDone = false;
    activeIndex = 0;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if activeS3ModalVideo}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    class="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center"
    on:click={closeS3VideoModal}
  >
    <!-- Center vertical container: w-full h-full on mobile, styled phone/player frame on desktop -->
    <div 
      class="relative w-full h-[100dvh] md:w-[410px] md:h-[88vh] md:rounded-[36px] bg-black overflow-hidden flex flex-col shadow-2xl md:border border-zinc-800/80"
      on:click|stopPropagation
    >
      <!-- Swipe/Scroll container -->
      <div
        bind:this={scrollContainer}
        on:scroll={handleScroll}
        class="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar flex flex-col"
        style="scrollbar-width: none; -ms-overflow-style: none;"
      >
        {#each allVideos as video, idx (video.id)}
          <div 
            id="slide-{idx}"
            class="w-full h-full shrink-0 snap-start relative"
          >
            <VideoSlide
              {video}
              isActive={activeIndex === idx}
              {globalMuted}
              {toggleMute}
              closeModal={closeS3VideoModal}
              {scrollToForm}
              showScrollIndicator={idx < allVideos.length - 1}
            />
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>
