const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const adj = new Map();
for (const line of fs.readFileSync(path, 'utf8').trim().split('\n')) {
    const [a, b] = line.trim().split('-');
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a).push(b);
    adj.get(b).push(a);
}
const isSmall = s => s === s.toLowerCase();

// DFS po jaskiniach
function count(node, visited, canTwice) {
    if (node === 'end') return 1;
    let total = 0;
    for (const next of adj.get(node)) {
        if (next === 'start') continue;
        if (isSmall(next) && visited.has(next)) {
            if (canTwice) total += count(next, visited, false);
            continue;
        }
        const small = isSmall(next);
        if (small) visited.add(next);
        total += count(next, visited, canTwice);
        if (small) visited.delete(next);
    }
    return total;
}

console.log(`Czesc 1: ${count('start', new Set(['start']), false)}`);
console.log(`Czesc 2: ${count('start', new Set(['start']), true)}`);
