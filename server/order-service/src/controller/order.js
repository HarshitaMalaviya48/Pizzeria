const orderService = require("../services/order.js");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler.js");

const createOrAppendOrder = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const userId = req.headers["x-user-id"];
  const { pizzaId } = req.body;
  console.log("---------", req.body);
  console.log(userId);
  
  
  const result = await orderService.createOrAppendOrder(
    userId,
    pizzaId,
    token
  );
  if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res, result.statusCode, result.message, {order: result.order, items: result.item});
};

const getAllOrdersByUser = async(req, res) => {
  const userId = req.headers["x-user-id"];
  const result = await orderService.getAllOrdersByUser(userId);
   if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details 
    );
  }
  return successResponse(res,  result.statusCode, result.message, { orders: result.orders});
}

const getAnOrderByUSer = async(req, res) => {
    const userId = req.headers["x-user-id"];
    const result = await orderService.getAnOrderByUSer(userId);
    if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, { items: result.orderItem});
}

const removeAnOrderItem = async(req, res) => {
  const userId = req.headers["x-user-id"];
  const token = req.headers?.authorization?.split(" ")[1];
  const {orderId, pizzaId} = req.body;
  
  const result = await orderService.removeAnOrderItem(userId, orderId, pizzaId, token);
  if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, { items: result.updatedOrder});
}

const confirmOrder = async(req, res) => {
  const userId = req.headers["x-user-id"];
  const {address, orderId} = req.body;
  const result = await orderService.confirmOrder(userId, orderId, address);
  if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, { items: result.orderItem});

}

const getAllOrders = async(req, res) => {
  const result = await orderService.getAllOrders();
  if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, { orders: result.order});
}

const updateStatus = async(req, res) => {
  const {orderId, status} = req.body;
  console.log("------------body", req.body);
  
  const result = await orderService.updateStatus(orderId, status);
   if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, {order: result.order});
}

module.exports = { createOrAppendOrder, getAllOrdersByUser, getAnOrderByUSer, removeAnOrderItem, confirmOrder, getAllOrders, updateStatus};
