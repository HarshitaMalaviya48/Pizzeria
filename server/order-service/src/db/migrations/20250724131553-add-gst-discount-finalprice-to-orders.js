'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'gst_amount', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.0
    });

    await queryInterface.addColumn('Orders', 'discount_amount', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.0
    });

    await queryInterface.addColumn('Orders', 'final_price', {
      type: Sequelize.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.0,
      comment: 'Total after discount and GST'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'gst_amount');
    await queryInterface.removeColumn('Orders', 'discount_amount');
    await queryInterface.removeColumn('Orders', 'final_price');
  }
};
