import { useContext } from "react";
import styles from "../styles/Cart.module.css";

import { CartContext } from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { showToast } from "host/toast";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, loading, removeItem, fetchCart } = useContext(CartContext);
  console.log("cart item from store", cartItems);

  // const token = localStorage.getItem("token");
  const token =
    localStorage.getItem("token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NTU4MzA5MSwiZXhwIjoxNzU1NjExODkxfQ.qwM9VY-LtbT3ADDkfKYIuv0zKu_Yt1a075Q5aTWkOQw";

  console.log("------token", token);

  // const { cart, loading, refreshCart } = useContext(CartContext);
  // const [cart, setCart] = useState(null);
  // const [shouldRefresh, setShouldRefresh] = useState(false);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState("");
  //   useEffect(() => {
  //   const fetchCart = async () => {
  //     try {
  //       const response = await fetch("http://localhost:3000/cart/get-cart", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const result = await response.json();
  //       console.log("-------result", result);
  //       console.log("-------result", result.data.items);
  //       console.log("-------result", result.data);

  //       if (result.error) {
  //         setError(result.message || "Failed to fetch cart");
  //       } else {
  //         setCart(result.data);
  //       }
  //     } catch (err) {
  //       setError("Server error while fetching cart", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchCart();
  // }, [token, shouldRefresh]);
  // const handleRemoveBtn = async(pizzaId) => {
  //   const response = await fetch(`http://localhost:3000/cart/delete-item/${pizzaId}`, {
  //     method: "DELETE",
  //     headers: {
  //       'Authorization': `Bearer ${token}`
  //     }
  //   });

  //   const result = await response.json();

  //   console.log("response", response);
  //   console.log("result", result);
  //   if(response.ok && result.success){
  //     toast.success(result.message);
  //     setShouldRefresh(!shouldRefresh);
  //     // refreshCart();
  //   }

  // }

  const handleCheckOutBtn = async () => {
    try {
      console.log("1");

      const pizzas = cartItems.map((item) => ({
      pizzaId: item.pizza.id,
    }));
    console.log("pizzas to go heaven", pizzas);
    

    const response = await fetch(`http://localhost:3000/order/user/create-order`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pizzas }),
    });
      // const orderPromises = cartItems.map((item) => {
      //   const { pizza } = item;
      //   console.log("pizza in cart for order", pizza);
      //   console.log("item in cart for order", item);

      //   return fetch(`http://localhost:3000/order/user/create-order`, {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({ pizzaId: pizza.id }),
      //   }).then((res) => res.json());
      // });
      // console.log("2");

      // const results = await Promise.all(orderPromises);
      // const successMessage = results.map((result) => {
      //   if(!result.success){
      //     showToast(result.message, "info");
      //   }else{
      //     return result.success
      //   }
      // })
      // console.log("successMessages", successMessage);
      
      // if(successMessage.includes(true)){
      //   showToast("Orders placed successfully!", "success");
      //   navigate("../orders");
      // }
      const result = await response.json();
    console.log("Order API result:", result);

    if (!result.success) {
      showToast(result.message, "info");
      return;
    }

    showToast("Orders placed successfully!", "success");
     navigate("../orders");
      fetchCart();
    } catch (err) {
      console.error("error in order page", err);
      showToast("Error placing orders", "error")
    }
  };

  const calculatePriceDetails = (items) => {
    let subtotal = 0;
    let discount = 0;

    items.forEach(({ quantity, pizza }) => {
      if (!pizza) return;

      console.log("--------pizza price", pizza.price);
      const price = pizza.price * quantity;
      console.log("--------price", price);

      const itemDiscount =
        pizza.discount_percent > 0
          ? ((pizza.price * pizza.discount_percent) / 100) * quantity
          : 0;

      subtotal += price;
      console.log("subtotal", subtotal);

      discount += itemDiscount;
    });
    const totalafterDiscount = subtotal -discount
    const gst = totalafterDiscount * 0.05;
    const total = subtotal + gst - discount;

    return {
      subtotal,
      discount,
      gst,
      total,
    };
  };

  if (loading) return <p style={{ padding: 20 }}>Loading cart...</p>;
  // if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  if (!cartItems || cartItems.length === 0) {
    console.log("cartItems", cartItems);
    // console.log("cartItems.items",cartItems.items);

    return (
      <section className={styles.cartSection}>
        <div className={styles.container}>
          <h2 className={styles.noCartBody}>Your cart is empty.</h2>
        </div>
      </section>
    );
  }
  const { subtotal, discount, gst, total } = calculatePriceDetails(cartItems);
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
            {cartItems.map((item) => {
              const { pizza, quantity } = item;
              if (!pizza) return null;

              const originalPrice = pizza.price * quantity;
              const discountAmount = pizza.discount_percent
                ? ((pizza.price * pizza.discount_percent) / 100) * quantity
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
                      {pizza.discount_percent > 0 ? (
                        <>
                          <span className={styles.originalPrice}>
                            ₹{pizza.price}
                          </span>
                          <span className={styles.currentPrice}>
                            ₹
                            {(pizza.price * (100 - pizza.discount_percent)) /
                              100}
                          </span>
                          <span className={styles.discount}>
                            {pizza.discount_percent}% OFF
                          </span>
                        </>
                      ) : (
                        <span className={styles.currentPrice}>
                          ₹{pizza.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>Quantity : {quantity}</div>

                  <div className={styles.itemTotal}>
                    {pizza.discount_percent > 0 ? (
                      <>
                        <span
                          className={styles.originalPrice}
                          style={{ paddingRight: "5px" }}
                        >
                          ₹{pizza.price * quantity}
                        </span>
                        <span className={styles.totalPrice}>
                          ₹{Math.round(finalPrice)}
                        </span>
                      </>
                    ) : (
                      <span className={styles.totalPrice}>
                        ₹{Math.round(finalPrice)}
                      </span>
                    )}
                  </div>
                  <div className={styles.itemActions}>
                    <button
                      className={`${styles.btn} ${styles.btnDanger} ${styles.removeItem}`}
                      onClick={() => removeItem(item.pizza_id)}
                    >
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
            <div
              className={`${styles.summaryItem} ${styles.discount}`}
              style={{ display: "flex" }}
            >
              <span style={{ color: "white", fontSize: "14px" }}>
                Discount:
              </span>
              <span style={{ color: "white", fontSize: "14px" }}>
                -₹{discount.toFixed(2)}
              </span>
            </div>
            <div className={`${styles.summaryItem} ${styles.total}`}>
              <span>Total:</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryActions}>
              <button
                className={`${styles.btn} ${styles.btnPrimary} ${styles.checkoutBtn}`}
                onClick={handleCheckOutBtn}
              >
                <i className="fas fa-credit-card"></i>
                Proceed to Checkout
              </button>
              <a
                href="/home"
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
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
