<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as Tone from 'tone';
  import {
    transcribeAudio,
    notesToMidi,
    audioBufferToWav,
    type TranscribedNote
  } from '$lib/audioPipeline';

  // State Machine
  let currentStep: 1 | 2 | 3 = 1; // 1: Pick, 2: Hum, 3: Result

  // Instrument state
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

  // Recording State
  let recording = false;
  let recordTime = 0;
  let recordTimerInterval: any = null;
  let mediaRecorder: MediaRecorder | null = null;
  let audioChunks: Blob[] = [];
  let audioCtx: AudioContext | null = null;
  let micStream: MediaStream | null = null;
  let analyserNode: AnalyserNode | null = null;
  let canvasElement: HTMLCanvasElement | null = null;
  let animationFrameId: number | null = null;

  // Transcription & Result State
  let transcribedNotes: TranscribedNote[] = [];
  let isPlaying = false;
  let activeNoteIndex: number | null = null;
  let playTime = 0;
  let playbackTimerInterval: any = null;

  // Export State
  let exportingMidi = false;
  let exportingWav = false;

  // Load Tone.js Sampler for Violin
  async function loadInstrument(id: string) {
    if (samplerLoaded) {
      currentStep = 2;
      return;
    }

    samplerLoading = true;
    try {
      // Audio context needs to start on user interaction
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

  // Live recording visualization
  function visualize() {
    if (!canvasElement || !analyserNode) return;
    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    const bufferLength = analyserNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!recording) return;
      animationFrameId = requestAnimationFrame(draw);
      analyserNode!.getByteTimeDomainData(dataArray);

      // Canvas dimensions
      const width = canvasElement!.width;
      const height = canvasElement!.height;

      // Dark background with trail
      canvasCtx.fillStyle = 'rgba(10, 8, 16, 0.25)';
      canvasCtx.fillRect(0, 0, width, height);

      // Draw subtle grids
      canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, height / 2);
      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();

      // Setup gradient line
      canvasCtx.lineWidth = 3;
      const gradient = canvasCtx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#f43f5e'); // rose-500
      gradient.addColorStop(0.5, '#d946ef'); // fuchsia-500
      gradient.addColorStop(1, '#8b5cf6'); // violet-500
      canvasCtx.strokeStyle = gradient;
      canvasCtx.shadowColor = 'rgba(217, 70, 239, 0.3)';
      canvasCtx.shadowBlur = 10;

      canvasCtx.beginPath();
      const sliceWidth = (width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        // Map [0, 255] to [-1.0, 1.0]
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();
      canvasCtx.shadowBlur = 0; // reset
    };

    draw();
  }

  // Mic recording start
  async function startRecording() {
    audioChunks = [];
    recordTime = 0;

    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(micStream);
      
      analyserNode = audioCtx.createAnalyser();
      analyserNode.fftSize = 512;
      source.connect(analyserNode);

      mediaRecorder = new MediaRecorder(micStream);
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Decode WebM/OGG buffer to AudioBuffer
        const arrayBuffer = await audioBlob.arrayBuffer();
        if (audioCtx) {
          try {
            const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            transcribedNotes = transcribeAudio(decodedBuffer);
            console.log('Notes transcribed:', transcribedNotes);
            currentStep = 3;
          } catch (decodeErr) {
            console.error('Decoding failed:', decodeErr);
            alert('Could not decode audio. Try humming a bit louder or closer to the mic.');
            currentStep = 2;
          }
        }
      };

      mediaRecorder.start();
      recording = true;

      // Start live timer
      recordTimerInterval = setInterval(() => {
        recordTime += 1;
      }, 1000);

      // Start visualization
      setTimeout(() => {
        visualize();
      }, 50);

    } catch (err) {
      console.error('Mic access error:', err);
      alert('Microphone permission is required to capture your humming.');
    }
  }

  // Mic recording stop
  function stopRecording() {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
    recording = false;

    if (recordTimerInterval) {
      clearInterval(recordTimerInterval);
    }

    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
    }

    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }

  // Play transcribed notes
  async function playMelody() {
    if (isPlaying) {
      stopMelody();
      return;
    }

    if (!sampler || !samplerLoaded || transcribedNotes.length === 0) return;

    await Tone.start();
    isPlaying = true;
    playTime = 0;

    const now = Tone.now();
    transcribedNotes.forEach((note) => {
      sampler!.triggerAttackRelease(
        note.note,
        note.duration,
        now + note.time,
        note.velocity
      );
    });

    const totalDuration = Math.max(...transcribedNotes.map((n) => n.time + n.duration), 0);

    // Track active note playback visual highlight
    const startTime = Date.now();
    playbackTimerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      playTime = elapsed;

      // Find which note is currently playing
      const activeIdx = transcribedNotes.findIndex(
        (n) => elapsed >= n.time && elapsed <= n.time + n.duration
      );
      activeNoteIndex = activeIdx !== -1 ? activeIdx : null;

      if (elapsed >= totalDuration + 0.3) {
        stopMelody();
      }
    }, 30);
  }

  function stopMelody() {
    if (sampler) {
      sampler.releaseAll();
    }
    isPlaying = false;
    activeNoteIndex = null;
    playTime = 0;
    if (playbackTimerInterval) {
      clearInterval(playbackTimerInterval);
    }
  }

  // Export MIDI
  async function downloadMidi() {
    if (transcribedNotes.length === 0) return;
    exportingMidi = true;
    try {
      const midiData = notesToMidi(transcribedNotes);
      const blob = new Blob([midiData], { type: 'audio/midi' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'hummed-melody.mid';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('MIDI export error:', err);
      alert('Could not export MIDI.');
    } finally {
      exportingMidi = false;
    }
  }

  // Export WAV via Offline Rendering
  async function downloadWav() {
    if (transcribedNotes.length === 0 || !sampler) return;
    exportingWav = true;
    try {
      const maxTime = Math.max(...transcribedNotes.map((n) => n.time + n.duration), 0);
      const totalDuration = maxTime + 0.8; // tail buffer

      // OfflineAudioContext render
      const renderedBuffer = await Tone.Offline(async () => {
        // Create an offline-bound sampler using the pre-loaded buffers
        const offlineSampler = new Tone.Sampler(sampler!.buffers).toDestination();

        // Schedule offline triggers
        transcribedNotes.forEach((note) => {
          offlineSampler.triggerAttackRelease(
            note.note,
            note.duration,
            note.time,
            note.velocity
          );
        });
      }, totalDuration);

      // Encode buffer to WAV
      const wavBlob = audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'hummed-melody.wav';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('WAV export error:', err);
      alert('Could not render WAV.');
    } finally {
      exportingWav = false;
    }
  }

  function tryAgain() {
    stopMelody();
    transcribedNotes = [];
    currentStep = 2;
  }

  // Cleanup on destroy
  onDestroy(() => {
    stopRecording();
    stopMelody();
  });
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

  <!-- Core App container -->
  <section class="w-full max-w-3xl flex-1 flex flex-col justify-center py-12 z-10">
    
    <!-- STEP 1: PICK INSTRUMENT -->
    {#if currentStep === 1}
      <div class="space-y-8 animate-fade-in">
        <div class="text-center space-y-3">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Choose Your Instrument Pack
          </h1>
          <p class="text-zinc-400 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Select the target instrument pack. Humming will be transcribed to notes played by this instrument.
          </p>
        </div>

        <div class="grid grid-cols-1 gap-6 max-w-md mx-auto">
          {#each instruments as inst}
            <button
              on:click={() => loadInstrument(inst.id)}
              disabled={samplerLoading}
              class="group relative flex flex-col text-left p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-rose-500/40 transition-all duration-300 backdrop-blur-md overflow-hidden hover:scale-[1.01] {inst.glow} disabled:opacity-75 disabled:pointer-events-none"
            >
              <div class="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl {inst.accent} opacity-5 group-hover:opacity-10 blur-xl transition-all duration-300"></div>
              
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl bg-zinc-800/80 group-hover:bg-zinc-800 transition-colors border border-zinc-700/30">
                  {@html inst.icon}
                </div>
                <div>
                  <h3 class="text-lg font-bold text-zinc-100 group-hover:text-white transition-colors">
                    {inst.name}
                  </h3>
                  <p class="text-xs text-zinc-500 mt-0.5">
                    {inst.author}
                  </p>
                </div>
              </div>

              <p class="text-sm text-zinc-400 mt-4 leading-relaxed">
                {inst.desc}
              </p>

              <div class="mt-6 flex items-center justify-between w-full border-t border-zinc-800/60 pt-4 text-xs font-semibold">
                {#if samplerLoading && selectedInstrumentId === inst.id}
                  <span class="flex items-center gap-2 text-rose-400 glow-text-rose">
                    <svg class="animate-spin h-4.5 w-4.5 text-rose-500" viewBox="0 0 24 24" fill="none">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading High-Quality Samples...
                  </span>
                {:else}
                  <span class="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Click to load pack
                  </span>
                  <svg class="w-4 h-4 text-zinc-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                {/if}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/if}

    <!-- STEP 2: HUM (RECORDING) -->
    {#if currentStep === 2}
      <div class="space-y-8 animate-fade-in max-w-lg mx-auto w-full text-center">
        <div class="space-y-2">
          <span class="text-xs font-bold tracking-widest text-rose-400 uppercase">
            Active Instrument: Violin
          </span>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Hum Your Melody
          </h1>
          <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
            Sing or hum single notes clearly into your microphone. Pitchy will segment notes automatically.
          </p>
        </div>

        <!-- Recorder glass box -->
        <div class="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md space-y-6 glow-box-violet">
          <!-- Canvas Visualizer -->
          <div class="relative w-full h-32 rounded-xl bg-[#0a0810] border border-zinc-800/80 overflow-hidden flex items-center justify-center">
            <canvas id="waveform" bind:this={canvasElement} class="w-full h-full block z-0" width="512" height="128"></canvas>
            
            {#if !recording}
              <div class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-zinc-500 z-10 bg-zinc-950/20 backdrop-blur-[1px]">
                Waiting for recording to start...
              </div>
            {/if}
          </div>

          <!-- Status and counter -->
          <div class="flex justify-between items-center px-2 text-sm">
            <div class="flex items-center gap-2">
              {#if recording}
                <span class="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                <span class="text-rose-400 font-semibold tracking-wide">Recording</span>
              {:else}
                <span class="h-2 w-2 rounded-full bg-zinc-600"></span>
                <span class="text-zinc-400 font-semibold">Idle</span>
              {/if}
            </div>
            
            {#if recording}
              <span class="font-mono text-zinc-300 font-semibold text-base">
                {recordTime}s
              </span>
            {/if}
          </div>

          <!-- Big Record Button -->
          <div class="flex justify-center items-center py-4">
            {#if !recording}
              <button
                on:click={startRecording}
                class="w-24 h-24 rounded-full bg-gradient-to-tr from-rose-500 to-violet-600 hover:from-rose-400 hover:to-violet-500 p-[3px] shadow-lg shadow-violet-500/20 transition-all active:scale-95 group"
                aria-label="Start recording"
              >
                <div class="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center group-hover:bg-zinc-900/80 transition-colors">
                  <div class="w-8 h-8 rounded-full bg-rose-500 group-hover:scale-105 transition-all"></div>
                </div>
              </button>
            {:else}
              <button
                on:click={stopRecording}
                class="w-24 h-24 rounded-full bg-zinc-800 border border-rose-500/50 hover:bg-zinc-700 p-0.5 shadow-lg shadow-rose-500/20 transition-all active:scale-95 group flex items-center justify-center"
                aria-label="Stop recording"
              >
                <div class="w-6 h-6 rounded bg-rose-500 group-hover:scale-105 transition-all"></div>
              </button>
            {/if}
          </div>
        </div>

        <button
          on:click={() => { currentStep = 1; }}
          class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium underline underline-offset-4"
        >
          Change Instrument Pack
        </button>
      </div>
    {/if}

    <!-- STEP 3: RESULT -->
    {#if currentStep === 3}
      <div class="space-y-8 animate-fade-in w-full">
        <div class="text-center space-y-2">
          <span class="text-xs font-bold tracking-widest text-violet-400 uppercase">
            Transcription Ready
          </span>
          <h1 class="text-3xl font-extrabold tracking-tight text-white">
            Your Transcribed Melody
          </h1>
          <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
            Listen to your humming played back by the Violin, and download the MIDI or rendered WAV.
          </p>
        </div>

        <!-- Dashboard Result Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Main Player Card -->
          <div class="md:col-span-2 p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-6 glow-box-violet">
            <div>
              <h3 class="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
                Melody Playback
              </h3>
              
              <!-- Timeline Note visualizer -->
              {#if transcribedNotes.length > 0}
                <div class="relative w-full bg-zinc-950/80 rounded-xl border border-zinc-800/60 p-4 h-36 overflow-x-auto overflow-y-hidden flex items-end gap-1.5 scroll-smooth">
                  {#each transcribedNotes as note, index}
                    <div
                      class="relative rounded-lg flex flex-col items-center justify-end p-2 transition-all shrink-0 select-none cursor-pointer"
                      style="
                        width: {Math.max(60, note.duration * 100)}px;
                        height: {Math.min(100, Math.max(30, (note.midi - 40) * 2.5))}px;
                        background: {activeNoteIndex === index
                          ? 'linear-gradient(to top, rgba(244, 63, 94, 0.4), rgba(139, 92, 246, 0.4))'
                          : 'rgba(255, 255, 255, 0.03)'};
                        border: 1px solid {activeNoteIndex === index
                          ? 'rgba(244, 63, 94, 0.7)'
                          : 'rgba(255, 255, 255, 0.08)'};
                      "
                      title="Note: {note.note}, Duration: {note.duration.toFixed(2)}s"
                    >
                      {#if activeNoteIndex === index}
                        <div class="absolute inset-0 bg-rose-500/10 rounded-lg blur-md animate-pulse"></div>
                      {/if}
                      <span class="text-xs font-bold font-mono tracking-tight {activeNoteIndex === index ? 'text-rose-300' : 'text-zinc-500'}">
                        {note.note}
                      </span>
                    </div>
                  {/each}
                </div>
              {:else}
                <div class="w-full bg-zinc-950/80 rounded-xl border border-zinc-800/60 h-36 flex items-center justify-center text-xs text-zinc-500">
                  No notes transcribed. Try humming closer to the microphone.
                </div>
              {/if}
            </div>

            <!-- Custom Play Button controls -->
            <div class="flex items-center justify-between pt-2 border-t border-zinc-800/50">
              <button
                on:click={playMelody}
                disabled={transcribedNotes.length === 0}
                class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all font-bold shadow-md shadow-white/5 active:scale-[0.98]"
              >
                {#if isPlaying}
                  <!-- Stop Icon -->
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                  </svg>
                  Stop Preview
                {:else}
                  <!-- Play Icon -->
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Play Violin
                {/if}
              </button>
              
              <div class="text-xs text-zinc-500 font-mono">
                Notes: {transcribedNotes.length}
              </div>
            </div>
          </div>

          <!-- Export & Controls Card -->
          <div class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-6 glow-box-rose">
            <div class="space-y-4">
              <h3 class="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                Downloads
              </h3>
              
              <!-- MIDI download -->
              <button
                on:click={downloadMidi}
                disabled={transcribedNotes.length === 0 || exportingMidi}
                class="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all font-semibold text-sm disabled:opacity-50"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  MIDI File (.mid)
                </span>
                {#if exportingMidi}
                  <svg class="animate-spin h-4 w-4 text-zinc-500" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                {:else}
                  <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                {/if}
              </button>

              <!-- WAV download -->
              <button
                on:click={downloadWav}
                disabled={transcribedNotes.length === 0 || exportingWav || !sampler}
                class="w-full flex items-center justify-between p-3.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all font-semibold text-sm disabled:opacity-50"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Rendered WAV (.wav)
                </span>
                {#if exportingWav}
                  <svg class="animate-spin h-4 w-4 text-zinc-500" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                {:else}
                  <svg class="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                {/if}
              </button>
            </div>

            <!-- Retry button -->
            <button
              on:click={tryAgain}
              class="w-full text-center py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/30 hover:bg-zinc-900 transition-all text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    {/if}

  </section>

  <!-- Bottom status info -->
  <footer class="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center py-6 border-t border-zinc-800/40 z-10 text-xs text-zinc-500 gap-4">
    <div>
      Decoupled DSP Pipeline: <code class="text-zinc-400">Recorded Audio &rarr; Pitchy DSP &rarr; Note Events &rarr; Offline Render / Sampler / MIDI</code>
    </div>
    <div>
      Powered by <a class="text-zinc-400 underline hover:text-zinc-300" href="https://github.com/nbrosowsky/tonejs-instruments" target="_blank" rel="noreferrer">VSCO2 samples</a> &middot; no server-side audio processing
    </div>
  </footer>
</main>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
</style>
