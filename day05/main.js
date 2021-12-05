const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const segs = fs.readFileSync(path, 'utf8').trim().split('\n')
    .map(line => line.match(/\d+/g).map(Number));

// liczymy przeciecia
function overlaps(withDiagonals) {
    const counts = new Map();
    let result = 0;
    for (const [x1, y1, x2, y2] of segs) {
        if (x1 !== x2 && y1 !== y2 && !withDiagonals) continue;
        const dx = Math.sign(x2 - x1), dy = Math.sign(y2 - y1);
        const len = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
        for (let i = 0; i <= len; i++) {
            const key = (x1 + dx * i) * 100000 + (y1 + dy * i);
            const c = (counts.get(key) || 0) + 1;
            counts.set(key, c);
            if (c === 2) result++;
        }
    }
    return result;
}

console.log(`Czesc 1: ${overlaps(false)}`);
console.log(`Czesc 2: ${overlaps(true)}`);
