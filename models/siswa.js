'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: 'userID', as: 'users' }); 
    }
  }
  siswa.init({
    siswaID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nama_siswa: {
      type: DataTypes.STRING
    },
    alamat: {
      type: DataTypes.STRING
    },
    telp: {
      type: DataTypes.STRING
    },
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    foto: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'siswa',
  });
  return siswa;
};