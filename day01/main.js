const fs = require('fs');

const path = process.argv[2] || 'data.txt';
const nums = fs.readFileSync(path, 'utf8').trim().split(/\s+/).map(Number);

// zliczamy wzrosty
function countIncreases(gap) {
    let count = 0;
    for (let i = gap; i < nums.length; i++) if (nums[i] > nums[i - gap]) count++;
    return count;
}

console.log(`Czesc 1: ${countIncreases(1)}`);
console.log(`Czesc 2: ${countIncreases(3)}`);
