const express = require("express");
require("dotenv").config();
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const {
  createOrAppendOrder,
  getAllOrdersByUser,
  deleteOrder,
  getAnOrderByUSer,
  removeAnOrderItem,
  confirmOrder,
  getAllOrders,
  updateStatus,
  getAllOrdersToDeleteUser
} = require("../controller/order.js");

router.post("/create-order", createOrAppendOrder);
router.get("/get-orders", getAllOrdersByUser);
router.get("/get-orders-to-delete-user/:id", getAllOrdersToDeleteUser);
router.delete("/delete-order", deleteOrder)
router.get("/get-orderItem", getAnOrderByUSer);
router.delete("/remove-orderItem", removeAnOrderItem);
router.post("/confirm-order", confirmOrder);

router.get("/get-all-orders", getAllOrders);
router.put("/update-status", updateStatus);

router.post("/create-checkout-session", async (req, res) => {
  const { products } = req.body;
  console.log("order id", products.id);
  const lineItems = buildLineItems(products.items);
  console.log("lineItems", lineItems);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:5000/user/success",
    cancel_url: "http://localhost:5000/user/cancel",
    client_reference_id: products.id,
    metadata: {
      orderId: products.id, // or any identifier you want
    },
  });

  console.log("session", session);

  res.json({ id: session.id });
});

const GST_RATE = 0.05; // Example: 5% GST

const buildLineItems = (items) => {
  const lineItems = items.map((item) => {
    const priceWithoutDiscount = parseFloat(item.pizza.price);
    const discountPercent = parseFloat(item.pizza.discount_percent) || 0;

    // Apply discount if available
    const discountedPrice =
      discountPercent > 0
        ? priceWithoutDiscount * (1 - discountPercent / 100)
        : priceWithoutDiscount;
    console.log("discountedPrice", discountedPrice);

    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.pizza.pizzaname,
          images: item.pizza.image_url ? [item.pizza.image_url] : [],
        },
        unit_amount: Math.round(discountedPrice * 100), // paise
      },
      quantity: item.quantity,
    };
  });

  // Calculate GST total from discounted prices
  console.log(lineItems);

  const totalWithoutGST = lineItems.reduce((sum, li) => {
    return sum + li.price_data.unit_amount * li.quantity;
  }, 0);
  console.log("totalWithoutGST", totalWithoutGST);

  const gstAmount = Math.round(totalWithoutGST * GST_RATE);
  console.log("gst amount", gstAmount);

  // Add GST as separate line item
  lineItems.push({
    price_data: {
      currency: "inr",
      product_data: {
        name: "GST",
      },
      unit_amount: gstAmount, // paise
    },
    quantity: 1,
  });

  return lineItems;
};

// const buildLineItems = (items) => {
//   return items.map(item => {
//     const finalPrice = item.pizza.discount_percent
//       ? Math.round(item.pizza.price * (100 - item.pizza.discount_percent) / 100)
//       : item.pizza.price;

//     return {
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.pizza.pizzaname,
//           images: item.pizza.image_url ? [item.pizza.image_url] : [],
//         },
//         unit_amount: finalPrice * 100, // Stripe needs price in paise
//       },
//       quantity: item.quantity,
//     };
//   });
// };

module.exports = router;
