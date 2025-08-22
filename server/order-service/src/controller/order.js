const orderService = require("../services/order.js");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler.js");

const createOrAppendOrder = async (req, res) => {
  const token = req.headers?.authorization?.split(" ")[1];
  const userId = req.headers["x-user-id"];
  const { pizzas } = req.body;
  console.log("---------", req.body);
  console.log(userId);
  let finalResult;
  for (const { pizzaId } of pizzas) {
    finalResult = await orderService.createOrAppendOrder(userId, pizzaId, token);

    if (finalResult.error) {
      return res.status(finalResult.statusCode).json({
        success: false,
        message: finalResult.message,
        details: finalResult.details,
      });
    }
  }
  return successResponse(res, finalResult.statusCode, finalResult.message, {order: finalResult.order, items: finalResult.item});
  
  // const result = await orderService.createOrAppendOrder(
  //   userId,
  //   pizzaId,
  //   token
  // );
  // if (result.error) {
  //   return errorResponse(
  //     res,
  //     result.statusCode,
  //     result.message,
  //     result.details
  //   );
  // }
};

const getAllOrdersByUser = async(req, res) => {
  const userId = req.headers["x-user-id"];
  const token = req.headers.authorization.split(" ")[1];
  const result = await orderService.getAllOrdersByUser(userId, token);
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

const deleteOrder = async(req, res) => {
 const userId = req.headers["x-user-id"];
 const {orderId} = req.body;
 console.log("orderId", orderId);
 

 const result = await orderService.deleteOrder(orderId);
 if(result.error){
  return errorResponse(res, result.statusCode,
    result.message,
    result.details
  )
 }

 return successResponse(res,  result.statusCode, result.message);


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
const getAllOrdersToDeleteUser = async(req, res) => {
    const userId = req.params.id;
    const result = await orderService.getAllOrdersToDeleteUser(userId);
    if (result.error) {
    return errorResponse(
      res,
      result.statusCode,
      result.message,
      result.details
    );
  }
  return successResponse(res,  result.statusCode, result.message, { items: result.orders});
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



module.exports = {getAllOrdersToDeleteUser, createOrAppendOrder, getAllOrdersByUser, getAnOrderByUSer, deleteOrder, removeAnOrderItem, confirmOrder, getAllOrders, updateStatus};
