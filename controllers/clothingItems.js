const Item = require("../models/clothingItem");
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require("../utils/status-codes");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => next(err));
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          new BadRequestError(
            "invalid data passed to the methods for creating an item, or invalid ID passed to the params."
          )
        );
      }
      return next(err);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const loggedInUserId = req.user._id;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() === loggedInUserId.toString()) {
        return item.deleteOne();
      }
      const err = new Error("Forbidden");
      err.name = "ForbiddenError";
      return Promise.reject(err);
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
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
        case "ForbiddenError":
          return next(
            new ForbiddenError(
              "user does not have permission to delete this item."
            )
          );
        default:
          return next(err);
      }
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const owner = req.user._id;
  Item.findByIdAndUpdate(itemId, { $addToSet: { likes: owner } }, { new: true })
    .orFail()
    .then((item) => res.send(item))
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

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const owner = req.user._id;
  Item.findByIdAndUpdate(itemId, { $pull: { likes: owner } }, { new: true })
    .orFail()
    .then((item) => res.send(item))
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
