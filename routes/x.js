const express = require('express');
const axios = require('axios');
let router = express.Router();

router.get('/', async (req, res) => {
  try {
    // await axios.get(SQL);
  } catch (err) {
    next(err);
  }
});

module.exports = router;