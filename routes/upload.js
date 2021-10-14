const express = require('express');
const { readFile, splitByNewLine, splitByTab } = require('../util/fileUtil');
const { Student } = require('../models');
let router = express.Router();

// Upload Students File
router.post('/students', async (req, res, next) => {
  try {
    const { fileName } = req.query;
    const file = req.files[0];
    const data = readFile(file);
    const splitData = splitByNewLine(data);
    const keys = splitByTab(splitData[0]);

    keys[1] = 'Name';
    splitData.shift();

    const studentData = splitData.map(line => {
      const split = splitByTab(line);
      const obj = { fileID: fileName };

      keys.forEach((key, i) => {
        if (split.length > i && split[i]) {
          obj[key] = split[i];
        }
      });

      return obj;
    });

    const result = await Student.bulkCreate(studentData);

    res.send(result);
  } catch (err) {
    console.log(err.code);
    next(err);
  }
});

module.exports = router;