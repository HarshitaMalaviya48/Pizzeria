'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CartItem.init({
    cart_id: {type: DataTypes.INTEGER, allowNull: false},
    pizza_id: {type: DataTypes.INTEGER, allowNull: false},
    quantity: {type: DataTypes.INTEGER, allowNull: false}
  }, {
    sequelize,
    modelName: 'CartItem',
  });

  CartItem.associate = function(models){
    CartItem.belongsTo(models.Cart, {
      foreignKey: "cart_id",
      as: "cart"
    })
  }

  return CartItem;
};