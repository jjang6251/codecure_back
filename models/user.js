const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  
  User.init({
    user_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING
    },
    user_password: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false
  });

  return User;
};
