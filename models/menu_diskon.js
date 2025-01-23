'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class menu_diskon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo (models.menu, {foreignKey: 'menuID', as:'menus'});
      this.belongsTo (models.diskon, {foreignKey: 'diskonID', as:'diskons'});
    }
  }
  menu_diskon.init({
    menudiskonID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    menuID: {
      type: DataTypes.INTEGER,
      allowNull: false 
    },
    diskonID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'menu_diskon',
  });
  return menu_diskon;
};