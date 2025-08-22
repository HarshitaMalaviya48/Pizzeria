import React, { useState, useEffect } from "react";
import styles from "../styles/Order.module.css";

function Order() {
  const [orders, setOrders] = useState([]);
  const token =
    localStorage.getItem("token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDg5NzA5NywiZXhwIjoxNzU0OTI1ODk3fQ.t9jCxhWsLwHls7XBmfNw9omQv5ITE0nr6GECDbUtocs";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/order/user/get-orders",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await response.json();
        console.log("fetch orders", result);

        if (response.ok && result.success) {
          setOrders(result.data.orders || []);
        }
      } catch (error) {
        console.log("error in fetch orders", error);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className={styles.ordersSection}>
      <div className={styles.container}>
        <div className={styles.ordersHeader}>
          <h1>Your Orders</h1>
          <p>Track your pizza orders and payment status</p>
        </div>

        <div className={styles.ordersList}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className={`${styles.orderCard} ${
                  order.status?.toLowerCase() === "delivered"
                    ? styles.completed
                    : ""
                }`}
              >
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Order #{order.order_id}</h3>
                    <p className={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </p>
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
                        <button
                          className={`${styles.btn} ${styles.btnSecondary}`}
                        >
                          <i className="fas fa-star"></i>
                          Rate Order
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                          <i className="fas fa-redo"></i>
                          Reorder
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                          <i className="fas fa-map-marker-alt"></i>
                          Track Order
                        </button>
                        <button className={`${styles.btn} ${styles.btnDanger}`}>
                          <i className="fas fa-trash"></i>
                          Cancel Order
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items?.map((item, idx) => {
                    const { pizza } = item;
                    return (
                      <div key={idx} className={styles.orderItem}>
                        <div className={styles.itemImage}>
                          <img src={pizza.image_url} alt={item.name} />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.name}</h4>
                          <p>Quantity: {item.quantity}</p>
                          {pizza.discount_percent ? (
                            <>
                              <span className={styles.originalPrice}>
                                ₹{pizza.price}
                              </span>
                              <span className={styles.currentPrice}>
                                ₹
                                {(pizza.price *
                                  (100 - pizza.discount_percent)) /
                                  100}
                              </span>
                              <span className={styles.discount}>
                                {pizza.discount_percent}% OFF
                              </span>
                            </>
                          ) : (
                            <span className={styles.currentPrice}>
                              ₹{pizza.price}
                            </span>
                          )}
                        </div>
                        <div className={styles.itemTotal}>
                          <span
                            className={styles.originalPrice}
                            style={{ paddingRight: "5px" }}
                          >
                            ₹{item.quantity * pizza.price}
                          </span>
                          <span className={styles.totalPrice}>
                            ₹
                            {Math.round(
                              (item.quantity *
                                (pizza.price *
                                  (100 - pizza.discount_percent))) /
                                100
                            )}
                          </span>
                        </div>
                        {/* <div className={styles.itemTotal}>
                          <span>₹{item.price * item.quantity}</span>
                        </div> */}
                      </div>
                    );
                  })}
                </div>

                <div className={styles.orderSummary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>
                      ₹
                      {order.items?.reduce(
                        (sum, i) => sum + i.price * i.quantity,
                        0
                      )}
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
                </div>
              </div>
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Order;
