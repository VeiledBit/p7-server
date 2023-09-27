const MaxiSaleItem = require("../models/MaxiSaleItem");
const sequelize = require("../config/postgre");
const { Op } = require("sequelize");

const getItemsOnSale = async (req, res) => {
  const { search, sort, categories } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 90;
  const offset = (page - 1) * limit
  let whereClause = {};
  let orderClause = [
    ["id", "ASC"], // Maintain canonical order
    ["category_id", "ASC"],
  ];

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

  if (sort) {
    let sortAttribute = "category_id";
    let order = "ASC";
    if (sort === "discountHighest") {
      sortAttribute = "discount_percentage";
      order = "DESC";
    } else if (sort === "discountLowest") {
      sortAttribute = "discount_percentage";
    }
    orderClause = [
      ["id", "ASC"], // Maintain canonical order
      [sortAttribute, order],
    ];
  }

  try {
    const saleItems = await MaxiSaleItem.findAll({
      where: whereClause,
      order: orderClause,
      limit: limit,
      offset: offset
    });
    res.json(saleItems);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getCategories,
  getItemsOnSale,
};
