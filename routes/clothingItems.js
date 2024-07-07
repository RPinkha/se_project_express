const router = require("express").Router();

router.get("/", () => console.log("GET items"));
router.post("/", () => console.log("POST item"));
router.delete("/:itemId", () => console.log("DELETE item"));

module.exports = router;
