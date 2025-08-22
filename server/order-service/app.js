const express = require("express");
const app = express();
const orderService = require("./src/services/order.js");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderRoutes = require("./src/routes/order.js");

app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.client_reference_id;
      await orderService.updateStatus(orderId, 'payment done');
      console.log(`Order ${orderId} status updated from checkout.session.completed`);
    } 
    else if (event.type === 'charge.updated') {
      const charge = event.data.object;
      if (charge.paid && charge.status === 'succeeded') {
        const paymentIntent = await stripe.paymentIntents.retrieve(charge.payment_intent);
        const orderId = paymentIntent.metadata.orderId;
        if (orderId) {
          await orderService.updateStatus(orderId, 'payment done');
          console.log(`Order ${orderId} status updated from charge.updated`);
        }
      }
    }
  } catch (error) {
    console.error('Error updating order status:', error);
  }

  res.json({ received: true });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", orderRoutes);

module.exports = app;
