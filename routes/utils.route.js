import express from "express";
import * as UTILSCONTROLLER from "../controllers/utils.controller.js";

const router = express.Router();

router.get("/products", UTILSCONTROLLER.getProducts);
router.get("/product/:id", UTILSCONTROLLER.getSingleProduct);
router.get("/offers", UTILSCONTROLLER.getOffers);
router.get("/products/search", UTILSCONTROLLER.searchProducts);

router.get("/reviews/:id", UTILSCONTROLLER.getProductReviews);

export default router;
