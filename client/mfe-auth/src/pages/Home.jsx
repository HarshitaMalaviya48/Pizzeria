import React from 'react'
import {NavLink} from "react-router-dom";
import styles from "../styles/Home.module.css";

function Home() {
  return (
    <>
     <section className={styles.hero}>
  <div className={styles.heroContent}>
    <h1>Welcome to Pizza Palace</h1>
    <p>Delicious pizzas delivered to your doorstep</p>
    <div className={styles.heroButtons}>
        <NavLink to="/signup" className={`${styles.btn} ${styles.btnPrimary}`}>Get Started</NavLink>
        <NavLink to="/login" className={`${styles.btn} ${styles.btnSecondary}`}>Login</NavLink>
    </div>
  </div>
  <div className={styles.heroImage}>
    <img
      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      alt="Delicious Pizza"
    />
  </div>
</section>

<section className={styles.features}>
  <div className={styles.container}>
    <h2>Why Choose Pizza Palace?</h2>
    <div className={styles.featuresGrid}>
      <div className={styles.featureCard}>
        <i className="fas fa-clock"></i>
        <h3>Fast Delivery</h3>
        <p>Get your pizza delivered in 30 minutes or less</p>
      </div>
      <div className={styles.featureCard}>
        <i className="fas fa-star"></i>
        <h3>Premium Quality</h3>
        <p>Fresh ingredients and authentic recipes</p>
      </div>
      <div className={styles.featureCard}>
        <i className="fas fa-mobile-alt"></i>
        <h3>Easy Ordering</h3>
        <p>Order online with just a few clicks</p>
      </div>
    </div>
  </div>
</section>
    </>
  

  )
}

export default Home