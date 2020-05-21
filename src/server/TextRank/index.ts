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

interface TupleType {
  key: Word[];
  value: number;
}

interface StartOfType {
  key: Word;
  value: [Word, Word];
}

class StartOf {
  startof: StartOfType[];
  constructor() {
    this.startof = [];
  }
  set(key: Word, value: [Word, Word]): void {
    for (const item of this.startof) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        item.value = value;
      }
    }
  }
  get(key: Word): [Word, Word] | undefined {
    for (const item of this.startof) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        return item.value;
      }
    }
    return undefined;
  }
}

class Tuple {
  tuple: TupleType[];
  constructor() {
    this.tuple = [];
  }
  set(key: Word[], value: number): void {
    for (const item of this.tuple) {
      if (item.key.length === key.length) {
        for (let i = 0; i < key.length; i++) {
          if (
            item.key[i].surface === key[i].surface &&
            item.key[i].tag === key[i].tag
          ) {
            item.value = value;
            return;
          }
        }
      }
    }
    this.tuple.push({ key, value });
  }

  get(key: Word[]): number | undefined {
    for (const item of this.tuple) {
      if (item.key.length === key.length) {
        for (let i = 0; i < key.length; i++) {
          if (
            item.key[i].surface === key[i].surface &&
            item.key[i].tag === key[i].tag
          ) {
            return item.value;
          }
        }
      }
    }
    return undefined;
  }
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

  sorted() {
    const map2 = [...this.map];
    map2.sort((x, y) => {
      const cp1 = x.key[0].surface;
      const cp2 = y.key[1].surface;
      const cp3 = y.key[0].surface;
      const cp4 = y.key[1].surface;
      if (cp1 < cp3) {
        return 1;
      } else if (cp1 > cp3) {
        return -1;
      } else if (cp2 < cp4) {
        return 1;
      } else if (cp2 > cp4) {
        return -1;
      }
      return 0;
    });
    return map2;
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
    // console.log("불가능", co0);
    const co: number = typeof co0 === "undefined" ? 0 : co0;
    if (co === 0) {
      return -1; // pmi 계산 불가능
    }
    const aCnt = this.dictCount.get(a);
    const bCnt = this.dictCount.get(b);
    if (typeof aCnt === "number" && typeof bCnt === "number")
      return Math.log((co * this.nTotal) / aCnt / bCnt);
    return -2;
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
    for (const x of this.dictBiCount.entries()) {
      const a: Word = x.key[0];
      const b: Word = x.key[1];
      const n: number = x.value;
      this.graph.addEdge(a, b, n * this.coef + (1 - this.coef));
    }
  }

  // 새로 만든 익스트랙트
  extract(ratio: number = 0.1) {
    const ranks: WordMap = this.graph.rank();
    const cand: WordMapElemType[] = Array.from(ranks.entries())
      .sort((a, b) => {
        if (a.key.surface < b.key.surface) {
          return 1;
        } else if (a.key.surface > b.key.surface) {
          return -1;
        }
        return 0;
      })
      .slice(0, Math.floor(ranks.entries().length * ratio));
    // .map((x) => x); // {surface, tag}
    // console.log(cand);
    const pairness: WordPairMap = new WordPairMap();
    const startOf: StartOf = new StartOf();
    const tuples: Tuple = new Tuple();

    for (const k of cand) {
      const surface = k.key.surface;
      const tag = k.key.tag;
      const word: Word = { surface, tag };
      // tuples[word] = this.getI(word) * ranks.get(word);
      const rgw = ranks.get(word);
      if (!rgw) throw new Error("ERR!");
      tuples.set([word], this.getI(word) * rgw);
      for (const l of cand) {
        if (k === l) continue; // 섈로우로 비교해도 될듯
        const surface = l.key.surface;
        const tag = l.key.tag;
        const lword: Word = { surface, tag };
        const PMI = this.getPMI(word, lword);
        // console.log(PMI, word, lword);
        if (PMI !== -1) {
          // pairness[maked] = PMI;
          pairness.set([word, lword], PMI);
          // console.log("^^", word, lword, pairness.get([word, lword]));
          // let sortedPairness: WordPairMap = pairness.sort;
        }
      }
    }
    // 이제... for (k, l) in sorted(pairness, key=pairness.get, reverse=True): 작업 해야지
    const sorted: Pair[] = pairness.sorted();
    for (let i = 0; i < sorted.length; i++) {
      const k = sorted[i].key[0];
      const l = sorted[i].key[1];
      console.log(k.surface, l.surface, pairness.get([k, l]));
      if (startOf.get(k) === undefined) startOf.set(k, [k, l]);
    }
    const ent = pairness.entries();
    for (let i = 0; i < ent.length; i++) {
      const k: Word = ent[i].key[0];
      const l: Word = ent[i].key[1];
      const v: number = ent[i].value;
      let pmis = v;
      const rgk = ranks.get(k);
      const rgl = ranks.get(l);
      if (typeof rgk !== "number" || typeof rgl !== "number") continue;
      let rs = rgk * rgl;
      const path = [k, l];
      tuples.set(
        path,
        (pmis / (path.length - 1)) * Math.pow(rs, 1 / path.length) * path.length
      );
      let last: Word = l;
      // startOf
      while (startOf.get(last) !== undefined && path.length < 7) {
        let stop = false;
        for (let i = 0; i < path.length; i++) {
          if (path[i].surface === last.surface && path[i].tag === last.tag) {
            stop = true;
            break;
          }
        }
        if (stop) break;
        const startOfLastVal: [Word, Word] = startOf.get(last) || [
          { surface: "", tag: "" },
          { surface: "", tag: "" },
        ];
        pmis += pairness.get(startOfLastVal) || 0;
        last = startOf.get(last)[1];
        rs *= ranks.get(last);
        path.push(last);
      }
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
