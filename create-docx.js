const fs = require('fs');

const HTMLtoDOCX = require('html-to-docx');

const truePositives = require('./1-cases/true-positives.json');
const trueNegative = require('./1-cases/true-negatives.json');

(async () => {
  const truePositivesDocx = await HTMLtoDOCX('<p>'+truePositives.join('</p><p>')+'</p>');
  const trueNegativeDocx = await HTMLtoDOCX('<p>'+trueNegative.join('</p><p>')+'</p>');

  fs.writeFileSync('./1-cases/true-positives.docx', truePositivesDocx);
  fs.writeFileSync('./1-cases/true-negatives.docx', trueNegativeDocx);
})();
