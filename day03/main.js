const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const lines = fs.readFileSync(path, 'utf8').trim().split(/\s+/);
const width = lines[0].length;

function onesAt(list, pos) {
    let ones = 0;
    for (const s of list) if (s[pos] === '1') ones++;
    return ones;
}

// gamma i epsilon
let gamma = '', epsilon = '';
for (let pos = 0; pos < width; pos++) {
    const ones = onesAt(lines, pos);
    const mostOnes = ones * 2 >= lines.length;
    gamma += mostOnes ? '1' : '0';
    epsilon += mostOnes ? '0' : '1';
}
const part1 = parseInt(gamma, 2) * parseInt(epsilon, 2);

// filtrujemy bitami
function rating(keepMostCommon) {
    let list = lines;
    for (let pos = 0; pos < width && list.length > 1; pos++) {
        const ones = onesAt(list, pos);
        const most = ones * 2 >= list.length ? '1' : '0';
        const want = keepMostCommon ? most : (most === '1' ? '0' : '1');
        list = list.filter(s => s[pos] === want);
    }
    return parseInt(list[0], 2);
}
const part2 = rating(true) * rating(false);

console.log(`Czesc 1: ${part1}`);
console.log(`Czesc 2: ${part2}`);
