// engine/notation/abc.ts

import type {
  ChordEvent,
  NoteEvent,
  Piece,
  PlaybackEvent,
  RestEvent,
  Track,
} from "../types";

const DEFAULT_METER = "4/4";
const DEFAULT_NOTE_LENGTH = "1/16";
const UNITS_PER_BAR = 16; // 4/4 を 16分音符単位で扱う

export interface AbcExportOptions {
  referenceNumber?: number;
  composer?: string;
  key?: string;
  trackId?: string;
}

interface TimedToken {
  start: number;
  dur: number;
  token: string;
}

export function pieceToAbc(
  piece: Piece,
  options: AbcExportOptions = {},
): string {
  const track = pickTrack(piece, options.trackId);
  const meter = piece.meter ?? DEFAULT_METER;
  const key = options.key ?? "C";
  const composer = options.composer ?? "ty-mmh + ChatGPT";
  const referenceNumber = options.referenceNumber ?? 1;

  if (meter !== DEFAULT_METER) {
    throw new Error(`Unsupported meter: ${meter}. Phase 1 supports only 4/4.`);
  }

  const tokens = trackToTimedTokens(track);
  const totalUnits = resolveTotalUnits(piece, tokens);
  const body = timedTokensToAbcBody(tokens, totalUnits);

  return [
    `X:${referenceNumber}`,
    `T:${piece.id}`,
    `C:${composer}`,
    `M:${meter}`,
    `L:${DEFAULT_NOTE_LENGTH}`,
    `Q:1/4=${piece.bpm}`,
    `K:${key}`,
    "",
    body,
  ].join("\n");
}

function pickTrack(piece: Piece, trackId?: string): Track {
  if (trackId) {
    const found = piece.tracks.find((track) => track.id === trackId);
    if (!found) {
      throw new Error(`Track not found: ${trackId}`);
    }
    return found;
  }

  const firstPlayable = piece.tracks.find((track) => !track.muted);
  if (!firstPlayable) {
    throw new Error("No playable track found.");
  }

  return firstPlayable;
}

function resolveTotalUnits(piece: Piece, tokens: TimedToken[]): number {
  if (piece.loop?.enabled) {
    return parseTonePosition(piece.loop.end);
  }

  const maxEnd = tokens.reduce((max, token) => {
    return Math.max(max, token.start + token.dur);
  }, 0);

  return maxEnd;
}

function trackToTimedTokens(track: Track): TimedToken[] {
  const sortedEvents = [...track.events].sort((a, b) => {
    return parseEventStart(a) - parseEventStart(b);
  });

  return sortedEvents.map((event) => playbackEventToTimedToken(event));
}

function parseEventStart(event: PlaybackEvent): number {
  return parseTonePosition(event.time);
}

function playbackEventToTimedToken(event: PlaybackEvent): TimedToken {
  switch (event.type) {
    case "note":
      return noteEventToTimedToken(event);
    case "chord":
      return chordEventToTimedToken(event);
    case "rest":
      return restEventToTimedToken(event);
  }
}

function noteEventToTimedToken(event: NoteEvent): TimedToken {
  return {
    start: parseTonePosition(event.time),
    dur: parseDuration(event.dur),
    token: `${noteToAbc(event.note)}${unitsToAbcLength(parseDuration(event.dur))}`,
  };
}

function chordEventToTimedToken(event: ChordEvent): TimedToken {
  const notes = event.notes.map(noteToAbc).join("");
  return {
    start: parseTonePosition(event.time),
    dur: parseDuration(event.dur),
    token: `[${notes}]${unitsToAbcLength(parseDuration(event.dur))}`,
  };
}

function restEventToTimedToken(event: RestEvent): TimedToken {
  return {
    start: parseTonePosition(event.time),
    dur: parseDuration(event.dur),
    token: `z${unitsToAbcLength(parseDuration(event.dur))}`,
  };
}

