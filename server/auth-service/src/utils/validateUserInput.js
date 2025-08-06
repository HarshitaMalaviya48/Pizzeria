const { REGEX } = require("../utils/constants.js");

const validateUserInput = (data, mode = "create") => {
  const errors = {};

  // Firstname
  if (mode === "create" || data.firstname !== undefined) {
    if (!data.firstname || data.firstname.trim() === "") {
      errors.firstname = "First name is required.";
    } else if (data.firstname.length < 3) {
      errors.firstname = "First name must be at least 3 characters.";
    }
  }

  // Lastname
  if (mode === "create" || data.lastname !== undefined) {
    if (!data.lastname || data.lastname.trim() === "") {
      errors.lastname = "Last name is required.";
    } else if (data.lastname.length < 3) {
      errors.lastname = "Last name must be at least 3 characters.";
    }
  }

  // Username
  if (mode === "create" || data.username !== undefined) {
    if (!data.username || data.username.trim() === "") {
      errors.username = "Username is required.";
    } else if (!REGEX.USERNAME.test(data.username)) {
      errors.username =
        "Username must be at least 6 characters and contain letters/numbers.";
    }
  }
  // Address
 // Address
if (mode === "create" || data.address !== undefined) {
  if (!data.address || data.address.trim() === "") {
    errors.address = "Address is required.";
  } else if (!REGEX.ADDRESS.test(data.address)) {
    errors.address = "Address must be at least 5 characters and contain only letters, numbers, spaces, commas";
  }
}

  // Email
  if (mode === "create" || data.email !== undefined) {
    if (!data.email || data.email.trim() === "") {
      errors.email = "Email is required.";
    } else if (!REGEX.EMAIL.test(data.email)) {
      errors.email = "Invalid email format.";
    }
  }

  // Password
  if (mode === "create" || data.password !== undefined) {
    if (!data.password || data.password.trim() === "") {
      errors.password = "Password is required.";
    } else if (!REGEX.PASSWORD.test(data.password)) {
      errors.password =
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
    }
  }

  // Phone number
  if (mode === "create" || data.phoneno !== undefined) {
    if (!data.phoneno || data.phoneno.trim() === "") {
      errors.phoneno = "Phone number is required.";
    } else if (!REGEX.PHONENO.test(data.phoneno)) {
      errors.phoneno = "Phone number must be exactly 10 digits.";
    }
  }
console.log("in validate user input utills confirmpassword brfore");
console.log("in validate user input utills confirmpassword brfore", data.confirmpassword);
  if(mode === "create" || data.confirmpassword !== undefined){
    console.log("in validate user input utills confirmpassword after" );
    
    if(!data.confirmpassword || data.confirmpassword.trim() === ""){
      errors.confirmpassword = "Confirm Password is required."
    }else if(data.confirmpassword !== data.password){
      console.log("in validate user input utills confirmpassword after 2" );
      errors.confirmpassword = "Password do not match"
    }
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

const validLoginInput = (data) => {
  const errors = {};
  if (!data.email) {
    errors.email = "Email is Mandatory";
  }
  if (!data.password) {
    errors.password = "Password is Mandatory";
  }

  const isValid = Object.keys(errors).length === 0;
  return { isValid, errors };
};

module.exports = { validateUserInput, validLoginInput };
