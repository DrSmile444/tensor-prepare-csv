const fs = require('fs');

const vocabTxt = fs.readFileSync('./1-3-temp/js_export/vocab.txt').toString();
const vocabJson = vocabTxt
  .trim()
  .split('\n')
  .map((row) => row.split(' ')[0]);

fs.writeFileSync('./1-3-temp/vocab.json', JSON.stringify(vocabJson, null, 2));
