export class UnionFind {
  private parent: Map<string, string>;
  private rank: Map<string, number>;

  constructor(nodes: string[]) {
    this.parent = new Map();
    this.rank = new Map();
    for (const node of nodes) {
      this.parent.set(node, node);
      this.rank.set(node, 0);
    }
  }

  find(x: string): string {
    const p = this.parent.get(x);
    if (p === undefined) return x;
    if (p !== x) {
      this.parent.set(x, this.find(p));
    }
    return this.parent.get(x) as string;
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);
    if (rootX === rootY) return false;

    const rankX = this.rank.get(rootX) ?? 0;
    const rankY = this.rank.get(rootY) ?? 0;

    if (rankX < rankY) {
      this.parent.set(rootX, rootY);
    } else if (rankX > rankY) {
      this.parent.set(rootY, rootX);
    } else {
      this.parent.set(rootY, rootX);
      this.rank.set(rootX, rankX + 1);
    }
    return true;
  }

  connected(x: string, y: string): boolean {
    return this.find(x) === this.find(y);
  }

  getParentMap(): Map<string, string> {
    const result = new Map<string, string>();
    for (const [key] of this.parent) {
      result.set(key, this.find(key));
    }
    return result;
  }
}
