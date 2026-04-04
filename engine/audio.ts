// engine/audio.ts

import * as Tone from "tone";

/**
 * ブラウザのユーザー操作を起点に AudioContext を開始する。
 *
 * 注意:
 * 多くのブラウザでは自動再生が制限されるため、
 * Play ボタンなどのクリックイベント内で呼ぶことを前提にする。
 */
export async function ensureAudioStarted(): Promise<void> {
  if (Tone.getContext().state !== "running") {
    await Tone.start();
  }
}

/**
 * 現在の AudioContext が再生可能かどうか。
 */
export function isAudioRunning(): boolean {
  return Tone.getContext().state === "running";
}

/**
 * Transport を再生前の状態に整える。
 *
 * - 既存のスケジュールを消す
 * - 停止する
 * - 再生位置を先頭に戻す
 * - BPM を設定する
 */
export function prepareTransport(bpm: number): void {
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
  Tone.Transport.position = "0:0:0";
  Tone.Transport.bpm.value = bpm;
}

/**
 * Transport を開始する。
 *
 * 少しだけ先の時刻で開始すると、スケジュールの安定性が上がる。
 */
export function startTransport(): void {
  Tone.Transport.start("+0.05");
}

/**
 * Transport を停止して、先頭位置に戻す。
 */
export function stopTransport(): void {
  Tone.Transport.stop();
  Tone.Transport.position = "0:0:0";
}

/**
 * Transport 上のスケジュールを消去する。
 */
export function clearTransport(): void {
  Tone.Transport.cancel(0);
}

/**
 * 停止・位置リセット・スケジュール削除をまとめて行う。
 * piece の切り替え前などに使いやすい。
 */
export function resetTransport(): void {
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
  Tone.Transport.position = "0:0:0";
}
