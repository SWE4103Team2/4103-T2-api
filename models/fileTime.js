module.exports = (sequelize, Sequelize) => {
    const FileTime = sequelize.define("FileTime", {
      fileID: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      uploadTime: {
        type: Sequelize.DATE,
        primaryKey: true,
        allowNull: false
      },
      program: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return FileTime;
  };