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
        type: Sequelize.STRING(5)
      },
      Term: {
        type: Sequelize.STRING(7),
        primaryKey: true,
        allowNull: false
      },
      Section: {
        type: Sequelize.STRING(5),
      }, 
      Title: {
        type: Sequelize.STRING(50),
      }, 
      Credit_Hrs: {
        type: Sequelize.STRING(5),
      },
      Notes_Codes: {
        type: Sequelize.STRING(1),
      }, 
    }, {
      freezeTableName: true,
      timestamps: false,
    });
  
    return Enrollment;
  };