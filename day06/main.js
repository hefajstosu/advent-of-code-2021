const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const fish = fs.readFileSync(path, 'utf8').trim().split(',').map(Number);

// ryby w kubelkach
function simulate(days) {
    let counts = new Array(9).fill(0n);
    for (const f of fish) counts[f]++;
    for (let d = 0; d < days; d++) {
        const zero = counts[0];
        counts = counts.slice(1).concat([zero]);
        counts[6] += zero;
    }
    return counts.reduce((a, b) => a + b, 0n);
}

console.log(`Czesc 1: ${simulate(80)}`);
console.log(`Czesc 2: ${simulate(256)}`);
