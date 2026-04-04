// engine/instruments/basicSynth.ts

import * as Tone from "tone";

export interface BasicSynthOptions {
  volume?: number;
  pan?: number;
}

export interface BasicSynthInstance {
  synth: Tone.PolySynth<Tone.Synth>;
  channel: Tone.Channel;
  dispose: () => void;
}

/**
 * Phase 1 用の最小シンセ。
 *
 * - 単音も和音も鳴らしやすいように PolySynth を使う
 * - Track 側の volume / pan を受けられるように Channel を挟む
 * - 音色はまず、癖が強すぎない triangle 系にしておく
 */
export function createBasicSynth(
  options: BasicSynthOptions = {},
): BasicSynthInstance {
  const { volume = 0, pan = 0 } = options;

  const channel = new Tone.Channel({
    volume,
    pan,
  }).toDestination();

  const synth = new Tone.PolySynth(Tone.Synth, {
    maxPolyphony: 8,
    options: {
      oscillator: {
        type: "triangle",
      },
      envelope: {
        attack: 0.01,
        decay: 0.12,
        sustain: 0.35,
        release: 0.8,
      },
    },
  }).connect(channel);

  return {
    synth,
    channel,
    dispose: () => {
      synth.dispose();
      channel.dispose();
    },
  };
}
