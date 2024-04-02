const mongoose = require('mongoose');
const oracleReadings = require('../models/reading');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

const getUserReadings = (req, res, next) => {
 const userId = req.user._id;

//  console.log('userId getUser- readingController', userId);

  oracleReadings.find({userId})
    .then(readings => res.send({ data: readings }))
    .catch(next);
};

const saveReading = (req, res, next) => {
  const { title, text } = req.body;
  const userId = req.user._id;

// console.log("req.body data, readingController: ", req.body)
// console.log("req.user readingConmtroller:", req.user);

if (userId !== req.user._id) {
  return next(new ForbiddenError('You are not authorized to create this reading'));
}

  return oracleReadings.create({ userId, title, text })
    .then(reading => res.send(reading))
    .catch(next);
};

const deleteReading = (req, res, next) => {
  const { readingId } = req.params;
  const userId = req.user._id;

  // console.log("deletereading readingController: ", req.params);

 return oracleReadings
    .findOne({ _id: readingId, userId })
    .then((reading) => {
      if (!reading) {
        throw new NotFoundError("Reading not found or not authorized to delete");
      }
      return oracleReadings.findByIdAndDelete(readingId);
    })
    .then((reading) => {
      if (!reading) throw new NotFoundError("Reading not found");
      res.send({ message: "Reading deleted" });
    })
    .catch(next);
};

const updateReadingTitle = (req, res, next) => {
  const { readingId } = req.params;
  const { title } = req.body;

  if (!mongoose.Types.ObjectId.isValid(readingId)) {
    return next(new BadRequestError('Invalid reading ID'));
  }

 return oracleReadings
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



module.exports = {
  saveReading,
  deleteReading,
  getUserReadings,
  updateReadingTitle
};
