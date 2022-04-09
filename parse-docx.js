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
  const uaNegatives = await extractText('./2-translated/true-negatives.ua.docx');
  const uaPositives = await extractText('./2-translated/true-positives.ua.docx');
  const ruNegatives = await extractText('./2-translated/true-negatives.ru.docx');
  const ruPositives = await extractText('./2-translated/true-positives.ru.docx');

  const trueNegativesUkrainian = normalizeDocx(uaNegatives);
  const truePositivesUkrainian = normalizeDocx(uaPositives);
  const trueNegativesRussian = normalizeDocx(ruNegatives);
  const truePositivesRussian = normalizeDocx(ruPositives);

  const newTrueNegatives = [...new Set([...trueNegatives, ...trueNegativesUkrainian, ...trueNegativesRussian])];
  const newTruePositives = [...new Set([...truePositives, ...truePositivesUkrainian, ...truePositivesRussian])];

  writeJson('./2-tensor/tensor-true-negatives.json', newTrueNegatives);
  writeJson('./2-tensor/tensor-true-positives.json', newTruePositives);
})();
