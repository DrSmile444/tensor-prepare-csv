const express = require('express');
const stringSimilarity = require('string-similarity');

const app = express();
app.use(express.json());
app.post('/compare', (req, res) => {
  const { first, second, rate } = req.body;
  console.info('Compare', first, second);
  const result = stringSimilarity.compareTwoStrings(first, second);

  res.json({ result, rate, isSame: result > rate });
});

app.listen(3040, () => {
  console.log('Server has been started');
});
