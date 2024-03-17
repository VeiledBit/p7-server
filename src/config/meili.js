const { MeiliSearch } = require("meilisearch");

const meiliClient = new MeiliSearch({
  host: process.env.MEILI_HOST,
  apiKey: process.env.MEILI_API_KEY,
});

const meiliConfig = async () => {
  try {
    await meiliClient
      .index("maxiSaleItems")
      .updateSearchableAttributes(["category_name", "name"]);

    await meiliClient
      .index("maxiSaleItems")
      .updateFilterableAttributes(["category_name"]);

    await meiliClient
      .index("maxiSaleItems")
      .updateSortableAttributes([
        "category_id",
        "discount_percentage",
        "price_sale",
        "price_per_unit_sale",
      ]);

    await meiliClient
      .index("maxiSaleItems")
      .updateRankingRules([
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "category_name:asc",
        "name:asc",
      ]);

    await meiliClient
      .index("elakolijeSaleItems")
      .updateSearchableAttributes(["category_name", "name"]);
    await meiliClient
      .index("elakolijeSaleItems")
      .updateFilterableAttributes(["category_name"]);

    await meiliClient
      .index("elakolijeSaleItems")
      .updateSortableAttributes([
        "category_id",
        "discount_percentage",
        "price_sale",
        "price_per_unit_sale",
        "insert_order",
      ]);

    await meiliClient
      .index("elakolijeSaleItems")
      .updateRankingRules([
        "words",
        "typo",
        "proximity",
        "attribute",
        "sort",
        "exactness",
        "category_name:asc",
        "name:asc",
      ]);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  meiliClient,
  meiliConfig,
};
