'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stans', {
      stanID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_stan: {
        type: Sequelize.STRING
      },
      nama_pemilik: {
        type: Sequelize.STRING
      },
      telp: {
        type: Sequelize.STRING
      },
      userID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users", 
          key: "userID"
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
    await queryInterface.dropTable('stans');
  }
};
