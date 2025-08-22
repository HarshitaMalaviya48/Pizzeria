const axios = require("axios");
require("dotenv").config();
const { Op } = require("sequelize");
// const { io } = require("../../server.js");
const { getIo } = require("../../socket.js");


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
    console.log("before creating order", order);
    

    if (!order) {
      console.log("to create order");
      
      order = await Order.create({
        user_id: userId,
        total_price: 0,
        discount_amount: 0,
        gst_amount: 0,
        final_price: 0,
        status: "Pending Payment",
      });
    }
    // console.log("order------------", order);

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
    }else{
      return {
        error: true,
        statusCode: 409,
        message: `${pizzaFromPizzaCatalog.pizzaname} already exists in order`
      }
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

const getPizzaById = async (pizzaId, token) => {
  try {
    // Assuming your pizza service runs on same server at port 3001
    const response = await axios.get(
      `http://localhost:3000/pizza/get/${pizzaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.data && response.data.pizza) {
      console.log("in ----------", response.data);
      console.log("in ----------", response.data.pizza);

      return response.data.pizza;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch pizza with id ${pizzaId}:`, error.message);
    return null;
  }
};

const getAllOrdersByUser = async (userId, token) => {
  const allOrder = await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, as: "items", required: false }],
    logging: console.log,
    order: [["createdAt", "DESC"]],
  });
  console.log("111111111111111");

  if (!allOrder) {
    return {
      error: false,
      statusCode: 404,
      message: "No order is placed",
    };
  }
  console.log("all orders", allOrder);

  for (const order of allOrder) {
    for (const item of order.items) {
      const pizzaDetails = await getPizzaById(item.pizza_id, token);
      item.dataValues.pizza = pizzaDetails; // attach pizza data inside item
    }
  }

  return {
    error: false,
    statusCode: 200,
    orders: allOrder,
  };
};
const getAllOrdersToDeleteUser = async (userId) => {
  console.log("userId", userId);
  
  const allOrder = await Order.findAll({
    where: { user_id: userId },
    order: [["createdAt", "DESC"]],
  });
  console.log("111111111111111");

  if (!allOrder) {
    return {
      error: false,
      statusCode: 404,
      message: "No order is placed",
    };
  }
  console.log("all orders", allOrder);

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
          [Op.in]: [
            "Payment Done",
            "Accepted",
            "Prepared",
            "Dispatched",
            "Delivered",
          ],
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

    //  const enrichedOrders = await Promise.allSettled(
    //   allOrdersObj.map(async (order) => {
    //     // Get user info
    //     const userResponse = await axios.get(
    //       `${process.env.AUTH_SERVICE}/get-user/${order.user_id}`
    //     );
    //     const userData = userResponse?.data || null;
    //     console.log("userData",userData);
        

    //     // Get pizza info for each order item
    //     const itemsWithPizza = await Promise.allSettled(
          
    //       order.items.map(async (item) => {
    //         console.log("order items", item.pizza_id);
    //         const pizzaResponse = await axios.get(
    //           `${process.env.PIZZA_CATALOG}/get/${item.pizza_id}`
    //         );
    //         console.log("pizza response", pizzaResponse);
    //         const pizzaData = pizzaResponse.data?.pizza || null;
    //         console.log("pizza", pizzaData);
            
    //         return {
    //           ...item,
    //           pizza: pizzaData,
    //         };
    //       })
    //     );

    //     return {
    //       ...order,
    //       user: userData,
    //        items: itemsWithPizza,
          
    //     };
    //   })
    // );
      const enrichedOrders = await Promise.all(
      allOrdersObj.map(async (order) => {
        // ---- user ----
        let userData = null;
        try {
          const userResponse = await axios.get(
            `${process.env.AUTH_SERVICE}/get-user/${order.user_id}`
          );
          userData = userResponse?.data || null;
        } catch (err) {
          userData = { firstname: "Unknown", lastname: "", email: "N/A" }; // fallback
        }

        // ---- items ----
        const itemsWithPizza = await Promise.all(
          order.items.map(async (item) => {
            try {
              const pizzaResponse = await axios.get(
                `${process.env.PIZZA_CATALOG}/get/${item.pizza_id}`
              );
              const pizzaData = pizzaResponse.data?.pizza || null;
              return { ...item, pizza: pizzaData };
            } catch (err) {
              return { ...item, pizza: { pizzaname: "Unknown Pizza" } }; // fallback
            }
          })
        );

        return {
          ...order,
          user: userData,
          items: itemsWithPizza,
        };
      })
    );
    
    return {
      error: false,
      statusCode: 200,
      message: "Got all orders",
      order: enrichedOrders,
    };
  } catch (error) {
    console.log("in order-service ", error.message);
    return {
      error: true,
      statusCode: 500,
      message: "server error",
      details: error.message,
    };
  }
};



const deleteOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    await order.destroy();

    return {
      error: false,
      statusCode: 200,
      message: "Order deleted successfully",
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
  console.log("update statuys called", orderId);
  

  
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

  const io = getIo();
  console.log("io in updateStatus service", io);
  
  io.to(`order_${orderId}`).emit("statusUpdated", { orderId, status });
  return {
    error: false,
    statusCode: 200,
    message: "Status updated successfully",
  };
};

module.exports = {
  createOrAppendOrder: createOrAppendOrder,
  getAllOrdersByUser,
  deleteOrder,
  getAnOrderByUSer,
  removeAnOrderItem,
  confirmOrder,
  getAllOrders,
  updateStatus,
  getAllOrdersToDeleteUser
};
