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

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Student = student(sequelize, Sequelize);

module.exports = db;