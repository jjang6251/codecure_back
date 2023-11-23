'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  Board.init({
    title: {
      type: DataTypes.STRING,
      collate: 'utf8mb4_unicode_ci', // 문자 인코딩 설정
    },
    content: {
      type: DataTypes.STRING,
      collate: 'utf8mb4_unicode_ci', // 문자 인코딩 설정
    },
    count: DataTypes.INTEGER,
    User: {
      type: DataTypes.STRING,
      collate: 'utf8mb4_unicode_ci', // 문자 인코딩 설정
    },
    type: {
      type: DataTypes.STRING,
      collate: 'utf8mb4_unicode_ci',
    }
  }, {
    sequelize,
    modelName: 'Board',
  });
  
  return Board;
};
