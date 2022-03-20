/**
 * It parses ./temp/parse.txt file.
 * You can pass there text copied from Excel and get JSON words
 * */
const fs = require('fs');

const casesPaths = ['./temp/true-negatives.txt', './temp/true-positives.txt'];

casesPaths.forEach((path) => {
  const cases = fs.readFileSync(path).toString();

  const fileWords = cases
    .split('\n')
    .slice(5)
    .map((row) => row.trim())
    .filter(Boolean)
    .map((row) => row.split('\t'))
    .flat();

  fs.writeFileSync(path.replace('temp', 'cases').replace('txt', 'json'), JSON.stringify(fileWords, null, 2));

})
