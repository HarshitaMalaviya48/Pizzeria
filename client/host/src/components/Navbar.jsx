import { NavLink, useNavigate } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { AuthConsumer } from "remote_auth_app/store/auth";

function Navbar() {
  const navigate = useNavigate();
  const { token, role, setAuth } = AuthConsumer();
  const tokenFromLocal = localStorage.getItem("token");
  const roleFromLocal = localStorage.getItem("role");
  const handleLogout = () => {
     const confirmed = window.confirm("Are you sure you want to logout?");
  if (!confirmed) return;

    setAuth({ token: "", role: "" }); // clears context + localStorage
    navigate("/login")
  };

   const getLinkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLogo}>
        <i className="fa-solid fa-pizza-slice"></i> PizzaExpress
      </div>
      <ul className={styles.navbarLinks}>
       {!tokenFromLocal && (
          <>
            <li>
              <NavLink to="/signup" className={getLinkClass}>Sign Up</NavLink>
            </li>
            <li>
              <NavLink to="/login" className={getLinkClass}>Login</NavLink>
            </li>
          </>
        )}

        {roleFromLocal && roleFromLocal === "user" && (
          <>
            <li><NavLink to="/user/home" className={getLinkClass}>Home</NavLink></li>
            <li><NavLink to="/user/cart" className={getLinkClass}>Cart</NavLink></li>
            <li><NavLink to="/user/orders" className={getLinkClass}>Orders</NavLink></li>
            <li><NavLink to="/user/update-profile" className={getLinkClass}>Profile</NavLink></li>
            <li><button className={styles.btnSecondary} onClick={handleLogout}>Logout</button></li>
          </>
        )}

        {roleFromLocal && roleFromLocal === "admin" && (
          <>
            <li><NavLink to="/admin/orders" className={getLinkClass}>Orders</NavLink></li>
            <li><NavLink to="/admin/users" className={getLinkClass}>Users</NavLink></li>
            <li><button className={styles.btnSecondary} onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
