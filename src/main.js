const express = require("express");
const dotenv = require("dotenv");
//const passport = require("passport");
dotenv.config();
const { default: mongoose } = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("./configs/logger.config");
//const { jwtStrategy, googleStrategy } = require("./configs/passport.config");
const app = express();
const port = process.env.PORT || 3001;
app.use(cookieParser());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

// passport.use("jwt", jwtStrategy);
// passport.use("google", googleStrategy);

app.use("/api", routes);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    logger.info("Connected to MongoDB successfully!");
  })
  .catch((error) => {
    logger.error("Failed to connect to MongoDB:", error);
  });

const server = app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`);
});
