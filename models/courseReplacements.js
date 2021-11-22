module.exports = (sequelize, Sequelize) => {
    const CourseReplacements = sequelize.define("CourseReplacements", {
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
      Replaces: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return CourseReplacements;
  };