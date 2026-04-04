// pieces/001-two-tones/scores/playback.ts

import type { Piece } from "../../../../engine/types";

export const playback: Piece = {
  id: "001-two-tones",
  title: "Two Tones",
  bpm: 72,
  meter: "4/4",
  description: "A minimal piece built from two tones and a slight displacement at the end of the second phrase.",
  concept: [
    "二音の往復だけで立ち上がる",
    "解決しないまま保留される",
    "2回目だけ終端が少し遅れる",
  ],
  loop: {
    enabled: true,
    start: "0:0:0",
    end: "2:0:0",
  },
  tracks: [
    {
      id: "main",
      name: "Main motif",
      instrument: "basic-synth",
      volume: -6,
      pan: 0,
      events: [
        {
          type: "note",
          time: "0:0:0",
          note: "C4",
          dur: "8n",
          velocity: 0.85,
        },
        {
          type: "note",
          time: "0:1:0",
          note: "D4",
          dur: "4n",
          velocity: 0.72,
        },
        {
          type: "rest",
          time: "0:2:0",
          dur: "2n",
        },
        {
          type: "note",
          time: "1:0:0",
          note: "C4",
          dur: "8n",
          velocity: 0.85,
        },
        {
          type: "note",
          time: "1:1:2",
          note: "D4",
          dur: "4n",
          velocity: 0.72,
        },
      ],
    },
  ],
};

export default playback;
