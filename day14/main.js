const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const [tpl, rulePart] = fs.readFileSync(path, 'utf8').trim().split(/\r?\n\s*\r?\n/);
const template = tpl.trim();
const rules = new Map();
for (const line of rulePart.trim().split('\n')) {
    const [pair, ins] = line.trim().split(' -> ');
    rules.set(pair, ins);
}

// liczymy pary
function solve(steps) {
    let pairs = new Map();
    for (let i = 0; i + 1 < template.length; i++) {
        const p = template.slice(i, i + 2);
        pairs.set(p, (pairs.get(p) || 0) + 1);
    }
    for (let s = 0; s < steps; s++) {
        const next = new Map();
        for (const [p, n] of pairs) {
            const ins = rules.get(p);
            const out = ins ? [p[0] + ins, ins + p[1]] : [p];
            for (const q of out) next.set(q, (next.get(q) || 0) + n);
        }
        pairs = next;
    }
    // liczymy litery
    const counts = new Map([[template[template.length - 1], 1]]);
    for (const [p, n] of pairs) counts.set(p[0], (counts.get(p[0]) || 0) + n);
    const vals = [...counts.values()];
    return Math.max(...vals) - Math.min(...vals);
}

console.log(`Czesc 1: ${solve(10)}`);
console.log(`Czesc 2: ${solve(40)}`);
