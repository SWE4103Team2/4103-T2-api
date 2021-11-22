const express = require('express');
let router = express.Router();

const { readFile } = require('../util/fileUtil');

const { sequelize, Student, Enrollment, FileTime, CoreCourse } = require('../models');
const db = require('../models/index');
/**************************************************************
Retrieve a list of Students.
Parameters:
-> file         : The File ID (REQUIRED).
**************************************************************/
router.get('/getStudents', async (req, res) => {
  try {
    let SQLQuery = "SELECT Student.*, Enrollment.Student_ID AS 'EStuID' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "'";
    SQLQuery += " GROUP BY Student.Student_ID";
    SQLQuery += " UNION ALL SELECT Student.*, Enrollment.Student_ID AS 'EStuID' FROM Student RIGHT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.Student_ID IS NULL AND Enrollment.fileID  = '" + req.query.file + "'";
    SQLQuery += " GROUP BY Enrollment.Student_ID";
    
    const resultTable = await sequelize.query(SQLQuery);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Retrieve a Student's Enrollment in Courses.
Parameters:
-> file         : The File ID (REQUIRED).
-> studentID    : Student's ID (REQUIRED).
**************************************************************/
router.get('/getEnrollment', async (req, res) => {
  try {
    const fileList = await sequelize.query("SELECT Enrollment.*, CoreCourse.userID AS 'isCore' FROM Enrollment LEFT JOIN CoreCourse ON Enrollment.Course = CoreCourse.Course AND CoreCourse.userID = '" + req.query.userID + "' WHERE Enrollment.fileID = '" + req.query.file + "' AND Enrollment.Student_ID = '" + req.query.studentID + "'");
    res.json(fileList[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Retrieve a list of File Names.
Parameters:
-> type         : The Type of File (OPTIONAL).
**************************************************************/
router.get('/getFiles', async (req, res) => {
  try {
    const resultTable = await FileTime.findAll({ 
      attributes: ['fileID'], 
      where: { program: req.query.type },
      order: [['uploadTime', 'DESC']],
      raw: true
    });

    res.json(resultTable);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Retrieve a list of File Types.
Parameters:
-> None.
**************************************************************/
router.get('/getFileTypes', async (req, res) => {
  try {
    const resultTable = await FileTime.findAll({ 
      attributes: ['program'], 
      order: [
        ['uploadTime', 'DESC']
      ],
      raw: true
    });

    const grouped = [];
    resultTable.forEach(item => {
      if (!grouped.includes(item.program)) {
        grouped.push(item.program);
      }
    })

    res.json(grouped);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Uploades Core Courses paired with UserID.
Parameters:
-> arr          : Core Courses Array (REQUIRED).
-> id           : Users Login ID (REQUIRED).
**************************************************************/
 router.post('/uploadXLSX', async (req, res) => {
  try {
    const result = {'delete' : 0, 'insert' : 0};
    const data = JSON.parse(req.body.BRUH);
    Object.keys(data).forEach(sheet => {
      data[sheet].forEach(row => {
        row.userID = req.query.userID;
      })
    })
    
    if(data["prereqs"]){
      result.delete += await db.CoursePrereqs.destroy({ where: { userID: req.query.userID }});
      result.insert += (await db.CoursePrereqs.bulkCreate(data["prereqs"])).length;
    }
    if(data["valid-tags"]){
      result.delete += await db.CourseTypes.destroy({ where: { userID: req.query.userID, isException: 0 }});
      result.insert += (await db.CourseTypes.bulkCreate(data["valid-tags"])).length;
    }
    if(data["exceptions"]){
      result.delete += await db.CourseTypes.destroy({ where: { userID: req.query.userID, isException: 1 }});
      result.insert += (await db.CourseTypes.bulkCreate(data["exceptions"])).length;
    }
    if(data["replacements"]){
      result.delete += await db.CourseReplacements.destroy({ where: { userID: req.query.userID }});
      result.insert += (await db.CourseReplacements.bulkCreate(data["replacements"])).length;
    }
    if(data["course-groups"]){
      result.delete += await db.CourseGroups.destroy({ where: { userID: req.query.userID }});
      result.insert += (await db.CourseGroups.bulkCreate(data["course-groups"])).length;
    }
    if(data["matrixes"]){
      result.delete += await CoreCourse.destroy({ where: { userID: req.query.userID }});
      result.insert += (await CoreCourse.bulkCreate(data["matrixes"])).length;
    }
    

    res.send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Uploads a Student to Database. (Useful for 'Missing Students').
Parameters:
-> None.
**************************************************************/
router.get('/addSingleStudent', async (req, res) => {
  try {
    const result = await Student.create(JSON.parse(req.query.stuObject));
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Retrieve a list of Courses.
Parameters:
-> None.
**************************************************************/
 router.get('/getAllCourses', async (req, res) => {
  try {
    const resultTable = await Enrollment.findAll({ 
      attributes: ['Course'], 
      group: ['Course'],
      raw: true
    });
    res.json(resultTable);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Remove all data matching the provided FileId
Parameters:
-> file         : The File ID (REQUIRED).
**************************************************************/
router.get('/deleteFile', async (req, res) => {
  try {
    await FileTime.destroy({ where: { fileID: req.query.file } });
    await Student.destroy({ where: { fileID: req.query.file } });
    await Enrollment.destroy({ where: { fileID: req.query.file } });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

/**************************************************************
Extracts Students Year based on Type Selection.
Parameters:
-> file         : The File ID (REQUIRED).
-> userID       : Core Courses Table ID (REQUIRED IF Type = 3).
-> searchObject : Custom Search Requirements (REQUIRED IF Type = 4).
-> Type         : Determines how 'Year' is Calculated
                  - 0: By Credit Hour (40ch = 1yr).
                  - 1: By Start Date.
                  - 2: By Cohort.
                  - 3: By Core Courses.
                  - 4: By Custom Requirements.
                  - Other: Result is [].
**************************************************************/
router.get('/getYear', async (req, res) =>{
  try {
    let SQLQuery;
    
    if(req.query.type === "0") {         // 0 means by credit hours (40h per year)
      SQLQuery = "SELECT CEILING(SUM(Credit_Hrs)/40) AS 'Year' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.Student_ID";
    }
    else if(req.query.type === "1") {    // 1 means by exact start date
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), Start_Date)/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
    }
    else if(req.query.type === "2") {    // 2 means by cohort
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), ADDDATE(Start_Date, -243))/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
    }
    else if(req.query.type === "3") {    // 3 means by core Courses
      SQLQuery = "SELECT COUNT(Enrollment.Student_ID) AS 'Year' FROM CoreCourse LEFT JOIN Enrollment ON CoreCourse.Course = Enrollment.Course AND CoreCourse.userID = " + req.query.userID + " RIGHT JOIN Student ON Student.Student_ID = Enrollment.Student_ID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.Student_ID";
    }
    else if(req.query.type === "4") {    // 4 means by the fixed SWE requirements
      var searchObject = JSON.parse(req.query.searchObject);
      
      SQLQuery = "SELECT SUM(IF(";
      if(searchObject.second.length !== 0) {
        for(let i = 0; i < searchObject.second.length; i++) {
          if(i !== 0) {
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.second[i] + "'";
        }
      }
      else {
        SQLQuery += "FALSE";
      }

      SQLQuery += ", 1, IF("
      if(searchObject.third.length !== 0) {
        for(let i = 0; i < searchObject.third.length; i++) {
          if(i !== 0) {
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.third[i] + "'";
        }
      }
      else {
        SQLQuery += "FALSE";
      }

      SQLQuery += ", 100, IF("
      if(searchObject.fourth.length !== 0) {
        for(let i = 0; i < searchObject.fourth.length; i++) {
          if(i !== 0) {
            SQLQuery += " OR ";
          }
          SQLQuery += "Enrollment.Course = '" + searchObject.fourth[i] + "'";
        }
      }
      else {
        SQLQuery += "FALSE";
      }

      SQLQuery += ",  10000, 0)))) AS 'CourseCount', SUM(Credit_Hrs) AS 'CreditHours' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR' OR Enrollment.Notes_Codes IS NOT NULL) WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.Student_ID";
    }
    else {
      res.json([]);
      return;
    }


    const resultTable = await sequelize.query(SQLQuery);
    if(req.query.type === "3") {         // Formatting for the by core course
      for(let i = 0; i < resultTable[0].length; i++) {
        if(resultTable[0][i].Year < 13) {
          resultTable[0][i].Year = 1;
        }
        else if(resultTable[0][i].Year < 23) {
          resultTable[0][i].Year = 2;
        }
        else if(resultTable[0][i].Year < 31) {
          resultTable[0][i].Year = 3;
        }
        else {
          resultTable[0][i].Year = 4;
        }
      }
    }
    else if(req.query.type === "4") {    // Formatting for when selecting by fixed SWE courses
      let courseCount = [searchObject.minCoursePer[0], 0, 0];
      courseCount[1] = courseCount[0]+searchObject.minCoursePer[1]*100
      courseCount[2] = courseCount[1]+searchObject.minCoursePer[2]*10000
      for(let i = 0; i < resultTable[0].length; i++) {
        if(resultTable[0][i].CourseCount >= courseCount[2] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[2]) {
          resultTable[0][i].Year = 4;
        }
        else if(resultTable[0][i].CourseCount%10000 >= courseCount[1] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[1]) {
          resultTable[0][i].Year = 3;
        }
        else if(resultTable[0][i].CourseCount%100 >= courseCount[0] && resultTable[0][i].CreditHours >= searchObject.creditHoursPer[0]) {
          resultTable[0][i].Year = 2;
        }
        else {
          resultTable[0][i].Year = 1;
        }
      }
    }

    //console.log(req.query);
    if(req.query.count === "true") {
      let finalTable = [0,0,0,0];
      for(let i = 0; i < resultTable[0].length; i++){
        if(resultTable[0][i].Year !== "null"){
          if(resultTable[0][i].Year <= "1"){
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
    let rankObject = [{countName: "FIR", Count: finalTable[0]}, {countName: "SOP", Count: finalTable[1]}, {countName: "JUN", Count: finalTable[2]}, {countName: "SEN", Count: finalTable[3]}];
    res.json(rankObject);

    } else {
      res.json(resultTable[0]);
    }
    
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
    sqlQuery = "SELECT Student.campus AS countName, COUNT(Student.Student_ID) AS Count FROM Student WHERE Student.fileID = '" + req.query.file + "' GROUP BY Student.campus";
    const resultTable = await sequelize.query(sqlQuery);
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
    sqlQuery = "SELECT Enrollment.Course, COUNT(Student.Student_ID) AS Count FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "' AND Enrollment.Course != 'null' AND Enrollment.Course NOT LIKE '%COOP' AND Enrollment.Course NOT LIKE '%PEP' GROUP BY Enrollment.Course";

    //sqlQuery += "GROUP BY Enrollment.Course"
    
    const resultTable = await sequelize.query(sqlQuery);
    res.json(resultTable[0]);
  } catch (err) {
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
    let sqlQuery = "SELECT Enrollment.Course AS countName, Count(DISTINCT Student.student_ID) AS Count FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "' AND (Enrollment.Course LIKE '%COOP' OR Enrollment.Course LIKE '%PEP') GROUP BY Enrollment.Course";
    const resultTable = await sequelize.query(sqlQuery);
    
    //console.log(resultTable[0]);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
})
module.exports = router;
