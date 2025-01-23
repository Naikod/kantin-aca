'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.stan, {
        foreignKey: 'stanID', as: 'stans' });
      this.belongsTo(models.siswa, {
        foreignKey: 'siswaID',  as: 'siswas'});
    }
  }
  transaksi.init({
    transaksiID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tanggal: {
      type: DataTypes.DATE
    },
    stanID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    siswaID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM ("belum dikonfirm", "dimasak", "diantar", "sampai")
    }
  }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};