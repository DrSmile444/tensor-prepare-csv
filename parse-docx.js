const fs = require('fs');

const extractText = require('office-text-extractor');


const truePositives = require('./1-cases/true-positives.json');
const trueNegatives = require('./1-cases/true-negatives.json');

const writeJson = (path, json) => {
  fs.writeFileSync(path, JSON.stringify(json, null, 2) + '\n');
}

const normalizeDocx = (string) => {
  return string
    .trim()
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

extractText('./2-translated/true-negatives.docx').then((data) => {
  const trueNegativesUkrainian = normalizeDocx(data);
  const newTrueNegatives = [...new Set([...trueNegatives, ...trueNegativesUkrainian])];

  writeJson('./2-tensor/2-tensor-true-negatives.json', newTrueNegatives);
})

extractText('./2-translated/true-positives.docx').then((data) => {
  const truePositivesUkrainian = normalizeDocx(data);
  const newTruePositives = [...new Set([...truePositives, ...truePositivesUkrainian])];

  writeJson('./2-tensor/2-tensor-true-positives.json', newTruePositives);
})
