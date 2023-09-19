const MaxiSaleItem = require("../models/MaxiSaleItem");
const { Op } = require('sequelize');

const getItemsOnSale = async (req, res) => {
  const { search } = req.query;
  let whereClause = {};

  if (search) {
    whereClause = {
      name: {
        [Op.iLike]: `%${search}%`,
      },
    };
  }

  try {
    const saleItems = await MaxiSaleItem.findAll({
      where: whereClause,
      order: [["id", "ASC"]],
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
