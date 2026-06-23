import { PitchDetector } from 'pitchy';
import MidiWriter from 'midi-writer-js';

export interface TranscribedNote {
  midi: number;
  note: string;
  time: number;
  duration: number;
  velocity: number;
}

/**
 * Transcribes a monophonic AudioBuffer containing humming into discrete notes.
 */
export function transcribeAudio(
  audioBuffer: AudioBuffer,
  silenceThreshold = 0.012,
  minClarity = 0.82
): TranscribedNote[] {
  const sampleRate = audioBuffer.sampleRate;
  const channelData = audioBuffer.getChannelData(0);
  const fftSize = 2048;
  const hopSize = 512;
  const detector = PitchDetector.forFloat32Array(fftSize);
  
  const frames: { t: number; pitch: number; clarity: number; rms: number }[] = [];
  
  for (let i = 0; i + fftSize <= channelData.length; i += hopSize) {
    const frameData = new Float32Array(fftSize);
    for (let j = 0; j < fftSize; j++) {
      frameData[j] = channelData[i + j];
    }
    
    // Calculate RMS (loudness/level)
    let sum = 0;
    for (let j = 0; j < fftSize; j++) {
      sum += frameData[j] * frameData[j];
    }
    const rms = Math.sqrt(sum / fftSize);
    
    // Detect pitch
    const [pitch, clarity] = detector.findPitch(frameData, sampleRate);
    const t = i / sampleRate;
    
    frames.push({ t, pitch, clarity, rms });
  }
  
  // Collapse frames into notes
  const notes: TranscribedNote[] = [];
  interface NoteCandidate {
    note: number;
    startTime: number;
    pitches: number[];
    rmses: number[];
  }
  let currentNote: NoteCandidate | null = null;
  
  for (let f of frames) {
    // Filter voice range to standard hum ranges (C2 to C6, roughly 65Hz to 1046Hz)
    const isVoiced = f.clarity > minClarity && f.rms > silenceThreshold && f.pitch > 60 && f.pitch < 1200;
    
    let midiNote = 0;
    let noteNumber = 0;
    if (isVoiced) {
      midiNote = 69 + 12 * Math.log2(f.pitch / 440);
      noteNumber = Math.round(midiNote);
    }
    
    if (currentNote === null) {
      if (isVoiced) {
        // Start a new note
        currentNote = {
          note: noteNumber,
          startTime: f.t,
          pitches: [midiNote],
          rmses: [f.rms]
        };
      }
    } else {
      if (!isVoiced) {
        // End the note due to silence
        const duration = f.t - currentNote.startTime;
        if (duration >= 0.12) { // Minimum duration check to reject noise
          notes.push(finalizeNote(currentNote, duration));
        }
        currentNote = null;
      } else {
        // Check if the pitch has jumped to start a new note
        const avgPitch = currentNote.pitches.reduce((a, b) => a + b, 0) / currentNote.pitches.length;
        const pitchJump = Math.abs(midiNote - avgPitch);
        
        if (pitchJump >= 1.5) {
          // Pitch jumped by more than 1.5 semitones (new note start)
          const duration = f.t - currentNote.startTime;
          if (duration >= 0.12) {
            notes.push(finalizeNote(currentNote, duration));
          }
          currentNote = {
            note: noteNumber,
            startTime: f.t,
            pitches: [midiNote],
            rmses: [f.rms]
          };
        } else {
          // Stable pitch, accumulate
          currentNote.pitches.push(midiNote);
          currentNote.rmses.push(f.rms);
        }
      }
    }
  }
  
  // Close any trailing note
  if (currentNote !== null) {
    const duration = (channelData.length / sampleRate) - currentNote.startTime;
    if (duration >= 0.12) {
      notes.push(finalizeNote(currentNote, duration));
    }
  }
  
  // Post-processing: Merge very short silences or smooth note transitions if needed.
  // For V1, the raw segmenter is robust enough.
  return notes;
}

