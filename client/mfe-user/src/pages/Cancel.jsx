import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Cancel.module.css";

function Cancel() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Payment Failed ❌</h1>
        <p className={styles.message}>
          Oops! Something went wrong. Please try again or choose another payment method.
        </p>
        <button onClick={() => navigate("/user/home")} className={styles.button}>
          Back to Shopping
        </button>
      </div>
    </div>
  );
}

export default Cancel;
