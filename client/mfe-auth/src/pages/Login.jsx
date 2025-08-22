import { useState } from "react";
import { Navigate, useNavigate, NavLink } from "react-router-dom";
import { showToast } from "host/toast";
import styles from "../styles/Login.module.css";
import { AuthConsumer } from "../store/auth";

function Login() {
  const navigate = useNavigate();
  const { setAuth, setLoading } = AuthConsumer();
  const initialFormInput = {
    email: "",
    password: "",
  };
  const [formInput, setFormInput] = useState(initialFormInput);
  const [formErrors, setFormErrors] = useState({});
  const [invalidCredentialError, setInvalidCredentialError] = useState("");

  const handleOnInputFieldChanges = (e) => {
    const { name, value } = e.target;
    console.log("----------", name, value);

    setFormInput({
      ...formInput,
      [name]: value,
    });
    console.log("formInput", formInput);
  };

  const handleFormSubmitBtn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
      });
      console.log("---------------1111111111111", response);
      const result = await response.json();

      console.log("----------", result);
      if (!result.success && !response.ok && result.error) {
        setFormErrors(result.error);
        setInvalidCredentialError("");
      } else if (!result.success && !response.ok && result.message) {
        setFormErrors({});
        setInvalidCredentialError(result.message);
      } else if (result.success) {
        console.log(
          "in else if login",
          result.data.token,
          result.data.user.role
        );
        setFormErrors({});
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("role", result.data.user.role);
        setAuth({ token: result.data.token, role: result.data.user.role });
        setLoading(false);
        setInvalidCredentialError("");
        setFormInput(initialFormInput);
        console.log(" before run toast");
        showToast(result.message, "success")
        console.log("after run toast");
      
          if (result.data.user.role === "user") {
            console.log("in user app", result.data.user.role);
            // <Navigate to="/user/home" replace />;
            navigate("/user/home");
          } else if (result.data.user.role === "admin") {
            console.log("in admin app", result.data.user.role);
            // <Navigate to="/admin/orders" replace />;
            navigate("/admin/orders");
          }
    
      }
    } catch (error) {
      console.error("login failed", error);
    }
  };
  return (
    <section className={styles.loginSection}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <h2>Welcome Back</h2>
            <p>Login to your Pizza Palace account</p>
          </div>

          <form
            className={styles.loginForm}
            id="loginForm"
            onSubmit={handleFormSubmitBtn}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formInput.email}
                onChange={handleOnInputFieldChanges}
                required
              />
              <p className={styles.error}>{formErrors.email || ""}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formInput.password}
                onChange={handleOnInputFieldChanges}
                required
              />
              {formErrors.password ? (
                <p className={styles.error}>{formErrors.password || ""}</p>
              ) : (
                <p className={styles.error}>{invalidCredentialError || ""}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <i className="fas fa-sign-in-alt"></i> Login
              </button>
            </div>
          </form>

          <div className={styles.loginFooter}>
            <NavLink to="/forgot-password" b className={styles.forgotPassword}>
              <i className="fas fa-key"></i>
              Forgot Password?
            </NavLink>

            <p>
              Don't have an account?{" "}
              <NavLink to="/signup">Sign up here</NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
