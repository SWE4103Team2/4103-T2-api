const express = require('express');
let router = express.Router();

const { sequelize } = require('../models');


/** 
 * API end point to get all the students in the student table and all those enrolled but not in the student table with a specific fileID, optional Student_ID
 * Parameters:
 *    file = The file ID (REQUIRED)
 *    id = The Student ID (OPTIONAL, set to "" to skip)  
*/
router.get('/', async (req, res) => {
  try {
    const SQLQuery = `SELECT userID FROM Login WHERE username = '${req.query.username}' AND pswrd = SHA1('${req.query.password}')`;
    const resultTable = await sequelize.query(SQLQuery);

    res.json(resultTable[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;