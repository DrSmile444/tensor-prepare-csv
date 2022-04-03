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

(async () => {
  const negatives1 = await extractText('./2-translated/true-negatives.docx');
  const positives1 = await extractText('./2-translated/true-positives.docx');
  const negatives2 = (await extractText('./2-translated/true-negatives (1).docx').catch(console.error)) || '';
  const positives2 = (await extractText('./2-translated/true-positives (1).docx').catch(console.error)) || '';

  const trueNegativesUkrainian = normalizeDocx(negatives1);
  const truePositivesUkrainian = normalizeDocx(positives1);
  const trueNegativesRussian = normalizeDocx(negatives2);
  const truePositivesRussian = normalizeDocx(positives2);

  const newTrueNegatives = [...new Set([...trueNegatives, ...trueNegativesUkrainian, ...trueNegativesRussian])];
  const newTruePositives = [...new Set([...truePositives, ...truePositivesUkrainian, ...truePositivesRussian])];

  writeJson('./2-tensor/tensor-true-negatives.json', newTrueNegatives);
  writeJson('./2-tensor/tensor-true-positives.json', newTruePositives);
})();
