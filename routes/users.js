const router = require("express").Router();
const {
  getUser,
  login,
  getUsers,
  createUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createUser);
router.post("/login", login);

module.exports = router;
