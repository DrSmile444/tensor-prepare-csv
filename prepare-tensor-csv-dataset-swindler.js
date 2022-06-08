const fs = require('fs');

const { stringify } = require('csv-stringify');

const { optimizeText } = require('ukrainian-ml-optimizer');
// const optimizeText = (text) => text;

const truePositives = require('./1-cases/true-positives-swindlers.json');
const trueNegative = require('./1-cases/true-negatives-swindlers.json');
const truePositivesTest = require('./1-cases/true-positives-swindlers-test.json');
const trueNegativeTest = require('./1-cases/true-negatives-swindlers-test.json');

function shuffle(array, times) {
  times--;

  if (times > 0) {
    return shuffle(array, times);
  }

  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

const truePositivesRows = truePositives.map(optimizeText).map((commenttext) => ({ commenttext, spam: "true" })).filter((item) => item.commenttext);
const truePositivesRowsTest = truePositivesTest.map(optimizeText).map((commenttext) => ({ commenttext, spam: "true" })).filter((item) => item.commenttext);
const trueNegativeRows = trueNegative.map(optimizeText).map((commenttext) => ({ commenttext, spam: "false" })).filter((item) => item.commenttext);
const trueNegativeRowsTest = trueNegativeTest.map(optimizeText).map((commenttext) => ({ commenttext, spam: "false" })).filter((item) => item.commenttext);

stringify( shuffle([...truePositivesRows, ...trueNegativeRows]), { header: true, columns: { commenttext: 'commenttext', spam: 'spam'  } }, (result, output) => {
  fs.writeFileSync('./1-3-temp/tensor-csv-dataset-swindler.csv', output);
});

stringify( shuffle([...truePositivesRowsTest, ...trueNegativeRowsTest]), { header: true, columns: { commenttext: 'commenttext', spam: 'spam'  } }, (result, output) => {
  fs.writeFileSync('./1-3-temp/tensor-csv-dataset-swindler-test.csv', output);
});
