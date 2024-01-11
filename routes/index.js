const router = require("express").Router();
const user = require("./users");
const {auth} = require("../middlewares/auth");
const aiController = require("../controllers/aiController");
const { getUserReadings, saveReading, deleteReading,updateReadingTitle } = require('../controllers/readingController');
const NotFoundError = require("../errors/not-found-err");
const { postRequestForAILimiter, requestLimiter } = require("../utils/rateLimiter");


router.use("/users", user);
router.post("/speech-to-text", postRequestForAILimiter, aiController.speechToText);
router.post("/fortune-teller", postRequestForAILimiter, aiController.fortuneTeller);
router.post("/text-to-speech", postRequestForAILimiter, aiController.textToSpeech);

router.get('/readings', auth, requestLimiter, getUserReadings)
router.post('/readings',auth, requestLimiter, saveReading);
router.delete('/readings/:readingId', auth, deleteReading);
router.patch('/readings/:readingId', auth, updateReadingTitle);


router.use((req, res, next) => {
  next(new NotFoundError("Request is NOWHERE TO BE FOUND"));
});

module.exports = router;
