module.exports = (sequelize, Sequelize) => {
    const CourseTypes = sequelize.define("CourseTypes", {
      userID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      Course: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
      Type: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
      isSubject: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      isException: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return CourseTypes;
  };