import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { showToast } from "host/toast";
import styles from "../styles/ResetPassword.module.css";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useParams();
  const initialFormInput = {
    password: "",
    confirmpassword: "",
  };
  const [formInput, setFormInput] = useState(initialFormInput);
  const [errorMessage, setErrorMessage] = useState("");
  const [formInputErrors, setFormInputErrors] = useState({});
  const [isValidToken, setIsValidToken] = useState(true);

  console.log("----------data", token);

  //   console.log(token);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/auth/verify-reset-token/${token.token}`
        );
        const data = await res.json();

        console.log("---------data in verify token", data);

        if (data.valid) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setErrorMessage(data.message);
        }
      } catch (err) {
        console.error(err);
        setIsValidToken(false);
        setErrorMessage("Server Error");
      }
    };

    verifyToken();
  }, [token.token]);

  useEffect(() => {
    const preventRouteChange = (e) => {
      if (location.pathname !== `/reset-password/${token.token}`) {
        e.preventDefault();
        showToast("You must finish resetting your password first.", "warn")
        navigate(`/reset-password/${token.token}`, { replace: true });
      }
    };
    window.addEventListener("beforeunload", preventRouteChange);

    return () => window.removeEventListener("beforeunload", preventRouteChange);
  }, [location.pathname, navigate, token.token]);

  //   useEffect(() => {
  //     if (isValidToken === false) {
  //       navigate("/login");
  //     }
  //   }, [isValidToken, navigate]);

  const handleInputFieldChange = (e) => {
    const { name, value } = e.target;
    console.log("--------name, value", name, value);

    setFormInput({
      ...formInput,
      [name]: value,
    });
    console.log("----------value", formInput);
  };

  const handleSubmitBtn = async (e) => {
    e.preventDefault();
    console.log("----------value in btn handler", formInput);
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/reset-password/${token.token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formInput),
        }
      );

      const result = await response.json();

      console.log("--result", result);

      if (!result.success && !response.ok && response.status === 400) {
        setFormInputErrors(result.error);
      } else if (!result.success && response.status === 401) {
        showToast(result.message, "error");
     
        navigate("/login", {replace: true});
      } else if (!result.success && !response.ok && response.status === 404) {
        showToast(result.message, "error");
       
        navigate("/", {replace: true});
      } else if (response.status === 200 && response.ok) {
        setFormInputErrors({});
        setFormInput(initialFormInput);
        navigate("/login", {replace: true});
       showToast(result.message, "success");
      }
    } catch (error) {
      console.error("Reset-password failed", error);
    }
  };

  if (isValidToken === null) return null;

  if (errorMessage) {
    return <p className={styles.errorMessage}>{errorMessage}</p>;
  }
  return (
    <section className={styles.resetSection}>
      <div className={styles.resetContainer}>
        <div className={styles.resetCard}>
          <div className={styles.resetHeader}>
            <h2>Reset Password</h2>
            <p>Enter your new password below</p>
          </div>

          <form
            className={styles.resetForm}
            id="resetForm"
            onSubmit={handleSubmitBtn}
            noValidate
          >
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">
                <i className="fas fa-lock"></i> New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formInput.password}
                onChange={handleInputFieldChange}
                required
              />
              <p className={styles.error}>{formInputErrors.password || ""}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmpassword"
                value={formInput.confirmpassword}
                onChange={handleInputFieldChange}
                required
              />
              <p className={styles.error}>
                {formInputErrors.confirmpassword || ""}
              </p>
            </div>

            <div className={styles.formGroup}>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                <i className="fas fa-key"></i> Set Password
              </button>
            </div>
          </form>

          {/* <div className={styles.resetFooter}>
            <a href="login.html" className={styles.backToLogin}>
              <i className="fas fa-arrow-left"></i> Back to Login
            </a>
          </div> */}
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
