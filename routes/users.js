const router = require("express").Router();
const { getUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/:userId", auth, getUser);
router.get("/me", auth, getCurrentUser);

module.exports = router;
