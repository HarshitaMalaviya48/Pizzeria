// components/PizzaList.js
import PizzaCard from "./PizzaCard";
import styles from "../styles/Home.module.css";

function PizzaList({ pizzas, filterType, token, cartItems }) {
  const filtered = pizzas.filter((pizza) => {
    if (filterType === "veg") return pizza.category === "Veg";
    if (filterType === "non-veg") return pizza.category === "Non-Veg";
    if (filterType === "discount") return pizza.discount_percent > 0;
    return true;
  });

  if (!filtered.length) return <p>No pizzas available.</p>;

  return (
    <div className={styles.pizzasGrid}>
      {filtered.map((pizza) => (
        <PizzaCard
          key={pizza.id}
          pizza={pizza}
          token={token}
          cartItems={cartItems}
          // refreshCart={refreshCart}
        />
      ))}
    </div>
  );
}

export default PizzaList;
