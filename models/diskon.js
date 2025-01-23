'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
module.exports = (sequelize, DataTypes) => {
  class diskon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany (models.diskon, {foreignKey: 'diskonID', as:'diskon'});
      this.belongsTo (models.stan, {foreignKey: 'stanID', as: 'stans'});
    }
  }
  diskon.init({
    diskonID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_diskon: {
      type: DataTypes.STRING
    },
    persentase_diskon: {
      type: DataTypes.DOUBLE
    },
    tanggal_awal: {
      type: DataTypes.DATE
    },
    tanggal_akhir: {
      type: DataTypes.DATE
    },
  }, {
    sequelize,
    modelName: 'diskon',
  });
  return diskon;
};