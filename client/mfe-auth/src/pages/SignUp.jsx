import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import styles from "../styles/SignUp.module.css";


function SignUp() {
  const navigate = useNavigate();
  const initialFormInput = {
    firstname: "",
    lastname: "",
    username: "",
    phoneno: "",
    email: "",
    password: "",
    confirmpassword: "",
  };
  const [formInput, setFormInput] = useState(initialFormInput);
  const [formErrors, setFormErrors] = useState({})

  const handleOnInputFieldChanges = (e) => {
    const { name, value } = e.target;
    setFormInput({
      ...formInput,
      [name]: value,
    });
    console.log("formInput", formInput);
  };

  const handleFormSubmitBtn = async (e) => {
    e.preventDefault();

    try {
        const response = await fetch("http://localhost:3000/api/auth/create", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formInput)
        });

        const result = await response.json();

        console.log("-------result", result);
        if(!result.success && !response.ok){
            setFormErrors(result.error)
        }else {
          toast.success(result.message);
          setFormInput(initialFormInput);
          setFormErrors({});
          navigate("/login");
        }
    } catch (error) {
        console.error("Registration failed", error);
    }


  }

  return (
 <section className={styles.signupSection}>
      <div className={styles.signupContainer}>
        <div className={styles.signupCard}>
          <div className={styles.signupHeader}>
            <h2>Create Your Account</h2>
            <p>Join Pizza Palace and start ordering delicious pizzas!</p>
          </div>

          <form className={styles.signupForm} id="signupForm" onSubmit={handleFormSubmitBtn} noValidate>

             <div className={styles.formGroup}>
              <label htmlFor="firstName">
                 <i className="fas fa-user"></i> First Name
              </label>
              <input type="text" id="firstName" name="firstname" value={formInput.firstname} onChange={handleOnInputFieldChanges}  required />
              <p className={styles.error}>{formErrors.firstname}</p>
            </div>

             <div className={styles.formGroup}>
              <label htmlFor="lastName">
                 <i className="fas fa-user"></i> Last Name
              </label>
              <input type="text" id="lastName" name="lastname" value={formInput.lastname} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.lastname}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="username">
                <i className="fas fa-at"></i> Username
              </label>
              <input type="text" id="username" name="username" value={formInput.username} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.username}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">
                <i className="fas fa-at"></i> Address
              </label>
              <input type="text" id="address" name="address" value={formInput.address} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.address}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="phone">
                <i className="fas fa-phone"></i> Phone Number
              </label>
              <input type="tel" id="phone" name="phoneno" value={formInput.phoneno} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.phoneno}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">
                <i className="fas fa-envelope"></i> Email Address
              </label>
              <input type="email" id="email" name="email" value={formInput.email} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.email}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">
                <i className="fas fa-lock"></i> Password
              </label>
              <input type="password" id="password" name="password" value={formInput.password} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.password}</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">
                <i className="fas fa-lock"></i> Confirm Password
              </label>
              <input type="password" id="confirmPassword" name="confirmpassword" value={formInput.confirmpassword} onChange={handleOnInputFieldChanges} required />
              <p className={styles.error}>{formErrors.confirmpassword}</p>
            </div>

            <div className={styles.formGroup}>
              <button type="submit" className={`${styles.btnPrimary} ${styles.btn}`}>
                <i className="fas fa-user-plus"></i> Sign Up
              </button>
            </div>
          </form>

          <div className={styles.signupFooter}>
            <p>
              Already have an account? <NavLink to="/login">Login here</NavLink>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignUp;
