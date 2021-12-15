const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const grid = fs.readFileSync(path, 'utf8').trim().split('\n').map(l => l.trim().split('').map(Number));

// Dijkstra z kopcem
function shortest(mult) {
    const h0 = grid.length, w0 = grid[0].length;
    const h = h0 * mult, w = w0 * mult;
    const cost = (r, c) => {
        const v = grid[r % h0][c % w0] + Math.floor(r / h0) + Math.floor(c / w0);
        return (v - 1) % 9 + 1;
    };
    const dist = new Array(h * w).fill(Infinity);
    const heap = []; // kopiec na piechote
    const push = item => {
        heap.push(item);
        let i = heap.length - 1;
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (heap[p][0] <= heap[i][0]) break;
            [heap[p], heap[i]] = [heap[i], heap[p]];
            i = p;
        }
    };
    const pop = () => {
        const top = heap[0];
        const last = heap.pop();
        if (heap.length) {
            heap[0] = last;
            let i = 0;
            for (;;) {
                const l = 2 * i + 1, r = l + 1;
                let m = i;
                if (l < heap.length && heap[l][0] < heap[m][0]) m = l;
                if (r < heap.length && heap[r][0] < heap[m][0]) m = r;
                if (m === i) break;
                [heap[m], heap[i]] = [heap[i], heap[m]];
                i = m;
            }
        }
        return top;
    };
    dist[0] = 0;
    push([0, 0]);
    while (heap.length) {
        const [d, idx] = pop();
        if (d > dist[idx]) continue;
        const r = Math.floor(idx / w), c = idx % w;
        if (r === h - 1 && c === w - 1) return d;
        for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
            if (nr < 0 || nr >= h || nc < 0 || nc >= w) continue;
            const nd = d + cost(nr, nc);
            const ni = nr * w + nc;
            if (nd < dist[ni]) { dist[ni] = nd; push([nd, ni]); }
        }
    }
    return -1;
}

console.log(`Czesc 1: ${shortest(1)}`);
console.log(`Czesc 2: ${shortest(5)}`);
