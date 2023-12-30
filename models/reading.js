const mongoose = require('mongoose');

const oracleReadings = new mongoose.Schema({
// owner of the reading
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'users',
  required: true,
},
title: {
  type: String,
  required: true,
},
text: {
  type: String,
  required: true,
},
// date of the reading
createdAt: {
  type: Date,
  default: Date.now,
},
// saved reading
});

module.exports = mongoose.model("oracleReadings", oracleReadings);