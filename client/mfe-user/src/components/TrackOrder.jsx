import React from "react";
import styles from "../styles/Order.module.css";


function TrackOrder({ setShowTracker, currentStatus }) {
    console.log("current status", currentStatus);
    
  const steps = [
    { title: "Pending Payment", description: "Payment Pending", icon: "fas fa-clock" },
    { title: "Payment Done", description: "Payment Done", icon: "fas fa-check" },
    { title: "Accepted", description: "Your order has been confirmed", icon: "fas fa-check" },
    { title: "Prepared", description: "Your pizza is being prepared", icon: "fas fa-utensils" },
    { title: "Dispatched", description: "Your order is being delivered", icon: "fas fa-motorcycle" },
    { title: "Delivered", description: "Order completed", icon: "fas fa-home" }
  ];

 const currentStatusIndex = steps.findIndex(
  (step) => step.title.toLowerCase() === currentStatus.toLowerCase()
);
console.log("currentStatusIndex", currentStatusIndex);

  return (
    <div className={styles.orderTracking} id="orderTracking">

      <div className={styles.trackingStages}>
        {steps.map((step, index) => {
          let stepClass;

          if (index <= currentStatusIndex) {
            stepClass = `${styles.stage} ${styles.completed}`;
          } else if (index === currentStatusIndex + 1) {
            stepClass = `${styles.stage} ${styles.active}`;
          }else{
            stepClass = `${styles.stage}`;
          }

          return (
            <div key={index} className={stepClass}>
              <div className={styles.stageIcon}>
                <i className={step.icon}></i>
              </div>
              <div className={styles.stageInfo}>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className={`${styles.btn} ${styles.btnSecondary}`}
        onClick={() => setShowTracker(false)}
      >
        <i className="fas fa-times"></i> Close Tracking
      </button>
    </div>
  );
}




export default TrackOrder;
