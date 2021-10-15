module.exports = (sequelize, Sequelize) => {
  const Student = sequelize.define("Student", {
    fileID: {
      type: Sequelize.STRING(20),
      primaryKey: true,
      allowNull: false
    },
    Student_ID: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      allowNull: false
    },
    Name: {
      type: Sequelize.STRING(40),
      allowNull: false
    },
    Start_Date: {
      type: Sequelize.DATEONLY
    },
    Email: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    Program: {
      type: Sequelize.STRING(10),
      allowNull: false
    }, 
    Campus: {
      type: Sequelize.STRING(2),
      allowNull: false
    }, 
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return Student;
};