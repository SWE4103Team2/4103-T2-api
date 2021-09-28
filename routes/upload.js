const express = require('express');
const { readFile, splitByNewLine, splitByTab } = require('../util/fileUtil');

let router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const file = req.files[0];
    const data = readFile(file);
    const splitData = splitByNewLine(data)
    const result = splitData.map(line => {
      return splitByTab(line);
    });

    if (result[0][result[0].length-1] === '\r') {
      result[0].pop();
    }

    console.log(result);

    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;