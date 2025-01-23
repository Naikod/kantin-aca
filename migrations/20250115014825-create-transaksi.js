'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksis', {
      transaksiID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tanggal: {
        type: Sequelize.DATE
      },
      stanID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'stans', 
          key: 'stanID'   
        },
      },
      siswaID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'siswas', 
          key: 'siswaID'   
        },
      },
      status: {
        type: Sequelize.ENUM("belum dikonfirm", "dimasak", "diantar", "sampai")
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
    await queryInterface.dropTable('transaksis');
  }
};
