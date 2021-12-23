const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const lines = fs.readFileSync(path, 'utf8').replace(/\r/g, '').split('\n').filter(l => l.trim());

const COST = { A: 1, B: 10, C: 100, D: 1000 };
const TYPES = 'ABCD';
const HALL = 11;
const DOORS = [2, 4, 6, 8];

// kopiec minimalny
class Heap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(x) {
    const a = this.a;
    a.push(x);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p][0] <= a[i][0]) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < a.length && a[l][0] < a[m][0]) m = l;
        if (r < a.length && a[r][0] < a[m][0]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

// uklad stanu
function solve(roomLines) {
  const D = roomLines.length;
  let start = '.'.repeat(HALL);
  for (let r = 0; r < 4; r++) for (let k = 0; k < D; k++) start += roomLines[k][3 + 2 * r];
  let goal = '.'.repeat(HALL);
  for (let r = 0; r < 4; r++) goal += TYPES[r].repeat(D);

  const hallClear = (s, from, to) => {
    // droga wolna?
    const step = to > from ? 1 : -1;
    for (let h = from + step; ; h += step) {
      if (s[h] !== '.') return false;
      if (h === to) return true;
    }
  };

  function* moves(s) {
    // wchodzimy do pokoju
    for (let h = 0; h < HALL; h++) {
      const c = s[h];
      if (c === '.') continue;
      const r = TYPES.indexOf(c);
      const base = HALL + r * D;
      let ok = true, k = -1;
      for (let i = 0; i < D; i++) {
        const x = s[base + i];
        if (x === '.') k = i;
        else if (x !== c) { ok = false; break; }
      }
      if (!ok || k < 0) continue;
      if (!hallClear(s, h, DOORS[r])) continue;
      const steps = Math.abs(h - DOORS[r]) + k + 1;
      const arr = s.split('');
      arr[h] = '.';
      arr[base + k] = c;
      yield [steps * COST[c], arr.join('')];
    }
    // wychodzimy na korytarz
    for (let r = 0; r < 4; r++) {
      const base = HALL + r * D;
      let k = 0;
      while (k < D && s[base + k] === '.') k++;
      if (k === D) continue;
      // juz na miejscu
      let settled = true;
      for (let i = k; i < D; i++) if (s[base + i] !== TYPES[r]) settled = false;
      if (settled) continue;
      const c = s[base + k];
      for (let h = 0; h < HALL; h++) {
        if (DOORS.includes(h)) continue;
        if (!hallClear(s, DOORS[r], h)) continue;
        const steps = k + 1 + Math.abs(DOORS[r] - h);
        const arr = s.split('');
        arr[base + k] = '.';
        arr[h] = c;
        yield [steps * COST[c], arr.join('')];
      }
    }
  }

  // Dijkstra
  const dist = new Map([[start, 0]]);
  const heap = new Heap();
  heap.push([0, start]);
  while (heap.size) {
    const [d, s] = heap.pop();
    if (s === goal) return d;
    if (d > dist.get(s)) continue;
    for (const [cost, t] of moves(s)) {
      const nd = d + cost;
      const prev = dist.get(t);
      if (prev === undefined || nd < prev) {
        dist.set(t, nd);
        heap.push([nd, t]);
      }
    }
  }
  return -1;
}

const rooms = lines.slice(2, lines.length - 1);
// dokladamy rzedy
const rooms2 = [rooms[0], '  #D#C#B#A#', '  #D#B#A#C#', ...rooms.slice(1)];

console.log(`Czesc 1: ${solve(rooms)}`);
console.log(`Czesc 2: ${solve(rooms2)}`);
