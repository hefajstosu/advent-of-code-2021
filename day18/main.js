const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const lines = fs.readFileSync(path, 'utf8').split('\n').map(s => s.trim()).filter(s => s);

// plaska lista
function parse(line) {
  const res = [];
  let depth = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '[') depth++;
    else if (ch === ']') depth--;
    else if (ch >= '0' && ch <= '9') {
      let j = i;
      while (line[j + 1] >= '0' && line[j + 1] <= '9') j++;
      res.push({ v: Number(line.slice(i, j + 1)), d: depth });
      i = j;
    }
  }
  return res;
}

function reduce(num) {
  for (;;) {
    // wybuchamy pare
    let done = false;
    for (let i = 0; i < num.length; i++) {
      if (num[i].d > 4) {
        if (i > 0) num[i - 1].v += num[i].v;
        if (i + 2 < num.length) num[i + 2].v += num[i + 1].v;
        num.splice(i, 2, { v: 0, d: num[i].d - 1 });
        done = true;
        break;
      }
    }
    if (done) continue;
    // dzielimy liczbe
    for (let i = 0; i < num.length; i++) {
      if (num[i].v >= 10) {
        const { v, d } = num[i];
        num.splice(i, 1, { v: Math.floor(v / 2), d: d + 1 }, { v: Math.ceil(v / 2), d: d + 1 });
        done = true;
        break;
      }
    }
    if (!done) return num;
  }
}

function add(a, b) {
  const res = [...a, ...b].map(e => ({ v: e.v, d: e.d + 1 }));
  return reduce(res);
}

function magnitude(num) {
  const arr = num.map(e => ({ ...e }));
  while (arr.length > 1) {
    const maxD = Math.max(...arr.map(e => e.d));
    // zwijamy pare
    const i = arr.findIndex(e => e.d === maxD);
    arr.splice(i, 2, { v: 3 * arr[i].v + 2 * arr[i + 1].v, d: maxD - 1 });
  }
  return arr[0].v;
}

const nums = lines.map(parse);

// sumujemy wszystko
let sum = nums[0];
for (let i = 1; i < nums.length; i++) sum = add(sum, nums[i]);

// brute force
let best = 0;
for (let i = 0; i < nums.length; i++) {
  for (let j = 0; j < nums.length; j++) {
    if (i !== j) best = Math.max(best, magnitude(add(nums[i], nums[j])));
  }
}

console.log(`Czesc 1: ${magnitude(sum)}`);
console.log(`Czesc 2: ${best}`);
