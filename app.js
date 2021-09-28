require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({
  origin: '*'
}))
app.use(bodyParser.json());

const port = process.env.PORT || 3001;
const example = require('./routes/example.js');
const upload = require('./routes/upload.js');

app.use('/example', example);
app.use('/upload', upload);

app.listen(port, () => console.log('App listening on port', port));
