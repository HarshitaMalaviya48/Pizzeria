'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      address: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      total_price: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      status: {
        defaultValue: 'Pending Payment',
        type: Sequelize.ENUM('Pending Payment',  'Accepted', 'Prepared', 'Dispatched', 'Delivered'),
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('Orders');
  }
};