const router = require("express").Router();
const { getCurrentUser, modifyUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, modifyUser);

module.exports = router;
