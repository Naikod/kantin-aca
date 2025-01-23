'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo (models.stan, { foreignKey: "stanID", as:"stans"});
  }
  }
  menu.init({
    menuID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_makanan: {
      type: DataTypes.STRING
    },
    harga: {
      type: DataTypes.DOUBLE
    },
    jenis: {
      type: DataTypes.ENUM ("makanan", "minuman")
    },
    foto: {
      type: DataTypes.STRING
    },
    deskripsi: {
      type: DataTypes.STRING
    },
    stanID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'menu',
  });
  return menu;
};