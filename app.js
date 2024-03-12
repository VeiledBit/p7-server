require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const sequelize = require("./src/config/postgre");
const router = require("./src/routes/router");
const { logger, requestLogger } = require("./src/config/winston");

const test = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection to PostgreDB has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the PostgreDB:", error);
  }
};

test();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/", router);


server.listen(process.env.PORT, async () => {
  logger.info(`Listening at http://localhost:${process.env.PORT}`);
});
