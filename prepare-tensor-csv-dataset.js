const fs = require('fs');

const truePositives = require('./2-tensor/tensor-true-positives.json');
const trueNegative = require('./2-tensor/tensor-true-negatives.json');

const csvFileRows = ['commenttext,spam'];

function processDatasetCase(item) {
  return item
    .replace(/[^a-z\u0400-\u04FF\d]/gi, ' ')
    .replace(/\s\s+/g, ' ')
    .trim();
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const truePositivesRows = truePositives.map(processDatasetCase).map((item) => `${item},true`);
const trueNegativeRows = trueNegative.map(processDatasetCase).map((item) => `${item},false`);

const wordsCount = [...truePositivesRows, ...trueNegativeRows].map((word) => word.split(' ').length).sort((a, b) => b - a);
const words = [...csvFileRows, ...shuffle([...truePositivesRows, ...trueNegativeRows])]

fs.writeFileSync('./1-3-temp/tensor-csv-dataset.stats.txt', wordsCount.join('\n'));
fs.writeFileSync('./1-3-temp/tensor-csv-dataset.csv', words.join('\n'));
