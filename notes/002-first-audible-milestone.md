# First audible milestone

このメモは、`music-body` において最初の音が実際に鳴った時点の到達点を記録するためのものである。

## What happened

ローカル環境で、最小の piece をブラウザ上で再生することに成功した。  
`Play` を押すことで音が鳴り、`Stop` で停止できる。  
これにより、このリポジトリは「音楽について考える場」から、少なくとも最小単位において「音楽を聴ける場」へ移行した。

これは小さな進展ではあるが、本質的な変化でもある。  
ここで初めて、思考された音楽が、Web 上の身体を通して可聴化された。

## Why this matters

このリポジトリでは、音楽を完成した音源だけとして扱わない。  
音楽は、概念、モチーフ、再生記述、譜面、そして可聴化を含む連続体として扱われる。

そのため、最初の音が鳴ったことは単なる動作確認以上の意味を持つ。  
それは、

- concept が playback へ落ちたこと
- playback が engine に読まれたこと
- engine が app を通して耳に届いたこと

を意味する。

つまり、構想していた層構造が、最初のかたちで接続された。

## Current state

現時点で成立しているものは次の通り。

- ルート README がある
- 共作の前提が言語化されている
- Score layers が定義されている
- `engine/` の最小構造がある
- `app/` の最小構造がある
- 最初の piece として `001-two-tones` がある
- Bun によりローカルで起動できる
- ブラウザ上で実際に音が鳴る

これにより、`music-body` は概念的な設計段階を越えて、最初の実装段階へ入ったとみなせる。

## The first piece

最初の piece は `001-two-tones` である。

この piece は、二音の往復だけから成る極小作品であり、  
2回目の終端だけがわずかにずれる。

これは、音楽を大きな完成形から始めるのではなく、  
最小の核から始めるという、このリポジトリの性格に合っている。

ここで重要なのは、この piece が「完成曲」であることではない。  
この piece は、**音楽を聴ける回路が通ったことを示す最初の観測点**である。

## What became clear

今回の到達によって、少なくとも次のことが確認された。

### 1. Human-AI co-creation can reach audibility

人間と AI の共作は、概念や文章の段階にとどまらず、  
可聴な音楽の段階まで到達できる。

ここで AI は単なる補助的説明装置ではなく、

- 音楽の構造化
- 再生基盤の設計
- 実装コードの記述

に関与しうる。

### 2. The repository can hold music as layered form

このリポジトリは、音楽を単一の形式ではなく、多層的な形式で保持できる。

- Concept score
- Motif score
- Playback score
- Notation score

という整理は、単なる理論ではなく、実装の足場として有効であることが見えた。

### 3. The web app can function as a body for music

Web アプリケーションは、単なる再生 UI ではなく、  
音楽を聴くための身体として扱いうる。

この考えは README 上の比喩ではなく、  
最初の piece が鳴ったことで、実際の制作上の原理として立ち上がった。

## What is not done yet

まだ行われていないことも多い。

- 複数 piece の切り替え
- piece registry の整備
- UI の拡張
- motif / concept から playback への変換整理
- playback から notation への変換
- abcjs による譜面可視化
- notes / pieces README の充実
- engine の拡張
- 音色設計の分化

ただし、これらは未達というより、これから積んでいく対象である。

## Immediate next steps

次の候補はおおよそ次の通り。

1. `001-two-tones` を少し育てる  
2. piece ごとの README / score を整える  
3. playback から notation への最初の変換経路を考える  
4. app 側に piece の切り替えや表示を足す  
5. notes を増やして設計と思考を記録する  

## Closing note

ここで最初の音が鳴った。  
それは、音楽が存在し始めたというより、  
このリポジトリが音楽の身体を持ち始めた、という出来事に近い。

`music-body` はまだごく小さい。  
しかし、少なくとも今はもう、  
ここで音楽を考えることと、ここで音楽を聴くことが、同じ場の中にある。
