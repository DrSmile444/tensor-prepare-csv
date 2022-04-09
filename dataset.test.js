const fs = require('fs');

const Papa = require('papaparse');

const { TensorService } = require('./tensor.service')

const unitTestsFile = fs.readFileSync('./1-3-temp/unit-tests.csv').toString();
const parseCsv = 'text\tisRealSpam\n' + unitTestsFile;

const file = Papa.parse(parseCsv, {
  header: true,
  skipEmptyLines: true,
});

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

    const resultsPromises = file.data.map(async ({ text, isRealSpam }) => {
      return {
        text,
        isRealSpam: isRealSpam === '1',
        tensor: await tensorService.predict(text),
      }
    });

    results = await Promise.all(resultsPromises);

    const positivesRate = getPositiveRate(results);
    const negativesRate = getNegativeRate(results);

    fs.writeFileSync('./1-3-temp/' + new Date().toISOString() + '-values.json', JSON.stringify({ positivesRate, negativesRate }));
  });

  it('should have decent positive rate', async () => {
    const positivesRate = getPositiveRate(results);

    expect(positivesRate).toBeGreaterThan(0.35);
  });

  it('should have decent negative rate', async () => {
    const negativesRate = getNegativeRate(results);

    expect(negativesRate).toBeGreaterThan(0.98);
  });
});
