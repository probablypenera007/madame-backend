const mongoose = require('mongoose');
const oracleReadings = require('../models/reading');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getUserReadings = (req, res, next) => {
 const userId = req.user._id;

 console.log('userId getUser- readingController', userId);

  oracleReadings.find({userId})
    .then(readings => res.send({ data: readings }))
    .catch(next);
};

const saveReading = (req, res, next) => {
  const { userId, title, text } = req.body;

console.log("req.body data, readingController: ", req.body)
console.log("req.user readingConmtroller:", req.user);

if (userId !== req.user._id) {
  return next(new ForbiddenError('You are not authorized to create this reading'));
}

  oracleReadings.create({ userId, title, text })
    .then(reading => res.send(reading))
    .catch(next);
};

const deleteReading = (req, res, next) => {
  const { readingId } = req.params;

 // console.log("deletereading readingController: ", req.params)

  oracleReadings.findByIdAndDelete(readingId)
    .then(reading => {
      if (!reading) throw new NotFoundError('Reading not found');
      res.send({ message: 'Reading deleted' });
    })
    .catch(next);
};

const updateReadingTitle = (req, res, next) => {
  const { readingId } = req.params;
  const { title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(readingId)) {
    return next(new BadRequestError('Invalid reading ID'));
  }

  oracleReadings
    .findOneAndUpdate(
      { _id: readingId, userId: req.user._id },
      { title },
      { new: true, runValidators: true }
    )
    .then((reading) => {
      if (!reading) {
        throw new NotFoundError('Reading not found');
      }
      res.send({ data: reading });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data'));
      } else {
        next(err);
      }
    });
};
// I suspect you may need to do updateReading.data
// instead of updateReading on line 131 of the previous screenshot
// You're probably saving the `{data: {...actual stuff}}`
// object to the list instead of `{...actual stuff}` to the list


module.exports = {
  saveReading,
  deleteReading,
  getUserReadings,
  updateReadingTitle
};
