import React, { useState } from "react";
import styles from "../styles/Order.module.css";
import { loadStripe } from "@stripe/stripe-js";
import TrackOrder from "./TrackOrder";
import { showToast } from "host/toast";

const OrderCard = ({ order, formatDate, fetchOrders }) => {
  console.log("ordeer", order);
  
  const token =
    localStorage.getItem("token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDk3ODU3NywiZXhwIjoxNzU1MDA3Mzc3fQ.t6jlfEarYGLdebS9Q6sWE4keE7_o2bUCIfvyWrxwvf8";

  const [showTracker, setShowTracker] = useState(false);
  const makePayment = async (order) => {
    console.log(import.meta.env.VITE_PAYMENT_SECRET_KEY);
    console.log(order);

    const stripe = await loadStripe(import.meta.env.VITE_PAYMENT_SECRET_KEY);

    const response = await fetch(
      "http://localhost:3000/order/user/create-checkout-session",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: order }),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  const handleCancelOrderBtn = async (orderId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete order?");
      if (!confirmed) return;
      console.log("orderId", orderId);

      const response = await fetch(
        "http://localhost:3000/order/user/delete-order",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderId }),
        }
      );

      console.log("resp[onse", response);
      const result = await response.json();
      console.log("resp[result", result);
      if (response.ok && result.success) {
        fetchOrders();
        showToast(result.message, "info");
      } else {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.error("error in order page", error);
      showToast("Error deleting order ", "error");
    }
  };
  return (
    <>
    
      <div
        className={`${styles.orderCard} ${
          order.status?.toLowerCase() === "delivered" ? styles.completed : ""
        }`}
      >
        {showTracker && (
          <TrackOrder
            setShowTracker={setShowTracker}
            currentStatus={order.status}
          />
        )}
        <div className={styles.orderHeader}>
          <div className={styles.orderInfo}>
            <h3>Order #{order.order_id || order.id}</h3>
            <p className={styles.orderDate}>{formatDate(order.createdAt)}</p>
            <span
              className={`${styles.orderStatus} ${
                order.status?.toLowerCase() === "delivered"
                  ? styles.delivered
                  : styles.preparing
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className={styles.orderActions}>
            {order.status?.toLowerCase() === "delivered" ? (
              <>
                <button className={`${styles.btn} ${styles.btnSecondary}`}>
                  <i className="fas fa-star"></i> Rate Order
                </button>
                <button className={`${styles.btn} ${styles.btnPrimary}`}>
                  <i className="fas fa-redo"></i> Reorder
                </button>
              </>
            ) : (
              <>
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => {
                    console.log("show tracker", showTracker);
                    setShowTracker(true);
                    console.log("show tracker", showTracker);
                  }}
                >
                  <i className="fas fa-map-marker-alt"></i> Track Order
                </button>
                {/* {order.status?.toLowerCase()}
                {console.log("6666666666",order.status?.toLowerCase() === "pending paymnet") */}
                {/* } */}
                {order.status?.toLowerCase() === "pending payment" && (
                  <button
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={() => handleCancelOrderBtn(order.id)}
                  >
                    <i className="fas fa-trash"></i> Cancel Order
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className={styles.orderItems}>
          {order.items?.map((item, idx) => {
            const { pizza } = item;
            if (!pizza) return null; // safeguard if pizza info missing

            // Calculate discounted price if discount_percent exists
            const discountedPrice = pizza.discount_percent > 0
              ? Math.round((pizza.price * (100 - pizza.discount_percent)) / 100)
              : pizza.price;

            return (
              <div key={idx} className={styles.orderItem}>
                <div className={styles.itemImage}>
                  <img src={pizza.image_url} alt={pizza.name} />
                </div>
                <div className={styles.itemDetails}>
                  <h4>{pizza.pizzaname}</h4>
                  <p>Quantity: {item.quantity}</p>
                  {pizza.discount_percent > 0 ? (
                    <>
                      <span className={styles.originalPrice}>
                        ₹{pizza.price}
                      </span>
                      <span className={styles.currentPrice}>
                        ₹{discountedPrice}
                      </span>
                      <span className={styles.discount}>
                        {pizza.discount_percent}% OFF
                      </span>
                    </>
                  ) : (
                    <span className={styles.currentPrice}>₹{pizza.price}</span>
                  )}
                </div>
                <div className={styles.itemTotal}>
                  {pizza.discount_percent > 0 && (
                    <span
                      className={styles.originalPrice}
                      style={{ paddingRight: "5px" }}
                    >
                      ₹{item.quantity * pizza.price}
                    </span>
                  )}

                  <span className={styles.totalPrice}>
                    ₹{item.quantity * discountedPrice}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.orderSummary}>
          <div className={styles.summaryRow}>
            <span>Subtotal:</span>
            <span>
              ₹{order.items?.reduce((sum, i) => sum + i.price * i.quantity, 0)}
            </span>
          </div>
          <div className={styles.summaryRow}>
            <span>GST (5%):</span>
            <span>₹{order.gst_amount}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Discount:</span>
            <span>₹{order.discount_amount}</span>
          </div>
          <div className={`${styles.summaryRow} ${styles.total}`}>
            <span>Total:</span>
            <span>₹{order.final_price}</span>
          </div>
          {order.status === "Pending Payment" ? (
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => makePayment(order)}
            >
              Payment ₹{order.final_price}
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default OrderCard;
