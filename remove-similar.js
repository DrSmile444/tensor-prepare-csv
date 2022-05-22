const fs = require('fs');

const axios = require('axios');
const queue = require('queue');

const dataset = require('./1-3-temp/tensor-csv-dataset.json');

(async () => {
  const q = queue({ results: [], timeout: 200, concurrency: 100, autostart: true });

  dataset.forEach((item, index, self) => q.push(async () => {
    if (index % 100 === 0) {
      console.info(index, 'of', dataset.length, ((index / dataset.length) * 100).toFixed(2), '%');
    }

    for (let i = 0; i < self.length; self++) {
      const { isSame } = (await axios.post('http://localhost:3040/compare',{
        first: item.commenttext,
        second: self[i].commenttext,
        rate: 0.3,
      })).data;

      if (isSame && i !== index) {
        return {
          item, unique: false,
        }
      }
    }

    return { item, unique: true };
  }));

  q.start(function (err) {
    if (err) throw err
    console.log('all done:', q.results);
    fs.writeFileSync('./1-3-temp/tensor-csv-dataset-result-server.json', JSON.stringify(q.results, null ,2));
  });
})();
