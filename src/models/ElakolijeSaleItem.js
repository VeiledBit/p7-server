const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/postgre");

const ElakolijeSaleItem = sequelize.define(
  "elakolijeSaleItem",
  {
    id: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    store: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    category_id: {
      type: Sequelize.INTEGER,
    },
    category_name: {
      type: Sequelize.STRING,
    },
    price_sale: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_sale_rounded: {
      type: Sequelize.INTEGER,
    },
    price_regular: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_regular_rounded: {
      type: Sequelize.INTEGER,
    },
    price_per_unit_sale: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_per_unit_sale_rounded: {
      type: Sequelize.INTEGER,
    },
    price_per_unit_regular: {
      type: Sequelize.DECIMAL(10, 2),
    },
    price_per_unit_regular_rounded: {
      type: Sequelize.INTEGER,
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
