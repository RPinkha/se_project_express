const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { CREATED } = require("../utils/status-codes");
const { JWT_SECRET } = require("../utils/config");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required."));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
        user,
      });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError(err.message));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
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
        return next(
          new BadRequestError(
            "invalid data passed to the methods for creating a user, or invalid ID passed to the params."
          )
        );
      }
      if (err.code === 11000) {
        return next(new ConflictError("email already exists"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return next(
            new BadRequestError(
              "invalid data passed to the methods for creating a user, or invalid ID passed to the params."
            )
          );
        case "DocumentNotFoundError":
          return next(
            new NotFoundError(
              "there is no user with the requested id, or the request was sent to a non-existent address."
            )
          );
        default:
          return next(err);
      }
    });
};

const modifyUser = (req, res, next) => {
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
          return next(
            new BadRequestError(
              "invalid data passed to the methods for creating a user, or invalid ID passed to the params."
            )
          );
        case "DocumentNotFoundError":
          return next(
            new NotFoundError(
              "there is no user with the requested id, or the request was sent to a non-existent address."
            )
          );
        case "ValidationError":
          return next(
            new BadRequestError(
              "invalid data passed to the methods for creating a user, or invalid ID passed to the params."
            )
          );
        default:
          return next(err);
      }
    });
};

// To be used by an admin user in future itterations

/* const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case "CastError":
          return next(
            new BadRequestError(
              "invalid data passed to the methods for creating a user, or invalid ID passed to the params."
            )
          );
        case "DocumentNotFoundError":
          return next(
            new NotFoundError(
              "there is no user with the requested id, or the request was sent to a non-existent address."
            )
          );
        default:
        return next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => next(err));
    );
}; */

module.exports = { login, createUser, getCurrentUser, modifyUser };
