'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('menu_diskons', {
      menudiskonID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      menuID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "menus",
          key: "menuID"
        }
      },
      diskonID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "diskons",
          key: "diskonID"
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
    await queryInterface.dropTable('menu_diskons');
  }
};