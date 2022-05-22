const fs = require('fs');

const stringSimilarity = require('string-similarity');

const dataset = require('./1-3-temp/tensor-csv-dataset.json');

const newDataset = dataset.filter((item, index, self) => {
  if (index % 100 === 0) {
    console.info(index, 'of', dataset.length, ((index / dataset.length) * 100).toFixed(2), '%');
  }

  return self.findIndex((searchItem) => {
    return stringSimilarity
      .compareTwoStrings(searchItem.commenttext, item.commenttext) > 0.5
  }) === index;
});

fs.writeFileSync('./1-3-temp/tensor-csv-dataset-result.json', JSON.stringify(newDataset, null ,2));
