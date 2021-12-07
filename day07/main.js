const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const crabs = fs.readFileSync(path, 'utf8').trim().split(',').map(Number);
const lo = Math.min(...crabs), hi = Math.max(...crabs);

// szukamy minimum
function minFuel(cost) {
    let best = Infinity;
    for (let target = lo; target <= hi; target++) {
        let total = 0;
        for (const c of crabs) total += cost(Math.abs(c - target));
        if (total < best) best = total;
    }
    return best;
}

console.log(`Czesc 1: ${minFuel(d => d)}`);
// liczba trojkatna
console.log(`Czesc 2: ${minFuel(d => d * (d + 1) / 2)}`);
