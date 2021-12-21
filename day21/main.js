const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const starts = fs.readFileSync(path, 'utf8').trim().split('\n').map(l => Number(l.split(':')[1]));

// kostka deterministyczna
function part1() {
  const pos = [...starts];
  const score = [0, 0];
  let die = 0, rolls = 0, cur = 0;
  for (;;) {
    let move = 0;
    for (let k = 0; k < 3; k++) {
      die = (die % 100) + 1;
      move += die;
    }
    rolls += 3;
    pos[cur] = ((pos[cur] - 1 + move) % 10) + 1;
    score[cur] += pos[cur];
    if (score[cur] >= 1000) return score[1 - cur] * rolls;
    cur = 1 - cur;
  }
}

// liczymy wszechswiaty
const dist = [[3, 1], [4, 3], [5, 6], [6, 7], [7, 6], [8, 3], [9, 1]];
const memo = new Map();
// rekurencja z cache
function wins(p1, s1, p2, s2) {
  const k = ((p1 * 11 + p2) * 21 + s1) * 21 + s2;
  if (memo.has(k)) return memo.get(k);
  let w1 = 0, w2 = 0;
  for (const [move, ways] of dist) {
    const np = ((p1 - 1 + move) % 10) + 1;
    const ns = s1 + np;
    if (ns >= 21) {
      w1 += ways;
    } else {
      const [a, b] = wins(p2, s2, np, ns);
      w1 += ways * b;
      w2 += ways * a;
    }
  }
  const res = [w1, w2];
  memo.set(k, res);
  return res;
}

console.log(`Czesc 1: ${part1()}`);
console.log(`Czesc 2: ${Math.max(...wins(starts[0], 0, starts[1], 0))}`);
