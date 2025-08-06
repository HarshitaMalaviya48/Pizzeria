'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
     await queryInterface.addColumn('PizzaCatalogs', 'discount_percent', {
      type: Sequelize.DECIMAL,
      allowNull: false,
      defaultValue: 0.0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('PizzaCatalogs', 'discount_percent');
  }
};
