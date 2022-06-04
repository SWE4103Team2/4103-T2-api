const Sequelize = require('sequelize');

// Define Our Database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
  }
);

// Import Models
const student = require('./student');
const enrollment = require('./enrollment');
const fileTime = require('./fileTime');
const CoreCourse = require('./coreCourse');
const CourseGroups = require('./courseGroups');
const CoursePrereqs = require('./coursePrereqs');
const CourseReplacements = require('./courseReplacements');
const CourseTypes = require('./courseTypes');
const Login = require('./login');

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
db.CourseGroups = CourseGroups(sequelize, Sequelize);
db.CoursePrereqs = CoursePrereqs(sequelize, Sequelize);
db.CourseReplacements = CourseReplacements(sequelize, Sequelize);
db.CourseTypes = CourseTypes(sequelize, Sequelize);
db.Login = Login(sequelize, Sequelize);

module.exports = db;