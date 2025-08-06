const { registerUser } = require("../services/auth.js");
const { User } = require("../db/models");

(async () => {
  const existing = await User.findOne({
    where: { email: "admin@example.com" },
  });

  if (existing) {
    console.log("Admin already exists. Skipping creation.");
    return;
  }

  const adminData = {
    firstname: "Admin",
    lastname: "User",
    username: "admin123",
    email: "admin@example.com",
    password: "Admin@123", 
    confirmpassword: "Admin@123", 
    phoneno: "9876543210",
    role: "admin",
  };

  const result = await registerUser(adminData);
  console.log("admin registered successfully", result);
})();
