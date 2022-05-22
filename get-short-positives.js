const {
  removeLatinPartialLetters,
  removeNumber,
  removeEmail,
  removeMention,
  removeExtraSpaces,
  removeSpecialSymbols,
  removeUrl,
} = require("ukrainian-ml-optimizer");

const tensorCsvDataset = require("./1-3-temp/tensor-csv-dataset.json");

const reformatMessage = (text) =>
  [text]
    .map(removeUrl)
    .map(removeEmail)
    .map(removeMention)
    .map(removeNumber)
    .map(removeSpecialSymbols)
    .map(removeLatinPartialLetters)
    .map(removeExtraSpaces)[0]
    .toLowerCase();

const positives = tensorCsvDataset
  .filter((item) => item.spam === "true")
  .map((item) => reformatMessage(item.commenttext))
  .filter((item) => item.split(" ").length <= 4 && item.split(" ").length > 1);

console.log(positives);
