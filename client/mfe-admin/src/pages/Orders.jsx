import React, { useEffect, useState } from "react";
import styles from "../styles/Orders.module.css";
import OrderComponent from "../components/OrderComponent.jsx";
import { io } from "socket.io-client";

function Orders() {
  const token =
    localStorage.getItem("token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4xMjMiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1NTgyMDIwLCJleHAiOjE3NTU2MTA4MjB9.nIQ8zjQhjsrczFHVDWRN_fXE83Bfw-BbcMkR7yIPaSo";
    
    const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/order/admin/get-all-orders",
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("response ", response);
        const result = await response.json();
        console.log("result", result);
        if (response.ok && result.success) {
          setOrders(result.data.orders);
        }
      } catch (error) {
        console.log("error while fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length === 0) return;

    const socket = io("http://localhost:3004");

    socket.on("connect", () => {
      console.log("Admin connected:", socket.id);
    });

    // Join rooms immediately after fetching orders
    if (orders.length > 0) {
      orders.forEach((order) => {
        console.log("11111111111");
        
        socket.emit("joinOrderRoom", order.id);
      });
    }
    socket.on("statusUpdated", ({ orderId, status }) => {
      console.log(`Order ${orderId} updated to ${status}`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [orders]);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => {
          console.log(
            order.status.toLowerCase(),
            statusFilter.toLowerCase(),
            order.status.toLowerCase() === statusFilter.toLowerCase()
          );
          return order.status.toLowerCase() === statusFilter.toLowerCase();
        });

  console.log("filteredOrders", filteredOrders);

  return (
    <>
      <section className={styles.ordersSection}>
        <div className={styles.container}>
          <div className={styles.ordersHeader}>
            <h1>Manage Orders</h1>
            <p>View and update order status</p>
          </div>

          {/* Search and Filter */}
          <div className={styles.ordersControls}>
            {/* <div className={styles.searchBox}>
              <input
                type="text"
                id="searchOrders"
                placeholder="Search orders by ID, customer name, or email..."
              />
              <i className="fas fa-search"></i>
            </div> */}
            <div className={styles.filterControls}>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="accepted">Accepted</option>
                <option value="Prepared">Prepared</option>
                <option value="on-the-way">On the Way</option>
                <option value="delivered">Delivered</option>
              </select>
              {/* <button
                className={styles.btnPrimary}
                onClick={() => setStatusFilter("all")}
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button> */}
            </div>
          </div>

          {/* Orders Table */}
          <div className={styles.ordersTableContainer}>
            <table className={styles.ordersTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody id="ordersTableBody">
                {filteredOrders.length > 0 ? (
                  <OrderComponent orders={filteredOrders} token={token} />
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      <h3>No Orders</h3>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {/* <div className={styles.pagination}>
            <button className={styles.btnSecondary} disabled>
                <i className="fas fa-chevron-left"></i>
                Previous
            </button>
            <div className={styles.pageNumbers}>
                <span className={styles.pageNumberActive}>1</span>
                <span className={styles.pageNumber}>2</span>
                <span className={styles.pageNumber}>3</span>
                <span className={styles.pageDots}>...</span>
                <span className={styles.pageNumber}>8</span>
            </div>
            <button className={styles.btnSecondary}>
                Next
                <i className="fas fa-chevron-right"></i>
            </button>
        </div> */}
        </div>
      </section>
    </>
  );
}

export default Orders;
