const { workerData, parentPort } = require('worker_threads');

const stringSimilarity = require('string-similarity');

const { first, second, rate } = workerData;

const result = stringSimilarity.compareTwoStrings(first, second);

// You can do any heavy stuff here, in a synchronous way
// without blocking the "main thread"
parentPort.postMessage({ result, rate, isSame: result > rate })

