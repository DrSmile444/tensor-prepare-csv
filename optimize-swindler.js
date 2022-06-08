const fs = require('fs');
const stringSimilarity = require('string-similarity');

const prodSwindler = require('./1-cases/swindlers.json');
const sheetSwindler = require('./1-cases/true-positives-swindlers.json');

const toOptimize = [...prodSwindler, ...sheetSwindler].sort();

const optimized = toOptimize
  .filter((item, index, self) => {
    const foundIndex = toOptimize.findIndex((secondItem) => stringSimilarity.compareTwoStrings(secondItem, item) >= 0.9);
    return foundIndex === index;
  }).map((item) => item.replace(/\n/g, ' '));

fs.writeFileSync('./1-cases/swindler.tsv', optimized.join('\n'));
