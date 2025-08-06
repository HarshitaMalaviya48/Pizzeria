'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItem.init({
    order_id: {type: DataTypes.INTEGER, allowNull: false},
    pizza_id: {type: DataTypes.INTEGER, allowNull: false},
    price: {type: DataTypes.DECIMAL, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false}
  }, {
    sequelize,
    modelName: 'OrderItem',
  });

  OrderItem.associate = function(models){
    OrderItem.belongsTo(models.Order, {foreignKey: 'order_id', as: 'order'});
  }
  return OrderItem;
};