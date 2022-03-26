/**
 * It parses ./1-3-temp/parse.txt file.
 * You can pass there text copied from Excel and get JSON words
 * */
const fs = require('fs');

const casesPaths = ['./1-3-temp/true-negatives.txt', './1-3-temp/true-positives.txt'];

casesPaths.forEach((path) => {
  const cases = fs.readFileSync(path).toString();

  const fileWords = cases
    .split('\n')
    .slice(5)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split('\t'))
    .flat();

  fs.writeFileSync(path.replace('1-3-temp', '1-cases').replace('txt', 'json'), JSON.stringify(fileWords, null, 2));

})
