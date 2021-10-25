const express = require('express');
let router = express.Router();

const { readFile } = require('../util/fileUtil');
const { formatStudentData, formatCourseData, formatTransferData } = require('../util/dataUtil');
const { Student, Enrollment, FileTime } = require('../models');

// Handles File Uploads
router.post('/', async (req, res, next) => {
  try {
    const { fileName, program } = req.query;
    const studentData = readFile(req.files[0]);
    const courseData = readFile(req.files[1]);
    const transferData = readFile(req.files[2]);

    if (!fileName || !program) {
      throw 'MissingParameters';
    }
  
    const students = formatStudentData(studentData);
    const courses = formatCourseData(courseData);
    const transfers = formatTransferData(transferData);

    let fileResult, studentResult, courseResult, transferResult;

    try {
      fileResult = await FileTime.create({ fileID: fileName, program });
      studentResult = await Student.bulkCreate(studentData);
      courseResult = await Enrollment.bulkCreate(courseData);
      transferResult = null // await idk

      res.send({ fileResult, studentResult, courseResult, transferResult });
    } catch (err) {
      await FileTime.destroy({ where: { fileID: fileName } });
      await Student.destroy({ where: { fileID: fileName } });
      await Enrollment.destroy({ where: { fileID: fileName } });
      // await Transfer.destroy({ where: { fileID: fileName } });
    }

    res.send({ fileResult, studentResult, courseResult, transferResult });
  } catch (err) {
    console.log(err.code);
    next(err);
  }
});

module.exports = router;