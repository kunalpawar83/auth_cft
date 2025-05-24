const express = require("express");
const router = express.Router();
const authController = require("../controller/authcontroller.js");
const { jwtAuthMiddleware } = require("../utils/jwt.js");

router.post("/signup", authController.Signup);
router.post("/login", authController.Login);

router.post("/forgetPassword", authController.forgotPassword);
router.put("/resetPassword/:token", authController.ResetPassword);

router.get("/getAllUser", jwtAuthMiddleware, authController.getAllUser);

module.exports = router;
