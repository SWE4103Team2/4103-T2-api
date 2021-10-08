const express = require('express');
const axios = require('axios');
require('dotenv');
let router = express.Router();
const { Sequelize } = require('sequelize');
router.get('/', async (req, res) => {
  try {
    const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      host: 'themis.xn--9xa.network',
      dialect:'mariadb'
    });
    const [results, metadata] = await sequelize.query("Select * from Student");
    res.json(results);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;