"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "address", {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    ;
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "address");
  },
};
