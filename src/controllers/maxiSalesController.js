const MaxiSaleItem = require("../models/MaxiSaleItem");
const sequelize = require("../config/postgre");
const { Op } = require("sequelize");
const { logger } = require("../config/winston");

const getItemsOnSale = async (req, res) => {
  const { search, sort, categories } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 90;
  const offset = (page - 1) * limit;
  let whereClause = {};
  let orderClause = [];

  if (search) {
    whereClause = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    };
  }

  if (categories) {
    categoryArray = categories.split("|");
    whereClause.category_name = {
      [Op.in]: categoryArray,
    };
  }

  const sortAttributes = {
    discountHighest: [["discount_percentage", "DESC"]],
    discountLowest: [["discount_percentage", "ASC"]],
    priceLowest: [["price_sale", "ASC"]],
    priceHighest: [["price_sale", "DESC"]],
    pricePerUnitLowest: [["price_per_unit_sale", "ASC"]],
    pricePerUnitHighest: [["price_per_unit_sale", "DESC"]],
    category: [
      ["insert_order", "ASC"], // Maintain canonical order, which is broken by LIMIT clause
    ],
  };

  if (sort) {
    orderClause = sortAttributes[sort];
  }

  try {
    const saleItems = await MaxiSaleItem.findAll({
      where: whereClause,
      order: orderClause,
      limit: limit,
      offset: offset,
    });
    res.json(saleItems);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCategories = async (req, res) => {
  try {
    const distinctCategories = await sequelize.query(
      'SELECT DISTINCT "category_id", "category_name" FROM "maxisales" ORDER BY "category_id";',
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );
    const categoryNames = distinctCategories.map((item) => item.category_name);
    res.json(categoryNames);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCategories,
  getItemsOnSale,
};
