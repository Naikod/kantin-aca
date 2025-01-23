'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class detail_transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo (models.transaksi, {foreignKey: 'transaksiID', as:'transaksis'})
      this.belongsTo (models.menu, {foreignKey: 'menuID', as:'menus'})
      
    }
  }
  detail_transaksi.init({
    detailtransaksiID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    transaksiID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    menuID: {
      type: DataTypes.INTEGER,
        allowNull: false 
      },
      qty: {
        type: DataTypes.INTEGER
      },
      harga_beli: {
        type: DataTypes.DOUBLE
      },
  }, {
    sequelize,
    modelName: 'detail_transaksi',
  });
  return detail_transaksi;
};