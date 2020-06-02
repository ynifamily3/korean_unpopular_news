import TextRankGraph from "./TextRankGraph";

export interface IKeyword {
  weight: number;
  value: string;
}

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

  constructor(windowSize = 5) {
    this.w = windowSize;
  }

  extractKeywords(wordList: Word[], numKeywords: number): IKeyword[] {
    const g = new TextRankGraph();
    const cm = new WordPair();
    for (let i = 0; i < wordList.length; ++i) {
      const word = wordList[i];
      if (this.candi_tags.includes(word.tag) && word.surface.length > 1) {
        for (let j = i + 1; j < i + this.w; ++j) {
          if (j >= wordList.length) break;
          if (
            !this.candi_tags.includes(wordList[j].tag) ||
            this.stopWords.filter(
              (word) =>
                word.surface === wordList[j].surface &&
                word.tag === wordList[j].tag
            ).length > 0 ||
            wordList[j].surface.length < 2
          ) {
            continue;
          }
          const pair: [string, string] = [word.surface, wordList[j].surface];
          cm.set(pair, (cm.get(pair) || 0) + 1);
        }
      }
    }
    for (const entry of cm.entries()) {
      g.addEdge(entry.key[0], entry.key[1], entry.value);
    }
    return Array.from(g.rank().entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, numKeywords)
      .map(([value, weight]) => ({
        value,
        weight,
      }));
  }
}
