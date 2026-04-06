// scripts/generate-abc.ts

import { dirname, resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";

import { pieceToAbc } from "../engine/notation/abc";
import type { Piece } from "../engine/types";

interface PieceModule {
  default?: Piece;
  playback?: Piece;
}

function resolveOutputPath(inputPath: string): string {
  return inputPath.replace(/playback\.(ts|js)$/, "notation.abc");
}

async function loadPieceModule(modulePath: string): Promise<Piece> {
  const moduleUrl = pathToFileURL(modulePath).href;
  const mod = (await import(moduleUrl)) as PieceModule;
  const piece = mod.default ?? mod.playback;

  if (!piece) {
    throw new Error(
      `Could not find a Piece export in "${modulePath}". Expected "default" or "playback".`,
    );
  }

  return piece;
}

async function main(): Promise<void> {
  const inputArg = Bun.argv[2] ?? "pieces/001-two-tones/scores/playback.ts";
  const outputArg = Bun.argv[3];

  const inputPath = resolve(process.cwd(), inputArg);
  const outputPath = resolve(
    process.cwd(),
    outputArg ?? resolveOutputPath(inputArg),
  );

  const piece = await loadPieceModule(inputPath);
  const abc = pieceToAbc(piece);

  await mkdir(dirname(outputPath), { recursive: true });
  await Bun.write(outputPath, `${abc}\n`);

  console.log(`Generated ABC notation:
  input:  ${inputPath}
  output: ${outputPath}`);
}

await main();
