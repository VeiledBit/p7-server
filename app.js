require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const sequelize = require("./src/config/postgre");
const router = require('./src/routes/router');

const test = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

test();
app.use(cors());
app.use(express.json());
app.use("/", router)

server.listen(process.env.PORT, async () => {
  console.log(`Listening at http://localhost:${process.env.PORT}`);
});
