const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { validateClothingItemBody, validateId } = require("../middlewares/validation")

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CRUD
// Read
router.get("/", getItems);
// Create
router.post("/", auth, validateClothingItemBody, createItem);



// Update
router.put("/:itemId/likes", auth, validateId,likeItem);
// Delete
router.delete("/:itemId", auth, validateId, deleteItem);
router.delete("/:itemId/likes", auth, validateId, dislikeItem);

module.exports = router;
