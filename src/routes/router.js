const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const maxiController = require("../controllers/maxiSalesController");
const elakolijeController = require("../controllers/elakolijeSalesController");

router.get("/saleItems", salesController.getItems);
router.get("/saleItems/maxi", maxiController.getAllItemsOnSale);
router.get("/saleItems/uni", elakolijeController.getAllItemsOnSale);

module.exports = router;
