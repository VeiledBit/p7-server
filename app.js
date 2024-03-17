require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const router = require("./src/routes/router");
const { logger, requestLogger } = require("./src/config/winston");
const { meiliConfig } = require("./src/config/meili");
const { initiateDBConnection } = require("./src/config/postgre");

initiateDBConnection();
meiliConfig();
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use("/", router);

server.listen(process.env.PORT, async () => {
  logger.info(`Listening at http://localhost:${process.env.PORT}`);
});
