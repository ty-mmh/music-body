// engine/player.ts

import * as Tone from "tone";
import {
  clearTransport,
  ensureAudioStarted,
  prepareTransport,
  resetTransport,
  startTransport,
  stopTransport,
} from "./audio";
import { createBasicSynth, type BasicSynthInstance } from "./instruments/basicSynth";
import type {
  ChordEvent,
  NoteEvent,
  Piece,
  PlaybackEvent,
  RestEvent,
  Track,
} from "./types";

type TrackInstrument = BasicSynthInstance;

export interface Player {
  load: (piece: Piece) => void;
  play: (piece?: Piece) => Promise<void>;
  stop: () => void;
  dispose: () => void;
  getCurrentPiece: () => Piece | null;
}

export function createPlayer(): Player {
  let currentPiece: Piece | null = null;
  let trackInstruments: TrackInstrument[] = [];

  function createInstrument(track: Track): TrackInstrument {
    switch (track.instrument) {
      case "basic-synth":
      case "mono-synth":
      case "poly-synth":
      default:
        return createBasicSynth({
          volume: track.volume ?? 0,
          pan: track.pan ?? 0,
        });
    }
  }

  function disposeTrackInstruments(): void {
    for (const instrument of trackInstruments) {
      instrument.dispose();
    }
    trackInstruments = [];
  }

  function applyLoop(piece: Piece): void {
    if (piece.loop?.enabled) {
      Tone.Transport.loop = true;
      Tone.Transport.loopStart = piece.loop.start;
      Tone.Transport.loopEnd = piece.loop.end;
      return;
    }

    Tone.Transport.loop = false;
    Tone.Transport.loopStart = 0;
    Tone.Transport.loopEnd = 0;
  }

  function scheduleNoteEvent(
    instrument: TrackInstrument,
    event: NoteEvent,
  ): void {
    Tone.Transport.schedule((time) => {
      instrument.synth.triggerAttackRelease(
        event.note,
        event.dur,
        time,
        event.velocity,
      );
    }, event.time);
  }

  function scheduleChordEvent(
    instrument: TrackInstrument,
    event: ChordEvent,
  ): void {
    Tone.Transport.schedule((time) => {
      instrument.synth.triggerAttackRelease(
        event.notes,
        event.dur,
        time,
        event.velocity,
      );
    }, event.time);
  }

  function scheduleRestEvent(_instrument: TrackInstrument, _event: RestEvent): void {
    // Rest は時間構造としては意味があるが、
    // Phase 1 では明示的な再生処理は行わない。
  }

  function scheduleEvent(
    instrument: TrackInstrument,
    event: PlaybackEvent,
  ): void {
    switch (event.type) {
      case "note":
        scheduleNoteEvent(instrument, event);
        return;
      case "chord":
        scheduleChordEvent(instrument, event);
        return;
      case "rest":
        scheduleRestEvent(instrument, event);
        return;
    }
  }

  function schedulePiece(piece: Piece): void {
    for (const track of piece.tracks) {
      if (track.muted) continue;

      const instrument = createInstrument(track);
      trackInstruments.push(instrument);

      for (const event of track.events) {
        scheduleEvent(instrument, event);
      }
    }
  }

  function load(piece: Piece): void {
    stopTransport();
    clearTransport();
    disposeTrackInstruments();

    currentPiece = piece;

    prepareTransport(piece.bpm);
    applyLoop(piece);
    schedulePiece(piece);
  }

  async function play(piece?: Piece): Promise<void> {
    if (piece) {
      load(piece);
    }

    if (!currentPiece) {
      throw new Error("No piece loaded.");
    }

    await ensureAudioStarted();
    startTransport();
  }

  function stop(): void {
    stopTransport();
    resetTransport();
    disposeTrackInstruments();
  }

  function dispose(): void {
    stop();
    currentPiece = null;
  }

  function getCurrentPiece(): Piece | null {
    return currentPiece;
  }

  return {
    load,
    play,
    stop,
    dispose,
    getCurrentPiece,
  };
}
