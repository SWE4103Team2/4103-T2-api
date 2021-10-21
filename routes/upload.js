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
  
    validateFiles(studentData, courseData, transferData);

    const students = formatStudentData(studentData);
    const courses = formatCourseData(courseData);
    const transfers = formatTransferData(transferData);

    console.log(students);
    console.log(courses);
    console.log(transfers);

    /*
    cosnt fileResult = await FileTime.create({ fileID: fileName, program });
    const studentResult = await Student.bulkCreate(studentData);
    const courseResult = await Course.bulkCreate(courseData);
    // const transferResult = await idk


    res.send({ studentResult, courseResult, transferResult });
    */
  } catch (err) {
    console.log(err.code);
    next(err);
  }
});

module.exports = router;