const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const lines = fs.readFileSync(path, 'utf8').replace(/\r/g, '').split('\n').map(l => l.trim()).filter(l => l);

// wyciagamy stale
const blocks = [];
for (const l of lines) {
  if (l.startsWith('inp')) blocks.push([]);
  blocks[blocks.length - 1].push(l.split(' '));
}

const params = blocks.map(b => {
  const div = Number(b.find(ins => ins[0] === 'div' && ins[1] === 'z')[2]);
  const addX = Number(b.find(ins => ins[0] === 'add' && ins[1] === 'x' && /^-?\d+$/.test(ins[2]))[2]);
  const iw = b.findIndex(ins => ins[0] === 'add' && ins[1] === 'y' && ins[2] === 'w');
  const addY = Number(b[iw + 1][2]);
  return { div, addX, addY };
});

// z jako stos
const stack = [];
const maxDigits = new Array(params.length);
const minDigits = new Array(params.length);
params.forEach((p, i) => {
  if (p.div === 1) {
    stack.push([i, p.addY]);
  } else {
    const [j, c] = stack.pop();
    const d = c + p.addX; // roznica cyfr
    maxDigits[j] = Math.min(9, 9 - d);
    maxDigits[i] = maxDigits[j] + d;
    minDigits[j] = Math.max(1, 1 - d);
    minDigits[i] = minDigits[j] + d;
  }
});

console.log(`Czesc 1: ${maxDigits.join('')}`);
console.log(`Czesc 2: ${minDigits.join('')}`);
