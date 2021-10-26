const express = require('express');
const axios = require('axios');
const db = require('../models/index');
const { Op } = require("sequelize");

let router = express.Router();

router.get('/', async (req, res) => {
  try {
    const fileTimeTable = await db.Student.findAll({ 
      attributes: ['Student_ID', 'Name', 'Start_Date', 'Program'], 
      where: {
        'fileID' : req.query.file
      }
    });
    const fileList = fileTimeTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
  } catch (err) {
    console.error(err);
  }
});

router.get('/getStudents', async (req, res) => {
  try {
    const fileTimeTable = await db.Student.findAll({  
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
    const fileList = fileTimeTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
  } catch (err) {
    console.error(err);
  }
});

router.get('/getFiles', async (req, res) => {
  try {
    const where = {};
    if(req.query.type !== undefined){
      where.program = req.query.type;
    }
    const fileTimeTable = await db.FileTime.findAll({ 
      attributes: ['fileID'], 
      where,
      order: [
        ['uploadTime', 'DESC']
      ]
    });
    const fileList = fileTimeTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
  } catch (err) {
    console.error(err);
  }
});

router.get('/getFileTypes', async (req, res) => {
  try {
    const fileTimeTable = await db.FileTime.findAll({ 
      attributes: ['program'], 
      order: [
        ['uploadTime', 'DESC']
      ],
      group: ['program']
    });
    const fileList = fileTimeTable.map( row => {
      return row.dataValues;
    });
    res.json(fileList);
  } catch (err) {
    console.error(err);
  }
});

router.get('/getYear', async (req, res) =>{
  try {
    let SQLQuery;
    if(req.query.type === "0"){         // 0 means by credit hours (40h per year)
      SQLQuery = "SELECT CEILING(SUM(Credit_Hrs)/40) AS 'Year' FROM Student LEFT JOIN Enrollment ON Student.Student_ID = Enrollment.Student_ID AND Student.fileID = Enrollment.fileID WHERE Student.fileID = '" + req.query.file + "'";
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
    const fileTimeTable = await db.sequelize.query(SQLQuery);
    res.json(fileTimeTable[0]);
  } catch (err) {
    console.error(err);
  }
})
module.exports = router;