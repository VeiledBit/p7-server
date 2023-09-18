const MaxiSaleItem = require("../models/MaxiSaleItem");

const getAllItemsOnSale = async (req, res) => {
  try {
    const saleItems = await MaxiSaleItem.findAll({
      order: [["id", "ASC"]],
    });
    res.json(saleItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllItemsOnSale,
};
