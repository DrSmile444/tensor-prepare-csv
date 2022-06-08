const fs = require('fs');

const { env } = require('typed-dotenv').config();

const { googleService } = require('./google.service');

const cases = Promise.all([
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_SWINDLERS_SHEET_NAME, 'A6:A'),
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_SWINDLERS_SHEET_NAME, 'B6:B'),
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_SWINDLERS_SHEET_NAME, 'E6:E'),
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_SWINDLERS_SHEET_NAME, 'F6:F'),
]);

console.info('Loading training messages...');

return cases
  .then(([negatives, positives, negativesTest, positivesTest]) => {
    return [
      negatives.map((item) => item.value),
      positives.map((item) => item.value),
      negativesTest.map((item) => item.value),
      positivesTest.map((item) => item.value),
    ];
  })
  .then(([negatives, positives, negativesTest, positivesTest]) => {
  console.info('Received training messages.');

  fs.writeFileSync('./1-cases/true-negatives-swindlers.json', JSON.stringify(negatives, null, 2));
  fs.writeFileSync('./1-cases/true-positives-swindlers.json', JSON.stringify(positives, null, 2));
  fs.writeFileSync('./1-cases/true-negatives-swindlers-test.json', JSON.stringify(negativesTest, null, 2));
  fs.writeFileSync('./1-cases/true-positives-swindlers-test.json', JSON.stringify(positivesTest, null, 2));
});
