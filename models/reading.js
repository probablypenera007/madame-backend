const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
// owner of the reading

// date of the reading

// saved reading
});

module.exports = mongoose.model("oracleReadings", oracleReadings)