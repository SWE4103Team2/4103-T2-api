require('dotenv').config();

const express = require('express');
const cors = require('cors');
const multer = require('multer');

const multerFile = multer();
const app = express();

// Implements Middleware
app.use(cors({ origin: '*' }));
app.use(multerFile.any());
app.use(express.static('public'));

// Syncs Database with Models
const db = require('./models');
db.sequelize.sync();

// Gets Routes
const upload = require('./routes/upload.js');
const students = require('./routes/students.js');
const login = require('./routes/login.js');

app.use('/upload', upload);
app.use('/students', students);
app.use('/login', login);

// Sets up the port
const port = process.env.PORT || 3001;
app.listen(port, () => console.log('App listening on port', port));
