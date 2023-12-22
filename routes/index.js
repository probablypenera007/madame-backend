const router = require("express").Router();
const user = require("./users");
const NotFoundError = require("../errors/not-found-err");

router.use("/users", user);

router.use((req, res, next) => {
 next(new NotFoundError("Request is NOWHERE TO BE FOUND"))
});

module.exports = router;
