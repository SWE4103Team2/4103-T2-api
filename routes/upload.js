const express = require('express');
const { readFile, splitByNewLine, splitByTab } = require('../util/fileUtil');
const { Student, Enrollment, FileTime } = require('../models');
let router = express.Router();

// Handles File Uploads
router.post('/', async (req, res, next) => {
  try {
    const { fileName, dataDate,  } = req.query;
    const studentData = readFile(req.files[0]);
    const courseData = readFile(req.files[1]);
    const transferData = readFile(req.files[2]);

    validateFiles(studentData, courseData, transferData);

    const students = formatStudentData(studentData);
    const courses = formatCourseData(courseData);
    const transfers = formatTransferData(transferData);

    console.log(students);
    console.log(courses);
    console.log(transfers);

    /*
    cosnt fileResult = await FileTime.create(idkyet);
    const studentResult = await Student.bulkCreate(studentData);
    const courseResult = await Course.bulkCreate(courseData);
    const transferResult = await idk


    res.send({ studentResult, courseResult, transferResult });
    */
  } catch (err) {
    console.log(err.code);
    next(err);
  }
});

module.exports = router;