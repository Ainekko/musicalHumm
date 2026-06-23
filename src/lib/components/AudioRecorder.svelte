<script lang="ts">
  import { createEventDispatcher, onDestroy, onMount } from 'svelte';
  import { transcribeAudio, type TranscribedNote } from '$lib/audioPipeline';

  export let instrumentName = 'Violin';

  const dispatch = createEventDispatcher();

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

      const width = canvasElement!.width;
      const height = canvasElement!.height;

      // Dark background with trail
      canvasCtx.fillStyle = 'rgba(10, 8, 16, 0.25)';
      canvasCtx.fillRect(0, 0, width, height);

      // Draw subtle midline
      canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      canvasCtx.lineWidth = 1;
      canvasCtx.beginPath();
      canvasCtx.moveTo(0, height / 2);
      canvasCtx.lineTo(width, height / 2);
      canvasCtx.stroke();

      // Glowing multi-color wave
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
      canvasCtx.shadowBlur = 0;
    };

    draw();
  }

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
        const arrayBuffer = await audioBlob.arrayBuffer();
        if (audioCtx) {
          try {
            const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            const notes = transcribeAudio(decodedBuffer);
            dispatch('transcribed', { notes });
          } catch (decodeErr) {
            console.error('Decoding failed:', decodeErr);
            alert('Could not decode audio. Try humming a bit louder.');
          }
        }
      };

      mediaRecorder.start();
      recording = true;

      recordTimerInterval = setInterval(() => {
        recordTime += 1;
      }, 1000);

      // Give DOM time to update for canvas reference
      setTimeout(() => {
        visualize();
      }, 50);

    } catch (err) {
      console.error('Mic access error:', err);
      alert('Microphone permission is required.');
    }
  }

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

  function changeInstrument() {
    stopRecording();
    dispatch('changeInstrument');
  }

  onDestroy(() => {
    stopRecording();
  });
</script>

<div class="space-y-8 animate-fade-in max-w-lg mx-auto w-full text-center">
  <div class="space-y-2">
    <span class="text-xs font-bold tracking-widest text-rose-400 uppercase">
      Active Instrument: {instrumentName}
    </span>
    <h1 class="text-3xl font-extrabold tracking-tight text-white">
      Hum Your Melody
    </h1>
    <p class="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
      Sing or hum single notes clearly into your microphone. Pitchy will segment notes automatically.
    </p>
  </div>

  <!-- Recorder Box -->
  <div class="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 backdrop-blur-md space-y-6 glow-box-violet">
    <!-- Visualizer Canvas -->
    <div class="relative w-full h-32 rounded-xl bg-[#0a0810] border border-zinc-800/80 overflow-hidden flex items-center justify-center">
      <canvas id="waveform" bind:this={canvasElement} class="w-full h-full block z-0" width="512" height="128"></canvas>
      
      {#if !recording}
        <div class="absolute inset-0 flex items-center justify-center text-xs font-semibold text-zinc-500 z-10 bg-zinc-950/20 backdrop-blur-[1px]">
          Waiting for recording to start...
        </div>
      {/if}
    </div>

    <!-- Status & Timer -->
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

    <!-- Record Trigger Button -->
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
    on:click={changeInstrument}
    class="text-xs text-zinc-500 hover:text-zinc-300 transition-colors font-medium underline underline-offset-4"
  >
    Change Instrument Pack
  </button>
</div>
