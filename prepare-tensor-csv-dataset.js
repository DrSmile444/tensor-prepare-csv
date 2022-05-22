const fs = require('fs');

const { stringify } = require('csv-stringify');

const { optimizeText } = require('ukrainian-ml-optimizer');
// const optimizeText = (text) => text;

const truePositives = require('./2-tensor/tensor-true-positives.json');
const trueNegative = require('./2-tensor/tensor-true-negatives.json');

function shuffle(array) {
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

const truePositivesRows = truePositives.map(optimizeText).map((commenttext) => ({ commenttext, spam: "true" }));
const trueNegativeRows = trueNegative.map(optimizeText).map((commenttext) => ({ commenttext, spam: "false" }));

stringify( shuffle([...truePositivesRows, ...trueNegativeRows]), { header: true, columns: { commenttext: 'commenttext', spam: 'spam'  } }, (result, output) => {
  fs.writeFileSync('./1-3-temp/tensor-csv-dataset.csv', output);
})

fs.writeFileSync('./1-3-temp/tensor-csv-dataset.json', JSON.stringify(shuffle([...truePositivesRows, ...trueNegativeRows])))

const wordsCount = [...truePositivesRows, ...trueNegativeRows].map((word) => word.commenttext.split(' ').length).sort((a, b) => b - a);

fs.writeFileSync('./1-3-temp/tensor-csv-dataset.stats.txt', wordsCount.join('\n'));
