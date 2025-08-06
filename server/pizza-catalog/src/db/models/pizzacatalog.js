"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PizzaCatalog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PizzaCatalog.init(
    {
      pizzaname: { type: DataTypes.STRING, allowNull: false },
      ingredients: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.DECIMAL, allowNull: false },
      discount_percent: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.0,
      },
      image_url: { type: DataTypes.STRING, allowNull: false },
      category: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "PizzaCatalog",
    }
  );
  return PizzaCatalog;
};
