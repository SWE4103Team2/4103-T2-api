const express = require('express');
const axios = require('axios');
const db = require('../models/index');

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
router.get('/getStudent', async (req, res) => {
  try {
    const fileTimeTable = await db.Student.findAll({ 
      attributes: ['Student_ID', 'Name', 'Start_Date', 'Program'], 
      where: {
        'fileID' : req.query.file, 
        'Student_ID' : req.query.id
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
    const fileTimeTable = await db.FileTime.findAll({ 
      attributes: ['fileID'], 
      order: [
        ['fileID', 'DESC']
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
module.exports = router;