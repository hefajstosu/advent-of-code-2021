const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const [algLine, imageText] = fs.readFileSync(path, 'utf8').replace(/\r/g, '').trim().split(/\n\s*\n/);
const alg = algLine.replace(/\s/g, '').split('').map(c => (c === '#' ? 1 : 0));
let grid = imageText.split('\n').map(l => l.trim().split('').map(c => (c === '#' ? 1 : 0)));
// migajace tlo
let bg = 0;

function step() {
  const h = grid.length, w = grid[0].length;
  const get = (i, j) => (i >= 0 && i < h && j >= 0 && j < w ? grid[i][j] : bg);
  const next = [];
  // obraz rosnie
  for (let i = -1; i <= h; i++) {
    const row = [];
    for (let j = -1; j <= w; j++) {
      let idx = 0;
      for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) idx = idx * 2 + get(i + di, j + dj);
      row.push(alg[idx]);
    }
    next.push(row);
  }
  grid = next;
  bg = bg ? alg[511] : alg[0];
}

const lit = () => grid.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0);

let part1 = 0;
for (let s = 1; s <= 50; s++) {
  step();
  if (s === 2) part1 = lit();
}

console.log(`Czesc 1: ${part1}`);
console.log(`Czesc 2: ${lit()}`);
