import TextRankGraph from "./TextRankGraph";

export interface Word {
  surface: string;
  tag: string;
}

interface WordMapElemType {
  key: Word;
  value: number;
}

export interface Pair {
  key: [Word, Word];
  value: number;
}

// [{surface:xx, tag:yy}=w1, {surface:zz, tag:aa}=w2...] 으로 이루어짐
export class WordMap {
  map: WordMapElemType[];
  constructor() {
    this.map = [];
  }

  set(key: Word, value: number): void {
    for (const item of this.map) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        item.value = value;
        return;
      }
    }
    // 없다면 추가할 것.
    this.map.push({
      key,
      value,
    });
  }

  get(key: Word): number | undefined {
    for (const item of this.map) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        return item.value;
      }
    }
    return undefined;
  }

  has(key: Word): boolean {
    for (const item of this.map) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        return true;
      }
    }
    return false;
  }

  values(): number[] {
    return this.map.map((x) => x.value);
  }

  entries(): WordMapElemType[] {
    return this.map;
  }
}

// [ Map-Map : value ...]
class WordPairMap {
  map: Pair[];

  constructor() {
    this.map = [];
  }

  set(key: [Word, Word], value: number): void {
    for (const item of this.map) {
      if (
        item.key[0].surface === key[0].surface &&
        item.key[0].tag === key[0].tag &&
        item.key[1].surface === key[1].surface &&
        item.key[1].tag === key[1].tag
      ) {
        item.value = value;
        return;
      }
    }
    this.map.push({ key, value });
  }

  get(key: [Word, Word]): number | undefined {
    for (const item of this.map) {
      if (
        item.key[0].surface === key[0].surface &&
        item.key[0].tag === key[0].tag &&
        item.key[1].surface === key[1].surface &&
        item.key[1].tag === key[1].tag
      ) {
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
  dictCount: WordMap;
  dictBiCount: WordPairMap; // [string, string]
  dictNear: WordPairMap; // [string, string]
  nTotal: number;
  // dup zone
  graph: TextRankGraph;

  constructor(windowSize = 5) {
    this.w = windowSize;
    this.coef = 0.1;
    this.threshold = 0.005;
    this.dictCount = new WordMap();
    this.dictBiCount = new WordPairMap();
    this.dictNear = new WordPairMap();
    this.nTotal = 0;

    // dup zone
    this.graph = new TextRankGraph();
  }

  insertPair(a: Word, b: Word): void {
    if (a.surface > b.surface || (a.surface === b.surface && a.tag > b.tag)) {
      const tmp: Word = a;
      a = b;
      b = tmp;
    } else if (a.surface === b.surface && a.tag === b.tag) return;
    const val: number | undefined = this.dictBiCount.get([a, b]);
    this.dictBiCount.set([a, b], typeof val !== "undefined" ? val + 1 : 1);
  }

  insertNearPair(a: Word, b: Word): void {
    const val: number | undefined = this.dictNear.get([a, b]);
    this.dictNear.set([a, b], typeof val !== "undefined" ? val + 1 : 1);
  }

  wordFilter(word: Word): boolean {
    if (
      this.candi_tags.includes(word.tag) &&
      this.stopWords.filter(
        (stop: Word): boolean =>
          word.surface === stop.surface && word.tag === stop.tag
      ).length === 0 &&
      word.surface.length > 1 // 두글자 이상
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
          // const maked = this.mks(word.surface, word.tag);
          const val: number | undefined = this.dictCount.get(word);
          this.dictCount.set(word, typeof val !== "undefined" ? val + 1 : 1);
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
    const co0: number | undefined = this.dictNear.get([a, b]);
    const co: number = typeof co0 === "undefined" ? 0 : co0;
    if (co === 0) {
      return -1; // pmi 계산 불가능
    }
    const aCnt = this.dictCount.get(a);
    const bCnt = this.dictCount.get(b);
    if (typeof aCnt === "number" && typeof bCnt === "number")
      return Math.log((co * this.nTotal) / aCnt / bCnt);
    return -1;
  }

  getI(a: Word): number {
    if (!this.dictCount.has(a)) {
      return -1; // I 계산 불가능
    }
    const aCnt = this.dictCount.get(a);
    if (typeof aCnt === "number") return Math.log(this.nTotal / aCnt);
    return -1;
  }

  build(): void {
    // this.graph.addEdge
    // dictCount keys로부터 노드를 다 추가한다.
    // for (const z of this.dictBiCount) {
    //   const x = this.ots(z[0]);
    //   const a = this.mks(x[0], x[1]);
    //   const b = this.mks(x[2], x[3]);
    //   const n = z[1];
    //   this.graph.addEdge(a, b, n * this.coef + (1 - this.coef));
    // }
    for (const x of this.dictBiCount.entries()) {
      const a: Word = x.key[0];
      const b: Word = x.key[1];
      const n: number = x.value;
      // this.graph.addEdge()
    }
  }

  // 새로 만든 익스트랙트
  // extract(ratio: number = 0.1) {
  //   const ranks: Map<string, number> = this.graph.rank();
  //   console.log(ranks);
  //   const cand = Array.from(ranks.entries())
  //     .sort((a, b) => {
  //       return b[1] - a[1];
  //     })
  //     .slice(0, Math.floor(ranks.size * ratio))
  //     .map((x) => x[0]);
  //   // console.log(cand);
  //   const pairness: Map<string, number> = new Map();
  //   const startOf: Map<string, number> = new Map();
  //   const tuples: Map<string, number> = new Map();

  //   for (const k of cand) {
  //     const [surface, tag] = this.ots(k);
  //     const word: Word = { surface, tag };
  //     tuples[k] = this.getI(word) * ranks[k];
  //     for (const l of cand) {
  //       if (k === l) continue;
  //       const [surface, tag] = this.ots(l);
  //       const lword: Word = { surface, tag };
  //       const PMI = this.getPMI(word, lword);
  //       console.log(word, lword);
  //       if (PMI !== -1) {
  //         const maked = k + ":" + l;
  //         pairness[maked] = PMI;
  //       } else {
  //         // PMIPASS
  //         console.log("PMI pass");
  //       }
  //     }
  //   }

  //   ////
  //   console.log(pairness);
  // }

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
