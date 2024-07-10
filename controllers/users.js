const User = require("../models/user");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(CREATED).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message:
            "invalid data passed to the methods for creating a user, or invalid ID passed to the params.",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return res.status(BAD_REQUEST).send({
            message:
              "invalid data passed to the methods for creating a user, or invalid ID passed to the params.",
          });
        case "DocumentNotFoundError":
          return res.status(NOT_FOUND).send({
            message:
              "there is no user with the requested id, or the request was sent to a non-existent address.",
          });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
