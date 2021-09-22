const express = require('express');
const axios = require('axios');
let router = express.Router();

router.get('/:bc-:tc', async (req, res) => {
  try {
    res.json({ success: true, ButtonCount: req.params.bc, NameCount: req.params.tc});
  } catch (err) {
    next(err);
  }
});

module.exports = router;