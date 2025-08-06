const express = require("express");
const router = express.Router();

const {createOrAppendOrder,getAllOrdersByUser, getAnOrderByUSer, removeAnOrderItem, confirmOrder, getAllOrders, updateStatus} = require("../controller/order.js");

router.post("/create-order", createOrAppendOrder);
router.get("/get-orders", getAllOrdersByUser)
router.get("/get-orderItem", getAnOrderByUSer);
router.delete("/remove-orderItem", removeAnOrderItem);
router.post("/confirm-order", confirmOrder);

router.get("/get-all-orders", getAllOrders);
router.put("/update-status", updateStatus);

module.exports = router;