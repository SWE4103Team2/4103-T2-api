require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerFile = multer();
const app = express();

app.use(cors({
  origin: '*'
}))
app.use(multerFile.array('file'));
app.use(express.static('public'));


const port = process.env.PORT || 3001;
const example = require('./routes/example.js');
const upload = require('./routes/upload.js');
const students = require('./routes/students.js');

app.use('/example', example);
app.use('/upload', upload);
app.use('/students', students);

app.listen(port, () => console.log('App listening on port', port));
