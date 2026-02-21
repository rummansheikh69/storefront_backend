import { Review } from "../models/review.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const submitReview = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const { name, comment, rating } = req.body;

  if (!productId || !name || !comment || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await Review.create({
    product: productId,
    rating,
    comment,
    user: { name },
  });

  res.status(201).json(review);
});
