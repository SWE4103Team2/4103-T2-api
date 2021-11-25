module.exports = (sequelize, Sequelize) => {
    const CoursePrereqs = sequelize.define("CoursePrereqs", {
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
      PrereqFor: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
      isCoreq: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return CoursePrereqs;
  };