const axios = require("axios");
require("dotenv").config();

const db = require("../db/models/index.js");
const { Cart, CartItem } = db;

const getCartByUser = async (userId, token) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: userId },
      include: [{ model: CartItem, as: "items" }],
    });

    if (!cart) {
      return {
        error: true,
        statusCode: 404,
        message: "Cart not found for this user",
        details: null,
      };
    }

    const cartObj = cart.toJSON();

    const newCartItems = await Promise.all(
      cartObj.items.map(async (cartItem) => {
        try {
          const { data } = await axios.get(
            `${process.env.PIZZA_CATALOG}/get/${cartItem.pizza_id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          return {
            ...cartItem,
            pizza: {...data.pizza, quantity: cartItem.quantity},
          };
        } catch (e) {
          return {
            ...cartItem,
            pizza: null,
            pizzaError: e.message,
          };
        }
      })
    );

    cartObj.items = newCartItems;

    return {
      error: false,
      statusCode: 200,
      message: "cart fetched successfully",
      cart: cartObj,
    };
  } catch (error) {
    console.log("in cart service ", error.message);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const addItem = async (userId, pizzaId, quantity) => {
  try {
    console.log("--------addItem", userId, pizzaId, quantity);
    
    if (!pizzaId || quantity <= 0) {
      return {
        status: "error",
        statusCode: 400,
        message: "Invalid pizza ID or quantity",
        error: "Validation error",
      };
    }
    let cart = await Cart.findOne({ where: { user_id: userId } });

    if (!cart) {
      cart = await Cart.create({ user_id: userId });
    }

    const result = await CartItem.create({
      cart_id: cart.id,
      pizza_id: pizzaId,
      quantity,
    });

    return {
      error: false,
      statusCode: 200,
      message: "cart item added successfully",
      result,
    };
  } catch (error) {
    console.log("in cart service ", error.message);
    console.log("in cart service ", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return {
        error: true,
        statusCode: 409,
        message: "Item already exists in cart",
        details: error.message,
      };
    }
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const deleteItem = async (itemId, userId) => {
  try {
    const item = await CartItem.findByPk(itemId, {
      include: { model: Cart, as: "cart" },
    });

    if (!item || item.cart.user_id != userId) {
      return {
        error: true,
        statusCode: 404,
        message: "Item not found or unauthorized",
        error: "Not authorized",
      };
    }

    await item.destroy();

    return {
      error: false,
      statusCode: 200,
      message: "item deleted successfully",
    };
  } catch (error) {
    console.log("in cart-service", error);

    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const removeCartItemCalledByOrderService = async (user_id, pizza_id) => {
  try {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      return {
        error: true,
        statusCode: 404,
        message: "Cart not found",
      };
    }

    const item = await CartItem.findOne({
      where: { cart_id: cart.id, pizza_id },
    });

    if (!item) {
      return {
        error: true,
        statusCode: 404,
        message: "Cart item not found",
      };
    }
    await item.destroy();

    return {
      error: false,
      statusCode: 200,
      message: "Item deleted successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const getCartItemCalledByOrderService = async(user_id, pizza_id) => {
  try {
    const cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      return {
        error: true,
        statusCode: 404,
        message: "Cart not found",
      };
    }

    const item = await CartItem.findOne({
      where: { cart_id: cart.id, pizza_id },
    });

    if (!item) {
      return {
        error: true,
        statusCode: 404,
        message: "Cart item not found",
      };
    }

    return {
      error: false,
      statusCode: 200,
      message: "Item found",
      item
    }


  }catch(error){
     return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
}

module.exports = {
  getCartByUser,
  addItem,
  deleteItem,
  removeCartItemCalledByOrderService,
  getCartItemCalledByOrderService
};
