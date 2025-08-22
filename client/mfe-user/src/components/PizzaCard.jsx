// components/PizzaCard.js
import { useState, useEffect,   useContext } from "react";
// import { toast } from "react-toastify";
import styles from "../styles/Home.module.css";

import { CartContext } from "../store/CartContext.jsx";

function PizzaCard({ pizza}) {
    const { cartItems, addToCart, updateQuantity } = useContext(CartContext);
  const [quantity, setQuantity] = useState(0);
//   const { refreshCart } = useContext(CartContext);

  //  useEffect(() => {
  //   const item = cartItems.find((ci) => ci.pizza.id === pizza.id);
  //   if (item && item.quantity !== quantity) {
  //     setQuantity(item.quantity);
  //   }
  // }, [cartItems, pizza.id]);

  useEffect(() => {
    const item = cartItems.find((ci) => ci.pizza.id === pizza.id);
    // console.log("cart items quantity usestate", pizza.id);
    
    // console.log("in use effect block ----------",pizza.id);
    // console.log("in use effect block", item, quantity, item);
    if (!item && quantity !== 0) {
      console.log("in set quantity to zero");
      
      setQuantity(0); // Item is gone, reset to 0
    } else if (item && item.quantity !== quantity) {
      console.log("--------in else if block", item.quantity, quantity);
      setQuantity(item.quantity);
    }
  }, [cartItems, pizza.id, quantity]);

  // const addToCart = async () => {
  //   try {
  //     const res = await fetch("http://localhost:3000/cart/add-item", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ pizzaId: pizza.id, quantity: 1 }),
  //     });

  //     const result = await res.json();
  //     if (res.ok) {
  //       toast.success("Added to cart");
  //       setQuantity(1);
  //       console.log("quantity", quantity);

  //       refreshCart();
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch {
  //     toast.error("Server error");
  //   }
  // };

  // const updateQuantity = async (newQty) => {
  //   if (newQty === 0) {
  //     return removeItem();
  //   }

  //   try {
         
  //     const res = await fetch(
  //       `http://localhost:3000/cart/update-item-quantity/${pizza.id}`,
  //       {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({ quantity: newQty }),
  //       }
  //     );

  //     const result = await res.json();
  //     if (res.ok) {
  //       setQuantity(newQty);
  //       refreshCart();
  //       toast.success("Quantity updated");
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch {
  //     toast.error("Server error");
  //   }
  // };

  // const removeItem = async () => {
  //   console.log("in removeItem function");

  //   try {
  //       const item = cartItems.find((ci) => ci.pizza.id === pizza.id);
  //       console.log("item in removeItem", item);
        
  //     const res = await fetch(
  //       `http://localhost:3000/cart/delete-item/${item.id}`,
  //       {
  //         method: "DELETE",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const result = await res.json();
  //     console.log("result in removeItem", result);

  //     if (res.ok) {
  //       console.log("in removeItem function success");
  //       setQuantity(0);
  //       console.log("removeItem quantity", quantity);
  //       refreshCart();
  //       toast.info("Removed from cart");
  //     } else {
  //       toast.error(result.message);
  //     }
  //   } catch {
  //     toast.error("Server error");
  //   }
  // };

  return (
    <div className={styles.pizzaCard}>
      <div className={styles.pizzaImage}>
        <img src={pizza.image_url} alt={pizza.pizzaname} />
        <div
          className={`${styles.pizzaTag} ${
            pizza.category === "Veg" ? styles.veg : styles.nonVeg
          }`}
        >
          {pizza.category}
        </div>
        {pizza.discount_percent > 0 && (
          <div className={styles.discountBadge}>
            {pizza.discount_percent}% OFF
          </div>
        )}
      </div>

      <div className={styles.pizzaInfo}>
        <h3>{pizza.pizzaname}</h3>
        <p>{pizza.ingredients}</p>
        <div className={styles.pizzaPrice}>
          {pizza.discount_percent > 0 ? (
            <>
              <span className={styles.originalPrice}>₹{pizza.price}</span>
              <span className={styles.currentPrice}>
                ₹{pizza.price - (pizza.price * pizza.discount_percent) / 100}
              </span>
            </>
          ) : (
            <span className={styles.currentPrice}>₹{pizza.price}</span>
          )}
        </div>

        <div className={styles.pizzaActions}>
          {quantity === 0 ? (
            <button className={`${styles.btn} ${styles.btnPrimary} ${styles.addToCart}`} onClick={() => addToCart(pizza.id)}>Add to Cart</button>
          ) : (
            <div className={styles.quantityControls}>
  <button className={styles.decrementButton} onClick={() => updateQuantity(pizza.id, quantity - 1)}>-</button>
  <span className={styles.quantityValue}>{quantity}</span>
  <button className={styles.incrementButton} onClick={() => updateQuantity(pizza.id, quantity + 1)}>+</button>
</div>

          )}
        </div>
      </div>
    </div>
  );
}

export default PizzaCard;
