<script lang="ts">
  import * as Tone from 'tone';
  import InstrumentSelector from '$lib/components/InstrumentSelector.svelte';
  import AudioRecorder from '$lib/components/AudioRecorder.svelte';
  import TranscriptionResult from '$lib/components/TranscriptionResult.svelte';
  import { type TranscribedNote } from '$lib/audioPipeline';

  // State Machine
  let currentStep: 1 | 2 | 3 = 1; // 1: Pick, 2: Hum, 3: Result

  // Instrument definitions
  const instruments = [
    {
      id: 'violin',
      name: 'Violin',
      author: 'Versilian Studios Chamber Orchestra',
      desc: 'Classical monophonic solo strings. Expressive and rich.',
      accent: 'from-rose-500 to-pink-500',
      glow: 'glow-box-rose',
      icon: `<svg class="w-10 h-10 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
               <path stroke-linecap="round" stroke-linejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
             </svg>`
    }
  ];

  let selectedInstrumentId = 'violin';
  let sampler: Tone.Sampler | null = null;
  let samplerLoading = false;
  let samplerLoaded = false;
  let transcribedNotes: TranscribedNote[] = [];

  // Load Tone.js Sampler for the selected instrument
  async function handleLoadInstrument(event: CustomEvent<{ id: string }>) {
    const { id } = event.detail;
    selectedInstrumentId = id;

    if (samplerLoaded) {
      currentStep = 2;
      return;
    }

    samplerLoading = true;
    try {
      await Tone.start();
      console.log('Audio context started');

      const violinSamples = {
        'A3': 'A3.mp3',
        'A4': 'A4.mp3',
        'A5': 'A5.mp3',
        'A6': 'A6.mp3',
        'C4': 'C4.mp3',
        'C5': 'C5.mp3',
        'C6': 'C6.mp3',
        'C7': 'C7.mp3',
        'E4': 'E4.mp3',
        'E5': 'E5.mp3',
        'E6': 'E6.mp3',
        'G4': 'G4.mp3',
        'G5': 'G5.mp3',
        'G6': 'G6.mp3'
      };

      sampler = new Tone.Sampler({
        urls: violinSamples,
        baseUrl: 'https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments@master/samples/violin/',
        onload: () => {
          samplerLoaded = true;
          samplerLoading = false;
          currentStep = 2;
        },
        onerror: (err) => {
          console.error('Error loading sampler:', err);
          alert('Failed to load instrument samples. Please check your internet connection.');
          samplerLoading = false;
        }
      }).toDestination();
    } catch (err) {
      console.error('Failed to load sampler:', err);
      samplerLoading = false;
    }
  }

  function handleTranscribed(event: CustomEvent<{ notes: TranscribedNote[] }>) {
    transcribedNotes = event.detail.notes;
    currentStep = 3;
  }

  function handleRetry() {
    transcribedNotes = [];
    currentStep = 2;
  }

  function handleReset() {
    transcribedNotes = [];
    currentStep = 1;
  }
</script>

<!-- Header & Layout -->
<main class="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 bg-[#09080d] text-zinc-100 selection:bg-rose-500 selection:text-white">
  <!-- Glowing Background Orbs -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
    <div class="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-rose-500/10 blur-[120px]"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-violet-600/10 blur-[120px]"></div>
  </div>

  <!-- Top bar -->
  <header class="w-full max-w-4xl flex justify-between items-center z-10 py-4 border-b border-zinc-800/40">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 via-pink-500 to-violet-500 flex items-center justify-center font-bold text-white shadow-lg shadow-pink-500/20">
        H
      </div>
      <span class="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
        musicalHumm
      </span>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/30 text-zinc-400">
        V1 Proof of Concept
      </span>
    </div>
  </header>

  <!-- Core App Container -->
  <section class="w-full max-w-3xl flex-1 flex flex-col justify-center py-12 z-10">
    {#if currentStep === 1}
      <InstrumentSelector
        {instruments}
        {selectedInstrumentId}
        {samplerLoading}
        on:select={handleLoadInstrument}
      />
    {:else}
      {@const activeInstrument = instruments.find(i => i.id === selectedInstrumentId)}
      
      {#if currentStep === 2}
        <AudioRecorder
          instrumentName={activeInstrument?.name || 'Violin'}
          on:transcribed={handleTranscribed}
          on:changeInstrument={handleReset}
        />
      {:else if currentStep === 3}
        <TranscriptionResult
          {transcribedNotes}
          {sampler}
          on:retry={handleRetry}
        />
      {/if}
    {/if}
  </section>

  <!-- Bottom Status Info -->
  <footer class="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center py-6 border-t border-zinc-800/40 z-10 text-xs text-zinc-500 gap-4">
    <div>
      Decoupled DSP Pipeline: <code class="text-zinc-400">Recorded Audio &rarr; Pitchy DSP &rarr; Note Events &rarr; Offline Render / Sampler / MIDI</code>
    </div>
    <div>
      Powered by <a class="text-zinc-400 underline hover:text-zinc-300" href="https://github.com/nbrosowsky/tonejs-instruments" target="_blank" rel="noreferrer">VSCO2 samples</a> &middot; no server-side audio processing
    </div>
  </footer>
</main>
