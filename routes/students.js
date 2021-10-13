const express = require('express');
const axios = require('axios');

let router = express.Router();

const { Sequelize } = require('sequelize');
router.get('/', async (req, res) => {
  try {
    const sequelize = new Sequelize('SWE4103T2', 'admin', 'PQzU$5vchmev!T2d%w8yCGosfqg%q#!9hcLN%c', {
      host: 'themis.xn--9xa.network',
      dialect:'mariadb'
    });
    const [results, metadata] = await sequelize.query("SELECT student_ID, Name, Start_Date, Program FROM Student WHERE fileID = '" + req.query.file + "'");
    res.json(results);
  } catch (err) {
    console.error(err);
  }
});
router.get('/getStudent', async (req, res) => {
  try {
    const studentID = req.query.id
    const sequelize = new Sequelize('SWE4103T2', 'admin', 'PQzU$5vchmev!T2d%w8yCGosfqg%q#!9hcLN%c', {
      host: 'themis.xn--9xa.network',
      dialect:'mariadb'
    });
    const [results, metadata] = await sequelize.query("SELECT student_ID, Name, Start_Date, Program FROM Student WHERE fileID = '" + req.query.file + "' AND student_ID = " + studentID);
    res.json(results);
  } catch (err) {
    console.error(err);
  }
});

router.get('/getFiles', async (req, res) => {
  try {
    const sequelize = new Sequelize('SWE4103T2', 'admin', 'PQzU$5vchmev!T2d%w8yCGosfqg%q#!9hcLN%c', {
      host: 'themis.xn--9xa.network',
      dialect:'mariadb'
    });
    const [results, metadata] = await sequelize.query("SELECT fileID FROM Student GROUP BY fileID");
    res.json(results);
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;