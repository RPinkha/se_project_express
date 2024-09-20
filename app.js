const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);

app.use((err, req, res, next) => {
  console.error(err);
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

app.listen(PORT, () => {});
