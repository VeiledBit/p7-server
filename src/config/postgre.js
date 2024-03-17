const { Sequelize } = require("sequelize");
const { logger } = require("./winston");

let sequelize;

if (process.env.IS_PROD == "false") {
  sequelize = new Sequelize(
    process.env.POSTGRE_DB,
    process.env.POSTGRE_USER,
    process.env.POSTGRE_PASSWORD,
    {
      host: process.env.POSTGRE_URL,
      dialect: "postgres",
      logging: (msg) => logger.info(`[Postgre]|${msg}`),
    }
  );
} else {
  sequelize = new Sequelize(
    process.env.POSTGRE_DB,
    process.env.POSTGRE_USER,
    process.env.POSTGRE_PASSWORD,
    {
      host: process.env.POSTGRE_URL,
      dialect: "postgres",
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: (msg) => logger.info(`[Postgre]|${msg}`),
    }
  );
}

const initiateDBConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connection to PostgreDB has been established successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the PostgreDB: ${error.message}|${error.stack}`);
  }
};

module.exports = {
  sequelize,
  initiateDBConnection,
};