function timedTokensToAbcBody(tokens: TimedToken[], totalUnits: number): string {
  const measures: string[] = [];
  let currentMeasure = "";
  let cursor = 0;

  for (const token of tokens) {
    if (token.start < cursor) {
      throw new Error("Overlapping events are not supported in Phase 1.");
    }

    if (token.start > cursor) {
      currentMeasure = appendTokenAcrossMeasures(
        currentMeasure,
        measures,
        cursor,
        token.start - cursor,
        (dur) => `z${unitsToAbcLength(dur)}`,
      );
      cursor = token.start;
    }

    currentMeasure = appendTokenAcrossMeasures(
      currentMeasure,
      measures,
      cursor,
      token.dur,
      (dur) => rewriteTokenLength(token.token, dur),
    );
    cursor += token.dur;
  }

  if (cursor < totalUnits) {
    currentMeasure = appendTokenAcrossMeasures(
      currentMeasure,
      measures,
      cursor,
      totalUnits - cursor,
      (dur) => `z${unitsToAbcLength(dur)}`,
    );
    cursor = totalUnits;
  }

  if (currentMeasure.length > 0) {
    measures.push(currentMeasure.trim());
  }

  return measures.join(" | ") + " ||";
}

function appendTokenAcrossMeasures(
  currentMeasure: string,
  measures: string[],
  start: number,
  dur: number,
  tokenFactory: (dur: number) => string,
): string {
  let remaining = dur;
  let cursor = start;
  let result = currentMeasure;

  while (remaining > 0) {
    const positionInBar = cursor % UNITS_PER_BAR;
    const availableInBar = UNITS_PER_BAR - positionInBar;
    const slice = Math.min(remaining, availableInBar);

    const token = tokenFactory(slice);
    result += `${token} `;

    cursor += slice;
    remaining -= slice;

    if (cursor % UNITS_PER_BAR === 0) {
      measures.push(result.trim());
      result = "";
    }
  }

  return result;
}

function rewriteTokenLength(token: string, dur: number): string {
  if (token.startsWith("[")) {
    const closeIndex = token.indexOf("]");
    const chordBody = token.slice(0, closeIndex + 1);
    return `${chordBody}${unitsToAbcLength(dur)}`;
  }

  const head = token.match(/^[\^_=]*[A-Ga-gz][,']*/)?.[0];
  if (!head) {
    throw new Error(`Could not rewrite token length: ${token}`);
  }

  return `${head}${unitsToAbcLength(dur)}`;
}

function parseTonePosition(value: string): number {
  const parts = value.split(":").map((part) => Number(part));

  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    throw new Error(`Unsupported Tone position: ${value}`);
  }

  const [bars, quarters, sixteenths] = parts;
  return bars * 16 + quarters * 4 + sixteenths;
}

function parseDuration(value: string): number {
  switch (value) {
    case "16n":
      return 1;
    case "8n":
      return 2;
    case "4n":
      return 4;
    case "2n":
      return 8;
    case "1m":
      return 16;
    default:
      throw new Error(`Unsupported duration: ${value}`);
  }
}

function unitsToAbcLength(units: number): string {
  if (units === 1) return "";
  return String(units);
}

function noteToAbc(note: string): string {
  const match = note.match(/^([A-Ga-g])([#b]?)(\d)$/);

  if (!match) {
    throw new Error(`Unsupported note format: ${note}`);
  }

  const [, rawLetter, accidental, octaveText] = match;
  const octave = Number(octaveText);

  const accidentalPrefix =
    accidental === "#"
      ? "^"
      : accidental === "b"
        ? "_"
        : "";

  const abcLetter = pitchLetterToAbc(rawLetter.toUpperCase(), octave);
  return `${accidentalPrefix}${abcLetter}`;
}

function pitchLetterToAbc(letter: string, octave: number): string {
  // Phase 1:
  // C4-B4 を大文字、
  // C5-B5 を小文字として扱う。
  if (octave === 4) {
    return letter.toUpperCase();
  }

  if (octave === 5) {
    return letter.toLowerCase();
  }

  if (octave < 4) {
    return `${letter.toUpperCase()}${",".repeat(4 - octave)}`;
  }

  return `${letter.toLowerCase()}${"'".repeat(octave - 5)}`;
}
