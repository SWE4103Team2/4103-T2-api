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
router.get('/getStudent', async (req, res) => {
  try {
    const fileTimeTable = await db.Student.findAll({ 
      attributes: ['Student_ID', 'Name', 'Start_Date', 'Program'], 
      where: {
        'fileID' : req.query.file, 
        [Op.or]: [
          {'Student_ID' : {[Op.like]: "%" + req.query.id + "%"}},
          {'Name' : req.query.id},
          {'Start_Date' : req.query.id},
          {'Program' : req.query.id}
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