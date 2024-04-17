const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");
const maxiController = require("../controllers/maxiSalesController");
const elakolijeController = require("../controllers/elakolijeSalesController");
const { verifyTokenFull, verifyTokenPartial } = require("../middleware/verifyToken");

router.get("/saleItems", salesController.getItemsSE);
router.get("/saleItems/maxi", verifyTokenPartial, maxiController.getItemsOnSaleSE);
router.put("/saleItems/maxi/favorite", verifyTokenFull, maxiController.favorite);
router.get("/saleItems/maxi/categories", maxiController.getCategories);
router.get("/saleItems/elakolije", verifyTokenPartial, elakolijeController.getItemsOnSaleSE);
router.put("/saleItems/elakolije/favorite", verifyTokenFull, elakolijeController.favorite);
router.get("/saleItems/elakolije/categories", elakolijeController.getCategories);

module.exports = router;
