require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const routes = require("./routes");
const { errors } = require("celebrate");
const { validateUserBody, validateLogIn } = require("./middlewares/validation");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());

app.use(
  fileUpload({
    createParentPath: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
);

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
mongoose.connect(MONGODB_URI).then(
  () => {
    console.log(`DB is connected to "${MONGODB_URI}"`);
  },
  (e) => console.log("DB ERROR", e),
);

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post("/signin", validateLogIn, login);

app.post("/signup", validateUserBody, createUser);

app.use(routes);

app.use(errorLogger); // enabling the error logger

app.use(errors());

app.use(errorHandler);

app.listen(PORT);
