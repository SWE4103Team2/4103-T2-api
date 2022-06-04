module.exports = (sequelize, Sequelize) => {
  const Login = sequelize.define("Login", {
    userID: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    pswrd: {
      type: Sequelize.STRING(64)
    }
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return Login;
};
