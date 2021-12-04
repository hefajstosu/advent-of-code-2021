const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const blocks = fs.readFileSync(path, 'utf8').trim().split(/\n\s*\n/);
const draws = blocks[0].trim().split(',').map(Number);
const boards = blocks.slice(1).map(b => b.trim().split(/\s+/).map(Number));

// sprawdzamy bingo
function wins(marked) {
    for (let i = 0; i < 5; i++) {
        let row = true, col = true;
        for (let j = 0; j < 5; j++) {
            if (!marked[i * 5 + j]) row = false;
            if (!marked[j * 5 + i]) col = false;
        }
        if (row || col) return true;
    }
    return false;
}

const marks = boards.map(() => new Array(25).fill(false));
const done = new Array(boards.length).fill(false);
const scores = [];  // kolejka wygranych

for (const n of draws) {
    for (let b = 0; b < boards.length; b++) {
        if (done[b]) continue;
        const idx = boards[b].indexOf(n);
        if (idx < 0) continue;
        marks[b][idx] = true;
        if (wins(marks[b])) {
            done[b] = true;
            let unmarked = 0;
            for (let k = 0; k < 25; k++) if (!marks[b][k]) unmarked += boards[b][k];
            scores.push(unmarked * n);
        }
    }
}

console.log(`Czesc 1: ${scores[0]}`);
console.log(`Czesc 2: ${scores[scores.length - 1]}`);