function finalizeNote(rawNote: { note: number; startTime: number; pitches: number[]; rmses: number[] }, duration: number): TranscribedNote {
  const avgMidi = rawNote.pitches.reduce((a, b) => a + b, 0) / rawNote.pitches.length;
  const finalNoteNumber = Math.round(avgMidi);
  const noteName = midiNoteToName(finalNoteNumber);
  
  const avgRms = rawNote.rmses.reduce((a, b) => a + b, 0) / rawNote.rmses.length;
  // Normalize velocity (map typical hum RMS ~0.02 - 0.2 to MIDI velocity 0.3 - 1.0)
  const velocity = Math.min(1.0, Math.max(0.3, (avgRms - 0.01) / 0.15));
  
  return {
    midi: finalNoteNumber,
    note: noteName,
    time: rawNote.startTime,
    duration: duration,
    velocity: velocity
  };
}

const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
function midiNoteToName(midi: number): string {
  const octave = Math.floor(midi / 12) - 1;
  const noteIndex = midi % 12;
  return NOTE_NAMES[noteIndex] + octave;
}

/**
 * Converts transcribed notes into MIDI file binary data (Uint8Array).
 */
export function notesToMidi(notes: TranscribedNote[]): Uint8Array {
  const track = new MidiWriter.Track();
  
  // Set default tempo to 120 BPM
  track.setTempo(120);
  
  // 120 BPM -> 1 beat = 0.5s. Default ticks per beat is 128.
  // Ticks per second is 256.
  const ticksPerSecond = 256;
  
  for (let note of notes) {
    const startTick = Math.round(note.time * ticksPerSecond);
    const durationTicks = Math.round(note.duration * ticksPerSecond);
    const safeDuration = Math.max(1, durationTicks);
    
    track.addEvent(
      new MidiWriter.NoteEvent({
        pitch: [note.note],
        duration: 'T' + safeDuration,
        tick: startTick,
        velocity: Math.round(note.velocity * 127)
      })
    );
  }
  
  const writer = new MidiWriter.Writer(track);
  return writer.buildFile();
}

/**
 * Encodes an AudioBuffer into standard 16-bit WAV file format.
 */
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result: Float32Array;
  if (numOfChan === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }
  
  const bufferLength = result.length * 2; // 16-bit
  const wavBuffer = new ArrayBuffer(44 + bufferLength);
  const view = new DataView(wavBuffer);
  
  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // File length
  view.setUint32(4, 36 + bufferLength, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // Format chunk identifier
  writeString(view, 12, 'fmt ');
  // Format chunk length
  view.setUint32(16, 16, true);
  // Sample format (raw PCM = 1)
  view.setUint16(20, format, true);
  // Channel count
  view.setUint16(22, numOfChan, true);
  // Sample rate
  view.setUint32(24, sampleRate, true);
  // Byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * numOfChan * (bitDepth / 8), true);
  // Block align (channel count * bytes per sample)
  view.setUint16(32, numOfChan * (bitDepth / 8), true);
  // Bits per sample
  view.setUint16(34, bitDepth, true);
  // Data chunk identifier
  writeString(view, 36, 'data');
  // Data chunk length
  view.setUint32(40, bufferLength, true);
  
  // Write PCM audio data
  floatTo16BitPCM(view, 44, result);
  
  return new Blob([view], { type: 'audio/wav' });
}

function interleave(inputL: Float32Array, inputR: Float32Array): Float32Array {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);
  
  let index = 0;
  let inputIndex = 0;
  
  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output: DataView, offset: number, input: Float32Array) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Shifts a musical note string (e.g. "C4", "A#3") by a specific number of octaves.
 */
export function shiftNoteOctave(noteName: string, octaves: number): string {
  const match = noteName.match(/^([A-G]#?)(\d+)$/);
  if (!match) return noteName;
  const pitch = match[1];
  const octave = parseInt(match[2], 10);
  return pitch + (octave + octaves);
}
