import { Word, WordMap } from "./index";

export interface GraphType {
  key: Word;
  value: [Word, Word, number][];
}

class Graph {
  graph: GraphType[];
  constructor() {
    this.graph = [];
  }
  set(key: Word, value: [Word, Word, number][]): Graph {
    for (const item of this.graph) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        item.value = value;
        return this;
      }
    }
    this.graph.push({
      key,
      value,
    });
    return this;
  }

  get(key: Word): [Word, Word, number][] | undefined {
    for (const item of this.graph) {
      if (item.key.surface === key.surface && item.key.tag === key.tag) {
        return item.value;
      }
    }
    return undefined;
  }
  entries(): GraphType[] {
    return this.graph;
  }
  keys(): Word[] {
    return this.graph.map((x) => {
      return x.key;
    });
  }
}

export default class TextRankGraph {
  graph: Graph = new Graph();
  d = 0.85;
  min_diff = 1e-5;
  steps = 10;

  addEdge(start: Word, end: Word, weight: number): void {
    (this.graph.get(start) || this.graph.set(start, []).get(start))?.push([
      start,
      end,
      weight,
    ]);
    (this.graph.get(end) || this.graph.set(end, []).get(end))?.push([
      end,
      start,
      weight,
    ]);
  }

  rank(): WordMap {
    const defaultWeight = 1.0 / (this.graph.graph.length || 1.0);
    const nodeweight: WordMap = new WordMap();
    const outsumNode: WordMap = new WordMap();
    // 그래프의 엔트리는 [str, str , number][] 이다..
    const gpE = this.graph.entries();
    for (let i = 0; i < gpE.length; i++) {
      const node = gpE[i].key;
      const outEdge = gpE[i].value;
      nodeweight.set(node, defaultWeight);
      outsumNode.set(
        node,
        outEdge.reduce<number>((acc, cur) => acc + cur[2], 0.0)
      );
    }
    const sortedKeys = Array.from(this.graph.keys()).sort(
      (a: Word, b: Word) => {
        if (a.surface < b.surface) {
          return -1;
        }
        if (a.surface > b.surface) {
          return 1;
        }
        return 0;
      }
    );
    const stepDict = [0];
    for (let step = 0; step < this.steps; ++step) {
      for (const node of sortedKeys) {
        let s = 0.0;
        for (const e of this.graph.get(node) || []) {
          const out = outsumNode.get(e[1]) || 0;
          const weight = nodeweight.get(e[1]) || 0;
          s += (e[2] / out) * weight;
        }
        nodeweight.set(node, 1 - this.d + this.d * s);
      }
      stepDict.push(
        Array.from(nodeweight.values()).reduce((acc, cur) => acc + cur)
      );

      if (Math.abs(stepDict[step] - stepDict[step - 1]) <= this.min_diff) break;
    }
    let [minRank, maxRank] = [0, 0];
    // 위에서도 nodeweight values를 불러서 성능저하 있을 수 있음.. O(2n)
    for (const w of nodeweight.values()) {
      if (w < minRank) minRank = w;
      if (w > maxRank) maxRank = w;
    }
    for (const x of nodeweight.entries()) {
      const n = x.key;
      const w = x.value;
      nodeweight.set(n, (w - minRank / 10.0) / (maxRank - minRank / 10.0));
    }
    return nodeweight;
  }
}
