/** Deterministic PRNG seeded from a string (mulberry32) — same seed always gives the
 *  same shuffle, so this is stable across a server render (no hydration mismatch) and
 *  across requests within the same day, but changes day to day since the seed is today's
 *  date. True per-request randomness would mean forcing every page that lists real data
 *  into dynamic rendering just for this, which isn't worth the lost static-generation
 *  benefit — a daily reshuffle still means no two visitors on different days see the
 *  same fixed array order every time. */
export function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let state = h >>> 0;
  const rand = () => {
    state = Math.imul(state ^ (state >>> 15), state | 1);
    state ^= state + Math.imul(state ^ (state >>> 7), state | 61);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** YYYY-MM-DD — rotates daily, so seeding with `todaySeed + ":" + salt` gives every
 *  independent list (tours, destinations, stays, reviews...) its own distinct shuffle
 *  rather than all reshuffling in lockstep off the same seed. */
export const todaySeed = new Date().toISOString().slice(0, 10);
