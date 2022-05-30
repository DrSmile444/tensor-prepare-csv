const fs = require('fs');

const negatives = require('./2-tensor/tensor-true-negatives-optimized.json');
const positives = require('./2-tensor/tensor-true-positives-optimized.json');

const processResult = (array) => {
  return array
    .map(((item) => item[0]))
    .filter((item) => item.unique)
    .map((item) => item.first);
}

const newNegatives = processResult(negatives);
const newPositives = processResult(positives);

console.log(negatives, newPositives);

fs.writeFileSync('./2-tensor/tensor-true-negatives-optimized-done.json', JSON.stringify(newNegatives, null, 2));
fs.writeFileSync('./2-tensor/tensor-true-positives-optimized-done.json', JSON.stringify(newPositives, null, 2));
