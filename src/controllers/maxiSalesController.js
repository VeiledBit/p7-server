const MaxiSaleItem = require("../models/MaxiSaleItem");
const FavoriteItem = require("../models/FavoriteItem");
const { sequelize } = require("../config/postgre");
const { Op } = require("sequelize");
const { logger } = require("../config/winston");
const { meiliClient } = require("../config/meili");

const favorite = async (req, res) => {
  const user = req.user;
  const userId = user.sub;
  const itemId = req.body.itemId;
  try {
    const existingFavorite = await FavoriteItem.findOne({
      where: {
        user_id: userId,
        item_id: itemId,
      },
    });

    if (existingFavorite) {
      await existingFavorite.destroy();
      res.status(200).send();
    } else {
      await FavoriteItem.create({ user_id: userId, item_id: itemId });
      res.status(201).send();
    }
  } catch (error) {
    logger.error(`Error in favorite endpoint|${error.message}|${error.stack}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getItemsOnSaleSE = async (req, res) => {
  const { search, sort, categories } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = 90;
  const offset = (page - 1) * limit;
  let filters = "";

  if (categories) {
    const categoryArray = categories.split("|");
    filters = `category_name IN [${categoryArray
      .map((category) => `"${category}"`)
      .join(", ")}]`;
  }

  const sortAttributes = {
    discountHighest: ["discount_percentage:desc"],
    discountLowest: ["discount_percentage:asc"],
    priceLowest: ["price_sale:asc"],
    priceHighest: ["price_sale:desc"],
    pricePerUnitLowest: ["price_per_unit_sale:asc"],
    pricePerUnitHighest: ["price_per_unit_sale:desc"],
    category: ["category_id:asc"],
  };

  if (sort) {
    sortingOrder = sortAttributes[sort];
  }

  try {
    const index = meiliClient.index("maxiSaleItems");
    const results = await index.search(search, {
      filter: filters,
      sort: sortingOrder,
      limit: limit,
      offset: offset,
    });
    const partial = req.partial;
    if (partial === false) {
      const user = req.user;
      const userId = user.sub;
      const favoredItemIds = (
        await FavoriteItem.findAll({
          where: {
            user_id: userId,
            item_id: results.hits.map((item) => item.id),
          },
        })
      ).map((favoredItem) => favoredItem.item_id);
      const modifiedSaleItems = results.hits.map((item) => ({
        ...item,
        isFavored: favoredItemIds.includes(item.id),
      }));

      res.json(modifiedSaleItems);
    } else {
      res.json(results.hits);
    }
  } catch (error) {
    logger.error(`${error.message}|${error.stack}`);
    getItemsOnSale(req, res);
  }
};

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

    const partial = req.partial;
    if (partial === false) {
      const user = req.user;
      const userId = user.sub;
      const favoredItemIds = (
        await FavoriteItem.findAll({
          where: {
            user_id: userId,
            item_id: saleItems.map((item) => item.id),
          },
        })
      ).map((favoredItem) => favoredItem.item_id);

      const modifiedSaleItems = saleItems.map((item) => ({
        ...item.toJSON(),
        isFavored: favoredItemIds.includes(item.id),
      }));

      res.json(modifiedSaleItems);
    } else {
      res.json(saleItems);
    }
  } catch (error) {
    logger.error(`${error.message}|${error.stack}`);
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
    logger.error(`${error.message}|${error.stack}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  favorite,
  getCategories,
  getItemsOnSale,
  getItemsOnSaleSE,
};
