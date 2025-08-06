'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart.init({
    user_id: {type: DataTypes.INTEGER, 
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });

  Cart.associate = function(models){
    Cart.hasMany(models.CartItem, {
      foreignKey: "cart_id",
      as: 'items',                // Alias for association
      onDelete: 'CASCADE'

    })
  }
  return Cart;
};