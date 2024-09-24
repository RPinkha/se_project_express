const router = require("express").Router();
const { getCurrentUser, modifyUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { validateUpdateProfile } = require("../middlewares/validation");

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUpdateProfile, modifyUser);

module.exports = router;
