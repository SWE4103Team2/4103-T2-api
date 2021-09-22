const express = require('express');
const axios = require('axios');
let router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.json({ success: true, value: 'Hello!' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;