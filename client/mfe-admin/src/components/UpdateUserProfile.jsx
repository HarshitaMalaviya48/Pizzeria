import React, { useState, useEffect } from "react";
import styles from "../styles/UpdateUserProfile.module.css";
import { useLocation } from "react-router-dom";
import { showToast } from "host/toast";

function UpdateUserProfile() {
  const location = useLocation();
  const[userData, setUserData]  = useState(location.state?.user);
  const token = location.state?.token;
  console.log("userData", userData);

  const initialFormValue = {
    firstname: "",
    lastname: "",
    username: "",
    address: "",
    phoneno: "",
  };

  const [formErrors, setFormErrors] = useState({});
  const [formInput, setFormInput] = useState(initialFormValue);
  const [isButtonDisable, setIsButtonDisabled] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("----name", name);
    console.log("----value", value);

    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    let hasAnyValue;

    hasAnyValue = Object.values(formInput).some(
      (val) => val && val.trim() !== ""
    );

    setIsButtonDisabled(!hasAnyValue);
  }, [formInput]);

  const handleSaveChangesBtn = async (e) => {
    console.log("-----e", e);
    e.preventDefault();
    const filteredData = Object.fromEntries(
      Object.entries(formInput).filter(([_, value]) => value.trim() !== "")
    );


    const response = await fetch(`http://localhost:3000/admin/update/${userData.id}`, {
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
     setUserData(result.data.user);
     showToast(result.message, "success")
    //   setShouldFetchAgain(!shouldFetchAgain);
      setFormErrors({});
    } else if (!response.ok && response.status === 400 && result.error) {
      setFormErrors(result.error);
    }
  };

  return (
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
        </div>
      </div>
    </section>
  );
}

export default UpdateUserProfile;
