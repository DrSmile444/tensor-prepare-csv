const fs = require('fs');

const queue = require('queue');
const workerFarm = require('worker-farm');
// const { Worker } = require('worker_threads');

const workers = workerFarm(require.resolve('./remove-similar-logic.js'));

const dataset = require('./1-3-temp/tensor-csv-dataset.json');

(async () => {
  const q = queue({ results: [], timeout: 0, concurrency: 6000 });

  dataset.forEach((item, index, self) => {
    q.push(async (cb) => {
      if (index % 100 === 0) {
        console.info(index, 'of', dataset.length, ((index / dataset.length) * 100).toFixed(2), '%');
      }

      for (let i = 0; i < self.length; self++) {
        const compareOptions = {
          first: item.commenttext,
          second: self[i].commenttext,
          rate: 0.2,
        };
        const { isSame } = await new Promise((resolve, reject) => {
          // const worker = new Worker('./remove-similar-service.js', { workerData: compareOptions });
          //
          // worker.on('message', resolve);
          // worker.on('error', reject);
          // worker.on('exit', (code) => {
          //   if (code !== 0)
          //     reject(new Error(`Worker stopped with exit code ${code}`));
          // })
          workers(compareOptions, resolve);
        });

        if (isSame && i !== index) {
          return {
            item, unique: false,
          }
        }
      }

      return { item, unique: true };
    })

    if (index === dataset.length - 1) {
      q.start(function (err) {
        if (err) throw err
        console.log('all done:', q.results);
        workerFarm.end(workers);
        fs.writeFileSync('./1-3-temp/tensor-csv-dataset-result-server.json', JSON.stringify(q.results, null ,2));

        console.log('File wrote');
      });
    }
  });
})();
