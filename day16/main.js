const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const hex = fs.readFileSync(path, 'utf8').trim();
const bits = [...hex].map(ch => parseInt(ch, 16).toString(2).padStart(4, '0')).join('');

let pos = 0;
const read = n => { const v = parseInt(bits.slice(pos, pos + n), 2); pos += n; return v; };

// parsujemy pakiet
function parse() {
    let versions = read(3);
    const type = read(3);
    if (type === 4) {
        let value = 0n, more = 1;
        while (more) {
            more = read(1);
            value = (value << 4n) | BigInt(read(4));
        }
        return { versions, value };
    }
    const vals = [];
    if (read(1) === 0) {
        const len = read(15);
        const end = pos + len;
        while (pos < end) { const p = parse(); versions += p.versions; vals.push(p.value); }
    } else {
        const cnt = read(11);
        for (let i = 0; i < cnt; i++) { const p = parse(); versions += p.versions; vals.push(p.value); }
    }
    let value;
    switch (type) {
        case 0: value = vals.reduce((a, b) => a + b, 0n); break;
        case 1: value = vals.reduce((a, b) => a * b, 1n); break;
        case 2: value = vals.reduce((a, b) => (b < a ? b : a)); break;
        case 3: value = vals.reduce((a, b) => (b > a ? b : a)); break;
        case 5: value = vals[0] > vals[1] ? 1n : 0n; break;
        case 6: value = vals[0] < vals[1] ? 1n : 0n; break;
        case 7: value = vals[0] === vals[1] ? 1n : 0n; break;
    }
    return { versions, value };
}

const res = parse();
// odpalamy parser
console.log(`Czesc 1: ${res.versions}`);
console.log(`Czesc 2: ${res.value}`);
