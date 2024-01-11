const { NODE_ENV, JWT_SECRET = 'dev-secret', OPENAI_API_KEY, MONGODB_URI = 'mongodb://127.0.0.1:27017/oracle_db'  } = process.env;

module.exports = { NODE_ENV, JWT_SECRET, OPENAI_API_KEY, MONGODB_URI };
