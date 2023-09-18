const ElakolijeSaleItem = require("../models/ElakolijeSaleItem");

const getAllItemsOnSale = async (req, res) => {
  try {
    const saleItems = await ElakolijeSaleItem.findAll({
      order: [["id", "ASC"]],
      limit: 100,
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
