import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Success.module.css";

function Success() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Payment Successful 🎉</h1>
        <p className={styles.message}>
          Thank you for your purchase! Your order has been placed successfully.
        </p>
        <button onClick={() => navigate("/user/home")} className={styles.button}>
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default Success;
