const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItem");
const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl, likes } = req.body;

  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id, likes })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Invalid Item Format. Check Image URL Provided"),
        );
      } else {
        next(err);
      }
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch(next);
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID"));
  }

  return ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item Does Not Exist!"));
      }
      if (item.owner.toString() !== req.user._id.toString()) {
        return next(
          new ForbiddenError(
            "You Do Not Have The Permission To Delete This Item! tsk. tsk.",
          ),
        );
      }
      return ClothingItem.findByIdAndDelete(itemId);
    })
    .then(() => res.send({ data: itemId }))
    .catch(next);
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID for Liking an Item"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item NOT FOUND for Liking an Item"))
    .then((item) => res.send({ data: item }))
    .catch(next);
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid Item ID for Disliking an Item"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: mongoose.Types.ObjectId(req.user._id) } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item NOT FOUND for Disliking an Item"))
    .then((item) => res.send({ data: item }))
    .catch(next);
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
