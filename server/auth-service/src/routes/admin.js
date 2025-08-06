const express = require("express");
const router = express.Router();
const {getUsers, deleteUserByAdmin, updateUserByAdmin} = require("../controller/admin.js")

router.get("/get-users", getUsers);
router.delete("/delete/:id",  deleteUserByAdmin);
router.put("/update/:id", updateUserByAdmin);

module.exports = router;