const Item = require("../models/clothingItem");
const {
  OK,
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(OK).send(items))
    .catch((err) => {
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
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
        }); //invalid data passed to the methods for creating an item or updating an item
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findById(itemId)
    .orFail()
    .then((item) => item.deleteOne())
    .then(() => res.status(OK).send({ message: "Item deleted successfully" }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({
          message:
            "there is no clothing item with the requested id, or the request was sent to a non-existent address.",
        });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem };
