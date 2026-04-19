const counters = new Map<string, number>();

export const metrics = {
  increment(name: string, amount = 1) {
    counters.set(name, (counters.get(name) ?? 0) + amount);
  },
  get(name: string): number {
    return counters.get(name) ?? 0;
  },
  getAll(): Record<string, number> {
    return Object.fromEntries(counters);
  },
};
