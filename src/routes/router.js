const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const maxiController = require("../controllers/maxiSalesController");
const elakolijeController = require("../controllers/elakolijeSalesController");

router.get("/saleItems", salesController.getItems);
router.get("/saleItems/maxi", maxiController.getItemsOnSale);
router.get("/saleItems/maxi/categories", maxiController.getCategories);
router.get("/saleItems/elakolije", elakolijeController.getItemsOnSale);
router.get("/saleItems/elakolije/categories", elakolijeController.getCategories);

module.exports = router;
