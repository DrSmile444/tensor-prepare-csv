const fs = require('fs');

const Papa = require('papaparse');

const { TensorService } = require('./tensor.service')

const unitTestsFile = fs.readFileSync('./1-3-temp/unit-tests.csv').toString();
const parseCsv = 'text\tisRealSpam\n' + unitTestsFile;

const file = Papa.parse(parseCsv, {
  header: true,
  skipEmptyLines: true,
});

const spamRate = 0.90;

/**
 * @type {TensorService}
 * */
const tensorService = new TensorService('./1-3-temp/js_export/tfjs/model.json', spamRate);

describe('Dataset test', () => {
  beforeAll(async () => {
    await tensorService.loadModel();
  });

  it('should work', async () => {
    const resultsPromises = file.data.map(async ({ text, isRealSpam }) => {
      return {
        text,
        isRealSpam: isRealSpam === '1',
        tensor: await tensorService.predict(text),
      }
    });

    const results = await Promise.all(resultsPromises);

    const positives = results.filter((singleCase) => singleCase.isRealSpam);
    const negatives = results.filter((singleCase) => !singleCase.isRealSpam);

    const positivesRate = positives.filter((singleCase) => singleCase.tensor.isSpam).length / positives.length;
    const negativesRate = negatives.filter((singleCase) => !singleCase.tensor.isSpam).length / negatives.length;

    expect({ positivesRate, negativesRate }).toMatchSnapshot();

    console.log(positivesRate, negativesRate);
  })
});
