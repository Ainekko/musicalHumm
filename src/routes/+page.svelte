<script lang="ts">
  /**
   * BordProd Landing Page - Light Theme (Inspiration)
   * ===============================================
   * Clean white theme matching the doctor inspiration.
   * Teal (#00abbd) and gold (#ffbe1a) branding.
   */
  import { api } from '$lib/api/base';
  import Spinner from '$lib/components/ui/Spinner.svelte';

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

    // Validations
    let isValid = true;
    if (!name.trim()) {
      nameError = 'Le nom est requis';
      isValid = false;
    }
    if (!email.trim()) {
      emailError = "L'email est requis";
      isValid = false;
    } else if (!validateEmail(email)) {
      emailError = 'Veuillez entrer une adresse email valide';
      isValid = false;
    }
    if (!projectDescription.trim()) {
      projectDescriptionError = 'Les détails du projet sont requis';
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
      // Reset form
      name = '';
      email = '';
      phone = '';
      company = '';
      budget = '';
      projectDescription = '';
    } catch (err: any) {
      console.error('Lead submission failed:', err);
      errorMessage = err.message || 'Une erreur est survenue. Veuillez réessayer.';
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

  // Vertical Reels Showcase (TikTok / Reels / Shorts style)
  const verticalVideos = [
    {
      client: '@Julie_Fintech',
      views: '1.2M vues',
      bgGradient: 'from-cyan-400 to-blue-500',
      title: 'Hook Publicitaire App',
      metric: '+120% Téléchargements'
    },
    {
      client: '@Hugo_B2B',
      views: '450K vues',
      bgGradient: 'from-teal-400 to-emerald-500',
      title: 'Vidéo Pitch Fondateur',
      metric: '18 Leads Qualifiés'
    },
    {
      client: '@Elena_Lifestyle',
      views: '2.8M vues',
      bgGradient: 'from-amber-300 to-orange-500',
      title: 'Publicité Produit D2C',
      metric: '3.4x ROAS Validé'
    },
    {
      client: '@Docteur_Malik',
      views: '890K vues',
      bgGradient: 'from-indigo-400 to-purple-550',
      title: 'Vulgarisation Santé',
      metric: '+22K Abonnés'
    },
    {
      client: '@Alice_Agency',
      views: '1.5M vues',
      bgGradient: 'from-rose-450 to-pink-500',
      title: 'UGC Commercial',
      metric: '+45% Taux de Clic'
    }
  ];

  // Testimonials with metrics
  const testimonials = [
    {
      quote: "L'équipe de BordProd a su comprendre notre besoin instantanément. Les vidéos produites ont dépassé toutes nos attentes et ont transformé notre communication.",
      author: "Julie Rinaldi",
      role: "Responsable Marketing, NeoBank",
      metric: "🚀 +120K abonnés organiques",
      avatarInitials: "JR",
      bgAvatar: "bg-[#e0f7f8] text-[#008ba3]"
    },
    {
      quote: "BordProd combine une réactivité sans faille et une créativité débordante. Nos campagnes publicitaires vidéo affichent des performances exceptionnelles.",
      author: "Thomas Lemoine",
      role: "Fondateur, Velo D2C",
      metric: "📈 ROAS moyen de 3.2x",
      avatarInitials: "TL",
      bgAvatar: "bg-[#fff8e1] text-[#b38f00]"
    },
    {
      quote: "Un travail d'orfèvre sur l'écriture et le montage. Le pitch fondateur nous a permis d'attirer des leads de haute qualité en moins de deux semaines.",
      author: "Hugo Martinez",
      role: "CEO, LeadFlow",
      metric: "🎯 +45% de leads qualifiés",
      avatarInitials: "HM",
      bgAvatar: "bg-[#e8f5e9] text-[#2e7d32]"
    },
    {
      quote: "Grâce à leur accompagnement stratégique, nous avons modernisé notre image de marque et instauré une vraie relation de confiance avec notre audience.",
      author: "Dr. Sofia Samadi",
      role: "Directrice, Centre Clinique",
      metric: "🩺 +600 nouveaux patients",
      avatarInitials: "SS",
      bgAvatar: "bg-[#e8eaf6] text-[#3f51b5]"
    }
  ];
</script>

<svelte:head>
  <title>BordProd | Agence de Production Vidéo</title>
</svelte:head>

<main class="min-h-screen flex flex-col items-center justify-between bg-white text-[#2a3b50] relative overflow-hidden font-sans">
  
  <!-- Floating background decorations inspired by the doctor template -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
    <!-- Light glowing orbs -->
    <div class="absolute top-[15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#00abbd]/5 blur-[120px]"></div>
    <div class="absolute bottom-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#ffbe1a]/5 blur-[120px]"></div>
    
    <!-- Outline SVG Icons floating around (Camera, Play, clapboard, heartbeat lines) -->
    <!-- Heartbeat wave style decorative lines -->
    <svg class="absolute top-[25%] right-[5%] w-48 h-32 text-zinc-100" fill="none" viewBox="0 0 100 50" stroke="currentColor" stroke-width="1">
      <path d="M0,25 L30,25 L35,15 L40,35 L45,20 L50,28 L55,25 L100,25" />
    </svg>
    <svg class="absolute top-[60%] left-[2%] w-48 h-32 text-zinc-100" fill="none" viewBox="0 0 100 50" stroke="currentColor" stroke-width="1">
      <path d="M0,25 L30,25 L35,10 L42,40 L47,15 L52,30 L57,25 L100,25" />
    </svg>

    <!-- Floating medical-themed clean cross/video shapes -->
    <div class="absolute top-[18%] left-[8%] text-[#00abbd]/15 animate-bounce" style="animation-duration: 6s;">
      <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    </div>
    <div class="absolute top-[45%] right-[10%] text-[#ffbe1a]/15 animate-bounce" style="animation-duration: 8s;">
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
    <nav class="hidden md:flex items-center gap-8 text-sm font-bold text-zinc-500">
      <a href="#who-we-are" class="hover:text-[#00abbd] transition-colors">Qui Sommes-Nous</a>
      <a href="#testimonials" class="hover:text-[#00abbd] transition-colors">Avis Partenaires</a>
      <a href="#portfolio" class="hover:text-[#00abbd] transition-colors">Nos Réalisations</a>
      <a href="#contact-form" class="hover:text-[#00abbd] transition-colors">Devis gratuit</a>
    </nav>
    <div>
      <button 
        on:click={scrollToForm}
        class="text-xs font-bold px-5 py-2.5 rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 transition-all shadow-md shadow-[#00abbd]/15 cursor-pointer border border-[#00abbd]/10"
      >
        Lancer un projet
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="w-full max-w-5xl px-6 pt-16 pb-12 text-center z-10 flex flex-col items-center">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10 text-xs text-[#008ba3] font-bold mb-6">
      <span class="w-2 h-2 rounded-full bg-[#00abbd] animate-pulse"></span>
      Agence de Production Vidéo Performance
    </div>
    <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight text-[#0a2f4c] max-w-4xl mb-6">
      Créer des vidéos qui propulsent <br class="hidden md:inline"/>
      <span class="font-serif italic text-[#00abbd] font-semibold">votre marque</span> vers le haut.
    </h1>
    <p class="text-base md:text-lg text-zinc-500 max-w-2xl font-medium leading-relaxed mb-10">
      Nous combinons l'art de l'image de qualité cinéma et l'efficacité des stratégies d'acquisition. Donnez vie à vos idées grâce à des formats optimisés pour convertir.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 mb-16">
      <button 
        on:click={scrollToForm}
        class="px-6 py-3.5 text-sm font-bold rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 shadow-lg shadow-[#00abbd]/25 transition-all cursor-pointer"
      >
        Demander ma stratégie vidéo
      </button>
      <a 
        href="#portfolio"
        class="px-6 py-3.5 text-sm font-bold rounded-full bg-white border border-zinc-200 text-zinc-650 hover:bg-zinc-50 active:scale-95 transition-all text-center"
      >
        Découvrir nos formats
      </a>
    </div>

    <!-- Video Showcase frame (as top header of testimonials area in template) -->
    <div class="w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-3 shadow-xl relative group">
      <div class="w-full aspect-video rounded-xl bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden">
        <!-- Abstract gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-tr from-[#004e57]/40 via-zinc-950 to-[#5c4a16]/30 opacity-80 z-0"></div>
        
        <!-- Play overlay -->
        <div class="z-10 flex flex-col items-center gap-4 cursor-pointer">
          <div class="w-20 h-20 rounded-full bg-white/10 border border-white/20 hover:border-white/40 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all duration-300 shadow-xl group-hover:scale-105">
            <svg class="w-7 h-7 text-white fill-white translate-x-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <span class="text-xs font-black tracking-widest uppercase text-zinc-300 group-hover:text-white transition-colors">Découvrir notre showreel</span>
        </div>

        <div class="absolute bottom-4 left-4 z-10 flex gap-2">
          <span class="px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[10px] font-bold text-[#00abbd] border border-[#00abbd]/20">BORDPROD 2026</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Who We Are Section -->
  <section id="who-we-are" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <!-- Left Experience Card -->
      <div class="lg:col-span-5 relative flex justify-center">
        <div class="w-72 h-72 rounded-3xl bg-gradient-to-tr from-[#00abbd] to-[#ffbe1a] p-8 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black/5"></div>
          <div class="z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/25">
            <img src="/logo/logo-icon.png" alt="BordProd Mark" class="w-8 h-8 object-contain" />
          </div>
          <div class="z-10 text-white">
            <p class="text-5xl font-black mb-1">3+</p>
            <p class="text-xs font-black uppercase tracking-wider text-white/95">Années d'Expérience</p>
          </div>
        </div>
        <!-- Decorative frame -->
        <div class="absolute -inset-4 border border-dashed border-[#00abbd]/25 rounded-3xl -z-10 transform rotate-3"></div>
      </div>

      <!-- Right Content -->
      <div class="lg:col-span-7 space-y-6">
        <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3 py-1 bg-[#e0f7f8] rounded-full">QUI SOMMES-NOUS</span>
        <h3 class="text-3xl md:text-4xl font-extrabold text-[#0a2f4c] leading-tight">
          Donner de la hauteur à <br class="hidden sm:inline"/>
          votre message de marque.
        </h3>
        
        <div class="space-y-4 text-zinc-500 text-sm md:text-base font-medium leading-relaxed">
          <p>
            Chez <strong class="text-[#00abbd] font-bold">BordProd</strong>, nous pensons que chaque marque a une histoire qui mérite d'être racontée.
          </p>
          <p>
            Nous combinons créativité, stratégie et production pour créer du contenu qui ne se contente pas d'être beau — il génère des résultats.
          </p>
          <p>
            Avec plus de 3 ans d'expérience, nous avons aidé des entreprises, des créateurs et des entrepreneurs à renforcer leur image et à développer leur présence grâce à une communication visuelle professionnelle.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Testimonials Section - Pure White & Cyan Accent (Doctor Inspiration Style) -->
  <section id="testimonials" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100 bg-zinc-50/30">
    <div class="text-center mb-16">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">TÉMOIGNAGES</span>
      <h2 class="text-3xl md:text-4xl font-black text-[#0a2f4c] mt-4 mb-2">
        Ce que disent <span class="font-serif italic text-[#00abbd] font-medium">nos partenaires</span>
      </h2>
      <p class="text-sm text-zinc-400 font-semibold max-w-md mx-auto">
        Plus de 30+ professionnels et créateurs nous font confiance pour développer leur image de marque.
      </p>
    </div>

    <!-- Doctor-like Testimonial Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {#each testimonials as t}
        <div class="bg-white rounded-2xl border border-zinc-200/50 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
          <!-- Quote Icon top-right decoration -->
          <div class="absolute top-4 right-4 text-[#00abbd]/5">
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 17h3l2-4V7h-6v6h3M6 17h3l2-4V7H5v6h3l-2 4z" />
            </svg>
          </div>

          <div class="space-y-4">
            <!-- Author Header -->
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 {t.bgAvatar}">
                {t.avatarInitials}
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-black text-zinc-900 leading-tight">{t.author}</span>
                <span class="text-[10px] text-zinc-400 font-semibold">{t.role}</span>
              </div>
            </div>

            <!-- Quote text -->
            <p class="text-xs text-zinc-500 font-semibold leading-relaxed italic">
              "{t.quote}"
            </p>
          </div>

          <!-- Bottom key metric pill button matching doctor style -->
          <div class="mt-6 pt-4 border-t border-zinc-100 self-start">
            <span class="text-[10px] font-bold px-3 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/20 text-[#008ba3] shadow-sm shadow-[#00abbd]/5">
              {t.metric}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- Video Portfolio Section - Vertical short-form 9:16 reels -->
  <section id="portfolio" class="w-full max-w-6xl px-6 py-20 z-10 border-t border-zinc-100">
    <div class="text-center mb-12">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">NOS RÉALISATIONS</span>
      <h2 class="text-3xl font-black text-[#0a2f4c] mt-4 mb-2">
        Ils ont <span class="font-serif italic text-[#00abbd] font-medium">transformé</span> leur présence
      </h2>
      <p class="text-xs text-zinc-400 font-semibold max-w-md mx-auto">
        Des vidéos qui font des millions de vues et qui remplissent les agendas de rendez-vous.
      </p>
    </div>

    <!-- Portrait 9:16 Grid of Reels -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      {#each verticalVideos as video}
        <div class="aspect-[9/16] rounded-2xl bg-zinc-950 border border-zinc-200 shadow-lg relative group overflow-hidden flex flex-col justify-between p-4 hover:scale-[1.02] hover:border-[#00abbd]/40 transition-all duration-300">
          <!-- Video thumb simulation gradient -->
          <div class="absolute inset-0 bg-gradient-to-tr {video.bgGradient} opacity-85 z-0"></div>
          <div class="absolute inset-0 bg-black/10 z-0"></div>
          
          <!-- Top Row: Handle and Views -->
          <div class="z-10 flex justify-between items-center text-[10px] font-bold text-white">
            <span class="bg-black/40 px-1.5 py-0.5 rounded border border-white/5 backdrop-blur-sm">{video.client}</span>
            <span class="bg-[#00abbd]/85 px-1.5 py-0.5 rounded backdrop-blur-sm">{video.views}</span>
          </div>

          <!-- Center Play Icon -->
          <div class="z-10 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center self-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all cursor-pointer">
            <svg class="w-4 h-4 text-white fill-white translate-x-0.5" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>

          <!-- Bottom: Title and Metric Badge -->
          <div class="z-10 space-y-2">
            <p class="text-xs font-black text-white leading-tight drop-shadow-sm">{video.title}</p>
            <div class="inline-block bg-white text-[#008ba3] text-[9px] font-black px-2 py-1 rounded-full border border-white/10">
              {video.metric}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Call to action linked to form -->
    <div class="text-center mt-12">
      <button 
        on:click={scrollToForm}
        class="inline-flex items-center gap-2 text-xs font-black px-6 py-3.5 rounded-full bg-[#00abbd] text-white hover:bg-[#0091a1] active:scale-95 transition-all shadow-lg shadow-[#00abbd]/15 cursor-pointer border border-[#00abbd]/10"
      >
        REJOINDRE L'APPEL / CRÉER MA VIDÉO
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </section>

  <!-- Lead Capture Form Section (in French) - Clean Light Card -->
  <section id="contact-form" class="w-full max-w-3xl px-6 py-20 z-10 border-t border-zinc-150">
    <div class="text-center mb-10">
      <span class="text-xs font-black text-[#00abbd] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-[#e0f7f8] border border-[#00abbd]/10">CONTACT</span>
      <h3 class="text-3xl font-extrabold text-[#0a2f4c] mt-4 mb-3">Démarrez votre projet vidéo</h3>
      <p class="text-xs text-zinc-400 font-semibold max-w-sm mx-auto">Complétez le formulaire ci-dessous. Nous analyserons vos besoins et vous recontacterons sous 24h avec un plan d'action.</p>
    </div>

    <div class="rounded-2xl border border-zinc-200 bg-white p-6 md:p-8 shadow-xl">
      {#if success}
        <div class="text-center py-12 space-y-4">
          <div class="w-16 h-16 rounded-full bg-[#e8f5e9] text-[#2e7d32] border border-[#2e7d32]/20 flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 class="text-lg font-bold text-[#0a2f4c]">Demande enregistrée avec succès !</h4>
          <p class="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed font-semibold">
            Merci de votre confiance. Vos informations ont été transmises à notre équipe dans notre CRM interne. Un conseiller BordProd va étudier votre projet et prendra contact avec vous rapidement.
          </p>
          <button 
            on:click={() => success = false}
            class="px-4 py-2 text-xs font-bold bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 rounded-xl text-zinc-600 transition-colors"
          >
            Faire une autre demande
          </button>
        </div>
      {:else}
        <form on:submit={handleSubmit} class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Name -->
            <div class="space-y-1.5">
              <label for="name" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Nom Complet *</label>
              <input 
                id="name"
                type="text"
                placeholder="Ex: Jean Dupont"
                bind:value={name}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all {nameError ? 'border-red-400 ring-2 ring-red-400/10' : ''}"
              />
              {#if nameError}
                <p class="text-xs text-red-500 font-semibold">{nameError}</p>
              {/if}
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label for="email" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Adresse E-mail *</label>
              <input 
                id="email"
                type="email"
                placeholder="Ex: jean@entreprise.com"
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
              <label for="phone" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Téléphone</label>
              <input 
                id="phone"
                type="text"
                placeholder="Ex: +33 6 12 34 56 78"
                bind:value={phone}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all"
              />
            </div>

            <!-- Company -->
            <div class="space-y-1.5">
              <label for="company" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Entreprise</label>
              <input 
                id="company"
                type="text"
                placeholder="Ex: My Startup"
                bind:value={company}
                class="w-full bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder:text-zinc-450 focus:outline-none focus:ring-2 focus:ring-[#00abbd]/20 focus:border-[#00abbd] transition-all"
              />
            </div>
          </div>

          <!-- Budget Range -->
          <div class="space-y-2">
            <span class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Budget Estimé</span>
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
            <label for="desc" class="block text-xs font-bold text-zinc-400 uppercase tracking-wider">Objectifs & Détails du Projet *</label>
            <textarea 
              id="desc"
              rows="4"
              placeholder="Décrivez votre besoin : objectifs de la vidéo, cible, durée souhaitée, exemples inspirants..."
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
              Traitement en cours...
            {:else}
              Envoyer ma demande
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
      <span>&copy; 2026 BordProd. Tous droits réservés.</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="#showcase" class="hover:text-zinc-600">Mentions Légales</a>
      <span>&middot;</span>
      <a href="#showcase" class="hover:text-zinc-600">Confidentialité</a>
      <span>&middot;</span>
      <a href="/dashboard/85e8d89e-4b47-49d7-84bc-79f9435b0b2e" class="text-[#00abbd] font-bold hover:underline">Accès CRM Interne</a>
    </div>
  </footer>
</main>
