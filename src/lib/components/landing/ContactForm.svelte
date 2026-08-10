<script lang="ts">
  import { onMount } from 'svelte';
  import { api } from '$lib/api/base';
  import Spinner from '$lib/components/ui/Spinner.svelte';
  import { t } from '$lib/i18n';

  let name = '';
  let email = '';
  let phone = '';
  let company = '';
  let budget = '';
  let projectDescription = '';

  let loading = false;
  let success = false;
  let errorMessage = '';
  let isVisible = false;

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

      // Track lead event via Meta Pixel
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: 'Contact Inquiry',
          content_category: 'Lead Generation'
        });
      }

      name = '';
      email = '';
      phone = '';
      company = '';
      budget = '';
      projectDescription = '';
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      errorMessage = err.message || $t('validation_error');
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    const triggerEl = document.querySelector('#contact-form');
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

<section id="contact-form" class="w-full max-w-3xl px-6 py-20 z-10 border-t border-zinc-200/60">
  <div class="text-center mb-10">
    <span class="text-xs font-black text-zinc-500 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm">{$t('contact_badge')}</span>
    <h3 class="text-3xl font-extrabold text-zinc-900 mt-4 mb-3">{$t('contact_title')}</h3>
    <p class="text-xs text-zinc-500 font-semibold max-w-sm mx-auto">{$t('contact_subtitle')}</p>
  </div>

  <div 
    class="rounded-3xl border border-zinc-200/80 bg-white p-6 md:p-10 shadow-xl"
    class:animate-fade-in-up={isVisible}
    style="opacity: {isVisible ? '1' : '0'};"
  >
    {#if success}
      <div class="text-center py-12 space-y-4 animate-fade-in-up">
        <div class="w-20 h-20 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center mx-auto shadow-inner animate-smile-pulse">
          <span class="text-4xl filter drop-shadow-sm select-none">😊</span>
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
  
  @keyframes smilePulse {
    0% {
      transform: scale(0.6);
      opacity: 0;
    }
    60% {
      transform: scale(1.12);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  .animate-smile-pulse {
    animation: smilePulse 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }
</style>
