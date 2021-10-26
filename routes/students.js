const express = require('express');
const axios = require('axios');
const db = require('../models/index');
const { Op } = require("sequelize");

let router = express.Router();

/** 
 * API end point to get all the columns of the student table with a specific fileID, optional Student_ID
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    id = The Student ID (OPTIONAL, set to "" to skip)  
*/
router.get('/getStudents', async (req, res) => {
  try {
    const resultTable = await db.Student.findAll({ 
      where: {
        'fileID' : req.query.file, 
        [Op.or]: [
          {'Student_ID' : {[Op.like]: "%" + req.query.srcVal + "%"}},
          {'Name' : req.query.srcVal},
          {'Start_Date' : req.query.srcVal},
          {'Program' : req.query.srcVal}
        ]
      }
    });
    const fileList = resultTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
  } catch (err) {
    console.error(err);
  }
});

/** 
 * API end point to get all the columns of the Enrollment table for a specific fileID and Student_ID
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    id = The Student ID (REQUIRED)  
*/
router.get('/getEnrollment', async (req, res) => {
      try {
        const resultTable = await db.Enrollment.findAll({  
          where: {
            'fileID' : req.query.file,
            'Student_ID' : req.query.id
          }
        });
    const fileList = resultTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
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
      order: [
        ['uploadTime', 'DESC']
      ]
    });
    const fileList = resultTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
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
      group: ['program']
    });
    const fileList = resultTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
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
 *    Type = the way you wish to calculate the year
 *        - 0 = by credit hours, currently 40h repersents 1 year
 *        - 1 = by exact start date, counts the years based of the current date
 *        - 2 = by cohort, counts based of starting cohort
 *        - Other = returns []
*/
router.get('/getYear', async (req, res) =>{
  try {
    let SQLQuery;
    if(req.query.type === "0"){         // 0 means by credit hours (40h per year)
      SQLQuery = "SELECT CEILING(SUM(Credit_Hrs)/40) AS 'Year' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID AND NOT (Enrollment.Grade = '' OR Enrollment.Grade = 'W' OR Enrollment.Grade = 'WF' OR Enrollment.Grade = 'WD' OR Enrollment.Grade = 'D' OR Enrollment.Grade = 'F' OR Enrollment.Grade = 'NCR') WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.id !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.id + "%' OR Student.Name = '" + req.query.id + "' OR Student.Start_Date = '" + req.query.id + "' OR Student.Program = '" + req.query.id + "')";
      }
      SQLQuery += " GROUP BY Student.Student_ID";
    }
    else if(req.query.type === "1"){    // 1 means by exact start date
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), Start_Date)/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.id !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.id + "%' OR Student.Name = '" + req.query.id + "' OR Student.Start_Date = '" + req.query.id + "' OR Student.Program = '" + req.query.id + "')";
      }
    }
    else if(req.query.type === "2"){    // 2 means by cohort
      SQLQuery = "SELECT CEILING(DATEDIFF(NOW(), ADDDATE(Start_Date, -243))/365) AS 'Year' FROM Student WHERE Student.fileID = '" + req.query.file + "'";
      if(req.query.id !== ""){
        SQLQuery += " AND (Student.Student_ID LIKE '%" + req.query.id + "%' OR Student.Name = '" + req.query.id + "' OR Student.Start_Date = '" + req.query.id + "' OR Student.Program = '" + req.query.id + "')";
      }
    }
    if(SQLQuery === undefined){
      res.json([]);
      return;
    }
    const resultTable = await db.sequelize.query(SQLQuery);
    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
  }
})
module.exports = router;