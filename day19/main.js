const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const text = fs.readFileSync(path, 'utf8').replace(/\r/g, '');
const scanners = text.trim().split(/\n\s*\n/).map(block =>
  block.split('\n').slice(1).filter(l => l.trim()).map(l => l.split(',').map(Number)));

// generujemy obroty
const rotations = [];
const perms = [[[0, 1, 2], 1], [[0, 2, 1], -1], [[1, 0, 2], -1], [[1, 2, 0], 1], [[2, 0, 1], 1], [[2, 1, 0], -1]];
for (const [p, parity] of perms) {
  for (const sx of [1, -1]) for (const sy of [1, -1]) for (const sz of [1, -1]) {
    if (parity * sx * sy * sz === 1) rotations.push([p, [sx, sy, sz]]);
  }
}
const rotate = (v, [p, s]) => [s[0] * v[p[0]], s[1] * v[p[1]], s[2] * v[p[2]]];

// klucz liczbowy
const key = (x, y, z) => ((x + 50000) * 100000 + (y + 50000)) * 100000 + (z + 50000);

const n = scanners.length;
const absolute = new Array(n).fill(null); // globalne wspolrzedne
const positions = new Array(n).fill(null);
absolute[0] = scanners[0];
positions[0] = [0, 0, 0];
const queue = [0];

// probujemy dopasowac
function tryMatch(known, u) {
  for (const rot of rotations) {
    const rotated = scanners[u].map(v => rotate(v, rot));
    const counts = new Map();
    for (const a of known) {
      for (const b of rotated) {
        const k = key(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        const c = (counts.get(k) || 0) + 1;
        counts.set(k, c);
        if (c >= 12) {
          const off = [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
          return [off, rotated.map(v => [v[0] + off[0], v[1] + off[1], v[2] + off[2]])];
        }
      }
    }
  }
  return null;
}

// odciski odleglosci
const fingerprints = scanners.map(list => {
  const m = new Map();
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const [a, b] = [list[i], list[j]];
      const d = (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
      m.set(d, (m.get(d) || 0) + 1);
    }
  }
  return m;
});
function commonDistances(i, j) {
  let c = 0;
  for (const [d, k] of fingerprints[i]) if (fingerprints[j].has(d)) c += Math.min(k, fingerprints[j].get(d));
  return c;
}

while (queue.length) {
  const r = queue.shift();
  for (let u = 0; u < n; u++) {
    if (absolute[u]) continue;
    if (commonDistances(r, u) < 66) continue;
    const res = tryMatch(absolute[r], u);
    if (res) {
      positions[u] = res[0];
      absolute[u] = res[1];
      queue.push(u);
    }
  }
}

if (absolute.some(a => !a)) console.error('Uwaga: nie udalo sie dopasowac wszystkich skanerow');

const beacons = new Set();
for (const list of absolute) if (list) for (const v of list) beacons.add(key(v[0], v[1], v[2]));

let best = 0;
for (const a of positions) for (const b of positions) {
  if (a && b) best = Math.max(best, Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]));
}

console.log(`Czesc 1: ${beacons.size}`);
console.log(`Czesc 2: ${best}`);
