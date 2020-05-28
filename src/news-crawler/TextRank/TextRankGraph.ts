export default class TextRankGraph {
  graph: Map<string, [string, string, number][]> = new Map();
  d = 0.85;
  min_diff = 1e-5;
  steps = 10;

  addEdge(start: string, end: string, weight: number): void {
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

  rank(): Map<string, number> {
    const defaultWeight = 1.0 / (this.graph.size || 1.0);
    const nodeweight: Map<string, number> = new Map();
    const outsumNode: Map<string, number> = new Map();

    for (const [node, outEdge] of this.graph.entries()) {
      nodeweight.set(node, defaultWeight);
      outsumNode.set(
        node,
        outEdge.reduce<number>((acc, cur) => acc + cur[2], 0.0)
      );
    }
    const sortedKeys = Array.from(this.graph.keys()).sort();
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
    for (const w of nodeweight.values()) {
      if (w < minRank) minRank = w;
      if (w > maxRank) maxRank = w;
    }
    for (const [n, w] of nodeweight.entries()) {
      nodeweight.set(n, (w - minRank / 10.0) / (maxRank - minRank / 10.0));
    }
    return nodeweight;
  }
}
