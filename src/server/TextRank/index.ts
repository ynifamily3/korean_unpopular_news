import TextRankGraph from "./TextRankGraph";

export interface Word {
  surface: string;
  tag: string;
}

interface Pair {
  key: [string, string];
  value: number;
}

class WordPair {
  map: Pair[];

  constructor() {
    this.map = [];
  }

  set(key: [string, string], value: number): void {
    for (const item of this.map) {
      if (item.key[0] === key[0] && item.key[1] === key[1]) {
        item.value = value;
        return;
      }
    }
    this.map.push({ key: key, value: value });
  }

  get(key: [string, string]): number | undefined {
    for (const item of this.map) {
      if (item.key[0] === key[0] && item.key[1] === key[1]) {
        return item.value;
      }
    }
    return undefined;
  }

  entries(): Pair[] {
    return this.map;
  }
}

export default class TextRank {
  stopWords: Word[] = [
    {
      surface: "있",
      tag: "VV",
    },
    {
      surface: "하",
      tag: "VV",
    },
    {
      surface: "되",
      tag: "VV",
    },
    {
      surface: "없",
      tag: "VV",
    },
    {
      surface: "보",
      tag: "VV",
    },
  ]; // stop words
  candi_tags: string[] = ["NNG", "NNP", "VV", "VA"]; // candidate tags
  w: number; // window size
  coef: number; // coef
  threshold: number;
  dictCount: Map<string, number>;
  dictBiCount: Map<string, number>; // [string, string]
  dictNear: Map<string, number>; // [string, string]
  nTotal: number;
  // dup zone
  graph: TextRankGraph;

  constructor(windowSize = 5) {
    this.w = windowSize;
    this.coef = 0.1;
    this.threshold = 0.005;
    this.dictCount = new Map();
    this.dictBiCount = new Map();
    this.dictNear = new Map();
    this.nTotal = 0;

    // dup zone
    this.graph = new TextRankGraph();
  }

  mks(key: string, value: string): string {
    return key + ":" + value;
  }
  ots(kv: string): string[] {
    return kv.split(":");
  }

  insertPair(a: Word, b: Word): void {
    if (a.surface > b.surface || (a.surface === b.surface && a.tag > b.tag)) {
      const tmp: Word = a;
      a = b;
      b = tmp;
    } else if (a.surface === b.surface && a.tag === b.tag) return;
    const maked = this.mks(a.surface, a.tag) + ":" + this.mks(b.surface, b.tag);
    const val: number | undefined = this.dictBiCount.get(maked);
    this.dictBiCount.set(maked, typeof val !== "undefined" ? val + 1 : 1);
  }

  insertNearPair(a: Word, b: Word): void {
    const maked = this.mks(a.surface, a.tag) + ":" + this.mks(b.surface, b.tag);
    const val: number | undefined = this.dictNear.get(maked);
    this.dictNear.set(maked, typeof val !== "undefined" ? val + 1 : 1);
  }

  wordFilter(word: Word): boolean {
    if (
      this.candi_tags.includes(word.tag) &&
      this.stopWords.filter(
        (stop: Word): boolean =>
          word.surface === stop.surface && word.tag === stop.tag
      ).length === 0 &&
      word.surface.length > 1
    )
      return true;
    return false;
  }

  load(sents: Word[][]): void {
    for (const sent of sents) {
      sent.forEach((word, i) => {
        // 스톱워드에 있는지를 체크한다.
        if (this.wordFilter(word)) {
          // 실행
          const maked = this.mks(word.surface, word.tag);
          const val: number | undefined = this.dictCount.get(maked);
          this.dictCount.set(maked, typeof val !== "undefined" ? val + 1 : 1);
          this.nTotal += 1;
          if (i - 1 >= 0 && this.wordFilter(sent[i - 1])) {
            this.insertNearPair(sent[i - 1], word);
          }
          if (i + 1 < sent.length && this.wordFilter(sent[i + 1])) {
            this.insertNearPair(word, sent[i + 1]);
          }
          const end = Math.min(i + this.w + 1, sent.length);
          for (let j = i + 1; j < end; j++) {
            if (!this.wordFilter(sent[j])) continue;
            if (sent[j].surface !== word.surface && sent[j].tag !== word.tag) {
              this.insertPair(word, sent[j]);
            }
          }
        }
      });
    }
  }

  getPMI(a: Word, b: Word): number {
    const maked = this.mks(a.surface, a.tag) + ":" + this.mks(b.surface, b.tag);
    const co0 = this.dictNear.get(maked);
    const co: number = typeof co0 === "undefined" ? 0 : co0;
    if (co === 0) {
      return -1; // pmi 계산 불가능
    }
    const aCnt = this.dictCount.get(this.mks(a.surface, a.tag));
    const bCnt = this.dictCount.get(this.mks(b.surface, b.tag));
    if (typeof aCnt === "number" && typeof bCnt === "number")
      return Math.log((co * this.nTotal) / aCnt / bCnt);
    return -1;
  }

  getI(a: Word): number {
    if (!this.dictCount.has(this.mks(a.surface, a.tag))) {
      return -1; // I 계산 불가능
    }
    const aCnt = this.dictCount.get(this.mks(a.surface, a.tag));
    if (typeof aCnt === "number") return Math.log(this.nTotal / aCnt);
    return -1;
  }

  build(): void {
    // this.graph.addEdge
    // dictCount keys로부터 노드를 다 추가한다.
    for (const z of this.dictBiCount) {
      const x = this.ots(z[0]);
      const a = x[0];
      const b = x[2];
      const n = z[1];
      this.graph.addEdge(a, b, n * this.coef + (1 - this.coef));
    }
  }

  // 새로 만든 익스트랙트
  extract(ratio: number = 0.1) {
    const ranks: Map<string, number> = this.graph.rank();
    console.log(ranks);
    const cand = Array.from(ranks.entries())
      .sort((a, b) => {
        return b[1] - a[1];
      })
      .slice(0, Math.floor(ranks.size * ratio))
      .map((x) => x[0]);
    const pairness = {};
    const startOf = {};
    const tuples: Map<[string, string?], number> = new Map(); // 튜플...ㅠㅠ
    console.log(cand);
    for (const k of cand) {
      // tuples.set([k], this.getI(k) * ranks[k]);
    }
  }

  // 빌드랑 랭크를 합친것
  //   extractKeywords(wordList: Word[], numKeywords: number): [string, number][] {
  //     const g = new TextRankGraph();
  //     const cm = new WordPair();
  //     for (let i = 0; i < wordList.length; ++i) {
  //       const word = wordList[i];
  //       if (this.candi_tags.includes(word.tag) && word.surface.length > 1) {
  //         for (let j = i + 1; j < i + this.w; ++j) {
  //           if (j >= wordList.length) break;
  //           if (
  //             !this.candi_tags.includes(wordList[j].tag) ||
  //             this.stopWords.filter(
  //               (word) =>
  //                 word.surface === wordList[j].surface &&
  //                 word.tag === wordList[j].tag
  //             ).length > 0 ||
  //             wordList[j].surface.length < 2
  //           ) {
  //             continue;
  //           }
  //           const pair: [string, string] = [word.surface, wordList[j].surface];
  //           cm.set(pair, (cm.get(pair) || 0) + 1);
  //         }
  //       }
  //     }
  //     for (const entry of cm.entries()) {
  //       g.addEdge(entry.key[0], entry.key[1], entry.value);
  //     }
  //     return Array.from(g.rank().entries())
  //       .sort((a, b) => b[1] - a[1])
  //       .slice(0, numKeywords);
  //   }
}
