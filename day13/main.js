const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const [dotPart, foldPart] = fs.readFileSync(path, 'utf8').trim().split(/\r?\n\s*\r?\n/);
let dots = dotPart.trim().split('\n').map(l => l.trim().split(',').map(Number));
const folds = foldPart.trim().split('\n').map(l => {
    const m = l.match(/fold along ([xy])=(\d+)/);
    return [m[1], Number(m[2])];
});

// skladamy kartke
function fold(points, [axis, v]) {
    const set = new Set();
    const out = [];
    for (let [x, y] of points) {
        if (axis === 'x' && x > v) x = 2 * v - x;
        if (axis === 'y' && y > v) y = 2 * v - y;
        const key = `${x},${y}`;
        if (!set.has(key)) { set.add(key); out.push([x, y]); }
    }
    return out;
}

// pierwsze zlozenie
dots = fold(dots, folds[0]);
const first = dots.length;
for (const f of folds.slice(1)) dots = fold(dots, f);

// rysujemy wynik
const maxX = Math.max(...dots.map(d => d[0]));
const maxY = Math.max(...dots.map(d => d[1]));
const pic = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(' '));
for (const [x, y] of dots) pic[y][x] = '#';

console.log(`Czesc 1: ${first}`);
console.log('Czesc 2:');
console.log(pic.map(row => row.join('')).join('\n'));
