const router = require("express").Router();
const { getItems } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", () => console.log("POST item"));
router.delete("/:itemId", () => console.log("DELETE item"));

module.exports = router;
