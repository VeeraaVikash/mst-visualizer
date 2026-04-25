export class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;
  constructor(nodes: string[]) {
    this.parent = new Map(nodes.map(n => [n, n]));
    this.rank = new Map(nodes.map(n => [n, 0]));
  }
  find(x: string): string {
    const p = this.parent.get(x);
    if (!p) return x;
    if (p !== x) this.parent.set(x, this.find(p));
    return this.parent.get(x)!;
  }
  union(a: string, b: string): boolean {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    const rankA = this.rank.get(ra) ?? 0, rankB = this.rank.get(rb) ?? 0;
    if (rankA >= rankB) { this.parent.set(rb, ra); if (rankA === rankB) this.rank.set(ra, rankA + 1); }
    else this.parent.set(ra, rb);
    return true;
  }
  connected(a: string, b: string): boolean { return this.find(a) === this.find(b); }
  snapshot(): Record<string, string> {
    const r: Record<string, string> = {};
    for (const [k] of this.parent) r[k] = this.find(k);
    return r;
  }
}
