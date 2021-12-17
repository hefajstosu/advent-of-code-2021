const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const text = fs.readFileSync(path, 'utf8');
const [x1, x2, y1, y2] = text.match(/-?\d+/g).map(Number);

// cel prawo-dol
function hits(vx, vy) {
  let x = 0, y = 0;
  while (x <= x2 && y >= y1) {
    x += vx;
    y += vy;
    if (vx > 0) vx--;
    vy--;
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) return true;
  }
  return false;
}

let best = 0;
let count = 0;
for (let vx = 0; vx <= x2; vx++) {
  for (let vy = y1; vy <= -y1; vy++) {
    if (hits(vx, vy)) {
      count++;
      // suma trojkatna
      const h = vy > 0 ? (vy * (vy + 1)) / 2 : 0;
      if (h > best) best = h;
    }
  }
}

console.log(`Czesc 1: ${best}`);
console.log(`Czesc 2: ${count}`);
