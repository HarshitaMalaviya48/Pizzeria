import { NavLink } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { AuthConsumer } from "remote_auth_app/store/auth";

function Navbar() {
  const { token } = AuthConsumer();
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <i className="fa-solid fa-pizza-slice"></i> PizzaExpress
      </div>
      <ul className={styles.navbarLinks}>
        {token ? (
          <>
            <li>
              <NavLink to="/user/home">Home</NavLink>
            </li>
            <li>
              <NavLink to="/user/cart">Cart</NavLink>
            </li>
            <li>
              <NavLink to="/user/orders">Orders</NavLink>
            </li>
            <li>
              <NavLink to="/user/update-profile">Profile</NavLink>
            </li>
            <li>
              <button>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <NavLink to="/signup">Sign Up</NavLink>
            </li>
            <li>
              <NavLink to="/login">Login</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
