const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const lines = fs.readFileSync(path, 'utf8').trim().split('\n').map(l => l.trim());

const pair = { ')': '(', ']': '[', '}': '{', '>': '<' };
const errScore = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const fixScore = { '(': 1, '[': 2, '{': 3, '<': 4 };

let syntax = 0;
const completions = [];
for (const line of lines) {
    const stack = [];
    let corrupted = false;
    for (const ch of line) {
        if (ch in pair) {
            if (stack.pop() !== pair[ch]) {
                // zly nawias
                syntax += errScore[ch];
                corrupted = true;
                break;
            }
        } else {
            stack.push(ch);
        }
    }
    if (corrupted) continue;
    // domykamy linie
    let s = 0;
    while (stack.length) s = s * 5 + fixScore[stack.pop()];
    completions.push(s);
}
completions.sort((a, b) => a - b);

console.log(`Czesc 1: ${syntax}`);
console.log(`Czesc 2: ${completions[(completions.length - 1) / 2]}`);
