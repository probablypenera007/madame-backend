const rateLimit = require("express-rate-limit");

// https://www.npmjs.com/package/express-rate-limit
// Audio Blob format: Blob {size: 35284, type: 'audio/webm'}
// Api.js:18

// POST http://localhost:3001/speech-to-text 429 (Too Many Requests)
// request @ Api.js:18
// sendAudioToOracle @ OracleApi.js:7
// recorder.onstop @ App.js:390 // need to incoprporate this to front end tinypopup modal

const postRequestForAILimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
});

const requestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { postRequestForAILimiter, requestLimiter };
