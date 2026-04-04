// app/main.ts

import { createPlayer } from "../engine/player";
import playback from "../pieces/001-two-tones/scores/playback";

const player = createPlayer();

const titleEl = document.getElementById("piece-title");
const bpmEl = document.getElementById("piece-bpm");
const statusEl = document.getElementById("player-status");
const playButton = document.getElementById("play-button");
const stopButton = document.getElementById("stop-button");

function assertHTMLElement<T extends HTMLElement>(
  element: HTMLElement | null,
  id: string,
): T {
  if (!element) {
    throw new Error(`Element with id "${id}" was not found.`);
  }
  return element as T;
}

const safeTitleEl = assertHTMLElement<HTMLElement>(titleEl, "piece-title");
const safeBpmEl = assertHTMLElement<HTMLElement>(bpmEl, "piece-bpm");
const safeStatusEl = assertHTMLElement<HTMLElement>(statusEl, "player-status");
const safePlayButton = assertHTMLElement<HTMLButtonElement>(playButton, "play-button");
const safeStopButton = assertHTMLElement<HTMLButtonElement>(stopButton, "stop-button");

function renderPieceInfo(): void {
  safeTitleEl.textContent = playback.title;
  safeBpmEl.textContent = String(playback.bpm);
}

function setStatus(text: string): void {
  safeStatusEl.textContent = text;
}

async function handlePlay(): Promise<void> {
  try {
    safePlayButton.disabled = true;
    setStatus("starting...");

    await player.play(playback);

    setStatus("playing");
  } catch (error) {
    console.error(error);
    setStatus("error");
    safePlayButton.disabled = false;
  }
}

function handleStop(): void {
  try {
    player.stop();
    setStatus("stopped");
  } catch (error) {
    console.error(error);
    setStatus("error");
  } finally {
    safePlayButton.disabled = false;
  }
}

function setup(): void {
  renderPieceInfo();
  setStatus("ready");

  safePlayButton.addEventListener("click", () => {
    void handlePlay();
  });

  safeStopButton.addEventListener("click", handleStop);
}

setup();
