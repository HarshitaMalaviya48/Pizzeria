const express = require("express");
const router = express.Router();

const {getCart, addItemInCart, deleteItemFromCart, removeCartItemByUserAndPizza, getCartItemByUserAndPizza, updateItemQuantity} = require("../controller/cart.js")

router.get("/get-cart", getCart);
router.post("/add-item", addItemInCart);
router.delete("/delete-item/:id", deleteItemFromCart);
router.patch("/update-item-quantity/:id", updateItemQuantity)

//used by order-service
router.delete("/user/:user_id/pizza/:pizza_id", removeCartItemByUserAndPizza);
router.get("/user/:user_id/pizza/:pizza_id", getCartItemByUserAndPizza);

module.exports = router;