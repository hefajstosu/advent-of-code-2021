const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const steps = fs.readFileSync(path, 'utf8').trim().split('\n').filter(l => l.trim()).map(l => {
  const [x1, x2, y1, y2, z1, z2] = l.match(/-?\d+/g).map(Number);
  return { on: l.startsWith('on'), c: [x1, x2, y1, y2, z1, z2] };
});

function intersect(a, b) {
  const r = [
    Math.max(a[0], b[0]), Math.min(a[1], b[1]),
    Math.max(a[2], b[2]), Math.min(a[3], b[3]),
    Math.max(a[4], b[4]), Math.min(a[5], b[5]),
  ];
  return r[0] <= r[1] && r[2] <= r[3] && r[4] <= r[5] ? r : null;
}

// odejmujemy przeciecia
function solve(list) {
  let cubes = new Map(); // mapa kostek
  for (const { on, c } of list) {
    const update = new Map();
    for (const [cube, mult] of cubes.values()) {
      const inter = intersect(cube, c);
      if (!inter) continue;
      const k = inter.join(',');
      const prev = update.get(k);
      update.set(k, [inter, (prev ? prev[1] : 0) - mult]);
    }
    if (on) {
      const k = c.join(',');
      const prev = update.get(k);
      update.set(k, [c, (prev ? prev[1] : 0) + 1]);
    }
    for (const [k, [cube, mult]] of update) {
      const prev = cubes.get(k);
      const m = (prev ? prev[1] : 0) + mult;
      if (m === 0) cubes.delete(k);
      else cubes.set(k, [cube, m]);
    }
  }
  // BigInt na zapas
  let total = 0n;
  for (const [c, mult] of cubes.values()) {
    total += BigInt(c[1] - c[0] + 1) * BigInt(c[3] - c[2] + 1) * BigInt(c[5] - c[4] + 1) * BigInt(mult);
  }
  return total;
}

// przycinamy do 50
const region = [-50, 50, -50, 50, -50, 50];
const clipped = [];
for (const s of steps) {
  const c = intersect(s.c, region);
  if (c) clipped.push({ on: s.on, c });
}

console.log(`Czesc 1: ${solve(clipped)}`);
console.log(`Czesc 2: ${solve(steps)}`);
