import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { toast } from "react-toastify";

function Home() {
  // const token = localStorage.getItem("token");

  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDQ2ODUwMCwiZXhwIjoxNzU0NDk3MzAwfQ.ep9M4oo7Q2HPLXLZZzzJkuDEAT8WZiUx5xpj3Jk387s";

  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    console.log("-----------token", token);

    // Only fetch if token exists
    if (token) {
      const callPizza = async () => {
        try {
          const response = await fetch("http://localhost:3000/pizza/get-all", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const result = await response.json();
          console.log("---------resulr pizzas", result);

          if (result.success) {
            setPizzas(result.pizzas);
          } else {
            console.error("Error fetching pizzas:", result.message);
          }
        } catch (err) {
          console.error("Network error while fetching pizzas:", err);
        } finally {
          setLoading(false);
        }
      };

      callPizza();
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAddToCartBtn = async (pizzaId, quantities) => {
    console.log("---------------pizzaId", pizzaId, quantities);

    try {
      const response = await fetch("http://localhost:3000/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pizzaId, quantity: quantities }),
      });

      const result = await response.json();
      console.log("---result of add item to cart", result);
      if (response.ok && result.success) {
        toast.success(result.message);
      } else if (!response.ok && !result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const filteredPizzas = pizzas.filter((pizza) => {
    if (filterType === "veg") return pizza.category === "Veg";
    if (filterType === "non-veg") return pizza.category === "Non-Veg";
    if (filterType === "discount") return pizza.discount_percent > 0;
    return true; // "all"
  });
  return (
    <>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Delicious Pizzas</h1>
          <p>Order your favorite pizza and get it delivered to your doorstep</p>
        </div>
        <div className={styles.heroImage}>
          <img
            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Delicious Pizza"
          />
        </div>
      </section>

      {/* Filters Section */}
      <section className={styles.filters}>
        <div className={styles.container}>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${styles.active}`}
              onClick={() => setFilterType("all")}
            >
              All Pizzas
            </button>
            <button
              className={styles.filterBtn}
              onClick={() => setFilterType("veg")}
            >
              Veg
            </button>
            <button
              className={styles.filterBtn}
              onClick={() => setFilterType("non-veg")}
            >
              Non-Veg
            </button>
            <button
              className={styles.filterBtn}
              onClick={() => setFilterType("discount")}
            >
              Discount
            </button>
          </div>
        </div>
      </section>

      {/* Pizzas Section */}
      <section className={styles.pizzas}>
        <div className={styles.container}>
          <div className={styles.pizzasGrid} id="pizzasGrid">
            {loading ? (
              <p>Loading pizzas...</p>
            ) : filteredPizzas.length === 0 ? (
              <p>No pizzas available or user not logged in.</p>
            ) : (
              filteredPizzas.map((pizza) => {
                // const [quantity, setQuantity] = useState(1);
                return (
                  <div
                    key={pizza.id}
                    className={styles.pizzaCard}
                    data-category={`${pizza.isVeg ? "veg" : "non-veg"} ${
                      pizza.discount ? "discount" : ""
                    }`}
                  >
                    <div className={styles.pizzaImage}>
                      <img src={pizza.image_url} alt={pizza.name} />
                      <div
                        className={`${styles.pizzaTag} ${
                          pizza.category === "Veg" ? styles.veg : styles.nonVeg
                        }`}
                      >
                        {pizza.category === "Veg" ? "Veg" : "Non-Veg"}
                      </div>
                      {pizza.discount_percent > 0 && (
                        <div className={styles.discountBadge}>
                          {pizza.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <div className={styles.pizzaInfo}>
                      <h3>{pizza.pizzaname}</h3>
                      <p className={styles.ingredients}>{pizza.ingredients}</p>
                      <div className={styles.pizzaPrice}>
                        {pizza.discount_percent > 0 ? (
                          <>
                            <span className={styles.originalPrice}>
                              ₹{pizza.price}
                            </span>
                            <span className={styles.currentPrice}>
                              ₹
                              {pizza.price -
                                (pizza.price * pizza.discount_percent) / 100}
                            </span>
                          </>
                        ) : (
                          <span className={styles.currentPrice}>
                            ₹{pizza.price}
                          </span>
                        )}
                      </div>
                      <div className={styles.pizzaActions}>
                        <select
                          className={styles.quantitySelect}
                          onChange={(e) =>
                            setQuantities((prev) => ({
                              ...prev,
                              [pizza.id]: parseInt(e.target.value),
                            }))
                          }
                        >
                          {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>
                              {val}
                            </option>
                          ))}
                        </select>
                        <button
                          className={`${styles.btn} ${styles.btnPrimary} ${styles.addToCart}`}
                          onClick={() =>
                            handleAddToCartBtn(
                              pizza.id,
                              quantities[pizza.id] || 1
                            )
                          }
                        >
                          <i className="fas fa-plus"></i>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
