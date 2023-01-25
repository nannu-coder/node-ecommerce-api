const router = require("express").Router();
const { login, logout, register } = require("../Controllers/AuthController");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

module.exports = router;
