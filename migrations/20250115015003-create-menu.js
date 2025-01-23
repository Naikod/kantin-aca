'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menus', {
      menuID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_makanan: {
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.DOUBLE
      },
      jenis: {
        type: Sequelize.ENUM("makanan","minuman")
      },
      foto: {
        type: Sequelize.STRING
      },
      deskripsi: {
        type: Sequelize.STRING
      },
      stanID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "stans",
          key: "stanID"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('menus');
  }
};