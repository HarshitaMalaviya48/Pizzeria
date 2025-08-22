// components/Filters.js
import styles from "../styles/Home.module.css";

function Filters({ filterType, setFilterType }) {
  return (
    <div className={styles.filterButtons}>
      {["all", "veg", "non-veg", "discount"].map((type) => (
        <button
          key={type}
          className={`${filterType === type ? "active" : ""} ${styles.filterBtn}`}
          onClick={() => setFilterType(type)}
        >
          {type === "all" ? "All Pizzas" : type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default Filters;
