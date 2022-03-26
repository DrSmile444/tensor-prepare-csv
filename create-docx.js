const fs = require('fs');

const HTMLtoDOCX = require('html-to-docx');

const truePositives = require('./cases/true-positives.json');
const trueNegative = require('./cases/true-negatives.json');

(async () => {
  const truePositivesDocx = await HTMLtoDOCX('<p>'+truePositives.join('</p><p>')+'</p>');
  const trueNegativeDocx = await HTMLtoDOCX('<p>'+trueNegative.join('</p><p>')+'</p>');

  fs.writeFileSync('./cases/true-positives.docx', truePositivesDocx);
  fs.writeFileSync('./cases/true-negatives.docx', trueNegativeDocx);
})();
