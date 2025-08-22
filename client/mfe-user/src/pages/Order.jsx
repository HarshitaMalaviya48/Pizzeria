import React, { useState, useEffect, useRef } from "react";
import styles from "../styles/Order.module.css";
import OrderCard from "../components/OrderCard";
import { io } from "socket.io-client";

function Order() {
  // const socket = io("http://localhost:3004");
  const [orders, setOrders] = useState([]);
  const socketRef = useRef(null);
  const token =
    localStorage.getItem("token") ||
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NTU4MzA5MSwiZXhwIjoxNzU1NjExODkxfQ.qwM9VY-LtbT3ADDkfKYIuv0zKu_Yt1a075Q5aTWkOQw";
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

      // const socket = io("http://localhost:3004");

      //   // When orders are fetched, join their rooms
      //   socket.on("connect", () => {
      //       console.log("Socket connected:", socket.id);
      //       orders.forEach(order => {
      //         console.log("111111111111");
      //           socket.emit("joinOrderRoom", order.id);
      //       });
      //   });

      //   // Listen for status updates
      //   socket.on("statusUpdated", ({ orderId, status }) => {
      //       setOrders(prev =>
      //           prev.map(o => o.id === orderId ? { ...o, status } : o)
      //       );
      //   });

     
    } catch (error) {
      console.log("error in fetch orders", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3004");

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
    });

    // Listen for updates
    socketRef.current.on("statusUpdated", ({ orderId, status }) => {
      console.log(`Order ${orderId} updated to ${status}`);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status } : o))
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Join rooms after orders are fetched
  useEffect(() => {
    if (orders.length > 0 && socketRef.current) {
      orders.forEach(order => {
        socketRef.current.emit("joinOrderRoom", order.id);
        console.log(`Joined room order_${order.id}`);
      });
    }
  }, [orders]);

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
        <div className={styles.ordersList}>
          {orders.length > 0 ? (
            <>
              <div className={styles.ordersHeader}>
                <h1>Your Orders</h1>
                <p>Track your pizza orders and payment status</p>
              </div>
              {orders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  formatDate={formatDate}
                  fetchOrders={fetchOrders}
                />
              ))}
            </>
          ) : (
            <h2 className={styles.noOrderBody}>No orders found</h2>
          )}
        </div>
      </div>
    </section>
  );
}

export default Order;
