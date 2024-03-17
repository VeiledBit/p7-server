const { sequelize } = require("../config/postgre");

const getItems = async (req, res) => {
  const { search, sort } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 90;
  const offset = (page - 1) * limit;
  let orderClause = ["category_id", "ASC"];

  const sortAttributes = {
    discountHighest: ["discount_percentage", "DESC"],
    discountLowest: ["discount_percentage", "ASC"],
    priceLowest: ["price_sale", "ASC"],
    priceHighest: ["price_sale", "DESC"],
    pricePerUnitLowest: ["price_per_unit_sale", "ASC"],
    pricePerUnitHighest: ["price_per_unit_sale", "DESC"],
    category: ["store", "DESC"],
  };

  if (sort) {
    orderClause = sortAttributes[sort];
  }

  try {
    const items = await sequelize.query(
      `SELECT id, store, store_id, name, category_id, category_name, price_sale, price_sale_rounded, price_regular, price_regular_rounded,
      price_per_unit_sale, price_per_unit_sale_rounded, price_per_unit_regular, price_per_unit_regular_rounded, discount_percentage,
      unit, sale_start_date, sale_end_date, note
      FROM maxisales
      WHERE name ILIKE '%' || :search || '%'
      UNION
      SELECT id, store, store_id, name, category_id, category_name, price_sale, price_sale_rounded, price_regular, price_regular_rounded,
      price_per_unit_sale, price_per_unit_sale_rounded, price_per_unit_regular, price_per_unit_regular_rounded, discount_percentage,
      unit, sale_start_date, sale_end_date, '' as placeholder
      FROM elakolijesales
      WHERE name ILIKE '%' || :search || '%'
      ORDER BY ${orderClause[0]} ${orderClause[1]}
      LIMIT ${limit}
      OFFSET ${offset}`,
      {
        replacements: { search: search },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    res.json(items);
  } catch (error) {
    logger.error(`${error.message}|${error.stack}`);
    res.status(500).json({ error: "Internal server error" });
  }
  res.status(200);
};

module.exports = {
  getItems,
};
