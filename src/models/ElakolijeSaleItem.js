const { Sequelize } = require("sequelize");
const sequelize = require("../config/postgre");

const ElakolijeSaleItem = sequelize.define(
  "elakolijeSaleItem",
  {
    store_id: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    store_url: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    price_sale: {
      type: Sequelize.STRING,
    },
    price_regular: {
      type: Sequelize.STRING,
    },
    price_per_unit_sale: {
      type: Sequelize.STRING,
    },
    price_per_unit_regular: {
      type: Sequelize.STRING,
    },
    discount_percentage: {
      type: Sequelize.INTEGER,
    },
    unit: {
      type: Sequelize.STRING,
    },
    sale_start_date: {
      type: Sequelize.STRING,
    },
    sale_end_date: {
      type: Sequelize.STRING,
    },
    img_url: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "elakolijesales",
    timestamps: false,
  }
);

module.exports = ElakolijeSaleItem;
