// engine/types.ts

/**
 * Phase 1 の最小再生基盤用型定義。
 *
 * この段階では、engine は Playback score を受け取り、
 * ブラウザ上で piece を再生することだけを目的にする。
 *
 * Concept score / Motif score / Notation score は別層にあり、
 * ここでは主に Playback score のための型を扱う。
 */

export type PieceId = string;
export type TrackId = string;
export type InstrumentId = string;

/**
 * Tone.js 互換の時間表現を想定した文字列。
 * 例:
 * - "0:0:0"
 * - "0:2:0"
 * - "1:0:0"
 */
export type TimeValue = string;

/**
 * 音名表現。
 * 例:
 * - "C4"
 * - "D#4"
 * - "Bb3"
 */
export type NoteValue = string;

/**
 * 音価表現。
 * 例:
 * - "8n"
 * - "4n"
 * - "2n"
 * - "1m"
 */
export type DurationValue = string;

/**
 * ベロシティ。0.0 ~ 1.0 を想定する。
 */
export type Velocity = number;

/**
 * Phase 1 では最小限の instrument kind だけを持つ。
 * 必要になったら増やしていく。
 */
export type InstrumentKind =
  | "basic-synth"
  | "mono-synth"
  | "poly-synth";

/**
 * 単音イベント。
 */
export interface NoteEvent {
  type: "note";
  time: TimeValue;
  note: NoteValue;
  dur: DurationValue;
  velocity?: Velocity;
}

/**
 * 和音イベント。
 * 最初は使わなくても、型として先に置いておく。
 */
export interface ChordEvent {
  type: "chord";
  time: TimeValue;
  notes: NoteValue[];
  dur: DurationValue;
  velocity?: Velocity;
}

/**
 * 休符イベント。
 * 無音も時間構造の一部として明示できるようにする。
 */
export interface RestEvent {
  type: "rest";
  time: TimeValue;
  dur: DurationValue;
}

/**
 * Phase 1 で engine が扱うイベント型。
 */
export type PlaybackEvent = NoteEvent | ChordEvent | RestEvent;

/**
 * 1トラック分の再生情報。
 */
export interface Track {
  id: TrackId;
  name?: string;
  instrument: InstrumentKind | InstrumentId;
  events: PlaybackEvent[];
  muted?: boolean;
  volume?: number;
  pan?: number;
}

/**
 * 最小ループ設定。
 */
export interface LoopConfig {
  enabled: boolean;
  start: TimeValue;
  end: TimeValue;
}

/**
 * Piece のメタ情報。
 * concept は UI や README にも流用しやすいよう残しておく。
 */
export interface PieceMeta {
  id: PieceId;
  title: string;
  bpm: number;
  meter?: string;
  description?: string;
  concept?: string[];
  tags?: string[];
}

/**
 * engine が直接受け取る、再生可能な作品単位。
 */
export interface Piece extends PieceMeta {
  tracks: Track[];
  loop?: LoopConfig;
}

/**
 * piece registry 用。
 */
export type PieceMap = Record<PieceId, Piece>;
