import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import styles from "../styles/UpdateProfile.module.css";
import {AuthConsumer} from "remote_auth_app/store/auth";

function UpdateProfile() {
const {setToken } = AuthConsumer();
  // const token = localStorage.getItem("token");
  // console.log("------token", token);
  const navigate = useNavigate();
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MzEsInJvbGUiOiJ1c2VyIiwidXNlcm5hbWUiOiJ0ZXN0MTIzNCIsImVtYWlsIjoidGVzdDk5QGdtYWlsLmNvbSIsImlhdCI6MTc1NDQ2ODUwMCwiZXhwIjoxNzU0NDk3MzAwfQ.ep9M4oo7Q2HPLXLZZzzJkuDEAT8WZiUx5xpj3Jk387s";

  const initialFormValue = {
    firstname: "",
    lastname: "",
    username: "",
    address: "",
    phoneno: "",
  };
  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState(initialFormValue);
  const [emailInput, setEmailInput] = useState({ email: "" });
  const [passwordInput, setPasswordInput] = useState({
    password: "",
    confirmpassword: "",
  });
  const [userData, setUserData] = useState({});
  const [isButtonDisable, setIsButtonDisabled] = useState(false);
  const [shouldFetchAgain, setShouldFetchAgain] = useState(false);
  const [whichUI, setWhichUI] = useState("all-details");
  useEffect(() => {
    const getProfile = async () => {
      const response = await fetch("http://localhost:3000/users/get-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (response.status === 401) {
        toast.error(result.message);
        navigate("/login");
        return;
      }
      if (result.success && response.ok) {
        setUserData(result.data.user);
      } else if (!response.ok && !result.success) {
        toast.error(result.message);
      }
      console.log("------------response", response);
      console.log("------------result", result);
    };
    getProfile();
  }, [shouldFetchAgain]);

  useEffect(() => {
    let hasAnyValue;
    if (whichUI === "all-details") {
      hasAnyValue = Object.values(formInput).some(
        (val) => val && val.trim() !== ""
      );
    } else if (whichUI === "change-email") {
      hasAnyValue = Object.values(emailInput).some(
        (val) => val && val.trim() !== ""
      );
    } else if (whichUI === "change-password") {
      hasAnyValue = Object.values(passwordInput).some(
        (val) => val && val.trim() !== ""
      );
    }
    setIsButtonDisabled(!hasAnyValue);
  }, [formInput, emailInput, whichUI, passwordInput]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("----name", name);
    console.log("----value", value);
    if (name === "email") {
      console.log("name", name, "value", value);

      setEmailInput({
        [name]: value,
      });
    } else if (name === "password" || name === "confirmpassword") {
      setPasswordInput({
        ...passwordInput,
        [name]: value,
      });
    } else {
      setFormInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveChangesBtn = async (e) => {
    console.log("-----e", e);
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formInput).filter(([_, value]) => value.trim() !== "")
    );

    const response = await fetch("http://localhost:3000/users/update/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(filteredData),
    });
    const result = await response.json();
    // setFormInput(result.data);

    console.log("------------response", response);
    console.log("------------result", result);

    if (response.ok && result.success) {
      setFormInput(initialFormValue);
      setShouldFetchAgain(!shouldFetchAgain);
      setFormErrors({});
    } else if (!response.ok && response.status === 400 && result.error) {
      setFormErrors(result.error);
    }
  };

  const handleEmailSaveChangesBtn = async (e) => {
    e.preventDefault();
    console.log("in email changes bitton");

    const response = await fetch("http://localhost:3000/users/update/email", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(emailInput),
    });

    const result = await response.json();

    console.log("email response", response);
    console.log("email result", result);
    if (!response.ok && response.status === 400) {
      setFormErrors(result.error);
    } else if (response.ok && result.success) {
      console.log("navigate to login from email");
      setEmailInput({ email: "" });
      setFormErrors({});
      localStorage.removeItem("token");
      setToken("");
      toast.success(result.message);
      navigate("/login");
    } else if (!response.ok && response.status === 401) {
      toast.error(response.message);
    }
  };

  const handlePasswordSaveChangesBtn = async (e) => {
    e.preventDefault();
    console.log("-------------password input", passwordInput);

    const response = await fetch(
      "http://localhost:3000/users/update/password",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwordInput),
      }
    );

    const result = await response.json();

    console.log("password response", response);
    console.log("password result", result);
    if (!response.ok && response.status === 400) {
      setFormErrors(result.error);
    } else if (response.ok && result.success) {
      console.log("navigate to login from password");
      setPasswordInput({ password: "", confirmpassword: "" });
      setFormErrors({});
      toast.success(result.message);
      localStorage.removeItem("token");
      setToken("");
      navigate("/login");
    } else if (!response.ok && response.status === 401) {
      toast.error(response.message);
    }
  };
  const handleDeleteBtn = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/delete/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();
      console.log("delete button response", response);
      console.log("delete button result", result);
      if (response.ok && result.success) {
        toast.success(result.message);
        navigate("/signup");
         localStorage.removeItem("token");
        setToken("");
      } else if (!response.status && result.success) {
        toast.error(result.message);
        navigate("/signup");
       
      }
    } catch (error) {
      console.log("Error while deleting user", error);
    }
  };
  const handleChangePasswordBtn = () => {
    setWhichUI("change-password");
  };

  const handleChangeEmailBtn = () => {
    setWhichUI("change-email");
  };

  const handlePersonalDetailsBtn = () => {
    setWhichUI("all-details");
  };
  return (
    <>
      <section className={styles.profileSection}>
        <div className={styles.container}>
          <div className={styles.profileHeader}>
            <h1>My Profile</h1>
            <p>Update your personal information and preferences</p>
          </div>

          <div className={styles.profileContent}>
            {/* Profile Info */}
            <div className={styles.profileInfo}>
              <div className={styles.profileAvatar}>
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Profile Picture"
                />
                <button className={styles.changeAvatarBtn}>
                  <i className="fas fa-camera"></i>
                </button>
              </div>
              <div className={styles.profileDetails}>
                <h2>
                  {userData.username} {userData.lastnmae}
                </h2>
                <p className={styles.userEmail}>{userData.email}</p>
                <p className={styles.userPhone}>{userData.phoneno}</p>
                <p className={styles.userAddress}>{userData.address}</p>
              </div>
            </div>

            {/* Profile Form */}
            {whichUI === "all-details" && (
              <div className={styles.profileFormContainer}>
                <form
                  className={styles.profileForm}
                  id="profileForm"
                  noValidate
                  onSubmit={handleSaveChangesBtn}
                >
                  <h3>Personal Information</h3>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">
                        <i className="fas fa-user"></i>
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstname"
                        value={formInput.firstname}
                        onChange={handleInputChange}
                        required
                      />
                      <p className={styles.error}>{formErrors.firstname}</p>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">
                        <i className="fas fa-user"></i>
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastname"
                        value={formInput.lastname}
                        name="lastname"
                        onChange={handleInputChange}
                        required
                      />
                      <p className={styles.error}>{formErrors.lastname}</p>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="username">
                      <i className="fas fa-at"></i>
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={formInput.username}
                      name="username"
                      onChange={handleInputChange}
                      required
                    />
                    <p className={styles.error}>{formErrors.username}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">
                      <i className="fas fa-phone"></i>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phoneno"
                      value={formInput.phoneno}
                      onChange={handleInputChange}
                      required
                    />
                    <p className={styles.error}>{formErrors.phoneno}</p>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="address">
                      <i className="fas fa-map-marker-alt"></i>
                      Delivery Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      value={formInput.address}
                      rows="3"
                      placeholder="Enter your delivery address"
                      onChange={handleInputChange}
                    ></textarea>
                    <p className={styles.error}>{formErrors.address}</p>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.btn + " " + styles.btnPrimary}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className={styles.btn + " " + styles.btnSecondary}
                      onClick={() => {
                        console.log("in setform input function");

                        setFormInput(initialFormValue);
                        setFormErrors({});
                      }}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-undo"></i>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}

            {whichUI === "change-password" && (
              <div className={styles.profileFormContainer}>
                <form
                  className={styles.profileForm}
                  id="profileForm"
                  noValidate
                  onSubmit={handlePasswordSaveChangesBtn}
                >
                  <h3>Password Information</h3>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">
                      <i className="fas fa-phone"></i>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={passwordInput.password}
                      onChange={handleInputChange}
                      required
                    />
                    <p className={styles.error}>{formErrors.password}</p>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">
                      <i className="fas fa-phone"></i>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmpassword"
                      name="confirmpassword"
                      value={passwordInput.confirmpassword}
                      onChange={handleInputChange}
                      required
                    />
                    <p className={styles.error}>{formErrors.confirmpassword}</p>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.btn + " " + styles.btnPrimary}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className={styles.btn + " " + styles.btnSecondary}
                      onClick={() => {
                        console.log("in setform input function");

                        setPasswordInput({ password: "", confirmpassword: "" });
                        setFormErrors({});
                      }}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-undo"></i>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}
            {whichUI === "change-email" && (
              <div className={styles.profileFormContainer}>
                <form
                  className={styles.profileForm}
                  id="profileForm"
                  noValidate
                  onSubmit={handleEmailSaveChangesBtn}
                >
                  <h3>Email Information</h3>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">
                      <i className="fas fa-email"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={emailInput.email}
                      onChange={handleInputChange}
                      required
                    />
                    <p className={styles.error}>{formErrors.email}</p>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      className={styles.btn + " " + styles.btnPrimary}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-save"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className={styles.btn + " " + styles.btnSecondary}
                      onClick={() => {
                        console.log("in setform input function");

                        setEmailInput({ email: "" });
                        setFormErrors({});
                      }}
                      disabled={isButtonDisable}
                    >
                      <i className="fas fa-undo"></i>
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Section */}
            <div className={styles.securitySection}>
              <h3>Security Settings</h3>
              <div className={styles.securityOptions}>
                <button
                  className={styles.btn + " " + styles.btnSecondary}
                  onClick={handlePersonalDetailsBtn}
                >
                  <i className="fas fa-key"></i>
                  Change Personal details
                </button>
                <button
                  className={styles.btn + " " + styles.btnSecondary}
                  onClick={handleChangePasswordBtn}
                >
                  <i className="fas fa-key"></i>
                  Change Password
                </button>
                <button
                  className={styles.btn + " " + styles.btnSecondary}
                  onClick={handleChangeEmailBtn}
                >
                  <i className="fas fa-envelope"></i>
                  Change Email
                </button>
                <button
                  className={styles.btn + " " + styles.btnDanger}
                  onClick={handleDeleteBtn}
                >
                  <i className="fas fa-trash"></i>
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default UpdateProfile;
