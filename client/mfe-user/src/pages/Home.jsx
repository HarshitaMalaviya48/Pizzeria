// pages/Home.js
import { useEffect, useState } from "react";
import PizzaList from "../components/PizzaList";
import Filters from "../components/Filters";
import styles from "../styles/Home.module.css";

function Home() {
  const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NTU4MzA5MSwiZXhwIjoxNzU1NjExODkxfQ.qwM9VY-LtbT3ADDkfKYIuv0zKu_Yt1a075Q5aTWkOQw";
  const [pizzas, setPizzas] = useState([]);
  // const [cartItems, setCartItems] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchPizzas = async () => {
    try {
      const res = await fetch("http://localhost:3000/pizza/get-all", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) setPizzas(result.pizzas);
    } catch (err) {
      console.error("Error loading pizzas:", err);
    } finally {
      setLoading(false);       
    }
  };

  // const fetchCart = async () => {
  //   try {
  //     console.log("in fetch cart");
      
  //     const res = await fetch("http://localhost:3000/cart/get-cart", {
  //        method: "GET",
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const result = await res.json();
  //     if (res.ok) setCartItems(result.data.items || []);
  //   } catch (err) {
  //     console.error("Error fetching cart:", err);
  //   }
  // };

  // const refreshCart = () => {
  //   fetchCart();
  // };

  useEffect(() => {
    fetchPizzas();
    // fetchCart();
  }, []);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroDiv}>

        <h1 className={styles.heroContentH1}>Delicious Pizzas</h1>
        <p className={styles.heroContentP}>Order your favorite pizza now</p>
        </div>
        <div className={styles.heroImage}>
                  <img
                    src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Delicious Pizza"
                  />
                </div>
      </section>

      <section className={styles.filters}>
        <Filters filterType={filterType} setFilterType={setFilterType} />
      </section>

      <section className={styles.pizzas}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <PizzaList
            pizzas={pizzas}
            filterType={filterType}
            token={token}
            // cartItems={cartItems}
            // refreshCart={refreshCart}
          />
        )}
      </section>
    </>
  );
}

export default Home;
