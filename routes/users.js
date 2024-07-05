const router = require("express").Router();

router.get("/", () => console.log("GET users"));
router.get("/:userId", () => console.log("GET user by ID"));
router.post("/", () => console.log("POST user"));

module.exports = router;
