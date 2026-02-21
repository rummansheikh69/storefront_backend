import express from "express";
import { submitReview } from "../controllers/user.controller.js";
import { protectedRoutes } from "../middleware/protectedRoutes.js";

const router = express.Router();

router.post("/reviews/:id", protectedRoutes, submitReview);

export default router;
