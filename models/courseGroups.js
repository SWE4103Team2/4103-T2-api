module.exports = (sequelize, Sequelize) => {
    const CourseGroups = sequelize.define("CourseGroups", {
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
      Group: {
        type: Sequelize.STRING(15),
        primaryKey: true,
        allowNull: false
      },
      isSubject: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return CourseGroups;
  };