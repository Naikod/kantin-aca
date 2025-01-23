'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany (models.user, {foreignKey: 'userID', as: 'user'})
    }
  }
  user.init({
    userID: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
    },
    username: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    role: {
      type: DataTypes.ENUM ("admin_stan", "siswa")
    }
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};