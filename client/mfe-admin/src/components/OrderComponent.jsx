import React from "react";
import styles from "../styles/Orders.module.css";
import { showToast } from "host/toast";

function OrderComponent({ orders, token }) {
  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log("updateOrderStatus", orderId, status);

      const res = await fetch(
        `http://localhost:3000/order/admin/update-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ orderId, status }),
        }
      );
      console.log("res", res);

      const result = await res.json();
      if (!res.ok) {
        console.error("Error updating status:", result.message);
      } else if (res.ok) {
        console.log("toast success message on order status updated ");
        showToast(result.message, "success");
      }
    } catch (error) {
      console.error("Network error updating status", error);
    }
  };
  return (
    <>
      {orders.map((order) => {
        const user = order.user.data || {};
        const items = order.items || [];

        return (
          <tr key={order.id}>
            {/* Order ID */}
            <td>#{order.id}</td>

            {/* Customer Info */}
            <td>
              <div className={styles.customerInfo}>
                <h4>{`${user.firstname || ""} ${user.lastname || ""}`}</h4>
                <span>{user.email || "No email"}</span>
                <span>{user.phoneno || "No phone"}</span>
              </div>
            </td>

            {/* Items */}
            <td>
              <div className={styles.orderItems}>
                {items.map((item) => (
                  <span key={item.id}>
                    {item.quantity}x {item.pizza?.pizzaname || "Unknown Pizza"}
                  </span>
                ))}
              </div>
            </td>

            {/* Total */}
            <td>₹{order.final_price || "0.00"}</td>

            {/* Status */}
            <td>
              {console.log("order.status", order.status)}
              <select
                className={styles.statusSelect}
                defaultValue={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              >
                {order.status === "Payment done" && (
                  <option value="Payment done" disabled>
                    Payment Done
                  </option>
                )}

                <option value="Accepted">Accepted</option>
                <option value="Prepared">Prepared</option>
                <option value="Dispatched">On the Way</option>
                <option value="Delivered">Delivered</option>
              </select>
            </td>

            {/* Date */}
            <td>
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              <br />
              {new Date(order.createdAt).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default OrderComponent;
