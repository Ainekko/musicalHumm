<script lang="ts">
  import { createEventDispatcher, onDestroy } from 'svelte';
  import * as Tone from 'tone';
  import {
    notesToMidi,
    audioBufferToWav,
    type TranscribedNote
  } from '$lib/audioPipeline';

  export let transcribedNotes: TranscribedNote[] = [];
  export let sampler: Tone.Sampler | null = null;

  const dispatch = createEventDispatcher();

  let isPlaying = false;
  let activeNoteIndex: number | null = null;
  let playTime = 0;
  let playbackTimerInterval: any = null;
  let exportingMidi = false;
  let exportingWav = false;

  async function playMelody() {
    if (isPlaying) {
      stopMelody();
      return;
    }

    if (!sampler || transcribedNotes.length === 0) return;

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

    const startTime = Date.now();
    playbackTimerInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      playTime = elapsed;

      // Find current note playing
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

  async function downloadWav() {
    if (transcribedNotes.length === 0 || !sampler) return;
    exportingWav = true;
    try {
      const maxTime = Math.max(...transcribedNotes.map((n) => n.time + n.duration), 0);
      const totalDuration = maxTime + 0.8; // Release tail buffer

      // Offline AudioContext render
      const renderedBuffer = await Tone.Offline(async () => {
        const offlineSampler = new Tone.Sampler(sampler!.buffers);
        
        const vibrato = new Tone.Vibrato({
          frequency: 5.8,
          depth: 0.12
        });

        const reverb = new Tone.JCReverb({
          roomSize: 0.78,
          wet: 0.4
        });

        offlineSampler.attack = 0.18;
        offlineSampler.release = 1.2;

        offlineSampler.chain(vibrato, reverb, Tone.Destination);

        transcribedNotes.forEach((note) => {
          offlineSampler.triggerAttackRelease(
            note.note,
            note.duration,
            note.time,
            note.velocity
          );
        });
      }, totalDuration);

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
    dispatch('retry');
  }

  onDestroy(() => {
    stopMelody();
  });
</script>

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

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Playback/Visualizer Card -->
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

      <div class="flex items-center justify-between pt-2 border-t border-zinc-800/50">
        <button
          on:click={playMelody}
          disabled={transcribedNotes.length === 0}
          class="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white text-zinc-950 hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed transition-all font-bold shadow-md shadow-white/5 active:scale-[0.98]"
        >
          {#if isPlaying}
            <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
            Stop Preview
          {:else}
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

    <!-- Export Actions Card -->
    <div class="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-md flex flex-col justify-between space-y-6 glow-box-rose">
      <div class="space-y-4">
        <h3 class="text-sm font-bold text-zinc-400 uppercase tracking-wider">
          Downloads
        </h3>
        
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

      <button
        on:click={tryAgain}
        class="w-full text-center py-3.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-950/30 hover:bg-zinc-900 transition-all text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white"
      >
        Try Again
      </button>
    </div>
  </div>
</div>
