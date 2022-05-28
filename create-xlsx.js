const fs = require('fs');

const xlsx = require('node-xlsx').default;

const truePositives = require('./1-cases/true-positives.json');
const trueNegative = require('./1-cases/true-negatives.json');

(async () => {
  const prepareData = (array) => array.map((item) => [item]);

  const truePositivesXlsx = xlsx.build([{ name: 'dataset', data: prepareData(truePositives), options: {} }]);
  const trueNegativeXlsx = xlsx.build([{ name: 'dataset', data: prepareData(trueNegative), options: {} }]);

  fs.writeFileSync('./1-cases/true-positives.xlsx', truePositivesXlsx);
  fs.writeFileSync('./1-cases/true-negatives.xlsx', trueNegativeXlsx);
})();
