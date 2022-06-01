const fs = require('fs');

const negatives = require('./2-tensor/tensor-true-negatives-optimized.json');
const positives = require('./2-tensor/tensor-true-positives-optimized.json');

const processResult = (array) => {
  return array
    .map(((item) => item[0]))
    .filter((item) => item.unique)
    .map((item) => item.first)
    .filter((item) => item.split(' ').length <= 25 && item.split(' ').length >= 3);
}

let newNegatives = processResult(negatives);
let newPositives = processResult(positives);

const shortestDataset = Math.min(newNegatives.length, newPositives.length);

console.log(shortestDataset)

// newNegatives = newNegatives.slice(newNegatives.length - shortestDataset, newNegatives.length - 1);
// newPositives = newPositives.slice(newPositives.length - shortestDataset, newPositives.length - 1);

console.log(newPositives, newNegatives);
console.log(newPositives.length);
console.log(newNegatives.length);

fs.writeFileSync('./2-tensor/tensor-true-negatives-optimized-done.json', JSON.stringify(newNegatives, null, 2));
fs.writeFileSync('./2-tensor/tensor-true-positives-optimized-done.json', JSON.stringify(newPositives, null, 2));
