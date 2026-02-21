import express from "express";
import * as ADMINCONTROLLER from "../controllers/admin.controller.js";
const router = express.Router();

router.post("/provider", ADMINCONTROLLER.createProviderFull);
router.post("/provider/:providerId", ADMINCONTROLLER.updateProvider);
router.delete("/provider/:providerId", ADMINCONTROLLER.deleteProvider);
router.put(
  "/provider/:providerId/category/:categoryId",
  ADMINCONTROLLER.updateCategory,
);
router.delete(
  "/provider/:providerId/category/:categoryId",
  ADMINCONTROLLER.deleteCategory,
);
router.put(
  "/provider/:providerId/category/:categoryId/offer/:offerId",
  ADMINCONTROLLER.updateOffer,
);
router.delete(
  "/provider/:providerId/category/:categoryId/offer/:offerId",
  ADMINCONTROLLER.deleteOffer,
);

router.get("/products", ADMINCONTROLLER.getAllProductsAdmin);
router.post("/product", ADMINCONTROLLER.createProduct);
router.put("/product/:id", ADMINCONTROLLER.updateProduct);
router.delete("/product/:id", ADMINCONTROLLER.deleteProduct);

export default router;
