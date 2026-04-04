# 001-two-tones

`001-two-tones` は、`music-body` において最初に可聴化された小作品である。

これは大きな完成曲ではない。  
二音の往復と、わずかなずれだけで成り立つ極小の piece である。  
しかしこの小ささこそが、この作品の意味でもある。

この piece は、音楽を大きな完成形から始めるのではなく、  
**最小の核から始める**という `music-body` の姿勢を、そのままかたちにした最初の観測点である。

## Role in this repository

この piece は、単に最初の作品というだけではない。  
`music-body` において、次のことが実際に成立するかを確かめるための最初の piece でもある。

- concept score を置けるか
- motif score を置けるか
- playback score を engine が読めるか
- app を通して実際に耳に届くか

つまり `001-two-tones` は、作品であると同時に、  
このリポジトリの最初の再生回路を通した確認点でもある。

## Concept

この piece の核はとても小さい。

- 二音の往復だけで立ち上がる
- 解決しないまま保留される
- 2回目だけ終端が少し遅れる

ここで重要なのは、音の数ではなく関係である。  
二音しかなくても、そこに反復があり、差異があり、時間的なずれがあるなら、  
すでに音楽は成立しうる。

## Listening image

聴感としては、これは展開的な作品ではない。  
むしろ、非常に小さな構造を観測するための piece に近い。

同じように見える往復が繰り返される。  
しかし、2回目の終端だけが少しだけ後ろへずれる。  
そのわずかな差異によって、反復は単なる繰り返しではなくなる。

この piece は、大きく進行するというより、  
**最小差の発生を聴く**ための piece である。

## Score layers in this piece

この piece も、`music-body` 全体と同じく複数の score layer を持つ。

### Concept score

日本語で読まれる層。  
この piece がどのような構造や感覚を持つかを記述する。

### Motif score

二音の関係や長さ、最小反復を保持する層。  
この piece の核は、ここに最も強く表れる。

### Playback score

engine が直接読む層。  
Tone.js ベースの再生基盤を通して、この piece を実際に鳴らす。

### Notation score

必要に応じて ABC / abcjs などを通して生成される層。  
この piece を音楽人の読解可能な言語へ開くための譜面である。

## Current implementation

現時点では、この piece は最小の playback score として実装されている。  
ループ再生を前提とし、二小節単位で循環する。

主な特徴は次の通り。

- BPM: 72
- meter: 4/4
- instrument: basic-synth
- loop: enabled
- structure: 二音の往復 + 2回目終端のずれ

## Why it is small

この piece は、意図的に小さい。

ここで目指されているのは、  
最初から豊かな編成や長い展開を作ることではない。  
まずは、音楽の核が記述され、再生され、聴かれるまでの経路を最短で通すことにある。

そのため、`001-two-tones` は完成度の大きさではなく、  
**回路を開くための最小性**によって選ばれている。

## Files

```text
001-two-tones/
├─ README.md
└─ scores/
   └─ playback.ts
```

将来的には、ここに次のような層が加わる可能性がある。

```text
001-two-tones/
├─ README.md
├─ scores/
│  ├─ concept.md
│  ├─ motif.json
│  ├─ playback.ts
│  └─ notation.abc
├─ modules/
└─ assets/
```

## Status

この piece は、最初の可聴化に成功している。  
つまり、`music-body` における最初の piece として、すでに耳で聴ける状態にある。

まだ小さい。  
けれど、この小ささの中に、  
このリポジトリ全体の作り方がすでに入っている。

## Note

`001-two-tones` は、最初の piece である。  
しかしそれは、最初だから単純なのではなく、  
単純であることを通して最初の piece になっている。

ここでは二音で足りる。  
そして、その二音が鳴ったことで、`music-body` は音楽を持ち始めた。
