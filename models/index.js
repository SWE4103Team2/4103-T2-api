const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: 'themis.xn--9xa.network',
    dialect: 'mariadb',
  }
);

const student = require('./student');
const enrollment = require('./enrollment');
const fileTime = require('./fileTime');
const CoreCourse = require('./coreCourse');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = student(sequelize, Sequelize);
db.Enrollment = enrollment(sequelize, Sequelize);
db.FileTime = fileTime(sequelize, Sequelize);
db.CoreCourse = CoreCourse(sequelize, Sequelize);

module.exports = db;