const fs = require('fs');

const queue = require('queue');
const workerFarm = require('worker-farm');
// const { Worker } = require('worker_threads');

const workers = workerFarm(require.resolve('./remove-similar-logic.js'));

const datasetTest = require('./2-tensor/tensor-test.json');
const datasetPositives = require('./2-tensor/tensor-true-positives.json');
const datasetNegatives = require('./2-tensor/tensor-true-negatives.json');

const removeSimilar = async (array) => {
  const filteredArray = array.filter(Boolean);

  return new Promise((resolve) => {
    const q = queue({ results: [], timeout: 0, concurrency: 6000 });
    const uniqueIndexes = [];

    filteredArray.forEach((first, firstIndex, self) => {
      q.push(async () => {
        if (firstIndex % 100 === 0) {
          console.info(firstIndex, 'of', filteredArray.length, ((firstIndex / filteredArray.length) * 100).toFixed(2), '%');
        }

        for (let secondIndex = 0; secondIndex < self.length; secondIndex++) {
          const second = self[secondIndex];
          const compareOptions = {
            first,
            second,
            rate: 0.7,
          };

          const { isSame } = await new Promise((resolve) => {
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

          // console.log(firstIndex, secondIndex, isSame, isSame && secondIndex !== firstIndex);

          if (isSame) {
            if (secondIndex === firstIndex) {
              uniqueIndexes.push(firstIndex);
              return { first, unique: true };
            } else {
              return {
                first, second, unique: false
              }
            }
          }
        }

        uniqueIndexes.push(firstIndex);

        return { first, unique: true };
      })

      if (firstIndex === filteredArray.length - 1) {
        q.start(function (err) {
          if (err) throw err
          console.log('all done:', q.results);
          workerFarm.end(workers);

          resolve(q.results);
        });
      }
    });
  });
};

const processResult = (array) => {
  return array.filter((item) => item.unique).map((item) => item.item);
}

(async() => {
  // const newDatasetPositives = processResult(await removeSimilar(datasetPositives));
  // const newDatasetPositives = await removeSimilar(datasetPositives);
  // fs.writeFileSync('./2-tensor/tensor-true-positives-optimized.json', JSON.stringify(newDatasetPositives, null ,2));

  // const newDatasetNegatives = processResult(await removeSimilar(datasetNegatives));
  const newDatasetNegatives = await removeSimilar(datasetNegatives);
  fs.writeFileSync('./2-tensor/tensor-true-negatives-optimized.json', JSON.stringify(newDatasetNegatives, null ,2));

  // const newDatasetTest = await removeSimilar(datasetTest);
  // fs.writeFileSync('./2-tensor/tensor-test-optimized.json', JSON.stringify(newDatasetTest, null ,2));

  console.log('File wrote');
})();

