const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const maxiController = require("../controllers/maxiSalesController");
const elakolijeController = require("../controllers/elakolijeSalesController");

router.get("/saleItems", salesController.getItemsSE);
router.get("/saleItems/maxi", maxiController.getItemsOnSaleSE);
router.get("/saleItems/maxi/categories", maxiController.getCategories);
router.get("/saleItems/elakolije", elakolijeController.getItemsOnSaleSE);
router.get("/saleItems/elakolije/categories", elakolijeController.getCategories);

module.exports = router;
