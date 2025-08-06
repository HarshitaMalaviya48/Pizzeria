"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: true },
      total_price: { type: DataTypes.DECIMAL, allowNull: false },
      status: DataTypes.ENUM(
        "Pending Payment",
        "Accepted",
        "Prepared",
        "Dispatched",
        "Delivered"
      ),
      order_date: { type: DataTypes.DATE, allowNull: true },
      gst_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0,
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0,
      },
      final_price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.0,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );

  Order.associate = function (models) {
    Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "items" });
  };
  return Order;
};
