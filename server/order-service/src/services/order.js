const axios = require("axios");
require("dotenv").config();
const { Op } = require("sequelize");

const db = require("../db/models/index.js");
const { Order, OrderItem } = db;
const createOrAppendOrder = async (userId, pizzaId, token) => {
  try {
    let pizzaFromCart;
    try {
     const pizzaResponse = await axios.get(
        `http://localhost:3003/user/${userId}/pizza/${pizzaId}`

      );
      console.log("-----------pizzaFromCart", pizzaResponse);
      pizzaFromCart = pizzaResponse.data.data;
      console.log("-----------pizzaFromCart", pizzaFromCart);
      

    } catch (error) {
      console.log("in order-service ", error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message;
      return {
        error: true,
        statusCode: status || 500,
        message: message || "error from cart-service",
        details: error.message,
      };
    }
    let pizzaFromPizzaCatalog;
    try {
      const pizzaResponse = await axios.get(
        `http://localhost:3000/pizza/get/${pizzaId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      pizzaFromPizzaCatalog = pizzaResponse.data.pizza;

      console.log("----------pizzaFromPizzaCatalog", pizzaFromPizzaCatalog);
    } catch (error) {
      console.log("in order-service ", error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message;
      return {
        error: true,
        statusCode: status || 500,
        message: message || "error from Pizzacatalog",
        details: error.message,
      };
    }

    let order = await Order.findOne({
      where: { user_id: userId, status: "Pending Payment" },
    });

    if (!order) {
      order = await Order.create({
        user_id: userId,
        total_price: 0,
        discount_amount: 0,
        gst_amount: 0,
        final_price: 0,
        status: "Pending Payment",
      });
    }
    console.log("order------------", order);

    let item = await OrderItem.findOne({
      where: {
        order_id: order.id,
        pizza_id: pizzaId,
      },
    });

    if (!item) {
      item = await OrderItem.create({
        order_id: order.id,
        pizza_id: pizzaId,
        price: pizzaFromPizzaCatalog.price,
        quantity: pizzaFromCart.quantity,
      });
    }

    const allItems = await OrderItem.findAll({ where: { order_id: order.id } });
    let subtotal = 0;
    let totalDiscount = 0;

    for (const i of allItems) {
      const { data } = await axios.get(
        `${process.env.PIZZA_CATALOG}/get/${i.pizza_id}`
      );
      const pizza = data.pizza;
      const price = Number(i.price);
      const qty = i.quantity;
      const discountPercent = Number(pizza?.discount_percent || 0);

      const itemTotal = price * qty;
      const discountAmount = (discountPercent / 100) * itemTotal;

      subtotal += itemTotal;
      totalDiscount += discountAmount;
    }

    const afterDiscount = subtotal - totalDiscount;
    const gstAmount = afterDiscount * 0.05; // 5% GST
    const finalAmount = afterDiscount + gstAmount;

    order.total_price = subtotal;
    order.discount_amount = totalDiscount;
    order.gst_amount = gstAmount;
    order.final_price = finalAmount;

    await order.save();

    // const allItems = await OrderItem.findAll({ where: { order_id: order.id } });
    // const newTotal = allItems.reduce(
    //   (sum, i) => sum + Number(i.price) * i.quantity,
    //   0
    // );
    // order.total_price = newTotal;
    // await order.save();

    try {
      await axios.delete(
        `${process.env.CART_SERVICE}/user/${userId}/pizza/${pizzaId}`
      );
    } catch (error) {
      //   console.log("in order-service ", error);
      const status = error.response?.status || 500;
      const message = error.response?.data?.message;
      return {
        error: true,
        statusCode: status || 500,
        message: message || "error from cart-service",
        details: error.message,
      };
    }

    return {
      error: false,
      statusCode: 200,
      message: "item added into order database",
      order,
      item,
    };
  } catch (error) {
    console.log("in order-service ", error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const getAllOrdersByUser = async (userId) => {
  const allOrder = await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, as: "items" }],
  });

  if (!allOrder) {
    return {
      error: false,
      statusCode: 404,
      message: "No order is placed",
    };
  }

  return {
    error: false,
    statusCode: 200,
    orders: allOrder,
  };
};

const getAnOrderByUSer = async (userId) => {
  try {
    const order = await Order.findOne({ where: { user_id: userId } });
    console.log("--------------", userId);

    if (!order) {
      return {
        error: true,
        statusCode: 404,
        message: "Order not found",
      };
    }
    // const orderObj = order.toJSON();
    // console.log("----------------order", orderObj);
    // console.log("----------------order", orderObj.id);

    const orderItem = await OrderItem.findAll({
      where: {
        order_id: order.id,
      },
    });

    if (!orderItem) {
      return {
        error: true,
        statusCode: 404,
        message: "Order Item not found",
      };
    }
    const ordersWithPizza = await Promise.all(
      orderItem.map(async (order) => {
        const orderObj = order.toJSON();
        console.log(orderObj);
        try {
          const { data } = await axios.get(
            `${process.env.PIZZA_CATALOG}/get/${orderObj.pizza_id}`
          );
          return {
            ...orderObj,
            pizza: data.pizza,
          };
        } catch (e) {
          return {
            ...orderObj,
            pizza: null,
            pizzaError: e.message,
          };
        }
      })
    );
    return {
      error: false,
      statusCode: 200,
      message: "get order Item",
      orderItem: ordersWithPizza,
    };
  } catch (error) {
    console.log("in order-service ", error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const removeAnOrderItem = async (userId, orderId, pizzaId, token) => {
  try {
    const order = await Order.findOne({
      where: { id: orderId, user_id: userId },
    });

    if (!order) {
      return {
        error: true,
        statusCode: 404,
        message: "Order not found",
      };
    }

    const item = await OrderItem.findOne({
      where: { order_id: orderId, pizza_id: pizzaId },
    });

    if (!item) {
      return {
        error: true,
        statusCode: 404,
        message: "Order Item not found",
      };
    }

    await item.destroy();

    const remainingItems = await OrderItem.findAll({
      where: { order_id: orderId },
    });

    let subtotal = 0;
    let totalDiscount = 0;

    for (const i of remainingItems) {
      const { data } = await axios.get(
        `${process.env.PIZZA_CATALOG}/get/${i.pizza_id}`
      );
      const pizza = data.pizza;
      const price = Number(i.price);
      const qty = i.quantity;
      const discountPercent = Number(pizza?.discount_percent || 0);

      const itemTotal = price * qty;
      const discountAmount = (discountPercent / 100) * itemTotal;

      subtotal += itemTotal;
      totalDiscount += discountAmount;
    }

    const afterDiscount = subtotal - totalDiscount;
    const gstAmount = afterDiscount * 0.05;
    const finalAmount = afterDiscount + gstAmount;

    order.total_price = subtotal;
    order.discount_amount = totalDiscount;
    order.gst_amount = gstAmount;
    order.final_price = finalAmount;

    await order.save();

    try {
      await axios.post(
        `http://localhost:3000/cart/add-item`,
        {
          pizzaId: pizzaId,
          quantity: item.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log("-----------internal http call", error);

      return {
        error: true,
        statusCode: error.response?.status || 500,
        message:
          error.response?.data?.message || "Error adding item back to cart",
        details: error.message,
      };
    }

    return {
      error: false,
      statusCode: 200,
      message: "Item removed from order and added back to cart",
      updatedOrder: order,
    };
  } catch (error) {
    console.log("in order-service ", error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const confirmOrder = async (userId, orderId, address) => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order || order.status !== "Pending Payment") {
      return {
        error: true,
        statusCode: 404,
        message: "Order is not fount or not in valid state",
      };
    }
    if (!address) {
      return {
        error: true,
        statusCode: 400,
        message: "Address is mandatory",
      };
    }

    order.address = address;
    order.status = "Accepted";
    order.order_date = new Date();
    await order.save();

    return {
      error: false,
      statusCode: 200,
      message: "Payment done successfully",
    };
  } catch (error) {
    console.log("in order-service ", error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const getAllOrders = async () => {
  try {
    const allOrders = await Order.findAll({
      where: {
        status: {
          [Op.in]: ["Accepted", "Prepared", "Delivered"],
        },
      },
      include: [{ model: OrderItem, as: "items" }],
      order: [["createdAt", "DESC"]],
    });
    console.log("---------------allOrders", allOrders);
    if (!allOrders) {
      return {
        error: false,
        statusCode: 404,
        message: "No order is placed",
        order: allOrders,
      };
    }
    const allOrdersObj = allOrders.map((order) => {
      return order.toJSON();
    });
    return {
      error: false,
      statusCode: 200,
      message: "Got all orders",
      order: allOrdersObj,
    };
  } catch (error) {
    console.log("in order-service ", error);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};

const updateStatus = async (orderId, status) => {
  console.log("-------------orderid", orderId);
  console.log("-------------status", status);

  const order = await Order.findOne({ where: { id: orderId } });

  if (!order) {
    return {
      error: true,
      statusCode: 404,
      message: "Order is not found",
      order,
    };
  }

  order.status = status;
  await order.save();
  return {
    error: false,
    statusCode: 200,
    message: "Status updated successfully",
  };
};

module.exports = {
  createOrAppendOrder: createOrAppendOrder,
  getAllOrdersByUser,
  getAnOrderByUSer,
  removeAnOrderItem,
  confirmOrder,
  getAllOrders,
  updateStatus,
};
