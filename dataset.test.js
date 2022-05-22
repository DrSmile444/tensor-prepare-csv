const fs = require('fs');

const Papa = require('papaparse');

const { optimizeText } = require('ukrainian-ml-optimizer');

const { TensorService } = require('./tensor.service')

const unitTestsFile = fs.readFileSync('./1-3-temp/ai-spam-detect-test-phrases - Sheet1.csv').toString();

const parseResult = Papa.parse(unitTestsFile, { skipEmptyLines: true });
const file = parseResult
  .data
  .slice(2)
  .map((row) => ({ text: row[0], isRealSpam: row[8] === '1' }));

const spamRate = 0.85;

/**
 * @type {TensorService}
 * */
const tensorService = new TensorService('./1-3-temp/js_export/tfjs/model.json', spamRate);
let results;

const getPositiveRate = (data) => {
  const positives = data.filter((singleCase) => singleCase.isRealSpam);
  return positives.filter((singleCase) => singleCase.tensor.isSpam).length / positives.length;
}

const getNegativeRate = (data) => {
  const negatives = data.filter((singleCase) => !singleCase.isRealSpam);
  return negatives.filter((singleCase) => !singleCase.tensor.isSpam).length / negatives.length;
}

describe('Dataset test', () => {
  beforeAll(async () => {
    await tensorService.loadModel();

    const resultsPromises = file.map(async ({ text, isRealSpam }) => {
      return {
        text,
        isRealSpam,
        tensor: await tensorService.predict(optimizeText(text)),
      }
    });

    results = await Promise.all(resultsPromises);

    const missMatch = results.filter((item) => item.isRealSpam !== item.tensor.isSpam)

    fs.writeFileSync('./1-3-temp/result.json', JSON.stringify(missMatch, null, 2));

    const positivesRate = getPositiveRate(results);
    const negativesRate = getNegativeRate(results);

    fs.writeFileSync('./1-3-temp/' + new Date().toISOString() + '-values.json', JSON.stringify({ positivesRate, negativesRate }));
  });

  it('should have decent positive rate', async () => {
    const positivesRate = getPositiveRate(results);

    expect(positivesRate).toBeGreaterThanOrEqual(0.6);
  });

  it('should have decent negative rate', async () => {
    const negativesRate = getNegativeRate(results);

    expect(negativesRate).toBeGreaterThanOrEqual(0.95);
  });

  it('should not ban empty message', async () => {
    const emptyMessage = '🇺🇦😝';

    const result = await tensorService.predict(emptyMessage);

    expect(result.spamRate).toBeLessThanOrEqual(0.7);
  });
});
