import {useEffect, useState} from "react";
import styles from "../styles/Cart.module.css";
import { toast } from "react-toastify";

function Cart() {
  
    // const token = localStorage.getItem("token");
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDQ2ODUwMCwiZXhwIjoxNzU0NDk3MzAwfQ.ep9M4oo7Q2HPLXLZZzzJkuDEAT8WZiUx5xpj3Jk387s"

    const [cart, setCart] = useState(null);
    const [shouldRefresh, setShouldRefresh] = useState(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
    useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:3000/cart/get-cart", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log("-------result", result);
        console.log("-------result", result.data.items);
        console.log("-------result", result.data);
        

        if (result.error) {
          setError(result.message || "Failed to fetch cart");
        } else {
          setCart(result.data);
        }
      } catch (err) {
        setError("Server error while fetching cart", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, shouldRefresh]);
  const handleRemoveBtn = async(pizzaId) => {
    const response = await fetch(`http://localhost:3000/cart/delete-item/${pizzaId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    console.log("response", response);
    console.log("result", result);
    if(response.ok && result.success){
      toast.success(result.message);
      setShouldRefresh(!shouldRefresh);
    }
    
  }
  const calculatePriceDetails = (items) => {
    let subtotal = 0;
    let discount = 0;

    items.forEach(({ quantity, pizza }) => {
      if (!pizza) return;

      const price = pizza.price * quantity;
      const itemDiscount = pizza.discount_percent
        ? (pizza.price * pizza.discount_percent) / 100 * quantity
        : 0;

      subtotal += price;
      discount += itemDiscount;
    });

    const gst = subtotal * 0.05;
    const total = subtotal + gst - discount;

    return {
      subtotal,
      discount,
      gst,
      total,
    };
  };

  if (loading) return <p style={{ padding: 20 }}>Loading cart...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <section className={styles.cartSection}>
        <div className={styles.container}>
          <h2>Your cart is empty.</h2>
        </div>
      </section>
    );
  }
  const { subtotal, discount, gst, total } = calculatePriceDetails(cart.items);
  return (
    <section className={styles.cartSection}>
      <div className={styles.container}>
        <div className={styles.cartHeader}>
          <h1>Your Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>

        <div className={styles.cartContent}>
          {/* Cart Items */}
          <div className={styles.cartItems}>
            {cart.items.map((item) => {
              const { pizza, quantity } = item;
              if (!pizza) return null;

              const originalPrice = pizza.price * quantity;
              const discountAmount = pizza.discount_percent
                ? (pizza.price * pizza.discount_percent) / 100 * quantity
                : 0;
              const finalPrice = originalPrice - discountAmount;

              return (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={pizza.image_url} alt={pizza.pizzaname} />
                  </div>
                  <div className={styles.itemDetails}>
                    <h3>{pizza.pizzaname}</h3>
                    <p className={styles.ingredients}>{pizza.ingredients}</p>
                    <div className={styles.itemPrice}>
                      {pizza.discount_percent ? (
                        <>
                          <span className={styles.originalPrice}>₹{pizza.price}</span>
                          <span className={styles.currentPrice}>
                            ₹{(pizza.price * (100 - pizza.discount_percent)) / 100}
                          </span>
                          <span className={styles.discount}>{pizza.discount_percent}% OFF</span>
                        </>
                      ) : (
                        <span className={styles.currentPrice}>₹{pizza.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <div>Quantity : {pizza.quantity}</div>
                  <div className={styles.itemTotal}>
                    <span className={styles.totalPrice}>₹{Math.round(finalPrice)}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <button className={`${styles.btn} ${styles.btnDanger} ${styles.removeItem}`} onClick={() => handleRemoveBtn(item.id)}>
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryItem}>
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span>GST (5%):</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.discount}`}>
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryActions}>
              <button className={`${styles.btn} ${styles.btnPrimary} ${styles.checkoutBtn}`}>
                <i className="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
              <a href="/home" className={`${styles.btn} ${styles.btnSecondary}`}>
                <i className="fas fa-arrow-left"></i>
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
