# Minimum audio foundation

このメモは、`music-body` における最初の再生基盤の設計を整理するためのものである。  
現時点では、小作品を増やすことより先に、**小作品を聴ける最小基盤**を作ることを優先する。

## Why this comes first

私は日本語を読める。  
ソースコードも読める。  
しかし、一般的な五線譜を主言語として読むことはできない。

そのため、このリポジトリでは、まず音楽を**聴けること**が重要になる。  
小作品を作る前に、それを Web 上で再生できる最小の基盤を持つ。

ここでいう基盤とは、単なる播放器ではない。  
それは、音楽を聴くための最初の身体である。

## First milestone

最初の到達点は、できるだけ小さく置く。

- ページを開ける
- `Play` を押せる
- 1つの小作品が鳴る
- `Stop` できる
- 作品名と BPM が見える

この段階では、複雑な UI や複数作品管理はまだ必要ない。  
まずは、音楽の核を「聴ける構造」として通す。

## Technical direction

再生基盤の第一候補は Tone.js とする。

理由は次の通り。

- ブラウザ上で音を扱うための高水準な基盤になる
- Transport による時間制御ができる
- 小さな作品を鳴らす最小基盤として十分である
- 後に engine を拡張しやすい

ただし、このリポジトリの正本は Tone.js の書き方そのものではない。  
Tone.js は、Playback score を可聴化するための最初の実装基盤として扱う。

## Score layers

このリポジトリでは、音楽を4層で扱う。

1. Concept score  
   人間が日本語で読む層

2. Motif score  
   音楽の核を保持する層

3. Playback score  
   engine が直接読む層

4. Notation score  
   音楽人が読む層  
   Playback score などから ABC / abcjs を通して生成する

最初の engine / app は、特に **Playback score** を正しく扱えることを目的とする。

## Principle of score design

このプロジェクトにおける譜面の正本は、一般的な五線譜ではない。  
五線譜は重要だが、最初の主言語ではない。

正本として重視するのは次の3層である。

- Concept score
- Motif score
- Playback score

Notation score は、音楽人に開くための重要な派生層として後から生成する。

つまりこのリポジトリでは、

- 日本語で読める
- ソースコードとして読める
- engine が鳴らせる
- 必要に応じて譜面として開ける

という構造を取る。

## Minimal playback data

最初の小作品は、五線譜ではなく、単純なイベント列として扱う。  
たとえば次のような形を想定する。

```ts
type NoteEvent = {
  time: string
  note: string
  dur: string
  velocity?: number
}

type Track = {
  instrument: string
  events: NoteEvent[]
}

type Piece = {
  id: string
  title: string
  bpm: number
  meter?: string
  concept?: string[]
  tracks: Track[]
}
```

この形式なら、譜面を読めなくても構造を追いやすい。  
同時に、engine はこれをそのまま入力として扱える。

## Minimal directory assumption

最初の段階では、次のような分離を想定する。

```text
engine/
├─ audio.ts
├─ transport.ts
├─ player.ts
├─ types.ts
└─ instruments/
   └─ basicSynth.ts

app/
├─ main.ts
├─ pieceRegistry.ts
├─ ui/
│  ├─ playButton.ts
│  └─ stopButton.ts
└─ styles.css
```

### engine

`engine/` は再利用可能な再生基盤を置く。  
Tone.js の起動、AudioContext の開始、Transport 制御、シンセ生成、Piece の再生を担う。

### app

`app/` は触れるための層を置く。  
最初は最小でよく、Play / Stop と作品名表示があれば十分である。

## First piece

最初の piece は完成曲である必要はない。  
むしろ、最初はごく小さな断片でよい。

候補:

- 二音だけのモチーフ
- 二小節だけの断片
- 反復の終端だけ少しずれる短い構造

最初の目的は作品の完成ではない。  
**作品を聴ける回路を通すこと**である。

## About notation

私は一般的な五線譜を主言語として読まない。  
しかし、音楽人にとって譜面は読解可能な言語である。  
そのため、このリポジトリでは譜面を捨てない。

将来的には、Playback score から ABC を生成し、abcjs で可視化する仕組みを置く。  
これにより、このリポジトリの音楽は、

- 私にとって読める
- engine にとって鳴らせる
- 音楽人にとっても読める

という複数の読解経路を持つ。

## Current conclusion

現時点の設計方針は次の通り。

- 先に `engine/` と `app/` を固める
- 最初の目的は「小作品を聴ける最小基盤」
- 再生基盤の第一候補は Tone.js
- 正本は五線譜ではなく、Concept / Motif / Playback score
- 譜面は第4層として ABC / abcjs で開く
- 最初の piece は極小でよい

この基盤が通ったあとに、小作品を少しずつ積んでいく。
