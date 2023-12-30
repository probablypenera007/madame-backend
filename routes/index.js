const router = require("express").Router();
const user = require("./users");
const {auth} = require("../middlewares/auth");
const aiController = require("../controllers/aiController");
const { getUserReadings, saveReading, deleteReading,updateReadingTitle } = require('../controllers/readingController');
const NotFoundError = require("../errors/not-found-err");

router.use("/users", user);
router.post("/speech-to-text", aiController.speechToText);
router.post("/fortune-teller", aiController.fortuneTeller);
router.post("/text-to-speech", aiController.textToSpeech);

router.get('/readings', auth, getUserReadings)
router.post('/readings', saveReading);
router.delete('/readings/:readingId', deleteReading);
router.patch('/readings/:readingId', updateReadingTitle);


router.use((req, res, next) => {
  next(new NotFoundError("Request is NOWHERE TO BE FOUND"));
});

module.exports = router;
