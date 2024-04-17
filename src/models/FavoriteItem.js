const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/postgre");

const FavoriteItem = sequelize.define(
  "favoriteItem",
  {
    user_id: {
      type: Sequelize.STRING,
    },
    item_id: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "favoriteitems",
    timestamps: false,
  }
);

module.exports = FavoriteItem;
