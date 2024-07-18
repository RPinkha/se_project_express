const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.status(CREATED).send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message:
            "invalid data passed to the methods for creating a user, or invalid ID passed to the params.",
        });
      }
      if (err.code === 11000) {
        return res.status(CONFLICT).send({
          message: "email already exists",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
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

const modifyUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return res.status(BAD_REQUEST).send({
            message:
              "invalid data passed to the methods for modifying a user, or invalid ID passed to the params.",
          });
        case "DocumentNotFoundError":
          return res.status(NOT_FOUND).send({
            message:
              "there is no user with the requested id, or the request was sent to a non-existent address.",
          });
        case "ValidationError":
          return res.status(BAD_REQUEST).send({
            message:
              "invalid data passed to the methods for updating a user, or invalid ID passed to the params.",
          });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
      }
    });
};

// To be used by an admin user in future itterations

/* const getUser = (req, res) => {
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

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
}; */

module.exports = { login, createUser, getCurrentUser, modifyUser };
