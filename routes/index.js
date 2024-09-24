const router = require("express").Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-err");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

router.use(() => {
  throw new NotFoundError(
    "The requested resource does not exist. Please check the URL and try again."
  );
});

module.exports = router;
