require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { errors } = require("celebrate");
const routes = require("./routes");
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

const { MONGODB_URI } = process.env;
mongoose.set("strictQuery", false);
mongoose.connect(MONGODB_URI)
// .then(
//   () => {
//     console.log(`DB is connected to "${MONGODB_URI}"`);
//   },
//   (e) => console.log("DB ERROR", e),
// );

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.post("/signin", validateLogIn, login);
app.post("/signup", validateUserBody, createUser);

app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
//   , () => {
//   console.log(`Server is running on port ${PORT}`);
// });
