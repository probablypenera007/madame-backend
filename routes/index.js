const router = require("express").Router();
const user = require("./users");
const aiController = require("../controllers/aiController");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", user);
router.post('/fortune-teller', aiController.fortuneTeller);

router.use((req, res, next) => {
 next(new NotFoundError("Request is NOWHERE TO BE FOUND"))
});

module.exports = router;
