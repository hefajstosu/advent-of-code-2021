const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const cmds = fs.readFileSync(path, 'utf8').trim().split('\n').map(line => {
    const [dir, n] = line.trim().split(' ');
    return [dir, Number(n)];
});

// czesc 1: glebokosc
let x = 0, depth = 0;
for (const [dir, n] of cmds) {
    if (dir === 'forward') x += n;
    else if (dir === 'down') depth += n;
    else if (dir === 'up') depth -= n;
}
const part1 = x * depth;

// czesc 2: aim
x = 0; depth = 0;
let aim = 0;
for (const [dir, n] of cmds) {
    if (dir === 'forward') { x += n; depth += aim * n; }
    else if (dir === 'down') aim += n;
    else if (dir === 'up') aim -= n;
}
const part2 = x * depth;

console.log(`Czesc 1: ${part1}`);
console.log(`Czesc 2: ${part2}`);
