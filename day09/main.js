const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const grid = fs.readFileSync(path, 'utf8').trim().split('\n').map(l => l.trim().split('').map(Number));
const h = grid.length, w = grid[0].length;
const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// szukamy dolkow
let risk = 0;
const lows = [];
for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
        const v = grid[r][c];
        const low = dirs.every(([dr, dc]) => {
            const nr = r + dr, nc = c + dc;
            return nr < 0 || nr >= h || nc < 0 || nc >= w || grid[nr][nc] > v;
        });
        if (low) { risk += v + 1; lows.push([r, c]); }
    }
}

// zalewamy baseny
const seen = grid.map(row => row.map(() => false));
const sizes = [];
for (const [sr, sc] of lows) {
    let size = 0;
    const stack = [[sr, sc]];
    seen[sr][sc] = true;
    while (stack.length) {
        const [r, c] = stack.pop();
        size++;
        for (const [dr, dc] of dirs) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;
            if (seen[nr][nc] || grid[nr][nc] === 9) continue;
            seen[nr][nc] = true;
            stack.push([nr, nc]);
        }
    }
    sizes.push(size);
}
sizes.sort((a, b) => b - a);

console.log(`Czesc 1: ${risk}`);
console.log(`Czesc 2: ${sizes[0] * sizes[1] * sizes[2]}`);
