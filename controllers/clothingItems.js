const Item = require("../models/clothingItem");
const {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." })
    );
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(CREATED).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({
          message:
            "invalid data passed to the methods for creating an item, or invalid ID passed to the params.",
        }); // invalid data passed to the methods for creating an item or updating an item
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
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
      } else {
        return Promise.reject({ name: "ForbiddenError" });
      }
    })
    .then(() => res.send({ message: "Item deleted successfully" }))
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
        case "ForbiddenError":
          return res.status(FORBIDDEN).send({
            message: "user does not have permission to delete this item.",
          });
        default:
          return res
            .status(INTERNAL_SERVER_ERROR)
            .send({ message: "An error has occurred on the server." });
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

const dislikeItem = (req, res) => {
  const { itemId } = req.params;
  const owner = req.user._id;
  Item.findByIdAndUpdate(itemId, { $pull: { likes: owner } }, { new: true })
    .orFail()
    .then((item) => res.send(item))
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

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
