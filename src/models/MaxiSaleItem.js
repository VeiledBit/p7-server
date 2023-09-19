const { Sequelize } = require("sequelize");
const sequelize = require("../config/postgre");

const MaxiSaleItem = sequelize.define(
  "maxiSaleItem",
  {
    store_id: {
      type: Sequelize.STRING,
    },
    store_url: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    category: {
      type: Sequelize.STRING,
    },
    price_sale: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_regular: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_per_unit_sale: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_per_unit_regular: {
      type: Sequelize.DECIMAL(10, 2),
    },
    discount_percentage: {
      type: Sequelize.INTEGER,
    },
    unit: {
      type: Sequelize.STRING,
    },
    sale_start_date: {
      type: Sequelize.DATE,
    },
    sale_end_date: {
      type: Sequelize.DATE,
    },
    img_url: {
      type: Sequelize.STRING,
    },
    note: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "maxisales",
    timestamps: false,
  }
);

module.exports = MaxiSaleItem;