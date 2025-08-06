const express = require("express");
const router = express.Router();

const {
  getUser,
  deleteUserByItself,
  updateUserByItself,
  updateEmailByUser,
  updatePasswordByUser
} = require("../controller/user.js");

router.get("/get-user", getUser);
router.delete("/delete/me", deleteUserByItself);
router.put("/update/me", updateUserByItself);

router.put('/update/email', updateEmailByUser);
router.put('/update/password', updatePasswordByUser);

module.exports = router;
