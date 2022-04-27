/**
 * It parses ./1-3-temp/parse.txt file.
 * You can pass there text copied from Excel and get JSON words
 * */
const fs = require('fs');

const Papa = require('papaparse');

const negativesPath = './1-3-temp/AntiSpamBot. Співпраця - NEGATIVE.csv';
const positivesPath = './1-3-temp/AntiSpamBot. Співпраця - POSITIVE.csv';

const casesPaths = [negativesPath, positivesPath];

casesPaths.forEach((path) => {
  const cases = fs.readFileSync(path).toString();

  const fileWords = Papa.parse(cases).data.slice(6).map((row) => row[0]);

  const newFilePath = path
    .replace('1-3-temp', '1-cases')
    .replace('csv', 'json')
    .replace('AntiSpamBot. Співпраця - NEGATIVE', 'true-negatives')
    .replace('AntiSpamBot. Співпраця - POSITIVE', 'true-positives');

  fs.writeFileSync(newFilePath, JSON.stringify(fileWords, null, 2));
})
