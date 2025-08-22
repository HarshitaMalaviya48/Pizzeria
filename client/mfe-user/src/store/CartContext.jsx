import { createContext, useState, useEffect } from "react";
import { showToast } from "host/toast";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const token =
    localStorage.getItem("token") ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDg5NzA5NywiZXhwIjoxNzU0OTI1ODk3fQ.t9jCxhWsLwHls7XBmfNw9omQv5ITE0nr6GECDbUtocs"; // fallback token
console.log("token in store", token);

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      console.log("in fetch cart after update");
      
      const res = await fetch("http://localhost:3000/cart/get-cart", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (res.ok) {
        setCartItems(result.data.items || []);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add to cart
  const addToCart = async (pizzaId) => {
    try {
      console.log("in add to cart function", token, pizzaId);
      
      const res = await fetch("http://localhost:3000/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ pizzaId, quantity: 1 }),
      });
      console.log("in add to cart function 2", res);
      const result = await res.json();
      if (res.ok) {
        showToast("Added to cart", "success");
        fetchCart();
      } else {
          showToast(result.message, "error");
      }
    } catch {
        showToast("Server error", "error");
    }
  };

  // Update quantity
  const updateQuantity = async (pizzaId, newQty) => {
    if (newQty <= 0) return removeItem(pizzaId);

    try {
      
      const res = await fetch(
        `http://localhost:3000/cart/update-item-quantity/${pizzaId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQty }),
        }
      );
      const result = await res.json();
      if (res.ok) {
  
        showToast("Quantity updated", "success");

        fetchCart();
      } else {
          showToast(result.message, "error");
      }
    } catch {
        showToast("Server error", "error");
    
    }
  };

  // Remove item
  const removeItem = async (pizzaId) => {
    try {
      console.log("Cart items", cartItems);
      console.log("Cart items pizzaIs", pizzaId);
      
       const item = cartItems.find((ci) => ci.pizza_id === pizzaId);
        console.log("item in removeItem", item);
      const res = await fetch(
        `http://localhost:3000/cart/delete-item/${item.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await res.json();
      if (res.ok) {
        showToast("Removed from cart", "info")
        fetchCart();
      } else {
        showToast(result.message, "error");
      }
    } catch {
      showToast("Server error","error")
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
