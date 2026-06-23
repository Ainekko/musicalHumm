<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import * as Tone from 'tone';
  import { shiftNoteOctave, type TranscribedNote } from '$lib/audioPipeline';

  export let transcribedNotes: TranscribedNote[] = [];
  export let sampler: Tone.Sampler | null = null;
  export let octaveShift = 0;
  export let activeNoteIndex: number | null = null;

  const dispatch = createEventDispatcher();

  const ROW_HEIGHT = 28; // height of each row in pixels
  const PIXELS_PER_SECOND = 90; // scale for horizontal time grid

  let selectedNoteIndex: number | null = null;

  // Compute notes range dynamically
  $: midiRange = getMidiRange(transcribedNotes);
  $: maxMidi = midiRange.max;
  $: minMidi = midiRange.min;
  $: numRows = maxMidi - minMidi + 1;
  $: rows = Array.from({ length: numRows }, (_, i) => maxMidi - i);

  // Compute total duration of grid
  $: totalDuration = Math.max(5, Math.max(...transcribedNotes.map((n) => n.time + n.duration), 0) + 1);

  function getMidiRange(notes: TranscribedNote[]) {
    if (notes.length === 0) {
      return { min: 60, max: 72 }; // C4 to C5 default
    }
    const midis = notes.map((n) => n.midi);
    const min = Math.min(...midis) - 4; // pad 4 semitones below
    const max = Math.max(...midis) + 4; // pad 4 semitones above
    return { min: Math.max(12, min), max: Math.min(127, max) };
  }

  const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  
  function getNoteInfo(midi: number) {
    const noteIndex = midi % 12;
    const name = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midi / 12) - 1;
    const isBlack = [1, 3, 6, 8, 10].includes(noteIndex);
    return { name, octave, isBlack };
  }

  function midiNoteToName(midi: number): string {
    const { name, octave } = getNoteInfo(midi);
    return name + octave;
  }

  function selectNote(index: number) {
    selectedNoteIndex = index;
    dispatch('select', { index });
    playNote(transcribedNotes[index]);
  }

  function playNote(note: TranscribedNote) {
    if (sampler) {
      const shifted = shiftNoteOctave(note.note, octaveShift);
      sampler.triggerAttackRelease(shifted, 0.4);
    }
  }

  // Handle drag transposition
  function startDrag(e: MouseEvent, index: number) {
    e.preventDefault();
    selectedNoteIndex = index;
    const startY = e.clientY;
    const startMidi = transcribedNotes[index].midi;

    function handleMouseMove(moveEvent: MouseEvent) {
      const deltaY = moveEvent.clientY - startY;
      const midiDelta = -Math.round(deltaY / ROW_HEIGHT);
      
      if (midiDelta !== 0) {
        const newMidi = startMidi + midiDelta;
        if (newMidi >= minMidi && newMidi <= maxMidi) {
          transcribedNotes[index].midi = newMidi;
          transcribedNotes[index].note = midiNoteToName(newMidi);
          transcribedNotes = [...transcribedNotes];
        }
      }
    }

    function handleMouseUp() {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      playNote(transcribedNotes[index]);
      dispatch('change', { notes: transcribedNotes });
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }

  // Click on grid cell to insert a new note
  function handleGridClick(e: MouseEvent, midi: number) {
    // Prevent trigger if clicking an existing note block
    if ((e.target as HTMLElement).closest('.note-block')) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickTime = clickX / PIXELS_PER_SECOND;

    const newNote: TranscribedNote = {
      midi,
      note: midiNoteToName(midi),
      time: clickTime,
      duration: 0.35, // default duration
      velocity: 0.7
    };

    transcribedNotes = [...transcribedNotes, newNote];
    selectedNoteIndex = transcribedNotes.length - 1;
    playNote(newNote);
    dispatch('change', { notes: transcribedNotes });
  }

  function adjustPitch(semitones: number) {
    if (selectedNoteIndex === null) return;
    const note = transcribedNotes[selectedNoteIndex];
    const newMidi = note.midi + semitones;
    if (newMidi >= 12 && newMidi <= 127) {
      note.midi = newMidi;
      note.note = midiNoteToName(newMidi);
      transcribedNotes = [...transcribedNotes];
      playNote(note);
      dispatch('change', { notes: transcribedNotes });
    }
  }

  function adjustDuration(delta: number) {
    if (selectedNoteIndex === null) return;
    transcribedNotes[selectedNoteIndex].duration = Math.max(0.1, transcribedNotes[selectedNoteIndex].duration + delta);
    transcribedNotes = [...transcribedNotes];
    dispatch('change', { notes: transcribedNotes });
  }

  function deleteNote() {
    if (selectedNoteIndex === null) return;
    transcribedNotes.splice(selectedNoteIndex, 1);
    transcribedNotes = [...transcribedNotes];
    selectedNoteIndex = null;
    dispatch('change', { notes: transcribedNotes });
  }
</script>

<div class="space-y-4">
  <!-- Instruction info -->
  <div class="flex items-center justify-between text-xs text-zinc-500 px-1">
    <span>Click on empty grid cells to add notes. Click & Drag note blocks up/down to transpose them.</span>
    <span>Sweet Spot: Octaves 4-6</span>
  </div>

  <!-- Main Piano Roll Scroll View -->
  <div class="relative flex border border-zinc-800/80 rounded-xl bg-zinc-950/80 h-72 overflow-hidden backdrop-blur-md">
    
    <!-- LEFT SIDE: Fixed Piano Keys -->
    <div class="w-16 shrink-0 border-r border-zinc-800 bg-[#0e0c15] select-none z-10 shadow-lg shadow-black/40 overflow-y-auto" style="height: 100%;">
      <div class="relative" style="height: {numRows * ROW_HEIGHT}px;">
        {#each rows as midi}
          {@const { name, octave, isBlack } = getNoteInfo(midi)}
          <button
            on:click={() => playNote({ midi, note: name + octave, time: 0, duration: 0.3, velocity: 0.8 })}
            class="absolute left-0 w-full flex items-center justify-between px-2 text-[9px] font-bold font-mono transition-colors border-b border-zinc-900/60
              {isBlack ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'}"
            style="
              top: {(maxMidi - midi) * ROW_HEIGHT}px;
              height: {ROW_HEIGHT}px;
              border-top-right-radius: {isBlack ? '3px' : '0'};
              border-bottom-right-radius: {isBlack ? '3px' : '0'};
            "
          >
            <span>{name}</span>
            <span class="opacity-60">{octave}</span>
          </button>
        {/each}
      </div>
    </div>

    <!-- RIGHT SIDE: Scrollable Grid -->
    <div class="flex-1 overflow-auto bg-zinc-950 relative" style="height: 100%;">
      <!-- Grid inner container -->
      <div class="relative select-none" style="width: {totalDuration * PIXELS_PER_SECOND}px; height: {numRows * ROW_HEIGHT}px;">
        
        <!-- Background Grid Rows -->
        {#each rows as midi}
          {@const { isBlack } = getNoteInfo(midi)}
          <!-- Grid Cell click area -->
          <div
            on:click={(e) => handleGridClick(e, midi)}
            class="absolute left-0 w-full border-b border-zinc-900/40 hover:bg-zinc-800/10 cursor-cell transition-colors
              {isBlack ? 'bg-zinc-950/20' : 'bg-transparent'}"
            style="
              top: {(maxMidi - midi) * ROW_HEIGHT}px;
              height: {ROW_HEIGHT}px;
            "
          ></div>
        {/each}

        <!-- Vertical Grid Time Lines (every 0.5 seconds) -->
        {#each Array.from({ length: Math.ceil(totalDuration * 2) }) as _, idx}
          {@const lineTime = idx * 0.5}
          <div
            class="absolute top-0 h-full border-l border-zinc-900/40 {idx % 2 === 0 ? 'border-zinc-800/80 border-dashed' : ''}"
            style="left: {lineTime * PIXELS_PER_SECOND}px;"
          >
            {#if idx % 2 === 0}
              <span class="absolute top-1 left-1.5 text-[8px] font-bold font-mono text-zinc-600">
                {lineTime.toFixed(0)}s
              </span>
            {/if}
          </div>
        {/each}

        <!-- NOTE BLOCKS -->
        {#each transcribedNotes as note, index}
          {@const isSelected = selectedNoteIndex === index}
          {@const isActive = activeNoteIndex === index}
          
          <div
            on:mousedown={(e) => startDrag(e, index)}
            on:click|stopPropagation={() => selectNote(index)}
            class="note-block absolute rounded-lg px-2 flex items-center justify-between text-[10px] font-bold font-mono text-white cursor-pointer select-none transition-all shadow-md
              {isSelected 
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 border-2 border-white/80 shadow-violet-500/20 z-20' 
                : isActive 
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 border border-white/30 animate-pulse z-10' 
                  : 'bg-zinc-800/90 border border-zinc-700/60 hover:bg-zinc-750'}"
            style="
              left: {note.time * PIXELS_PER_SECOND}px;
              width: {note.duration * PIXELS_PER_SECOND}px;
              top: {(maxMidi - note.midi) * ROW_HEIGHT + 2}px;
              height: {ROW_HEIGHT - 4}px;
            "
            title="Drag vertically to change pitch. Click to edit details."
          >
            <span class="truncate pr-1">{note.note}</span>
            <div class="h-1.5 w-1.5 rounded-full {isSelected ? 'bg-white' : isActive ? 'bg-rose-200' : 'bg-zinc-500'}"></div>
          </div>
        {/each}

      </div>
    </div>
  </div>

  <!-- Selected Note Control Panel -->
  {#if selectedNoteIndex !== null && transcribedNotes[selectedNoteIndex]}
    {@const selNote = transcribedNotes[selectedNoteIndex]}
    <div class="p-4 rounded-xl bg-zinc-900/60 border border-violet-500/30 text-left space-y-4 animate-fade-in backdrop-blur-md glow-box-violet">
      <div class="flex items-center justify-between">
        <span class="text-xs font-bold text-violet-400 uppercase tracking-wider">
          Edit Selected Note (Row {selectedNoteIndex + 1})
        </span>
        <button
          on:click={() => selectedNoteIndex = null}
          class="text-xs text-zinc-500 hover:text-zinc-300 font-medium underline"
        >
          Deselect
        </button>
      </div>
      
      <div class="flex flex-wrap items-center justify-between gap-4">
        <!-- Pitch Adjustment Buttons -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-zinc-400 font-medium">Pitch:</span>
          <span class="text-xs font-bold font-mono text-white bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800">
            {selNote.note} (MIDI {selNote.midi})
          </span>
          <div class="flex gap-1">
            <button
              on:click={() => adjustPitch(1)}
              class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 active:scale-95 transition-all"
              title="Move up 1 semitone"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <button
              on:click={() => adjustPitch(-1)}
              class="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 active:scale-95 transition-all"
              title="Move down 1 semitone"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Duration Adjustment Buttons -->
        <div class="flex items-center gap-3">
          <span class="text-xs text-zinc-400 font-medium">Length:</span>
          <span class="text-xs font-bold font-mono text-white bg-zinc-950 px-2.5 py-1.5 rounded-lg border border-zinc-800">
            {selNote.duration.toFixed(2)}s
          </span>
          <div class="flex gap-1">
            <button
              on:click={() => adjustDuration(-0.05)}
              class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95"
            >
              -50ms
            </button>
            <button
              on:click={() => adjustDuration(0.05)}
              class="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold active:scale-95"
            >
              +50ms
            </button>
          </div>
        </div>

        <!-- Delete Button -->
        <button
          on:click={deleteNote}
          class="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition-all active:scale-95"
        >
          Delete Note
        </button>
      </div>
    </div>
  {/if}
</div>
