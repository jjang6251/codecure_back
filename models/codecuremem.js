'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class codecureMem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  codecureMem.init({
    major: DataTypes.STRING,
    stdid: DataTypes.INTEGER,
    grade: DataTypes.INTEGER,
    name: DataTypes.STRING,
    role: DataTypes.STRING,
    password: DataTypes.STRING,
    is_admin: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'codecureMem',
    timestamps: false
  });
  return codecureMem;
};