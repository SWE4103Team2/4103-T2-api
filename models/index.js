const Sequelize = require('sequelize');

// Define Our Database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'swe4103t2bruh.mysql.database.azure.com',
    dialect: 'mysql',
    logging: false
  }
);

// Import Models
const student = require('./student');
const enrollment = require('./enrollment');
const fileTime = require('./fileTime');
const CoreCourse = require('./coreCourse');

const db = {};

// Add Sequelize to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op = Sequelize.Op;

// Add Models to db object
db.Student = student(sequelize, Sequelize);
db.Enrollment = enrollment(sequelize, Sequelize);
db.FileTime = fileTime(sequelize, Sequelize);
db.CoreCourse = CoreCourse(sequelize, Sequelize);

module.exports = db;