const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const entries = fs.readFileSync(path, 'utf8').trim().split('\n').map(line => {
    const [pats, out] = line.split('|');
    const norm = s => s.trim().split(/\s+/).map(w => [...w].sort().join(''));
    return [norm(pats), norm(out)];
});

// zawieranie segmentow
const common = (a, b) => [...a].filter(ch => b.includes(ch)).length;

// rozkminiamy cyfry
function decode(patterns) {
    const one = patterns.find(p => p.length === 2);
    const four = patterns.find(p => p.length === 4);
    const map = new Map();
    for (const p of patterns) {
        const c1 = common(p, one), c4 = common(p, four);
        let digit;
        switch (p.length) {
            case 2: digit = 1; break;
            case 3: digit = 7; break;
            case 4: digit = 4; break;
            case 7: digit = 8; break;
            case 5: digit = c1 === 2 ? 3 : (c4 === 3 ? 5 : 2); break;
            case 6: digit = c1 === 1 ? 6 : (c4 === 4 ? 9 : 0); break;
        }
        map.set(p, digit);
    }
    return map;
}

let part1 = 0, part2 = 0;
for (const [pats, out] of entries) {
    for (const w of out) if ([2, 3, 4, 7].includes(w.length)) part1++;
    const map = decode(pats);
    part2 += Number(out.map(w => map.get(w)).join(''));
}

console.log(`Czesc 1: ${part1}`);
console.log(`Czesc 2: ${part2}`);
