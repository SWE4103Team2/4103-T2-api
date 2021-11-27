module.exports = (sequelize, Sequelize) => {
    const CoreCourse = sequelize.define("CoreCourse", {
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
      columnID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      sheetName: {
        type: Sequelize.STRING(50),
        primaryKey: true,
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return CoreCourse;
  };