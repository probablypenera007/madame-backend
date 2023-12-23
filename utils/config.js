const {
  NODE_ENV,
  JWT_SECRET,
  OPENAI_API_KEY
} = process.env;

module.exports = { NODE_ENV, JWT_SECRET, OPENAI_API_KEY };
