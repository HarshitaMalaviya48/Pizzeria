const {getCartByUser, addItem, deleteItem, updateQuantity, removeCartItemCalledByOrderService, getCartItemCalledByOrderService} = require("../services/cart.js");
const { successResponse,
  errorResponse} = require("../utils/responseHandler.js");

const getCart = async (req, res) => {
    console.log("-------------");
    
    const userId = req.headers['x-user-id'];
    const token = req.headers.authorization.split(" ")[1];
    console.log("token in get cart", token);
    
    const result = await getCartByUser(userId, token);

    if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.cart)
}

const addItemInCart = async(req, res) => {
    console.log("in add item cart");
    
    const userId = req.headers['x-user-id'];
    const {pizzaId, quantity} = req.body;
console.log("-----------addItemInCart", pizzaId, quantity);

    const result = await addItem(userId, pizzaId, quantity);

     if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.cart)
}

const deleteItemFromCart = async(req, res) => {
    const userId = req.headers['x-user-id'];
    const itemId = req.params.id;
    console.log("in cart-service", itemId);
    

    const result = await deleteItem(itemId, userId);
    if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.cart)
}

const updateItemQuantity = async(req, res) => {
     const userId = req.headers['x-user-id'];
    const pizzaId = req.params.id;
    const {quantity} = req.body
    console.log("Quantity", quantity);
    

    const result = await updateQuantity(userId, pizzaId, quantity);
     if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.cart)
}

const removeCartItemByUserAndPizza = async(req, res) => {
    const { user_id, pizza_id } = req.params;
    const result = await removeCartItemCalledByOrderService(user_id, pizza_id);
     if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.cart)
}

const getCartItemByUserAndPizza = async(req, res) => {
    const { user_id, pizza_id } = req.params;
    const result = await getCartItemCalledByOrderService(user_id, pizza_id);
    if(result.error){
        return errorResponse(res, result.statusCode, result.message, result.details)
    }
    return successResponse(res, result.statusCode, result.message, result.item)
}
module.exports = {getCart, addItemInCart, deleteItemFromCart, removeCartItemByUserAndPizza, getCartItemByUserAndPizza, updateItemQuantity}