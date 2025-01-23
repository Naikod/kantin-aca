'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('detail_transaksis', {
      detailtransaksiID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaksiID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "transaksis",
          key: "transaksiID"
        }
      },
      menuID: {
      type: Sequelize.INTEGER,
        allowNull: false,
        references: {
        model: "menus",
          key: "menuID"
         }
        },
      qty: {
        type: Sequelize.INTEGER
      },
      harga_beli: {
        type: Sequelize.DOUBLE
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
    await queryInterface.dropTable('detail_transaksis');
  }
};