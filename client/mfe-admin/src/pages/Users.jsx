import React, { useEffect, useState } from "react";
import styles from "../styles/Users.module.css";
import UserComponent from "../components/UserComponent.jsx";

function Users() {
  const token =
    localStorage.getItem("token") ||
   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInJvbGUiOiJhZG1pbiIsInVzZXJuYW1lIjoiYWRtaW4xMjMiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU1NTgyMDIwLCJleHAiOjE3NTU2MTA4MjB9.nIQ8zjQhjsrczFHVDWRN_fXE83Bfw-BbcMkR7yIPaSo";
   
    const [users, setUsers] = useState([]);
  
 
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3000/admin/get-users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("response", response);

        const result = await response.json();
        console.log("result", result);
        if (response.ok && result.success) {
            console.log(result.data.user);  
          setUsers(result.data.user);
        }
      } catch (error) {
        console.log("Error ehile fetching user", error);
      }
    };
    const refreshUsers = () => {
        fetchUsers();
    }

  useEffect(() => {
refreshUsers();
  },[])
  return (
    <section className={styles.usersSection}>
      <div className={styles.container}>
        <div className={styles.usersHeader}>
          <h1>Manage Users</h1>
          <p>View and manage all registered users</p>
        </div>

        {/* Search and Filter */}
        {/* <div className={styles.usersControls}>
          
           
            <button className={`${styles.btnPrimary} ${styles.btn}`}>
              <i className="fas fa-user-plus"></i>
              Add New User
            </button>
          
        </div> */}

        {/* Users Table */}
        <div className={styles.usersTableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              {/* User Row 1 */}
              {users.length > 0 ? (
                users.map((user) => (

                    <UserComponent user={user} token={token} refreshUsers={refreshUsers}/>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    <h3>No Users</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default Users;
