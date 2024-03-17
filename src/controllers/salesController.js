const { sequelize } = require("../config/postgre");
const { logger } = require("../config/winston");
const { meiliClient } = require("../config/meili");

const getItemsSE = async (req, res) => {
  const { search, sort } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 90;
  const offset = (page - 1) * limit;
  const indexNames = ["maxiSaleItems", "elakolijeSaleItems"];
  let sortingFunction = (a, b) => b.store - a.store; // Default sorting

  const sortingFunctions = {
    discountHighest: (a, b) => b.discount_percentage - a.discount_percentage,
    discountLowest: (a, b) => a.discount_percentage - b.discount_percentage,
    priceLowest: (a, b) => a.price_sale - b.price_sale,
    priceHighest: (a, b) => b.price_sale - a.price_sale,
    pricePerUnitLowest: (a, b) => a.price_per_unit_sale - b.price_per_unit_sale,
    pricePerUnitHighest: (a, b) =>
      b.price_per_unit_sale - a.price_per_unit_sale,
  };

  if (sort) {
    sortingFunction = sortingFunctions[sort];
  }

  try {
    const searches = indexNames.map((indexName) => {
      return {
        indexUid: indexName,
        q: search,
        limit: limit,
        offset: offset,
      };
    });

    const results = (await meiliClient.multiSearch({ queries: searches }))
      .results;
    const resultsReduced = results.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue.hits);
    }, []);

    resultsReduced.sort(sortingFunction);
    res.json(resultsReduced);
  } catch (error) {
    logger.error(`${error.message}|${error.stack}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

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
};

module.exports = {
  getItems,
  getItemsSE,
};
