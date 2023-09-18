const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.POSTGRE_URL);

module.exports = sequelize;
