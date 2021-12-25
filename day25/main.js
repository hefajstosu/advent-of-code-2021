const fs = require('fs');

const path = process.argv[2] || 'data.txt';
let grid = fs.readFileSync(path, 'utf8').replace(/\r/g, '').trim().split('\n').map(l => l.trim().split(''));
const h = grid.length, w = grid[0].length;

// ruch stada
function moveHerd(type, di, dj) {
  const next = grid.map(row => [...row]);
  let moved = false;
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      if (grid[i][j] !== type) continue;
      const ni = (i + di) % h, nj = (j + dj) % w;
      if (grid[ni][nj] === '.') {
        next[i][j] = '.';
        next[ni][nj] = type;
        moved = true;
      }
    }
  }
  grid = next;
  return moved;
}

let steps = 0;
for (;;) {
  steps++;
  const a = moveHerd('>', 0, 1);
  const b = moveHerd('v', 1, 0);
  if (!a && !b) break;
}

console.log(`Czesc 1: ${steps}`);
console.log('Czesc 2: -');
