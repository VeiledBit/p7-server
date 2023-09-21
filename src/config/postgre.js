const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.IS_PROD == "false") {
  sequelize = new Sequelize(
    process.env.POSTGRE_DB,
    process.env.POSTGRE_USER,
    process.env.POSTGRE_PASSWORD,
    {
      host: process.env.POSTGRE_URL,
      dialect: "postgres",
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
    }
  );
}

module.exports = sequelize;
