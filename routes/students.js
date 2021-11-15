const express = require('express');
const axios = require('axios');
const db = require('../models/index');
const { Op } = require("sequelize");

let router = express.Router();

/** 
 * API end point to get all the students in the student table and all those enrolled but not in the student table with a specific fileID, optional Student_ID
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    id = The Student ID (OPTIONAL, set to "" to skip)  
*/
router.get('/getStudents', async (req, res) => {
  try {
//     const resultTable = await db.Student.findAll({ 
//       where: {
//         'fileID' : req.query.file, 
//         [Op.or]: [
//           {'Student_ID' : {[Op.like]: "%" + req.query.srcVal + "%"}},
//           {'Name' : req.query.srcVal},
//           {'Start_Date' : req.query.srcVal},
//           {'Program' : req.query.srcVal}
//         ]
//       },
//       raw: true
//     });
//     res.json(resultTable);
    let SQLQuery = "SELECT Student.*, Enrollment.Student_ID AS 'EStuID' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "'";
    if(req.query.studentID !== ""){
      SQLQuery += " AND Student.Student_ID = '" + req.query.studentID + "'";
    }
    SQLQuery += " GROUP BY Student.Student_ID";
    SQLQuery += " UNION ALL SELECT Student.*, Enrollment.Student_ID AS 'EStuID' FROM Student RIGHT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.Student_ID IS NULL AND Enrollment.fileID  = '" + req.query.file + "'";
    if(req.query.studentID !== ""){
      SQLQuery += " AND Enrollment.Student_ID = '" + req.query.studentID + "'";
    }
    SQLQuery += " GROUP BY Enrollment.Student_ID";
    const resultTable = await db.sequelize.query(SQLQuery);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
});

/** 
 * API end point to get all the columns of the Enrollment table for a specific fileID and Student_ID
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    studentID = The Student ID (REQUIRED)  
*/
router.get('/getEnrollment', async (req, res) => {
  try {
    // const resultTable = await db.Enrollment.findAll({  
    //   where: {
    //     'fileID' : req.query.file,
    //     'Student_ID' : req.query.studentID
    //   }
    // });
    // const fileList = resultTable.map( row => {
    //   return row.dataValues;
    // });
    const fileList = await db.sequelize.query("SELECT Enrollment.*, CoreCourse.userID AS 'isCore' FROM Enrollment LEFT JOIN CoreCourse ON Enrollment.Course = CoreCourse.Course AND CoreCourse.userID = '" + req.query.userID + "' WHERE Enrollment.fileID = '" + req.query.file + "' AND Enrollment.Student_ID = '" + req.query.studentID + "'");
    res.json(fileList[0]);
  } catch (err) {
    console.error(err);
  }
});

/**
 * API end point to get the list of fileIDs from the FileTime table, optional program type
 * Parameters:
 *    type = The type of program the files have (OPTIONAL, set to undefined to skip)
 */
router.get('/getFiles', async (req, res) => {
  try {
    const where = {};
    if(req.query.type !== undefined){
      where.program = req.query.type;
    }
    const resultTable = await db.FileTime.findAll({ 
      attributes: ['fileID'], 
      where,
      order: [['uploadTime', 'DESC']],
      raw: true
    });
    res.json(resultTable);
  } catch (err) {
    console.error(err);
  }
});

/**
 * API end point to get the list of program types from the FileTime table
 * Parameters:
 *    NONE
 */
router.get('/getFileTypes', async (req, res) => {
  try {
    const resultTable = await db.FileTime.findAll({ 
      attributes: ['program'], 
      order: [
        ['uploadTime', 'DESC']
      ],
      raw: true
    });
    const grouped = [];
    resultTable.forEach((program) => {
      if(!grouped.some((element) => element.program === program.program)){
        grouped.push(program);
      }
    });
    res.json(grouped);
  } catch (err) {
    console.error(err);
  }
});

/**
 * Adds the core course array into the database labeled with the users ID
 * Parameters:
 *    arr = The course array
 *    id = the users ID, should be linked to their login ID
 */
 router.get('/uploadXLSX', async (req, res) => {
  try {
    const result = {};
    result.delete = await db.CoreCourse.destroy({where: {userID: req.query.userID}})
    result.insert = await db.CoreCourse.bulkCreate(req.query.arr.map(course => {return {userID: req.query.userID, Course : course}}));
    result.insert = result.insert.length;
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

/**
 * Adds a single student, used for to add missing students
 */
router.get('/addSingleStudent', async (req, res) => {
  try {
    const result = await db.Student.create(JSON.parse(req.query.stuObject));
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

/**
 * API end point to get the list of all different courses from the enrollment table
 * Parameters:
 *    NONE
 */
 router.get('/getAllCourses', async (req, res) => {
  try {
    const resultTable = await db.Enrollment.findAll({ 
      attributes: ['Course'], 
      group: ['Course'],
      raw: true
    });
    res.json(resultTable);
  } catch (err) {
    console.error(err);
  }
});

router.get('/deleteFile', async (req, res) => {
  try {
    await db.FileTime.destroy({ where: { fileID: req.query.file } });
    await db.Student.destroy({ where: { fileID: req.query.file } });
    await db.Enrollment.destroy({ where: { fileID: req.query.file } });
  } catch (err) {
    console.error(err);
  }
});

/** 
 * API end point to get year of a student from the student table with a specific fileID, optional Student_ID
 * This requires an addional type variable for different calculation types
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    id = The Student ID (OPTIONAL, set to "" to skip)
 *    userID = The CoreCourse table ID (ONLY REQUIRED FOR type = 3)  
 *    searchObject - contains information about the custom requirements (ONLY REQUIRED FOR type = 4)  
 *    Type = the way you wish to calculate the year
 *        - 0 = by credit hours, currently 40h repersents 1 year
 *        - 1 = by exact start date, counts the years based of the current date
 *        - 2 = by cohort, counts based of starting cohort
 *        - 3 = by core courses, counts the number of core courses done by each student for the list that is currently loaded in CoreCourse
 *        - 4 = by Custom requirements, these are set in the API
 *        - Other = returns []
*/
router.get('/getYear', async (req, res) =>{
  try {
    let SQLQuery;
    if(req.query.type === "0"){         // 0 means by credit hours (40h per year)
      SQLQuery = "SELECT CEILING(SUM(Credit_Hrs)/40) AS 'Year' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.studentID !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.studentID + "%' OR Student.Name = '" + req.query.studentID + "' OR Student.Start_Date = '" + req.query.studentID + "' OR Student.Program = '" + req.query.studentID + "')";
      }
      SQLQuery += " GROUP BY Student.Student_ID";
    }
    else if(req.query.type === "1"){    // 1 means by exact start date
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), Start_Date)/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.studentID !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.studentID + "%' OR Student.Name = '" + req.query.studentID + "' OR Student.Start_Date = '" + req.query.studentID + "' OR Student.Program = '" + req.query.studentID + "')";
      }
    }
    else if(req.query.type === "2"){    // 2 means by cohort
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), ADDDATE(Start_Date, -243))/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.studentID !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.studentID + "%' OR Student.Name = '" + req.query.studentID + "' OR Student.Start_Date = '" + req.query.studentID + "' OR Student.Program = '" + req.query.studentID + "')";
      }
    }
    else if(req.query.type === "3"){    // 3 means by core Courses
      SQLQuery = "SELECT COUNT(Enrollment.Student_ID) AS 'Year' FROM CoreCourse LEFT JOIN Enrollment ON CoreCourse.Course = Enrollment.Course AND CoreCourse.userID = " + req.query.userID + " RIGHT JOIN Student ON Student.Student_ID = Enrollment.Student_ID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.studentID !== ""){
        SQLQuery += " AND Student.Student_ID = '" + req.query.studentID + "'";
      }
      SQLQuery += " GROUP BY Student.Student_ID";
    }
    else if(req.query.type === "4"){    // 4 means by the fixed SWE requirements
      var searchObject = JSON.parse(req.query.searchObject);
      SQLQuery = "SELECT SUM(IF(";
      if(searchObject.second.length !== 0){
        for(let i = 0; i < searchObject.second.length; i++){
          if(i !== 0){
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.second[i] + "'";
        }
      }
      else{
        SQLQuery += "FALSE";
      }
      SQLQuery += ", 1, IF("
      if(searchObject.third.length !== 0){
        for(let i = 0; i < searchObject.third.length; i++){
          if(i !== 0){
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.third[i] + "'";
        }
      }
      else{
        SQLQuery += "FALSE";
      }
      SQLQuery += ", 100, IF("
      if(searchObject.fourth.length !== 0){
        for(let i = 0; i < searchObject.fourth.length; i++){
          if(i !== 0){
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.fourth[i] + "'";
        }
      }
      else{
        SQLQuery += "FALSE";
      }
      SQLQuery += ",  10000, 0)))) AS 'CourseCount', SUM(Credit_Hrs) AS 'CreditHours' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.studentID !== ""){
        SQLQuery += " AND Student.Student_ID = '" + req.query.studentID + "'";
      }
      SQLQuery += " GROUP BY Student.Student_ID";
    }
    else{
      res.json([]);
      return;
    }
    const resultTable = await db.sequelize.query(SQLQuery);
    if(req.query.type === "3"){         // Formatting for the by core course
      for(let i = 0; i < resultTable[0].length; i++){
        if(resultTable[0][i].Year < 13){
          resultTable[0][i].Year = 1;
        }
        else if(resultTable[0][i].Year < 23){
          resultTable[0][i].Year = 2;
        }
        else if(resultTable[0][i].Year < 31){
          resultTable[0][i].Year = 3;
        }
        else{
          resultTable[0][i].Year = 4;
        }
      }
    }
    else if(req.query.type === "4"){    // Formatting for when selecting by fixed SWE courses
      let courseCount = [searchObject.minCoursePer[0], 0, 0];
      courseCount[1] = courseCount[0]+searchObject.minCoursePer[1]*100
      courseCount[2] = courseCount[1]+searchObject.minCoursePer[2]*10000
      for(let i = 0; i < resultTable[0].length; i++){
        if(resultTable[0][i].CourseCount >= courseCount[2] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[2]){
          resultTable[0][i].Year = 4;
        }
        else if(resultTable[0][i].CourseCount%10000 >= courseCount[1] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[1]){
          resultTable[0][i].Year = 3;
        }
        else if(resultTable[0][i].CourseCount%100 >= courseCount[0] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[0]){
          resultTable[0][i].Year = 2;
        }
        else{
          resultTable[0][i].Year = 1;
        }
      }
    }
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
})

/**
 * API endpoint to get the count of students per entered campus
 * Parameters:
 *  file = The file ID
 */
router.get('/getCampusCounts', async (req, res) =>{
  try{
    let sqlQuery;
    sqlQuery = "SELECT COUNT(Student.Student_ID) FROM Student WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.campus";
    const resultTable = await db.sequelize.query(sqlQuery);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
});

/**
 * API endpoint to get the counts of students in courses. If course is entered, counts by entered course
 * Parameters:
 *  file = The file ID
 */
router.get('/getCourseCounts', async (req, res) =>{
  try{
    let sqlQuery;
    sqlQuery = "SELECT Enrollment.Course, COUNT(Student.Student_ID) FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "' AND Enrollment.Course != 'null' GROUP BY Enrollment.Course";

    //sqlQuery += "GROUP BY Enrollment.Course"
    
    const resultTable = await db.sequelize.query(sqlQuery);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
});

/**
 * API endpoint that gets counts of ranks by year
 * Parameters:
 *  file = The file ID
 */
router.get('/getRankCounts', async (req, res) =>{
  try{
    let sqlQuery;
    sqlQuery = "SELECT CEILING(SUM(Credit_Hrs)/40) AS 'Year' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.Student_ID";
    
    const resultTable = await db.sequelize.query(sqlQuery);
    let finalTable = [0,0,0,0];
    for(let i = 0; i < resultTable[0].length; i++){
      if(resultTable[0][i].Year !== "null"){
        if(resultTable[0][i].Year == "1"){
          finalTable[0] += 1;
        }
        else if(resultTable[0][i].Year == "2"){
          finalTable[1] += 1;
        }
        else if(resultTable[0][i].Year == "3"){
          finalTable[2] += 1;
        }
        else if(resultTable[0][i].Year >= "4"){
          finalTable[3] += 1;
        }
      }
    }
    //console.log(finalTable)
    res.json(finalTable);
  }catch (err) {
    console.error(err);
  }
});

/**
 * API endpoint that gets counts of coops
 * Parameters:
 *  file = The file ID
 */
router.get('/getCoopCounts', async (req, res) =>{
  try{
    let sqlQuery = "SELECT Enrollment.Course, Count(Student.student_ID) FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "' AND Enrollment.Course LIKE '%COOP' GROUP BY SUBSTRING(Enrollment.Course, 1,2)";
    const resultTable = await db.sequelize.query(sqlQuery);
    
    //console.log(resultTable[0]);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
})
module.exports = router;