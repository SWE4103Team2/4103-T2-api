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
    const [results, metadata] = await sequelize.query("SELECT stuID, name, sDate, program FROM Student");
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;