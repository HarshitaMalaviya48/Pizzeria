import React from "react";
import styles from "../styles/Users.module.css";
import { useNavigate } from "react-router-dom";;
import { showToast } from "host/toast";

function UserComponent({ user, token, refreshUsers }) {
  const navigate = useNavigate();
  const handleUpdateBtn = () => {
    console.log("handleUpdateBtn clicked");

    navigate("../update-user-profile", { state: { user, token } });
  };

  const handleDeleteBtn = async () => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete user?");
      if (!confirmed) return;

      const response = await fetch(
        `http://localhost:3000/admin/delete/${user.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();
      console.log("delete button response", response);
      console.log("delete button result", result);
      console.log("delete button result", !response.ok);
      console.log("delete button result", response.status);
      if (response.ok && result.success) {
        refreshUsers();
        showToast(result.message, "success");
      }
      else if(!response.ok && response.status === 409){
        showToast(result.message, "info");
      } else if (!response.ok && result.success) {
        showToast(result.message, "error");
      }
    } catch (error) {
      console.log("Error while deleting user", error);
    }
  };
  return (
    <>
      <tr>
        <td>
          <div className={styles.userInfo}>
            <div>
              <h4>
                {user.firstname} {user.lastname}
              </h4>
              <span className={styles.username}>{user.username}</span>
            </div>
          </div>
        </td>
        <td>{user.email}</td>
        <td>+91 {user.phoneno}</td>
        <td>{user.address}</td>

        <td>
          {new Date(user.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </td>
        <td>
          <div className={`${styles.actionButtons} `}>
            <button
              className={`${styles.btnSecondary} ${styles.btn}`}
              onClick={() => handleUpdateBtn()}
            >
              <i className="fas fa-edit"></i>
              Update
            </button>
            <button
              className={`${styles.btnDanger} ${styles.btn}`}
              onClick={handleDeleteBtn}
            >
              <i className="fas fa-trash"></i>
              Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
}

export default UserComponent;
