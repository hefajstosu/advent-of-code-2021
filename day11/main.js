const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const grid = fs.readFileSync(path, 'utf8').trim().split('\n').map(l => l.trim().split('').map(Number));
const h = grid.length, w = grid[0].length;

// jeden krok
function step() {
    const stack = [];
    for (let r = 0; r < h; r++)
        for (let c = 0; c < w; c++)
            if (++grid[r][c] === 10) stack.push([r, c]);
    let flashes = 0;
    while (stack.length) {
        const [r, c] = stack.pop();
        flashes++;
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr, nc = c + dc;
                if ((dr || dc) && nr >= 0 && nr < h && nc >= 0 && nc < w)
                    if (++grid[nr][nc] === 10) stack.push([nr, nc]);
            }
        }
    }
    for (let r = 0; r < h; r++)
        for (let c = 0; c < w; c++)
            if (grid[r][c] > 9) grid[r][c] = 0;
    return flashes;
}

// krecimy symulacje
let total = 0, all = 0;
for (let s = 1; s <= 100 || !all; s++) {
    const f = step();
    if (s <= 100) total += f;
    if (!all && f === h * w) all = s;
}

console.log(`Czesc 1: ${total}`);
console.log(`Czesc 2: ${all}`);
