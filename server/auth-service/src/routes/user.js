const express = require("express");
const router = express.Router();
const { getUserFromId } = require("../services/user.js");
const {
  getUser,
  deleteUserByItself,
  updateUserByItself,
  updateEmailByUser,
  updatePasswordByUser
} = require("../controller/user.js");


router.get("/get-user/:id", getUser);
router.delete("/delete/me/:id", deleteUserByItself);
router.put("/update/me/:id", updateUserByItself);

router.put("/update/email/:id", updateEmailByUser);
router.put("/update/password/:id", updatePasswordByUser);

module.exports = router;
