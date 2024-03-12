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

module.exports = sequelize;
