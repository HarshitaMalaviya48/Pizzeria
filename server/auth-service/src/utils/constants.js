exports.REGEX = {
  USERNAME:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, // must contain letters and numbers
  EMAIL: /^\S+@\S+\.\S+$/, // simple email format
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, // 8+ chars, upper, lower, number, special
  PHONENO: /^\d{10}$/,// exactly 10 digits
   ADDRESS: /^[a-zA-Z0-9\s,.'\-/#]{5,}$/,
};
