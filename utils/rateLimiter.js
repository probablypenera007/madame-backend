const rateLimit = require("express-rate-limit");

const postRequestForAILimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 9,
  standardHeaders: true,
  legacyHeaders: false,
});

const requestLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { postRequestForAILimiter, requestLimiter };
