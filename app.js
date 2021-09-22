require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: '*'
}))

const port = process.env.PORT || 3001;
const example = require('./routes/example.js');

app.use('/example', example);

app.listen(port, () => console.log('App listening on port', port));
