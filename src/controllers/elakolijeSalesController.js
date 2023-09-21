const ElakolijeSaleItem = require("../models/ElakolijeSaleItem");
const { Op } = require('sequelize');

const getItemsOnSale = async (req, res) => {
  const { search, sort } = req.query;
  let whereClause = {};
  let orderClause = [["category", "ASC"]];

  if (search) {
    whereClause = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    };
  }

  if (sort) {
    let sortAttribute = "category";
    let order = "ASC";
    if (sort === "discountHighest") {
      sortAttribute = "discount_percentage";
      order = "DESC"
    } else if (sort === "discountLowest") {
      sortAttribute = "discount_percentage";
    }
    orderClause = [[sortAttribute, order]];
  }

  try {
    const saleItems = await ElakolijeSaleItem.findAll({
      where: whereClause,
      order: orderClause,
      limit: 100,
    });
    res.json(saleItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getItemsOnSale,
};
