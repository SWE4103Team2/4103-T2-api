const express = require('express');
const { readFile, splitByNewLine, splitByTab } = require('../util/fileUtil');

let router = express.Router();

router.put('/', async (req, res, next) => {
  try {
    const data = req.body.data;

    //const file = req.body;
    //const data = readFile(file);
    const splitData = splitByNewLine(data)
    const result = splitData.map(line => {
      return splitByTab(line);
    });

    if (result[0][result[0].length-1] === '\r') {
      result[0].pop();
    }

    res.send(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;