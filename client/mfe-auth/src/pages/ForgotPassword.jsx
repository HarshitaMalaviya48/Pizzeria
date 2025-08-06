import { useState } from "react";
import styles from "../styles/ForgotPassword.module.css";
import { NavLink } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputFieldChange = (e) => {
    const value = e.target.value;
    console.log("-------email", value);

    setEmail(value);
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const result = await response.json();
      console.log("-------result", result);

      if (!response.ok && !result.success) {
        setEmailError(result.error);
      } else if (response.ok && result.success) {
        setEmailError({});
        setEmail("");
        setSuccessMessage(result.message);
        console.log("link is send to your email");
      }
    } catch (error) {
      console.error("forgot-password failed", error);
    }
  };
  return (
    <section className={styles.forgotSection}>
      {successMessage && <p className={styles.success}>{successMessage}</p>}
      <div className={styles.forgotContainer}>
        <div className={styles.forgotCard}>
          <div className={styles.forgotHeader}>
            <h2>Forgot Password</h2>
            <p>Enter your email address to receive a password reset link</p>
          </div>

          <form
            className={styles.forgotForm}
            id="forgotForm"
            onSubmit={handleSubmitBtn}
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
                value={email}
                onChange={handleInputFieldChange}
                required
              />
              <p className={styles.error}>{emailError.email || ""}</p>
            </div>

            <div className={styles.formGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <i className="fas fa-paper-plane"></i> Send Link
              </button>
            </div>
          </form>

          <div className={styles.forgotFooter}>
            <NavLink to="/login" className={styles.backToLogin}>
              <i className="fas fa-arrow-left"></i> Back to Login
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
