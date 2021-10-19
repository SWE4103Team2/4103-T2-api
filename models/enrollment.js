module.exports = (sequelize, Sequelize) => {
    const Enrollment = sequelize.define("Enrollment", {
      fileID: {
        type: Sequelize.STRING(20),
        primaryKey: true,
        allowNull: false
      },
      Student_ID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      Course: {
        type: Sequelize.STRING(9),
        primaryKey: true,
        allowNull: false
      },
      Grade: {
        type: Sequelize.STRING(3)
      },
      Term: {
        type: Sequelize.STRING(7),
        primaryKey: true,
        allowNull: false
      },
      Section: {
        type: Sequelize.STRING(5),
        allowNull: false
      }, 
      Title: {
        type: Sequelize.STRING(50),
        allowNull: false
      }, 
      Credit_Hrs: {
        type: Sequelize.FLOAT,
        allowNull: false
      }, 
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return Enrollment;
  };