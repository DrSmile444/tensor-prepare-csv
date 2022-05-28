const fs = require('fs');

const { env } = require('typed-dotenv').config();

const { googleService } = require('./google.service');

const cases = Promise.all([
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_POSITIVE_SHEET_NAME),
  googleService.getSheet(env.GOOGLE_SPREADSHEET_ID, env.GOOGLE_NEGATIVE_SHEET_NAME),
]);

console.info('Loading training messages...');

return cases
  .then(([positives, negatives]) => {
    return [positives.map((item) => item.value), negatives.map((item) => item.value)];
  })
  .then(([positives, negatives]) => {
  console.info('Received training messages.');

  fs.writeFileSync('./1-cases/true-negatives.json', JSON.stringify(negatives, null, 2));
  fs.writeFileSync('./1-cases/true-positives.json', JSON.stringify(positives, null, 2));
});
